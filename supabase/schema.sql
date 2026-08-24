-- simplecycle schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_type text check (application_type in ('medical','law','graduate_masters','graduate_doctorate')),
  cycle_year text not null,
  cycle_start_date date not null,
  gpa numeric(3,2),
  major_gpa numeric(3,2),
  gpa_scale numeric(2,1) check (gpa_scale in (4.0, 5.0)),
  created_at timestamptz not null default now(),
  constraint gpa_within_scale check (gpa is null or gpa_scale is null or gpa <= gpa_scale),
  constraint major_gpa_within_scale check (major_gpa is null or gpa_scale is null or major_gpa <= gpa_scale)
);

create table if not exists public.exam_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid not null references public.cycles(id) on delete cascade,
  exam_name text not null, -- e.g. MCAT, CASPer
  score text not null,
  date_taken date,
  created_at timestamptz not null default now(),
  constraint exam_score_within_range check (
    exam_name not in ('MCAT','LSAT','GRE')
    or (
      score ~ '^\d+$'
      and (
        (exam_name = 'MCAT' and score::int between 472 and 528)
        or (exam_name = 'LSAT' and score::int between 120 and 180)
        or (exam_name = 'GRE' and score::int between 260 and 340)
      )
    )
  )
);

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_id uuid not null references public.cycles(id) on delete cascade,
  name text not null,
  city text,
  state text,
  in_state_tuition numeric(10,2),
  out_state_tuition numeric(10,2),
  residency text check (residency in ('in_state','out_state','unknown')) default 'unknown',
  national_ranking int,
  combined_program text, -- e.g. MD/PhD, MD/MPH
  pros text,
  cons text,
  alignment_notes text, -- how the user aligns with the school
  clubs_of_interest text,
  status text check (status in ('considering','applied','secondary_pending','interview','waitlist','accepted','rejected','withdrawn')) default 'considering',
  user_ranking int, -- user's personal ranking of this school
  primary_submitted_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.secondaries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  received boolean not null default false,
  date_received date,
  date_submitted date,
  deadline date, -- typically two weeks from date_received
  created_at timestamptz not null default now()
);

create table if not exists public.essay_prompts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  response text,
  word_limit int,
  ai_feedback text, -- populated by future AI grading feature
  created_at timestamptz not null default now()
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invited boolean not null default false,
  invite_date date,
  interview_date date,
  format text check (format in ('in_person','virtual','mmi','traditional','unknown')) default 'unknown',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.school_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requested_name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.email_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  alert_type text check (alert_type in ('secondary_deadline','recommendation_reminder','interview_prep','custom')) not null,
  send_at timestamptz not null,
  sent boolean not null default false,
  message text,
  created_at timestamptz not null default now()
);

-- Row Level Security: every user can only see/edit their own rows.
alter table public.profiles enable row level security;
alter table public.cycles enable row level security;
alter table public.exam_scores enable row level security;
alter table public.schools enable row level security;
alter table public.secondaries enable row level security;
alter table public.essay_prompts enable row level security;
alter table public.interviews enable row level security;
alter table public.school_requests enable row level security;
alter table public.email_alerts enable row level security;

create policy "profiles: owner access" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "cycles: owner access" on public.cycles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "exam_scores: owner access" on public.exam_scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "schools: owner access" on public.schools
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "secondaries: owner access" on public.secondaries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "essay_prompts: owner access" on public.essay_prompts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "interviews: owner access" on public.interviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "email_alerts: owner access" on public.email_alerts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "school_requests: owner access" on public.school_requests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row and first cycle when a new user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_cycle_id uuid;
  cycle_year_value text;
  cycle_start_year int;
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  cycle_year_value := coalesce(nullif(new.raw_user_meta_data->>'cycle_year', ''), to_char(now(), 'YYYY') || '-' || to_char(now() + interval '1 year', 'YYYY'));
  cycle_start_year := split_part(cycle_year_value, '-', 1)::int;

  insert into public.cycles (user_id, application_type, cycle_year, cycle_start_date, gpa, major_gpa, gpa_scale)
  values (
    new.id,
    new.raw_user_meta_data->>'application_type',
    cycle_year_value,
    make_date(cycle_start_year, 8, 1),
    nullif(new.raw_user_meta_data->>'gpa', '')::numeric(3,2),
    nullif(new.raw_user_meta_data->>'major_gpa', '')::numeric(3,2),
    nullif(new.raw_user_meta_data->>'gpa_scale', '')::numeric(2,1)
  )
  returning id into new_cycle_id;

  if nullif(new.raw_user_meta_data->>'exam_name', '') is not null
     and nullif(new.raw_user_meta_data->>'exam_score', '') is not null then
    insert into public.exam_scores (user_id, cycle_id, exam_name, score)
    values (
      new.id,
      new_cycle_id,
      new.raw_user_meta_data->>'exam_name',
      new.raw_user_meta_data->>'exam_score'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
