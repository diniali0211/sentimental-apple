# Switching on accounts, card payments and the shared journal

Until you do this, the site keeps working on its own (orders by email, notes saved only in each visitor's browser).
Do the steps in order. Use **test mode** in Stripe first, and only switch to live keys once a test order works.

You'll need:
- the shop owner's email, to create her Supabase and Stripe accounts
- the site's web address, e.g. `https://diniali0211.github.io/sentimental-apple`

---

## Step 1 — Create the Supabase project (shop owner's account)

1. The owner signs up at **supabase.com** (free) and creates a new project, e.g. `sentimental-apple`. Pick a region close to her customers (London for the UK).
2. She invites you: **Organization settings → Team → Invite** (your email, role *Developer* or *Owner*).
3. Save the **database password** she chose somewhere safe.

## Step 2 — Create the tables

> **Shortcut:** `supabase/setup-all.sql` contains all four files below in one. Paste it once and click Run.

1. In the project, open **SQL Editor → New query**.
2. Open `supabase/migrations/001_shop.sql`, copy everything, paste it in, then click **Run**. You should see *Success*.
3. Do the same with `supabase/migrations/002_starter_content.sql`. This copies the current products and journal posts in.
4. Then `supabase/migrations/003_product_colours.sql`. This lets products come in colours (the dots on the homepage).
5. Then `supabase/migrations/004_styles.sql`. This tags products with styles for the **Find your style** page, and lets a customer's style follow their account.

From now on, **products are edited in Supabase** (Table Editor → `products`), not in `js/data.js`. A product's colour dots go in its `colors` column, e.g. `[["#83c3c3","Teal"],["#f177ae","Pink"]]`.
Everything else in `data.js` (banners, events, story, colours) still comes from that file.

## Step 3 — Login settings

1. **Authentication → URL Configuration**
   - *Site URL*: your site address, e.g. `https://diniali0211.github.io/sentimental-apple`
   - *Redirect URLs*: add `https://diniali0211.github.io/sentimental-apple/**`
2. **Authentication → Sign In / Providers → Email**: leave *Confirm email* on. New customers get a link to confirm their account.

## Step 4 — Connect the website

1. **Project Settings → API** (or **Data API**). Copy:
   - **Project URL**
   - the **anon / publishable** key (NOT the `service_role` / secret key)
2. Paste them into `js/config.js`:
   ```js
   window.SHOP_CONFIG = {
     supabaseUrl: "https://xxxxxxxx.supabase.co",
     supabaseAnonKey: "eyJhbGciOi...",
   };
   ```
3. Upload to GitHub. The account icon now appears in the header, and journal notes and likes are shared by everyone.

## Step 5 — Make the owner an admin

1. The owner opens `account.html` on the live site and creates her account (then confirms it from her email).
2. In Supabase **SQL Editor**, run (with her email):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'owner@example.com';
   ```
3. She logs in at `admin.html`. She can write posts with photos, delete notes and update orders there.
   The admin page isn't linked from the menu; she can bookmark it or reach it from **My account → Open the shop admin**.

## Step 6 — Stripe (card payments)

1. The owner signs up at **stripe.com** and stays in **Test mode** (toggle at the top).
2. **Developers → API keys**: copy the **Secret key** (`sk_test_...`). Never put this in the website files.

## Step 7 — Upload the two payment functions

Easiest with the Supabase command-line tool. In a terminal, inside the site folder:

```bash
npx supabase login
npx supabase link --project-ref xxxxxxxx          # the part before .supabase.co
npx supabase functions deploy create-checkout --no-verify-jwt
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

Then add the secrets (Supabase → **Edge Functions → Secrets**, or with the CLI):

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
npx supabase secrets set SITE_URL=https://diniali0211.github.io/sentimental-apple
```

Optional: `CURRENCY` (default `gbp`), `FREE_SHIPPING_OVER` (default `30`), `SHIPPING_COST` (default `3.5`), `KIT_DISCOUNT` (default `0.15`), `KIT_MIN_PIECES` (default `3`).
Keep these matching `freeShippingOver`, `shippingCost` and `kit` in `js/data.js`, which the site uses to show estimates.

> No terminal? In Supabase go to **Edge Functions → Deploy a new function → Via editor**, name it `create-checkout`, paste in `supabase/functions/create-checkout/index.ts` and deploy. Do the same for `stripe-webhook`. For each, open its settings and turn **off** "Verify JWT".

## Step 8 — Tell Stripe where to send payment confirmations

1. Stripe → **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://xxxxxxxx.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`
2. Copy the **Signing secret** (`whsec_...`) and add it to Supabase:
   ```bash
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

## Step 9 — Test order

0. In `js/config.js`, change `cardPayments: false` to `cardPayments: true`, then upload it.

1. On the live site, add something to the bag and check out.
2. On Stripe's page, pay with the test card `4242 4242 4242 4242`, any future date, any CVC.
3. You should land on "Thank you, your order is in!". In `admin.html → Orders`, the order shows as **Paid**.

## Step 10 — Go live

When the owner is ready to take real money:
1. Stripe: finish activating the account, switch off Test mode, copy the **live** secret key and create the same webhook again in live mode.
2. Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Supabase with the live values.

---

### How things are kept safe
- Prices are always checked on the server, so changing a price in the browser does nothing.
- Customers can only see their own orders. Only the owner can edit posts, delete notes or change orders.
- Orders can only be created by the checkout function, and only Stripe can mark them as paid (its messages are signature-checked).
- The anon key in `js/config.js` is meant to be public; the security rules in `001_shop.sql` decide what it's allowed to do.
