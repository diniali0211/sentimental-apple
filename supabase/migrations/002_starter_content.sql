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
