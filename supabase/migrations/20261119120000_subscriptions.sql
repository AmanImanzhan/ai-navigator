-- Подписка AI Navigator Premium (RevenueCat) и лимит ИИ-помощника по подписке.
--
-- Как работает:
-- 1. Человек покупает подписку в приложении (App Store → RevenueCat).
-- 2. RevenueCat присылает событие на сервер (apps/web, /api/revenuecat/webhook).
--    Сервер с secret key вызывает apply_subscription_event / apply_subscription_transfer —
--    они обновляют строку в subscriptions. Писать в subscriptions может только сервер.
-- 3. consume_ai_request сам смотрит в subscriptions: есть подписка — дневной лимит больше.
--
-- Все уроки и шаблоны бесплатные: платный только ИИ-помощник.

-- ---------- Контент: платных направлений больше нет ----------

update public.tracks set premium = false where premium;

comment on column public.tracks.premium is
  'Не используется: все уроки бесплатные, по подписке только ИИ-помощник.';

-- ---------- Подписки ----------

-- Таблица из схемы v1 подходит (одна строка на пользователя, удаляется вместе с аккаунтом —
-- on delete cascade). Добавляем:
--   last_event_at — время последнего применённого события: события могут прийти не по порядку,
--                   старое не перетирает новое;
--   environment   — SANDBOX (тестовая покупка) или PRODUCTION.
alter table public.subscriptions
  add column last_event_at timestamptz,
  add column environment text check (environment in ('SANDBOX', 'PRODUCTION'));

comment on column public.subscriptions.status is
  'active / trialing (пробный период) / grace_period (не прошла оплата, доступ ещё есть) / '
  'cancelled (автопродление выключено, доступ до expires_at) / expired (доступа нет).';

-- Какие события RevenueCat уже обработаны. RevenueCat может прислать одно событие дважды
-- (и повторяет при ошибке) — второй раз ничего не меняем. Только id и тип, без данных человека.
create table public.revenuecat_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

create index revenuecat_events_processed_at_idx on public.revenuecat_events (processed_at);

-- RLS включён, политик нет: таблицу видит только сервер (secret key).
alter table public.revenuecat_events enable row level security;
revoke all on public.revenuecat_events from anon, authenticated;
grant select, insert, update, delete on public.revenuecat_events to service_role;

-- ---------- Есть ли подписка ----------

-- cancelled — автопродление выключено, но оплаченный период ещё идёт.
-- grace_period — оплата не прошла, Apple ещё пытается списать; expires_at = конец льготного срока.
create function public.has_premium(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.subscriptions as sub
    where sub.user_id = p_user
      and sub.status in ('active', 'trialing', 'grace_period', 'cancelled')
      and (sub.expires_at is null or sub.expires_at > now())
  );
$$;

-- ---------- Применить событие RevenueCat ----------

-- Вызывает только сервер. Возвращает, что получилось:
--   applied — записали; duplicate — это событие уже было; stale — есть более новое событие;
--   unknown_user — такого пользователя нет (например, аккаунт удалён).
create function public.apply_subscription_event(
  p_event_id text,
  p_event_type text,
  p_user uuid,
  p_status public.subscription_status,
  p_product_id text,
  p_expires_at timestamptz,
  p_event_at timestamptz,
  p_environment text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_changed integer;
begin
  insert into public.revenuecat_events (id, type)
  values (p_event_id, p_event_type)
  on conflict (id) do nothing;
  if not found then
    return 'duplicate';
  end if;

  -- Старые отметки больше не нужны: RevenueCat повторяет событие максимум ~80 минут.
  delete from public.revenuecat_events where processed_at < now() - interval '90 days';

  if not exists (select 1 from auth.users where id = p_user) then
    return 'unknown_user';
  end if;

  insert into public.subscriptions as sub
    (user_id, status, product_id, expires_at, last_event_at, environment, updated_at)
  values
    (p_user, p_status, p_product_id, p_expires_at, p_event_at, p_environment, now())
  on conflict (user_id) do update
    set status = excluded.status,
        product_id = excluded.product_id,
        expires_at = excluded.expires_at,
        last_event_at = excluded.last_event_at,
        environment = excluded.environment,
        updated_at = now()
    where sub.last_event_at is null or sub.last_event_at <= excluded.last_event_at;

  get diagnostics v_changed = row_count;
  return case when v_changed = 0 then 'stale' else 'applied' end;
end;
$$;

-- ---------- Перенос подписки на другой аккаунт ----------

-- RevenueCat перенёс покупки (человек нажал «Восстановить покупки» в другом аккаунте на том же
-- Apple ID). Подписка переходит к p_to, у прежних владельцев — заканчивается.
-- p_to = null: покупки ушли анонимному пользователю — просто забираем доступ у прежних.
create function public.apply_subscription_transfer(
  p_event_id text,
  p_from uuid[],
  p_event_at timestamptz,
  p_to uuid default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_source public.subscriptions%rowtype;
begin
  insert into public.revenuecat_events (id, type)
  values (p_event_id, 'TRANSFER')
  on conflict (id) do nothing;
  if not found then
    return 'duplicate';
  end if;

  -- Самая свежая подписка среди прежних владельцев.
  select * into v_source
  from public.subscriptions
  where user_id = any (p_from)
  order by expires_at desc nulls first
  limit 1;

  update public.subscriptions
  set status = 'expired', last_event_at = p_event_at, updated_at = now()
  where user_id = any (p_from)
    and (last_event_at is null or last_event_at <= p_event_at);

  if p_to is null or v_source.user_id is null
     or not exists (select 1 from auth.users where id = p_to) then
    return 'applied';
  end if;

  insert into public.subscriptions as sub
    (user_id, status, product_id, expires_at, last_event_at, environment, updated_at)
  values
    (p_to, v_source.status, v_source.product_id, v_source.expires_at, p_event_at,
     v_source.environment, now())
  on conflict (user_id) do update
    set status = excluded.status,
        product_id = excluded.product_id,
        expires_at = excluded.expires_at,
        last_event_at = excluded.last_event_at,
        environment = excluded.environment,
        updated_at = now()
    where sub.last_event_at is null or sub.last_event_at <= excluded.last_event_at;

  return 'applied';
end;
$$;

-- ---------- Лимит ИИ с учётом подписки ----------

-- Было: consume_ai_request(p_limit) — лимит выбирал сервер.
-- Стало: сервер передаёт оба лимита, а функция сама решает по subscriptions, какой применить.
-- Так подписку нельзя «подделать» в запросе: она читается из базы в той же транзакции.
drop function public.consume_ai_request(integer);

create function public.consume_ai_request(p_free_limit integer, p_premium_limit integer)
returns table (
  allowed boolean,
  used integer,
  remaining integer,
  reset_at timestamptz,
  reservation_id uuid,
  daily_limit integer,
  premium boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_day date := (now() at time zone 'utc')::date;
  v_reset timestamptz := (v_day + 1)::timestamp at time zone 'utc';
  v_premium boolean;
  v_limit integer;
  v_count integer;
  v_reservation uuid;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_free_limit is null or p_free_limit < 1 or p_free_limit > 1000
     or p_premium_limit is null or p_premium_limit < 1 or p_premium_limit > 1000 then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  v_premium := public.has_premium(v_user);
  v_limit := case when v_premium then p_premium_limit else p_free_limit end;

  -- +1, только если ещё не упёрлись в лимит. Не прибавилось — строка не вернётся.
  -- Атомарно: INSERT … ON CONFLICT DO UPDATE блокирует строку счётчика.
  insert into public.ai_usage as usage (user_id, day, count)
  values (v_user, v_day, 1)
  on conflict (user_id, day) do update
    set count = usage.count + 1
    where usage.count < v_limit
  returning usage.count into v_count;

  if v_count is null then
    select usage.count into v_count
    from public.ai_usage as usage
    where usage.user_id = v_user and usage.day = v_day;
    return query select false, v_count, 0, v_reset, null::uuid, v_limit, v_premium;
    return;
  end if;

  insert into public.ai_usage_reservations (user_id, day)
  values (v_user, v_day)
  returning id into v_reservation;

  delete from public.ai_usage_reservations
  where user_id = v_user and created_at < now() - interval '2 days';

  return query
    select true, v_count, greatest(v_limit - v_count, 0), v_reset, v_reservation, v_limit,
      v_premium;
end;
$$;

-- Сколько запросов осталось сегодня — без списания (для «Осталось N из 3/30»).
create function public.ai_usage_status(p_free_limit integer, p_premium_limit integer)
returns table (
  used integer,
  remaining integer,
  reset_at timestamptz,
  daily_limit integer,
  premium boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_day date := (now() at time zone 'utc')::date;
  v_premium boolean;
  v_limit integer;
  v_count integer;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  v_premium := public.has_premium(v_user);
  v_limit := case when v_premium then p_premium_limit else p_free_limit end;

  select coalesce(max(usage.count), 0) into v_count
  from public.ai_usage as usage
  where usage.user_id = v_user and usage.day = v_day;

  v_count := least(v_count, v_limit);
  return query
    select v_count, greatest(v_limit - v_count, 0), (v_day + 1)::timestamp at time zone 'utc',
      v_limit, v_premium;
end;
$$;

-- ---------- Права ----------

-- has_premium и запись подписок — только сервер (secret key).
revoke execute on function public.has_premium(uuid) from public, anon, authenticated;
revoke execute on function public.apply_subscription_event(
  text, text, uuid, public.subscription_status, text, timestamptz, timestamptz, text
) from public, anon, authenticated;
revoke execute on function public.apply_subscription_transfer(text, uuid[], timestamptz, uuid)
  from public, anon, authenticated;
grant execute on function public.has_premium(uuid) to service_role;
grant execute on function public.apply_subscription_event(
  text, text, uuid, public.subscription_status, text, timestamptz, timestamptz, text
) to service_role;
grant execute on function public.apply_subscription_transfer(text, uuid[], timestamptz, uuid)
  to service_role;

-- Лимит — вошедшим (функции сами знают, кто это, по auth.uid()).
revoke execute on function public.consume_ai_request(integer, integer) from public, anon;
revoke execute on function public.ai_usage_status(integer, integer) from public, anon;
grant execute on function public.consume_ai_request(integer, integer) to authenticated, service_role;
grant execute on function public.ai_usage_status(integer, integer) to authenticated, service_role;
