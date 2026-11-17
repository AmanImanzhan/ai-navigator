-- Дневной лимит ИИ-помощника.
--
-- Как работает:
-- 1. Перед вызовом ИИ сервер (apps/web) вызывает consume_ai_request(лимит) от имени пользователя.
--    Функция атомарно прибавляет 1 к счётчику за сегодня (UTC), если лимит не исчерпан,
--    и выдаёт «квитанцию» — id резервации.
-- 2. Если ИИ не ответил, сервер вызывает refund_ai_request(квитанция) — попытка возвращается.
--    Квитанцию знает только сервер, поэтому пользователь не может сам «отменять» запросы.
--
-- Secret key не нужен: функции security definer работают по auth.uid() — с токеном пользователя.
-- Таблица ai_usage (счётчик по дням) уже есть в схеме v1; пользователь может её только читать.

-- ---------- Квитанции списаний ----------

-- Только факт списания: ни текста запроса, ни ответа здесь нет.
create table public.ai_usage_reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  created_at timestamptz not null default now(),
  refunded_at timestamptz
);

create index ai_usage_reservations_user_created_idx
  on public.ai_usage_reservations (user_id, created_at);

-- RLS включён, политик нет: читать и писать таблицу могут только функции ниже и сервер (secret key).
alter table public.ai_usage_reservations enable row level security;
grant select, insert, update, delete on public.ai_usage_reservations to service_role;

-- ---------- Списание попытки ----------

-- p_limit — сколько запросов в день разрешено этому пользователю (передаёт сервер).
-- Атомарность: INSERT … ON CONFLICT DO UPDATE блокирует строку счётчика, поэтому два
-- одновременных запроса не проскочат лимит — второй дождётся первого и увидит новое значение.
create function public.consume_ai_request(p_limit integer)
returns table (
  allowed boolean,
  used integer,
  remaining integer,
  reset_at timestamptz,
  reservation_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_day date := (now() at time zone 'utc')::date;
  v_reset timestamptz := (v_day + 1)::timestamp at time zone 'utc';
  v_count integer;
  v_reservation uuid;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 1000 then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  -- +1, только если ещё не упёрлись в лимит. Не прибавилось — строка не вернётся.
  insert into public.ai_usage as usage (user_id, day, count)
  values (v_user, v_day, 1)
  on conflict (user_id, day) do update
    set count = usage.count + 1
    where usage.count < p_limit
  returning usage.count into v_count;

  if v_count is null then
    select usage.count into v_count
    from public.ai_usage as usage
    where usage.user_id = v_user and usage.day = v_day;
    return query select false, v_count, 0, v_reset, null::uuid;
    return;
  end if;

  insert into public.ai_usage_reservations (user_id, day)
  values (v_user, v_day)
  returning id into v_reservation;

  -- Старые квитанции больше не нужны: вернуть попытку можно только в течение часа.
  delete from public.ai_usage_reservations
  where user_id = v_user and created_at < now() - interval '2 days';

  return query select true, v_count, greatest(p_limit - v_count, 0), v_reset, v_reservation;
end;
$$;

-- ---------- Возврат попытки ----------

-- Возвращает попытку по квитанции: только свою, только один раз и только в течение часа.
create function public.refund_ai_request(p_reservation uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_day date;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  update public.ai_usage_reservations
  set refunded_at = now()
  where id = p_reservation
    and user_id = v_user
    and refunded_at is null
    and created_at > now() - interval '1 hour'
  returning day into v_day;

  if v_day is null then
    return false;
  end if;

  update public.ai_usage
  set count = greatest(count - 1, 0)
  where user_id = v_user and day = v_day;
  return true;
end;
$$;

-- С 30.10.2026 Supabase не открывает новые функции для API сам — разрешаем явно и только вошедшим.
revoke execute on function public.consume_ai_request(integer) from public, anon;
revoke execute on function public.refund_ai_request(uuid) from public, anon;
grant execute on function public.consume_ai_request(integer) to authenticated, service_role;
grant execute on function public.refund_ai_request(uuid) to authenticated, service_role;
