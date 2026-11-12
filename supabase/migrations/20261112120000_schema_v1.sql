-- Схема v1: пользователи, команды, контент уроков и шаблонов, прогресс, лимиты AI, подписки.
--
-- Правила доступа (RLS):
--   контент — читают все (только опубликованное), пишет только сервер (secret key);
--   profiles, user_progress, saved_prompts — владелец читает и пишет своё;
--   ai_usage, subscriptions — владелец только читает, пишет сервер.
-- secret key работает от роли service_role: она обходит RLS, поэтому политики для неё не нужны.
--
-- С 30.10.2026 Supabase не открывает новые таблицы для API сам — нужен явный GRANT.
-- GRANT отвечает «можно ли вообще трогать таблицу», RLS — «какие именно строки».

-- ---------- Типы ----------

-- Языки интерфейса и контента. Новый язык: alter type public.app_locale add value 'de';
create type public.app_locale as enum ('en', 'ru', 'es');

create type public.org_role as enum ('owner', 'admin', 'member');

create type public.subscription_status as enum (
  'active',
  'trialing',
  'grace_period',
  'expired',
  'cancelled'
);

-- ---------- Профиль ----------

-- Ответы онбординга. id совпадает с id пользователя в Supabase Auth.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  language public.app_locale not null default 'en',
  occupation text check (
    occupation in ('office', 'manager', 'business', 'student', 'retired')
  ),
  minutes_per_day smallint not null default 10 check (minutes_per_day in (5, 10, 15)),
  reminder_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Команды (задел под командный тариф) ----------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.memberships (
  user_id uuid not null references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role public.org_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (user_id, organization_id)
);

create index memberships_organization_id_idx on public.memberships (organization_id);

-- ---------- Контент: направления и уроки ----------

create table public.tracks (
  id text primary key,
  sort integer not null,
  premium boolean not null default false
);

create table public.track_translations (
  track_id text not null references public.tracks (id) on delete cascade,
  locale public.app_locale not null,
  title text not null,
  primary key (track_id, locale)
);

create table public.lessons (
  id text primary key,
  track_id text not null references public.tracks (id) on delete cascade,
  sort integer not null,
  level smallint not null check (level between 1 and 3),
  minutes smallint not null check (minutes > 0),
  published boolean not null default false
);

create index lessons_track_id_idx on public.lessons (track_id);

-- content — карточки урока (тип LessonContent из приложения). null — урока на этом языке ещё нет.
create table public.lesson_translations (
  lesson_id text not null references public.lessons (id) on delete cascade,
  locale public.app_locale not null,
  title text not null,
  content jsonb,
  primary key (lesson_id, locale)
);

-- Общее предупреждение для всех шаблонов урока.
create table public.lesson_notes (
  lesson_id text not null references public.lessons (id) on delete cascade,
  locale public.app_locale not null,
  text text not null,
  primary key (lesson_id, locale)
);

-- ---------- Контент: шаблоны запросов ----------

-- id = «урок.номер», например '2.3'.
create table public.templates (
  id text primary key,
  lesson_id text not null references public.lessons (id) on delete cascade,
  sort integer not null,
  published boolean not null default false
);

create index templates_lesson_id_idx on public.templates (lesson_id);

-- tools — список инструментов [{ name, url }].
create table public.template_translations (
  template_id text not null references public.templates (id) on delete cascade,
  locale public.app_locale not null,
  title text not null,
  purpose text not null,
  prompt text not null,
  example text not null,
  tools jsonb not null default '[]'::jsonb,
  primary key (template_id, locale)
);

-- ---------- Данные пользователя ----------

create table public.user_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- template_id пустой, если запрос написан не по шаблону или шаблон удалили.
create table public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null,
  template_id text references public.templates (id) on delete set null,
  created_at timestamptz not null default now()
);

create index saved_prompts_user_id_idx on public.saved_prompts (user_id, created_at desc);

-- Сколько раз за день человек обратился к AI-помощнику. Считает сервер.
create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default current_date,
  count integer not null default 0 check (count >= 0),
  primary key (user_id, day)
);

-- Состояние подписки. Обновляет сервер (позже — по вебхукам RevenueCat).
create table public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  status public.subscription_status not null,
  product_id text not null,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------- Доступ к таблицам (GRANT) ----------

-- Контент: anon и authenticated только читают.
grant select on
  public.tracks,
  public.track_translations,
  public.lessons,
  public.lesson_translations,
  public.lesson_notes,
  public.templates,
  public.template_translations
to anon, authenticated;

-- Свои данные: вошедший пользователь читает и пишет (какие строки — решает RLS).
grant select, insert, update, delete on
  public.profiles,
  public.user_progress,
  public.saved_prompts
to authenticated;

-- Только чтение для вошедшего пользователя.
grant select on
  public.organizations,
  public.memberships,
  public.ai_usage,
  public.subscriptions
to authenticated;

-- Сервер (secret key) может всё.
grant select, insert, update, delete on all tables in schema public to service_role;

-- ---------- RLS ----------

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.tracks enable row level security;
alter table public.track_translations enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_translations enable row level security;
alter table public.lesson_notes enable row level security;
alter table public.templates enable row level security;
alter table public.template_translations enable row level security;
alter table public.user_progress enable row level security;
alter table public.saved_prompts enable row level security;
alter table public.ai_usage enable row level security;
alter table public.subscriptions enable row level security;

-- Контент. Политик на запись нет — значит, писать может только service_role.
-- (select auth.uid()) в скобках: Postgres считает его один раз на запрос, а не на каждую строку.

create policy "content: read tracks"
  on public.tracks for select
  to anon, authenticated
  using (true);

create policy "content: read track translations"
  on public.track_translations for select
  to anon, authenticated
  using (true);

create policy "content: read published lessons"
  on public.lessons for select
  to anon, authenticated
  using (published);

create policy "content: read translations of published lessons"
  on public.lesson_translations for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.lessons
      where lessons.id = lesson_translations.lesson_id and lessons.published
    )
  );

create policy "content: read notes of published lessons"
  on public.lesson_notes for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.lessons
      where lessons.id = lesson_notes.lesson_id and lessons.published
    )
  );

-- Шаблон виден, если опубликован он сам и его урок.
create policy "content: read published templates"
  on public.templates for select
  to anon, authenticated
  using (
    published
    and exists (
      select 1 from public.lessons
      where lessons.id = templates.lesson_id and lessons.published
    )
  );

create policy "content: read translations of published templates"
  on public.template_translations for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.templates
      join public.lessons on lessons.id = templates.lesson_id
      where templates.id = template_translations.template_id
        and templates.published
        and lessons.published
    )
  );

-- Профиль: только свой.

create policy "profiles: owner reads"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: owner inserts"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles: owner updates"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "profiles: owner deletes"
  on public.profiles for delete
  to authenticated
  using ((select auth.uid()) = id);

-- Прогресс: только свой.

create policy "user_progress: owner reads"
  on public.user_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "user_progress: owner inserts"
  on public.user_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user_progress: owner updates"
  on public.user_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "user_progress: owner deletes"
  on public.user_progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Сохранённые запросы: только свои.

create policy "saved_prompts: owner reads"
  on public.saved_prompts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "saved_prompts: owner inserts"
  on public.saved_prompts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "saved_prompts: owner updates"
  on public.saved_prompts for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "saved_prompts: owner deletes"
  on public.saved_prompts for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Лимиты AI и подписка: пользователь только читает своё.

create policy "ai_usage: owner reads"
  on public.ai_usage for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "subscriptions: owner reads"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Команды: человек видит свои членства и команды, в которых состоит. Пишет пока только сервер.

create policy "memberships: member reads own"
  on public.memberships for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "organizations: members read"
  on public.organizations for select
  to authenticated
  using (
    exists (
      select 1 from public.memberships
      where memberships.organization_id = organizations.id
        and memberships.user_id = (select auth.uid())
    )
  );
