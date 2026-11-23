-- =========================================================
-- SENTIMENTAL APPLE — DATABASE SETUP
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to run again: it only creates what's missing.
-- =========================================================

-- ---------- Admins (the shop owner) ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins can see admins" on public.admins;
create policy "admins can see admins" on public.admins for select using (public.is_admin());

-- ---------- Customer profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles for insert with check (id = auth.uid());

-- Create a profile automatically when someone signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Products ----------
create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  icon text default 'apple',
  color text default 'pink',
  badge text default '',
  is_new boolean not null default false,
  sold_out boolean not null default false,
  description text default '',
  image text,
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;

drop policy if exists "anyone can see products" on public.products;
create policy "anyone can see products" on public.products for select using (active or public.is_admin());
drop policy if exists "admin manages products" on public.products;
create policy "admin manages products" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Journal posts ----------
create table if not exists public.posts (
  id text primary key,                       -- short name used in links, e.g. "first-spread"
  title text not null,
  date date not null default current_date,
  author text not null default '',
  icon text default 'notebook',
  color text default 'teal',
  tags text[] not null default '{}',
  body text not null default '',             -- paragraphs separated by a blank line
  image text,                                -- photo shown in the polaroid (optional)
  likes integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.posts enable row level security;

drop policy if exists "anyone can read published posts" on public.posts;
create policy "anyone can read published posts" on public.posts for select using (published or public.is_admin());
drop policy if exists "admin manages posts" on public.posts;
create policy "admin manages posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

-- Likes: anyone can add or take back one like (no direct writes to the posts table)
create or replace function public.like_post(p_id text, p_add boolean)
returns integer language sql security definer set search_path = public as $$
  update public.posts
     set likes = greatest(0, likes + case when p_add then 1 else -1 end)
   where id = p_id and published
  returning likes;
$$;
revoke all on function public.like_post(text, boolean) from public;
grant execute on function public.like_post(text, boolean) to anon, authenticated;

-- ---------- Journal notes (comments) ----------
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id text not null references public.posts (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  body text not null check (char_length(trim(body)) between 1 and 300),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at);
alter table public.comments enable row level security;

drop policy if exists "anyone can read notes" on public.comments;
create policy "anyone can read notes" on public.comments for select using (
  exists (select 1 from public.posts p where p.id = post_id and (p.published or public.is_admin()))
);
drop policy if exists "anyone can add a note" on public.comments;
create policy "anyone can add a note" on public.comments for insert to anon, authenticated with check (
  (user_id is null or user_id = auth.uid())
  and exists (select 1 from public.posts p where p.id = post_id and p.published)
);
drop policy if exists "admin removes notes" on public.comments;
create policy "admin removes notes" on public.comments for delete using (public.is_admin());

-- ---------- Orders ----------
-- Orders are only ever created by the "create-checkout" server function,
-- so customers can't fake an order or change a price.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  address text not null,
  note text default '',
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null,
  total numeric(10, 2) not null,
  currency text not null default 'gbp',
  status text not null default 'pending' check (status in ('pending', 'paid', 'packed', 'shipped', 'cancelled')),
  stripe_session_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists orders_number_idx on public.orders (number);
alter table public.orders enable row level security;

drop policy if exists "customers see own orders" on public.orders;
create policy "customers see own orders" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin updates orders" on public.orders;
create policy "admin updates orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text,
  name text not null,
  price numeric(10, 2) not null,
  qty integer not null check (qty > 0)
);
alter table public.order_items enable row level security;

drop policy if exists "see items of visible orders" on public.order_items;
create policy "see items of visible orders" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);

-- ---------- Photo storage for journal posts ----------
insert into storage.buckets (id, name, public)
values ('journal', 'journal', true)
on conflict (id) do nothing;

drop policy if exists "admin lists journal photos" on storage.objects;
create policy "admin lists journal photos" on storage.objects for select to authenticated
  using (bucket_id = 'journal' and public.is_admin());
drop policy if exists "admin uploads journal photos" on storage.objects;
create policy "admin uploads journal photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'journal' and public.is_admin());
drop policy if exists "admin edits journal photos" on storage.objects;
create policy "admin edits journal photos" on storage.objects for update to authenticated
  using (bucket_id = 'journal' and public.is_admin());
drop policy if exists "admin deletes journal photos" on storage.objects;
create policy "admin deletes journal photos" on storage.objects for delete to authenticated
  using (bucket_id = 'journal' and public.is_admin());
