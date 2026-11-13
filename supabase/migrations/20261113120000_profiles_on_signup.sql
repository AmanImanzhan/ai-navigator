-- Профиль создаётся сам при регистрации + имя пользователя.
--
-- Раньше строки в profiles не было, пока приложение само её не вставит.
-- Теперь её создаёт триггер на auth.users — в момент первого входа (Apple, позже Google).

-- Имя. Apple отдаёт его только при самом первом входе — приложение сохраняет его сюда.
alter table public.profiles add column full_name text;

-- security definer: функция работает с правами владельца, а не того, кто входит, —
-- иначе RLS не дал бы вставить строку. search_path = '' — защита от подмены таблиц.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Функцию вызывает только триггер — через API её не вызвать.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Пользователи, которые успели зарегистрироваться до этой миграции, тоже получают профиль.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;
