
# Ontwikkelkompas App

Een minimalistische PWA voor begeleiders en ouders in thuisonderwijssettings. Volledig gebouwd in React + Tailwind + Supabase, met AI-gegenereerde dagschema's en Stripe-integratie.

## 🔧 Techstack

- React + Vite
- Tailwind CSS + ShadCN UI
- Supabase (auth, observaties, doelen, rollen)
- Netlify (serverless functions)
- Stripe (betaling)
- OpenAI (AI-dagschema’s)

## 🚀 Installatie

1. Download deze repository en plaats in Bolt.new of lokaal in Vite.
2. Voeg een `.env` toe met de volgende variabelen:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
URL=https://jouw-app-url.netlify.app
```

3. Zet Supabase tabellen klaar (zie onder).

4. Deploy op Netlify of Vercel. PWA werkt met manifest + service worker.

## 🧱 Supabase-tabellen

### `observations`

| kolom     | type     |
|-----------|----------|
| id        | uuid (PK)|
| child_id  | text     |
| date      | date     |
| note      | text     |

### `user_roles`

| kolom     | type     |
|-----------|----------|
| user_id   | uuid     |
| role      | text     | ('ouder' / 'begeleider')

### `goals`

| kolom     | type     |
|-----------|----------|
| id        | uuid     |
| child_id  | text     |
| goal      | text     |

## 🤖 AI-generatie (Netlify function)

`/.netlify/functions/ai-plan.js` stuurt prompt naar OpenAI en retourneert een dagschema.

## 💳 Stripe-integratie

`/.netlify/functions/stripe-checkout.js` start een checkout flow. Je kunt deze koppelen aan toegang tot premium functies (zoals AI-generatie).

## ✅ PWA

De app is een volwaardige Progressive Web App:
- `manifest.json` aanwezig
- `service-worker.js` met registratie in `main.tsx`

## 📌 Aanbevolen volgorde

1. Zet Supabase-project op
2. Maak de tabellen aan (zoals hierboven)
3. Voeg `.env` in Bolt.new of lokaal toe
4. Voeg serverless functions toe in Netlify
5. Deploy en test

---

Gemaakt met visie op holistisch leren en eigenaarschap in onderwijs.
