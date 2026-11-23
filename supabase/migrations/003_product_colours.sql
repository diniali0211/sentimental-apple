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
