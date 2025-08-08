# Ontwikkelkompas App

PWA voor thuisonderwijs – React + Vite + Tailwind + Supabase + Netlify Functions. Inclusief onboarding en guided tour.

## Setup
1. Zet `.env` (Vite) met:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
URL=https://jouw-app-url.netlify.app
```
2. Supabase tabellen:
- children: { child_id text PK, nickname text, birthdate date }
- observations: { id uuid PK, child_id text, date date, note text }
- user_roles: { user_id uuid PK, role text }
- user_settings: { user_id uuid PK, onboarding_completed boolean, tour_completed boolean }
- goals: { id uuid PK, child_id text, goal text }

3. Netlify functions staan in `/netlify/functions`.

## Scripts
- `npm i`
- `npm run dev`
- `npm run build`

Veel plezier!