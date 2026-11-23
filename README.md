# Sentimental Apple 🍎

A cute, standalone shop website. Plain HTML, CSS and JavaScript, so there's no Shopify and nothing to install or build.

## Pages

| Page | File |
|---|---|
| Home: clean shop layout with the kit builder and camera | `index.html` |
| Shop: category tiles, search, sort, saved items, colour dots | `shop.html` |
| Product: colour gallery, quantity, save, info tabs (description, shipping, returns), "you may also like" | `product.html?id=...` |
| Events (countdown, add to calendar) | `events.html` |
| Journal: a flip-through scrapbook (likes and sticky-note comments) | `journal.html` |
| Our story: a magazine spread with the founder & co-founder profiles | `about.html` |
| Check out | `checkout.html` |
| Your account (customers: log in, details, past orders) | `account.html` |
| Shop admin (owner: write posts with photos, delete notes, manage orders) | `admin.html` |
| Brand kit (logo, colours, fonts, stickers, voice) | `brand.html` |

## The homepage

A clean layout in the brand colours: teal hero, little promises (icons), "Shop our faves" with tabs and a feature picture, categories, banners, new arrivals, collections, **Build your journal kit** (drag products onto a page; 3+ pieces = 15% off, checked again at checkout), the pink **camera** gallery, reviews and the newsletter.

To tint the camera photos pink, set `home.pinkPhotos: true` in `js/data.js`.

## Changing things

| I want to change… | Edit this |
|---|---|
| Products, prices, categories | `js/data.js` → `products`, `categories` |
| Events | `js/data.js` → `events` |
| Journal posts | `js/data.js` → `journal` |
| Our story text | `js/data.js` → `story` |
| Banner messages at the top | `js/data.js` → `announcement` |
| Shop name, email, socials | `js/data.js` (top of the file) |
| Colours and fonts | `css/style.css` → `:root` at the very top |
| Homepage headline, hero photo and camera roll | `js/data.js` → `home` |
| Products in "Our faves" and the big picture beside them | `js/data.js` → `home.faves`, `home.featureCollection` |
| Kit builder pieces and discount | `js/data.js` → `kit` |
| Banner captions, collection labels, reviews | `js/data.js` → `banners` (caption), `collections` (note), `reviews` |
| Colour dots on a product | `js/data.js` → add `colors: [["#83c3c3", "Teal"], ["#f177ae", "Pink"]]` to the product |
| Homepage look | `css/home.css` (only used by the homepage) |
| Founder & co-founder photos, names, bios, favourite things | `js/data.js` → `story.team` (photos go in `images/team/`) |
| Our story page look | `css/story.css` |
| Shop & product page look | `css/shop.css` (script: `js/shop.js`) |

### Using real product photos
1. Put the photo in the `images/` folder, for example `images/heart-stickers.jpg`.
2. In `js/data.js`, add `image: "images/heart-stickers.jpg",` to that product.

## Database, accounts and card payments

The site can run on its own, or connected to Supabase (database and logins) and Stripe (card payments).
It's off until you fill in `js/config.js`. **See [SETUP.md](SETUP.md) for the step-by-step guide.**

When it's switched on:
- journal posts, products, notes and likes come from the database, so everyone sees the same notes
- customers can check out as a guest or with an account, and pay by card
- the owner writes posts (with photos) and manages orders at `admin.html`

## How orders work while the database is off

There's no payment system yet. At checkout, the customer's order is written into an email (or WhatsApp message) to the shop owner, who replies with payment details. Switch between them in `js/data.js` → `checkout.method` (`"email"` or `"whatsapp"`).

Possible later upgrades: Stripe Payment Links or PayPal buttons for real card payments.

## Good to know

- **While the database is off**, journal notes and likes are saved only in each visitor's own browser. Saved items and the bag always stay in the visitor's browser.
- The newsletter form only shows a thank-you message for now. Connect it to Mailchimp, Buttondown or similar to collect emails.

## Preview on your computer

Double-click `index.html`, or from this folder run:

```
python -m http.server 8000
```

then open http://localhost:8000

## Publishing

**GitHub Pages:** repo → Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save. The site appears at `https://<username>.github.io/<repo>/` after a minute.

**Vercel:** Import the repo, choose *Other* as the framework, leave the build settings empty, then deploy.
