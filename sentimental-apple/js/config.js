/* =========================================================
   SENTIMENTAL APPLE — CONNECTION SETTINGS
   ---------------------------------------------------------
   Leave both blank and the site works on its own using js/data.js
   (no accounts, card payments or shared journal notes).

   To switch the database on, paste the two values from
   Supabase -> Project Settings -> API:
     - Project URL
     - "anon" / "publishable" key
   These two are safe to be public. NEVER paste the service_role
   or secret key here.
   ========================================================= */
window.SHOP_CONFIG = {
  supabaseUrl: "https://sebpkvgmgjrhopwgsmud.supabase.co",
  supabaseAnonKey: "sb_publishable_Gwvbh9SKmflWP4JG6TCAjw_NKnIdxlX",

  // Card payments with Stripe. Leave false until the two payment
  // functions are uploaded (SETUP.md steps 6–9). While false,
  // checkout sends the order by email instead.
  cardPayments: false,
};
