/* =========================================================
   SENTIMENTAL APPLE — SITE CONTENT
   ---------------------------------------------------------
   This is the ONLY file you need to edit to change the shop's
   words, products, events and journal posts.

   Tips
   - Keep the commas and quotes exactly as they are.
   - "icon" picks a built-in cute drawing:
       apple, heart, star, cloud, flower, envelope,
       notebook, cherry, rainbow, sparkle
   - To use a real photo instead, add  image: "images/your-photo.jpg"
     to a product (put the photo in the /images folder).
   - Colours are set in css/style.css at the very top (:root).
   ========================================================= */

window.SITE = {
  name: "Sentimental Apple",
  tagline: "Little paper things for big feelings",
  currency: "£",
  freeShippingOver: 30,
  shippingCost: 3.5,

  announcement: [
    "Free UK shipping on orders over £30",
    "Use code MATCHA10 for 10% off your first order",
    "5% of every order goes to our community art fund",
  ],

  // How orders are sent while there's no payment system yet.
  // method: "email" opens the customer's email app with the order filled in.
  // method: "whatsapp" opens WhatsApp with the order filled in.
  checkout: {
    method: "email",
    email: "hello@sentimentalapple.com",
    whatsapp: "447000000000", // country code + number, no + or spaces
  },

  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    pinterest: "https://pinterest.com/",
  },

  contact: {
    email: "hello@sentimentalapple.com",
    hours: "We reply Monday to Friday, usually within a day",
  },

  story: {
    title: "Hello, we're Sentimental Apple",
    intro:
      "We started with a shoebox of stickers and a habit of writing letters to friends who lived far away. Now we draw, print and pack little paper things for people who like to keep their feelings somewhere they can see them.",
    paragraphs: [
      "Every design starts as a doodle in the margin of a journal. If it makes us smile on a grey Tuesday, it gets printed.",
      "We use recycled paper wherever we can, pack everything by hand, and tuck a small surprise into every order.",
      "Five percent of what we make goes to our community art fund, which buys supplies for local after-school art clubs.",
    ],
    values: [
      { icon: "heart", color: "pink", title: "Made with care", text: "Drawn, printed and packed by hand in our tiny paper studio." },
      { icon: "flower", color: "teal", title: "Kind to the planet", text: "Recycled paper, plastic-free packaging, compostable mailers." },
      { icon: "star", color: "butter", title: "Giving back", text: "5% of every order funds art supplies for local kids." },
    ],
    // Photos on the first spread (put your own in images/team/ and change these)
    photos: [
      { image: "images/home/bw-2.jpg", caption: "where the doodles happen" },
      { image: "images/home/bw-1.jpg", caption: "packed with love" },
    ],

    // ---------- MEET THE GIRLS ----------
    // To add your photos: put them in the images/team/ folder, then type the
    // file name below, e.g. photo: "images/team/founder.jpg".
    // Leave a photo as "" and a cute "photo coming soon" frame shows instead.
    team: [
      {
        name: "Founder name",
        role: "the founder",
        photo: "",
        quote: "if it makes me smile, it gets printed",
        bio: "the dreamer behind every doodle. she started sentimental apple with a shoebox of stickers and a habit of writing letters to friends far away.",
        favourites: ["gel pens in every colour", "rainy-day journalling", "strawberry matcha", "handwritten letters"],
        aesthetics: [
          { image: "", label: "her desk" },
          { image: "", label: "her colours" },
          { image: "", label: "her happy place" },
        ],
      },
      {
        name: "Co-founder name",
        role: "the co-founder",
        photo: "",
        quote: "little details, big feelings",
        bio: "the one making the magic work behind the scenes: the website, the orders and every last spreadsheet, with a soft spot for washi tape.",
        favourites: ["a fresh notebook", "pink everything", "late-night playlists", "sticker hauls"],
        aesthetics: [
          { image: "", label: "her desk" },
          { image: "", label: "her colours" },
          { image: "", label: "her happy place" },
        ],
      },
    ],
  },

  // ---------- HOMEPAGE ----------
  home: {
    kicker: "new: the autumn sticker drop",
    title: "Little paper things for big feelings",
    intro: "Stickers, notebooks and love-letter postcards, drawn and packed by hand for girls who still write things down.",
    // Photos in the pink camera (press the shutter to flick through)
    cameraRoll: [
      { image: "images/home/photo-1.jpg", caption: "packing your orders, one bow at a time ♡", date: "02 11 '26" },
      { image: "images/home/photo-2.jpg", caption: "new sticker sheets fresh off the press", date: "08 11 '26" },
      { image: "images/home/photo-3.jpg", caption: "a thank-you note in every single parcel", date: "13 11 '26" },
    ],
    faves: ["puffy-hearts", "cloud-diary", "postcard-set"],   // the "Our faves" tab (product ids)
    featureCollection: "our-favourites",                       // the big picture beside it (collection id)
    pinkPhotos: false,                                         // true = tint the camera photos pink
  },

  // ---------- FIND YOUR STYLE ----------
  // Each product lists its styles in  styles: ["cottagecore", "coquette"]
  // A style with no products shows "coming soon" cards.
  styles: [
    { id: "coquette", name: "Coquette", emoji: "🎀", tagline: "bows, pearls & love letters",
      about: "You love a handwritten note, a satin ribbon and anything blush pink. Your journal is basically a love letter to yourself.",
      vibe: ["satin bows", "pearls", "blush pink", "love letters"], palette: ["#fff0f5", "#f4a6c6", "#d6457f", "#5b1f3c"] },
    { id: "cottagecore", name: "Cottagecore", emoji: "🌿", tagline: "wildflowers, tea & slow mornings",
      about: "You press flowers between pages, write by the window and dream of a cottage with a garden. Soft, slow and full of nature.",
      vibe: ["pressed flowers", "linen", "sage green", "picnics"], palette: ["#f6f1e3", "#9db48a", "#e8a0a0", "#3e4a2f"] },
    { id: "y2k", name: "Y2K", emoji: "🦋", tagline: "glitter, butterflies & bubblegum",
      about: "Main-character energy. Glitter gel pens, butterfly clips and a playlist from 2003. Your journal sparkles and you're not sorry.",
      vibe: ["butterfly clips", "glitter", "chrome", "bubblegum"], palette: ["#fdf2ff", "#ff5fc8", "#6fd6ff", "#3a1a78"] },
    { id: "goth", name: "Goth", emoji: "🦇", tagline: "candlelight, lace & midnight ink",
      about: "You journal by candlelight in black ink. Lace, moons and old poetry. Mysterious, romantic and a little bit dramatic.",
      vibe: ["black lace", "moons", "candles", "dark poetry"], palette: ["#0e0b10", "#8e1b3d", "#6b5b7b", "#efe6ee"] },
    { id: "cybersigilism", name: "Cybersigilism", emoji: "⛓️", tagline: "chrome, thorns & sharp lines",
      about: "Sharp lines, silver chrome and spiky tattoo-style doodles. Your journal looks like it came from the future, in the best way.",
      vibe: ["spiky line art", "silver chrome", "tattoo flash", "neon nights"], palette: ["#0a0a0c", "#c7cfe0", "#ff2fb3", "#e8ebf2"] },
  ],

  // 6 quick questions. Each answer gives points to one style.
  quiz: [
    { q: "Pick a colour palette", a: [
      { t: "Blush, pearl & rose", s: "coquette", sw: ["#fff0f5", "#f4a6c6", "#d6457f"] },
      { t: "Sage, cream & wildflower", s: "cottagecore", sw: ["#f6f1e3", "#9db48a", "#e8a0a0"] },
      { t: "Bubblegum, chrome & baby blue", s: "y2k", sw: ["#ff5fc8", "#c7cfe0", "#6fd6ff"] },
      { t: "Black, wine & candlelight", s: "goth", sw: ["#0e0b10", "#8e1b3d", "#d9b56a"] },
      { t: "Silver, black & a flash of neon", s: "cybersigilism", sw: ["#e8ebf2", "#0a0a0c", "#ff2fb3"] } ] },
    { q: "Your ideal Sunday", a: [
      { t: "Writing love letters in bed", s: "coquette", i: "envelope" },
      { t: "A picnic in a meadow", s: "cottagecore", i: "flower" },
      { t: "Mall trip & lip gloss", s: "y2k", i: "star" },
      { t: "Old bookshop on a rainy day", s: "goth", i: "moon" },
      { t: "Late-night city lights", s: "cybersigilism", i: "thorn" } ] },
    { q: "Choose a sticker", a: [
      { t: "A satin bow", s: "coquette", i: "bow" },
      { t: "A pressed daisy", s: "cottagecore", i: "flower" },
      { t: "A glitter butterfly", s: "y2k", i: "butterfly" },
      { t: "A crescent moon", s: "goth", i: "moon" },
      { t: "A spiky chrome heart", s: "cybersigilism", i: "thorn" } ] },
    { q: "Your go-to pen", a: [
      { t: "Pink gel pen with a heart", s: "coquette", i: "heart" },
      { t: "A pencil you sharpen by hand", s: "cottagecore", i: "leaf" },
      { t: "Glitter gel pens, all of them", s: "y2k", i: "sparkle" },
      { t: "A fountain pen in black ink", s: "goth", i: "drop" },
      { t: "Silver metallic marker", s: "cybersigilism", i: "bolt" } ] },
    { q: "Where do you journal?", a: [
      { t: "At a vanity with fairy lights", s: "coquette", i: "heart" },
      { t: "By an open window", s: "cottagecore", i: "leaf" },
      { t: "On the bus with headphones in", s: "y2k", i: "star" },
      { t: "By candlelight at midnight", s: "goth", i: "moon" },
      { t: "Anywhere, as long as it's dark", s: "cybersigilism", i: "bolt" } ] },
    { q: "Your playlist vibe", a: [
      { t: "Soft love songs", s: "coquette", i: "bow" },
      { t: "Folk & acoustic", s: "cottagecore", i: "flower" },
      { t: "2000s pop", s: "y2k", i: "butterfly" },
      { t: "Moody & dramatic", s: "goth", i: "drop" },
      { t: "Electronic & hyperpop", s: "cybersigilism", i: "thorn" } ] },
  ],

  // "Build your journal kit" on the homepage
  kit: {
    discount: 0.15,       // 15% off...
    minPieces: 3,         // ...when the kit has this many pieces or more
    products: ["cloud-diary", "puffy-hearts", "washi-trio", "postcard-set", "apple-of-my-eye", "star-collector"],
  },

  // Big banners on the homepage (images in images/banners/)
  banners: [
    { image: "images/banners/welcome.jpg", link: "shop.html", alt: "Welcome to Sentimental Apple. Make room for making.", caption: "welcome to the club ♡" },
    { image: "images/banners/sale.jpg", link: "shop.html?col=our-favourites", alt: "Sale is live. Grab your faves now at a discount.", caption: "the sale is on, babe" },
    { image: "images/banners/cutest-collection.jpg", link: "shop.html", alt: "The cutest collection of products. Shop now.", caption: "the cutest collection yet" },
    { image: "images/banners/gallery.jpg", link: "index.html#camera", alt: "Hey beautiful, check out our gallery.", caption: "peek at our camera roll" },
  ],

  // Little promises shown with the brand icons (images in images/icons/)
  badges: [
    { icon: "images/icons/support.svg", title: "Friendly support", text: "We reply within a day" },
    { icon: "images/icons/delivery.svg", title: "Packed with care", text: "Tracked delivery across the UK" },
    { icon: "images/icons/returns.svg", title: "Easy returns", text: "30 days to change your mind" },
    { icon: "images/icons/giving.svg", title: "5% given back", text: "To local kids' art clubs" },
  ],

  // Collections: list the product ids that belong in each one
  collections: [
    { id: "latest-arrivals", name: "Latest arrivals", image: "images/collections/latest-arrivals.jpg", products: ["puffy-hearts", "cloud-diary", "postcard-set", "cherry-card"], note: "just landed" },
    { id: "pretty-goodies", name: "Pretty goodies", image: "images/collections/pretty-goodies.jpg", products: ["washi-trio", "flower-postcard", "rainbow-print", "pocket-notebook"], note: "pretty things" },
    { id: "our-favourites", name: "Our favourites", image: "images/collections/our-favourites.jpg", products: ["apple-of-my-eye", "star-collector", "journal-kit", "cloud-diary"], note: "our faves ♡" },
    { id: "impact-collection", name: "Impact collection", image: "images/collections/impact-collection.jpg", products: ["letter-bundle", "postcard-set", "rainbow-print"], note: "5% gives back" },
    { id: "old-but-gold", name: "Old but gold stock", image: "images/collections/old-but-gold.jpg", products: ["pocket-notebook", "star-collector", "flower-postcard"], note: "last chance" },
  ],

  // Customer reviews (photos in images/reviews/)
  reviews: [
    { image: "images/reviews/review-1.jpg", name: "Aisha", text: "Every item was wrapped like a little present. I didn't want to open it!" },
    { image: "images/reviews/review-2.jpg", name: "Grace", text: "The stickers are so glossy and thick. My journal has never looked cuter." },
    { image: "images/reviews/review-3.jpg", name: "Hannah", text: "Fast delivery and a handwritten thank-you card. Already ordering again." },
  ],

  categories: [
    { id: "stickers", name: "Stickers", icon: "star", color: "butter", tagline: "glossy, puffy & a little bit extra", blurb: "Waterproof vinyl friends with tiny faces for planners, laptops and water bottles." },
    { id: "notebooks", name: "Notebooks", icon: "notebook", color: "teal", tagline: "fresh pages, fresh start", blurb: "Dot-grid and lined notebooks that lie flat and never let your gel pens bleed." },
    { id: "postcards", name: "Postcards", icon: "envelope", color: "pink", tagline: "write to her. today.", blurb: "Thick recycled card for letters, pen pals and saying the soft stuff out loud." },
    { id: "prints", name: "Prints & cards", icon: "rainbow", color: "blush" },
    { id: "journalling", name: "Journalling", icon: "sparkle", color: "mint" },
    { id: "bundles", name: "Bundles", icon: "cherry", color: "apple" },
  ],

  products: [
    { id: "apple-of-my-eye", name: "Apple of my eye sticker sheet", price: 3.5, category: "stickers", icon: "apple", color: "apple", badge: "Bestseller", isNew: false,
      styles: ["coquette", "cottagecore"],
      description: "Twelve glossy apple friends with tiny faces. Waterproof vinyl, so they're happy on water bottles and laptops too." },
    { id: "puffy-hearts", name: "Puffy hearts sticker pack", price: 4, category: "stickers", icon: "heart", color: "pink", badge: "", isNew: true,
      styles: ["coquette", "y2k"],
      colors: [["#f177ae", "Pink"], ["#83c3c3", "Teal"], ["#de4e93", "Deep pink"]],
      description: "Squishy 3D heart stickers in five sweet shades. Perfect for sealing letters." },
    { id: "star-collector", name: "Star collector sticker sheet", price: 3.5, category: "stickers", icon: "star", color: "butter", badge: "", isNew: false,
      styles: ["y2k"],
      description: "Gold-foil stars for marking good days, finished books and tiny wins." },
    { id: "cloud-diary", name: "Cloud nine dot-grid notebook", price: 12, category: "notebooks", icon: "cloud", color: "teal", badge: "New", isNew: true,
      styles: ["cottagecore"],
      colors: [["#83c3c3", "Teal"], ["#f177ae", "Pink"], ["#2e2460", "Navy"], ["#de4e93", "Deep pink"]],
      description: "A5, 160 pages of 100gsm dot-grid paper that doesn't let pens bleed through. Lays flat, has a ribbon." },
    { id: "pocket-notebook", name: "Little apple pocket notebook", price: 6, category: "notebooks", icon: "notebook", color: "pink", badge: "", isNew: false,
      styles: ["coquette"],
      description: "A6 lined notebook that fits in a coat pocket. For shopping lists and sudden poems." },
    { id: "postcard-set", name: "Wish you were here postcard set", price: 8, category: "postcards", icon: "envelope", color: "mint", badge: "", isNew: true,
      styles: ["cottagecore"],
      colors: [["#de4e93", "Deep pink"], ["#83c3c3", "Teal"]],
      description: "Six illustrated postcards on thick recycled card. Write to someone you miss." },
    { id: "flower-postcard", name: "Pressed flower postcard", price: 2, category: "postcards", icon: "flower", color: "blush", badge: "", isNew: false,
      styles: ["cottagecore", "coquette"],
      description: "A single soft-touch postcard with a little flower friend on the front." },
    { id: "rainbow-print", name: "After the rain A5 print", price: 10, category: "prints", icon: "rainbow", color: "teal", badge: "", isNew: false,
      styles: ["y2k"],
      description: "Risograph-style print on 300gsm textured paper. Frame not included." },
    { id: "cherry-card", name: "We go together greeting card", price: 3.5, category: "prints", icon: "cherry", color: "apple", badge: "", isNew: true,
      styles: ["coquette"],
      description: "Blank inside so you can say it your way. Comes with a pink envelope." },
    { id: "washi-trio", name: "Sparkle washi tape trio", price: 7, category: "journalling", icon: "sparkle", color: "butter", badge: "", isNew: false,
      styles: ["y2k", "cottagecore"],
      description: "Three rolls of easy-tear washi: sparkles, gingham and tiny apples." },
    { id: "journal-kit", name: "Starter journalling kit", price: 22, category: "bundles", icon: "notebook", color: "teal", badge: "Save £6", isNew: false,
      styles: ["cottagecore", "coquette"],
      description: "A notebook, two sticker sheets, washi tape and a pen. Everything to start your first spread." },
    { id: "letter-bundle", name: "Pen pal letter bundle", price: 15, category: "bundles", icon: "heart", color: "pink", badge: "Sold out", isNew: false, soldOut: true,
      styles: ["coquette"],
      description: "Writing paper, envelopes, seal stickers and postcards. Back in stock soon." },
  ],

  events: [
    { id: "christmas-market", title: "Winter makers market", date: "2026-12-06T10:00:00", end: "4pm", place: "Old Town Hall, Brighton", type: "Market", icon: "star", color: "butter",
      text: "Come say hello at our stall. We'll have market-only sticker sheets and free gift wrapping." },
    { id: "spread-workshop", title: "New year journal spread workshop", date: "2027-01-10T14:00:00", end: "4pm", place: "Online, on Zoom", type: "Workshop", icon: "notebook", color: "teal",
      text: "Plan your 2027 journal with us. Bring a notebook, we'll bring the ideas and a playlist." },
    { id: "sticker-swap", title: "Valentine's sticker swap", date: "2027-02-13T11:00:00", end: "2pm", place: "Paper & Co café, London", type: "Meet-up", icon: "heart", color: "pink",
      text: "Bring stickers you don't use, leave with ones you love. Hot chocolate on us." },
  ],

  journal: [
    { id: "first-spread", title: "How I set up my first journal spread", date: "2026-11-02", author: "Mia", icon: "notebook", color: "teal", tags: ["journalling", "how-to"],
      likes: 48,
      body: [
        "My first spread was a mess, and I love it. Here's what I'd tell myself if I started again.",
        "Start with one page, not a whole month. A tiny weekly box with three things you're looking forward to is plenty.",
        "Pick two colours and stick to them. Teal and pink, obviously.",
        "Leave space. Stickers look best when they have room to breathe.",
      ],
      comments: [
        { name: "Hana", text: "The two colours tip changed everything for me!", date: "2026-11-03" },
        { name: "Jo", text: "Please do a monthly one next 🥺", date: "2026-11-04" },
      ] },
    { id: "pen-pals", title: "Why we still write letters", date: "2026-10-18", author: "Ellie", icon: "envelope", color: "pink", tags: ["letters", "story"],
      likes: 72,
      body: [
        "A text disappears up the screen. A letter sits on a shelf for years.",
        "We started this shop because of a pen pal who moved across the world. We still write every month.",
        "If you've never tried it, send one postcard this week. Just one.",
      ],
      comments: [
        { name: "Sam", text: "I just sent my first postcard to my gran 💌", date: "2026-10-20" },
      ] },
    { id: "autumn-stickers", title: "Behind the scenes: the autumn sticker drop", date: "2026-09-29", author: "Mia", icon: "apple", color: "apple", tags: ["behind the scenes"],
      likes: 35,
      body: [
        "This drop started as a single apple doodle on a train.",
        "We tested fourteen shades of red before choosing this one. Yes, fourteen.",
        "Every sheet is cut by our little machine called Pip. Pip is very slow but very precise.",
      ],
      comments: [] },
  ],
};
