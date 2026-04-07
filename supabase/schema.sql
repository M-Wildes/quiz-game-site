create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  total_score integer not null default 0,
  total_xp integer not null default 0,
  level integer not null default 1,
  quizzes_completed integer not null default 0,
  best_score integer not null default 0,
  accuracy numeric(5, 2) not null default 0,
  streak integer not null default 0,
  last_played_at timestamptz
);

create table if not exists public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_type text not null,
  category text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  score integer not null,
  correct_answers integer not null,
  total_questions integer not null,
  duration_ms integer not null,
  xp_earned integer not null,
  played_at timestamptz not null default now()
);

create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  season_id uuid references public.seasons(id) on delete set null,
  category text not null,
  score integer not null,
  xp integer not null default 0,
  streak integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.battle_pass_tiers (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  tier_number integer not null,
  xp_required integer not null,
  reward_type text not null default 'free',
  reward_name text not null,
  reward_value text,
  created_at timestamptz not null default now(),
  unique (season_id, tier_number)
);

create table if not exists public.user_battle_pass_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  current_xp integer not null default 0,
  current_tier integer not null default 1,
  last_reward_claimed integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, season_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := split_part(new.email, '@', 1);

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g')) || '_' || substr(new.id::text, 1, 6),
    coalesce(new.raw_user_meta_data ->> 'display_name', base_username)
  )
  on conflict (id) do nothing;

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.apply_quiz_result()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_season public.seasons%rowtype;
  total_correct integer;
  total_questions_answered integer;
  computed_accuracy numeric(5, 2);
begin
  select * into active_season
  from public.seasons
  where is_active = true
  order by starts_at desc
  limit 1;

  insert into public.user_stats (user_id)
  values (new.user_id)
  on conflict (user_id) do nothing;

  select
    coalesce(sum(correct_answers), 0),
    coalesce(sum(total_questions), 0)
  into total_correct, total_questions_answered
  from public.quiz_results
  where user_id = new.user_id;

  computed_accuracy := case
    when total_questions_answered > 0
      then round((total_correct::numeric / total_questions_answered::numeric) * 100, 2)
    else 0
  end;

  update public.user_stats
  set
    total_score = total_score + new.score,
    total_xp = total_xp + new.xp_earned,
    level = floor(sqrt((total_xp + new.xp_earned)::numeric / 180)) + 1,
    quizzes_completed = quizzes_completed + 1,
    best_score = greatest(best_score, new.score),
    accuracy = computed_accuracy,
    last_played_at = new.played_at
  where user_id = new.user_id;

  if active_season.id is not null then
    insert into public.user_battle_pass_progress (
      user_id,
      season_id,
      current_xp,
      current_tier
    )
    values (
      new.user_id,
      active_season.id,
      new.xp_earned,
      greatest(floor((new.xp_earned)::numeric / 200) + 1, 1)
    )
    on conflict (user_id, season_id)
    do update
    set
      current_xp = public.user_battle_pass_progress.current_xp + excluded.current_xp,
      current_tier = greatest(
        floor((public.user_battle_pass_progress.current_xp + excluded.current_xp)::numeric / 200) + 1,
        1
      ),
      updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists on_quiz_result_inserted on public.quiz_results;
create trigger on_quiz_result_inserted
after insert on public.quiz_results
for each row execute procedure public.apply_quiz_result();

alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.quiz_results enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.user_battle_pass_progress enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Users can read own stats" on public.user_stats;
create policy "Users can read own stats"
on public.user_stats
for select
using (auth.uid() = user_id);

drop policy if exists "Users can read own quiz history" on public.quiz_results;
create policy "Users can read own quiz history"
on public.quiz_results
for select
using (auth.uid() = user_id);

drop policy if exists "Server can insert quiz results" on public.quiz_results;
create policy "Server can insert quiz results"
on public.quiz_results
for insert
with check (auth.uid() = user_id);

drop policy if exists "Leaderboard is public" on public.leaderboard_entries;
create policy "Leaderboard is public"
on public.leaderboard_entries
for select
using (true);

drop policy if exists "Users can read own battle pass progress" on public.user_battle_pass_progress;
create policy "Users can read own battle pass progress"
on public.user_battle_pass_progress
for select
using (auth.uid() = user_id);
