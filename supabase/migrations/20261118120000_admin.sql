-- Админ-панель сайта (apps/web/src/app/admin): кто админ, журнал изменений, сводные цифры.
--
-- Все три объекта доступны только сервисной роли (secret key на сервере сайта).
-- Ни приложение, ни браузер (anon, authenticated) не могут их ни читать, ни менять:
-- значит, назначить себя админом из клиента нельзя.

-- ---------- Кто админ ----------

-- Отдельная таблица, а не app_metadata в токене: снять права можно сразу (токен с ролью
-- жил бы ещё до часа), а список админов виден одним запросом в SQL Editor.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- Политик нет: anon и authenticated не видят ни одной строки. service_role обходит RLS.
revoke all on public.admins from anon, authenticated;
grant select, insert, update, delete on public.admins to service_role;

-- ---------- Журнал изменений ----------

-- Кто, когда и что поменял. Содержимое до и после не храним — только что именно менялось.
create table public.admin_audit_log (
  id bigint generated always as identity primary key,
  -- Админа могут удалить — запись остаётся, почта сохраняется для истории.
  admin_id uuid references auth.users (id) on delete set null,
  admin_email text,
  -- lesson.update, lesson.publish, lesson.hide, template.update
  action text not null,
  entity_id text not null,
  locale public.app_locale,
  -- Какие поля менялись, например { "fields": ["title", "content"] }.
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);

alter table public.admin_audit_log enable row level security;
revoke all on public.admin_audit_log from anon, authenticated;
grant select, insert on public.admin_audit_log to service_role;

-- ---------- Сводка для обзора ----------

-- Только числа, без личных данных. День — по UTC, как в лимитах ИИ (consume_ai_request).
create function public.admin_stats()
returns table (
  users bigint,
  ai_requests_today bigint,
  ai_requests_7d bigint,
  ai_users_today bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with today as (select (now() at time zone 'utc')::date as day)
  select
    (select count(*) from auth.users),
    (select coalesce(sum(u.count), 0) from public.ai_usage u, today where u.day = today.day),
    (select coalesce(sum(u.count), 0) from public.ai_usage u, today where u.day > today.day - 7),
    (select count(*) from public.ai_usage u, today where u.day = today.day and u.count > 0);
$$;

revoke execute on function public.admin_stats() from public, anon, authenticated;
grant execute on function public.admin_stats() to service_role;
