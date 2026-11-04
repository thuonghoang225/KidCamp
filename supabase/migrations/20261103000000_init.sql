-- KidCamp: schema khởi tạo
-- Mọi dữ liệu quy về một phụ huynh (auth.users). Row Level Security bật trên mọi bảng.


-- ---------- Phụ huynh & bé ----------
create table public.parents (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  pin_hash text,
  timezone text not null default 'Asia/Ho_Chi_Minh',
  created_at timestamptz not null default now()
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 40),
  avatar_path text,
  costume_id text not null default 'camper',
  voice_accent text not null default 'en-US',
  daily_goal_min int not null default 25 check (daily_goal_min between 5 and 90),
  topic_ratio numeric not null default 0 check (topic_ratio between 0 and 1),
  created_at timestamptz not null default now()
);
create index on public.children (parent_id);

create table public.enrollments (
  child_id uuid not null references public.children (id) on delete cascade,
  course_id text not null,
  current_unit_id text not null default 'u01',
  started_at timestamptz not null default now(),
  primary key (child_id, course_id)
);

-- ---------- Học tập ----------
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  course_id text not null,
  kind text not null check (kind in ('station', 'review', 'challenge', 'talk')),
  unit_id text,
  station_id text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  stars smallint check (stars between 0 and 3),
  first_try_correct int,
  total int
);
create index on public.sessions (child_id, started_at desc);

create table public.attempts (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.sessions (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  course_id text not null,
  item_id text,
  exercise text not null,
  is_correct boolean not null,
  first_try boolean not null default true,
  score numeric not null default 0,
  response jsonb,
  latency_ms int,
  created_at timestamptz not null default now()
);
create index on public.attempts (child_id, created_at desc);
create index on public.attempts (child_id, item_id);

create table public.item_progress (
  child_id uuid not null references public.children (id) on delete cascade,
  course_id text not null, -- 'english' cho mọi item tiếng Anh (sách + chủ đề dùng chung lịch ôn)
  item_id text not null,
  box smallint not null default 0 check (box between 0 and 5),
  due_on date,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  last_seen_at timestamptz,
  primary key (child_id, course_id, item_id)
);
create index on public.item_progress (child_id, due_on);

create table public.station_progress (
  child_id uuid not null references public.children (id) on delete cascade,
  course_id text not null,
  unit_id text not null,
  station_id text not null,
  best_stars smallint not null default 0,
  completed_at timestamptz not null default now(),
  primary key (child_id, course_id, unit_id, station_id)
);

create table public.daily_activity (
  child_id uuid not null references public.children (id) on delete cascade,
  day date not null,
  seconds int not null default 0,
  sessions_count int not null default 0,
  spoken_count int not null default 0,
  freeze_used boolean not null default false,
  primary key (child_id, day)
);

create table public.badges (
  child_id uuid not null references public.children (id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (child_id, badge_id)
);

-- ---------- Khu Nói chuyện ----------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  course_id text not null,
  mode text not null check (mode in ('quick', 'roleplay', 'ai')),
  dialogue_id text,
  round smallint not null default 1,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table public.conversation_turns (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  speaker text not null check (speaker in ('child', 'bot')),
  text text not null,
  expected_item_id text,
  score numeric,
  latency_ms int,
  hint_level smallint,
  created_at timestamptz not null default now()
);
create index on public.conversation_turns (child_id, created_at desc);

create table public.child_facts (
  child_id uuid not null references public.children (id) on delete cascade,
  key text not null,
  value text not null,
  source_conversation_id uuid references public.conversations (id) on delete set null,
  primary key (child_id, key)
);

-- ---------- Row Level Security ----------
create or replace function public.is_my_child(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.children c where c.id = cid and c.parent_id = auth.uid());
$$;

alter table public.parents enable row level security;
create policy "parent: own row" on public.parents for all using (id = auth.uid()) with check (id = auth.uid());

alter table public.children enable row level security;
create policy "children: own" on public.children for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['enrollments','sessions','attempts','item_progress','station_progress',
                           'daily_activity','badges','conversations','conversation_turns','child_facts']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own children only" on public.%I for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id))', t);
  end loop;
end $$;

-- ---------- Ghi kết quả một câu trả lời (một giao dịch) ----------
-- Trạng thái ôn mới (box, due_on) do server tính bằng hàm thuần src/core/srs/leitner.ts
create or replace function public.record_attempt(
  p_session_id uuid, p_child_id uuid, p_course_id text, p_progress_course_id text,
  p_item_id text, p_exercise text, p_is_correct boolean, p_first_try boolean, p_score numeric,
  p_response jsonb, p_latency_ms int, p_box smallint, p_due_on date
) returns void language plpgsql security invoker as $$
begin
  insert into public.attempts (session_id, child_id, course_id, item_id, exercise, is_correct, first_try, score, response, latency_ms)
  values (p_session_id, p_child_id, p_course_id, p_item_id, p_exercise, p_is_correct, p_first_try, p_score, p_response, p_latency_ms);

  if p_item_id is not null and p_first_try then
    insert into public.item_progress as ip (child_id, course_id, item_id, box, due_on, correct_count, wrong_count, last_seen_at)
    values (p_child_id, p_progress_course_id, p_item_id, p_box, p_due_on,
            case when p_is_correct then 1 else 0 end, case when p_is_correct then 0 else 1 end, now())
    on conflict (child_id, course_id, item_id) do update set
      box = excluded.box,
      due_on = excluded.due_on,
      correct_count = ip.correct_count + excluded.correct_count,
      wrong_count = ip.wrong_count + excluded.wrong_count,
      last_seen_at = now();
  end if;
end $$;

-- ---------- Tạo hồ sơ phụ huynh khi đăng ký ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.parents (id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Ảnh khuôn mặt của bé (bucket riêng tư) ----------
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', false)
on conflict (id) do nothing;

create policy "avatars: own folder read" on storage.objects for select
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars: own folder write" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars: own folder update" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars: own folder delete" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
