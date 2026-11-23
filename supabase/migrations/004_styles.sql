-- =========================================================
-- SENTIMENTAL APPLE — FIND YOUR STYLE
-- Tags each product with the styles it belongs to, and lets a
-- customer's chosen style follow them to any device.
-- Styles: coquette, cottagecore, y2k, goth, cybersigilism
-- Run once in the SQL Editor, after 001–003. Safe to run again.
-- =========================================================
alter table public.products add column if not exists styles text[] not null default '{}';
alter table public.profiles add column if not exists style text;

-- starter tags (only filled in where a product has none yet)
update public.products set styles = '{coquette,cottagecore}' where id = 'apple-of-my-eye' and styles = '{}';
update public.products set styles = '{coquette,y2k}'         where id = 'puffy-hearts'    and styles = '{}';
update public.products set styles = '{y2k}'                  where id = 'star-collector'  and styles = '{}';
update public.products set styles = '{cottagecore}'          where id = 'cloud-diary'     and styles = '{}';
update public.products set styles = '{coquette}'             where id = 'pocket-notebook' and styles = '{}';
update public.products set styles = '{cottagecore}'          where id = 'postcard-set'    and styles = '{}';
update public.products set styles = '{cottagecore,coquette}' where id = 'flower-postcard' and styles = '{}';
update public.products set styles = '{y2k}'                  where id = 'rainbow-print'   and styles = '{}';
update public.products set styles = '{coquette}'             where id = 'cherry-card'     and styles = '{}';
update public.products set styles = '{y2k,cottagecore}'      where id = 'washi-trio'      and styles = '{}';
update public.products set styles = '{cottagecore,coquette}' where id = 'journal-kit'     and styles = '{}';
update public.products set styles = '{coquette}'             where id = 'letter-bundle'   and styles = '{}';
