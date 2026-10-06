-- X - Report: database schema (reference)
--
-- Run this in the Supabase SQL Editor on a NEW project to recreate the
-- database used by the app. It contains the tables, security rules and
-- functions, but no sample data.
--
-- After running it and signing up on the site, make yourself an admin with:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com'
--   on conflict do nothing;

-- ---------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------

create table public.issues (
  id bigint generated always as identity (start with 1001) primary key,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 5 and 1000),
  category text not null check (category in ('Roads','Water','Electricity','Waste','Public lighting','Safety','Other')),
  severity text not null check (severity in ('Low','Medium','High')),
  location text not null default 'Pinned location' check (char_length(location) <= 120),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  status text not null default 'Reported' check (status in ('Reported','Verified','Assigned','Being fixed','Resolved')),
  confirmations integer not null default 0 check (confirmations >= 0),
  is_demo boolean not null default false,
  user_id uuid references auth.users(id) on delete set null default auth.uid(),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.confirmations (
  issue_id bigint not null references public.issues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (issue_id, user_id)
);

create table public.status_history (
  id bigint generated always as identity primary key,
  issue_id bigint not null references public.issues(id) on delete cascade,
  status text not null check (status in ('Reported','Verified','Assigned','Being fixed','Resolved')),
  note text check (note is null or char_length(note) <= 300),
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index status_history_issue_idx on public.status_history (issue_id);

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------------------------------------------------------------
-- 2. Security (Row Level Security)
-- ---------------------------------------------------------------

alter table public.issues enable row level security;
alter table public.confirmations enable row level security;
alter table public.status_history enable row level security;
alter table public.admins enable row level security;

-- Everyone can read reports and their history
grant select on public.issues to anon, authenticated;
grant select on public.status_history to anon, authenticated;
-- Only signed-in users can create reports
grant insert on public.issues to authenticated;
-- Confirmations and admins are only reachable through the functions below
revoke all on public.confirmations from anon, authenticated;
revoke all on public.admins from anon, authenticated;

create policy "Anyone can read issues"
  on public.issues for select to anon, authenticated
  using (true);

create policy "Signed-in users can report"
  on public.issues for insert to authenticated
  with check (user_id = auth.uid() and status = 'Reported' and confirmations = 0 and is_demo = false);

create policy "Anyone can read status history"
  on public.status_history for select to anon, authenticated
  using (true);

-- ---------------------------------------------------------------
-- 3. Functions
-- ---------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.toggle_confirmation(p_issue_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  report_owner uuid;
  new_count integer;
  now_confirmed boolean;
begin
  if uid is null then
    raise exception 'Sign in to confirm a report';
  end if;

  select user_id into report_owner from public.issues where id = p_issue_id;
  if not found then
    raise exception 'Report not found';
  end if;
  if report_owner = uid then
    raise exception 'You cannot confirm your own report';
  end if;

  if exists (select 1 from public.confirmations where issue_id = p_issue_id and user_id = uid) then
    delete from public.confirmations where issue_id = p_issue_id and user_id = uid;
    update public.issues set confirmations = greatest(confirmations - 1, 0)
      where id = p_issue_id returning confirmations into new_count;
    now_confirmed := false;
  else
    insert into public.confirmations (issue_id, user_id) values (p_issue_id, uid);
    update public.issues set confirmations = confirmations + 1
      where id = p_issue_id returning confirmations into new_count;
    now_confirmed := true;
  end if;

  return jsonb_build_object('confirmed', now_confirmed, 'count', new_count);
end;
$$;

create or replace function public.my_confirmations()
returns bigint[]
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(array_agg(issue_id), '{}'::bigint[])
  from public.confirmations
  where user_id = auth.uid();
$$;

create or replace function public.set_issue_status(p_issue_id bigint, p_status text, p_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can change a status';
  end if;
  if p_status not in ('Reported','Verified','Assigned','Being fixed','Resolved') then
    raise exception 'Invalid status';
  end if;

  update public.issues
  set status = p_status,
      resolved_at = case when p_status = 'Resolved' then coalesce(resolved_at, now()) else null end
  where id = p_issue_id;
  if not found then
    raise exception 'Report not found';
  end if;

  insert into public.status_history (issue_id, status, note, changed_by)
  values (p_issue_id, p_status, nullif(left(btrim(coalesce(p_note, '')), 300), ''), auth.uid());
end;
$$;

create or replace function public.log_initial_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.status_history (issue_id, status, changed_by)
  values (new.id, new.status, new.user_id);
  return new;
end;
$$;

create trigger issues_log_initial_status
  after insert on public.issues
  for each row execute function public.log_initial_status();

-- Only signed-in users may call these
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.toggle_confirmation(bigint) from public, anon;
revoke execute on function public.my_confirmations() from public, anon;
revoke execute on function public.set_issue_status(bigint, text, text) from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.toggle_confirmation(bigint) to authenticated;
grant execute on function public.my_confirmations() to authenticated;
grant execute on function public.set_issue_status(bigint, text, text) to authenticated;
