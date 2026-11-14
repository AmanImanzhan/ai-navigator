-- Синхронизация прогресса и сохранённых запросов.
--
-- Чего не хватало в схеме v1:
--   saved_prompts — заголовка запроса и «мягкого» удаления (иначе удалённое на одном
--                   телефоне вернётся с другого);
--   profiles      — отметки «онбординг пройден» (иначе не отличить настройки по умолчанию
--                   от выбранных человеком);
--   функции, которая очищает данные аккаунта одним действием («Сбросить данные»).

-- ---------- Колонки ----------

-- Заголовок шаблона, по которому сохранён запрос.
alter table public.saved_prompts add column title text;

-- Когда запрос удалён. Строку не стираем: по ней другие телефоны узнают, что запрос удалён.
alter table public.saved_prompts add column deleted_at timestamptz;

-- Когда человек прошёл онбординг. null — ещё не проходил (или сбросил данные).
alter table public.profiles add column onboarding_completed_at timestamptz;

-- ---------- Защита от потери данных при повторной отправке ----------
-- Телефон может отправить одно и то же несколько раз (повтор после ошибки сети, два телефона).
-- Эти триггеры гарантируют, что повтор ничего не испортит.

-- Урок, пройденный раньше, остаётся пройденным раньше: из двух дат берём самую раннюю.
create function public.keep_earliest_completion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.completed_at := least(old.completed_at, new.completed_at);
  return new;
end;
$$;

create trigger user_progress_keep_earliest
  before update on public.user_progress
  for each row execute function public.keep_earliest_completion();

-- Удалённый запрос не «воскресает»: однажды заданный deleted_at обратно не сбросить.
create function public.keep_prompt_deleted()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.deleted_at := coalesce(old.deleted_at, new.deleted_at);
  return new;
end;
$$;

create trigger saved_prompts_keep_deleted
  before update on public.saved_prompts
  for each row execute function public.keep_prompt_deleted();

-- Функции триггеров вызывает только сама база.
revoke execute on function public.keep_earliest_completion() from public, anon, authenticated;
revoke execute on function public.keep_prompt_deleted() from public, anon, authenticated;

-- ---------- «Сбросить данные» ----------

-- Очищает данные того, кто вызывает: прогресс, сохранённые запросы, ответы онбординга.
-- security invoker — работает с правами пользователя, поэтому RLS не даст тронуть чужое.
-- Всё в одной транзакции: либо очистится всё, либо ничего.
create function public.reset_my_data()
returns void
language sql
security invoker
set search_path = ''
as $$
  delete from public.user_progress where user_id = auth.uid();
  update public.saved_prompts set deleted_at = now()
    where user_id = auth.uid() and deleted_at is null;
  update public.profiles set occupation = null, onboarding_completed_at = null
    where id = auth.uid();
$$;

-- С 30.10.2026 Supabase не открывает новые функции для API сам — разрешаем явно.
revoke execute on function public.reset_my_data() from public, anon;
grant execute on function public.reset_my_data() to authenticated;
