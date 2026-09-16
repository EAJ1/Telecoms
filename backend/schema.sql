-- Run in the Supabase SQL editor. Public visitors may submit enquiries,
-- but cannot read them. Manage submissions through the Supabase dashboard.
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null
);
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  date date not null default current_date
);
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 5000),
  email text not null check (length(email) between 3 and 5000),
  message text not null check (length(trim(message)) between 1 and 5000)
);
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  company text not null check (length(trim(company)) between 1 and 5000),
  email text not null check (length(email) between 3 and 5000),
  plan text not null check (plan in ('basic', 'pro', 'enterprise')),
  message text check (length(message) <= 5000)
);
alter table public.services enable row level security;
alter table public.news enable row level security;
alter table public.contacts enable row level security;
alter table public.contracts enable row level security;
grant select on public.services, public.news to anon;
grant insert on public.contacts, public.contracts to anon;
drop policy if exists public_services on public.services;
create policy public_services on public.services for select to anon using (true);
drop policy if exists public_news on public.news;
create policy public_news on public.news for select to anon using (true);
drop policy if exists submit_contact on public.contacts;
create policy submit_contact on public.contacts for insert to anon with check (true);
drop policy if exists submit_contract on public.contracts;
create policy submit_contract on public.contracts for insert to anon with check (true);
