-- =========================================================
-- SENTIMENTAL APPLE — FULL DATABASE SETUP (all 3 steps in one)
-- Supabase → SQL Editor → New query → paste ALL of this → Run.
-- Safe to run more than once.
-- =========================================================

-- ----- 001_shop.sql -----
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

-- ----- 002_starter_content.sql -----
-- =========================================================
-- SENTIMENTAL APPLE — STARTER CONTENT
-- Copies the products and journal posts from js/data.js into the database.
-- Run once, AFTER 001_shop.sql. Running it again won't create duplicates.
-- =========================================================

insert into public.products (id, name, price, category, icon, color, badge, is_new, sold_out, description, sort) values
  ('apple-of-my-eye', 'Apple of my eye sticker sheet', 3.5, 'stickers', 'apple', 'apple', 'Bestseller', false, false, 'Twelve glossy apple friends with tiny faces. Waterproof vinyl, so they''re happy on water bottles and laptops too.', 0),
  ('puffy-hearts', 'Puffy hearts sticker pack', 4, 'stickers', 'heart', 'pink', '', true, false, 'Squishy 3D heart stickers in five sweet shades. Perfect for sealing letters.', 1),
  ('star-collector', 'Star collector sticker sheet', 3.5, 'stickers', 'star', 'butter', '', false, false, 'Gold-foil stars for marking good days, finished books and tiny wins.', 2),
  ('cloud-diary', 'Cloud nine dot-grid notebook', 12, 'notebooks', 'cloud', 'teal', 'New', true, false, 'A5, 160 pages of 100gsm dot-grid paper that doesn''t let pens bleed through. Lays flat, has a ribbon.', 3),
  ('pocket-notebook', 'Little apple pocket notebook', 6, 'notebooks', 'notebook', 'pink', '', false, false, 'A6 lined notebook that fits in a coat pocket. For shopping lists and sudden poems.', 4),
  ('postcard-set', 'Wish you were here postcard set', 8, 'postcards', 'envelope', 'mint', '', true, false, 'Six illustrated postcards on thick recycled card. Write to someone you miss.', 5),
  ('flower-postcard', 'Pressed flower postcard', 2, 'postcards', 'flower', 'blush', '', false, false, 'A single soft-touch postcard with a little flower friend on the front.', 6),
  ('rainbow-print', 'After the rain A5 print', 10, 'prints', 'rainbow', 'teal', '', false, false, 'Risograph-style print on 300gsm textured paper. Frame not included.', 7),
  ('cherry-card', 'We go together greeting card', 3.5, 'prints', 'cherry', 'apple', '', true, false, 'Blank inside so you can say it your way. Comes with a pink envelope.', 8),
  ('washi-trio', 'Sparkle washi tape trio', 7, 'journalling', 'sparkle', 'butter', '', false, false, 'Three rolls of easy-tear washi: sparkles, gingham and tiny apples.', 9),
  ('journal-kit', 'Starter journalling kit', 22, 'bundles', 'notebook', 'teal', 'Save £6', false, false, 'A notebook, two sticker sheets, washi tape and a pen. Everything to start your first spread.', 10),
  ('letter-bundle', 'Pen pal letter bundle', 15, 'bundles', 'heart', 'pink', 'Sold out', false, true, 'Writing paper, envelopes, seal stickers and postcards. Back in stock soon.', 11)
on conflict (id) do nothing;

insert into public.posts (id, title, date, author, icon, color, tags, body, likes) values
  ('first-spread', 'How I set up my first journal spread', '2026-11-02', 'Mia', 'notebook', 'teal', array['journalling', 'how-to']::text[], 'My first spread was a mess, and I love it. Here''s what I''d tell myself if I started again.

Start with one page, not a whole month. A tiny weekly box with three things you''re looking forward to is plenty.

Pick two colours and stick to them. Teal and pink, obviously.

Leave space. Stickers look best when they have room to breathe.', 48),
  ('pen-pals', 'Why we still write letters', '2026-10-18', 'Ellie', 'envelope', 'pink', array['letters', 'story']::text[], 'A text disappears up the screen. A letter sits on a shelf for years.

We started this shop because of a pen pal who moved across the world. We still write every month.

If you''ve never tried it, send one postcard this week. Just one.', 72),
  ('autumn-stickers', 'Behind the scenes: the autumn sticker drop', '2026-09-29', 'Mia', 'apple', 'apple', array['behind the scenes']::text[], 'This drop started as a single apple doodle on a train.

We tested fourteen shades of red before choosing this one. Yes, fourteen.

Every sheet is cut by our little machine called Pip. Pip is very slow but very precise.', 35)
on conflict (id) do nothing;

-- Sample notes (only added if the post has none yet)
insert into public.comments (post_id, name, body, user_id, created_at) select 'first-spread', 'Hana', 'The two colours tip changed everything for me!', null, '2026-11-03'::timestamptz where not exists (select 1 from public.comments where post_id = 'first-spread' and name = 'Hana' and body = 'The two colours tip changed everything for me!');
insert into public.comments (post_id, name, body, user_id, created_at) select 'first-spread', 'Jo', 'Please do a monthly one next 🥺', null, '2026-11-04'::timestamptz where not exists (select 1 from public.comments where post_id = 'first-spread' and name = 'Jo' and body = 'Please do a monthly one next 🥺');
insert into public.comments (post_id, name, body, user_id, created_at) select 'pen-pals', 'Sam', 'I just sent my first postcard to my gran 💌', null, '2026-10-20'::timestamptz where not exists (select 1 from public.comments where post_id = 'pen-pals' and name = 'Sam' and body = 'I just sent my first postcard to my gran 💌');

-- ----- 003_product_colours.sql -----
-- =========================================================
-- SENTIMENTAL APPLE — PRODUCT COLOURS
-- Lets a product come in colours (shown as little dots on the homepage).
-- Format: [["#83c3c3", "Teal"], ["#f177ae", "Pink"]]  (hex code, name)
-- Run once in the SQL Editor, after 001 and 002.
-- =========================================================
alter table public.products add column if not exists colors jsonb;

update public.products set colors = '[["#f177ae","Pink"],["#83c3c3","Teal"],["#de4e93","Deep pink"]]' where id = 'puffy-hearts' and colors is null;
update public.products set colors = '[["#83c3c3","Teal"],["#f177ae","Pink"],["#2e2460","Navy"],["#de4e93","Deep pink"]]' where id = 'cloud-diary' and colors is null;
update public.products set colors = '[["#de4e93","Deep pink"],["#83c3c3","Teal"]]' where id = 'postcard-set' and colors is null;
