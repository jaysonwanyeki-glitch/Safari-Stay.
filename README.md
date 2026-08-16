# SafariStay 🇰🇪

A Kenyan safari accommodation marketplace — beach villas, bush homes, tented camps and hosted stays beside Kenya's wildlife reserves. Built with **Next.js 16 (App Router)**, **TypeScript**, **Drizzle ORM** and **Postgres** (Neon), styled with **Tailwind CSS v4**.

**Live demo:** https://safari-stay-six.vercel.app

## What makes it Kenyan

- **M-Pesa & Pay-at-property bookings** — guests choose *Lipa na M-Pesa* (STK-push flow: booking stays `pending` until the PIN is entered) or *Pay at property*. Bookings have a real status lifecycle: `pending → confirmed → completed / cancelled`.
- **Real M-Pesa payments (IntaSend)** — with `INTASEND_TOKEN` + `INTASEND_PUBLISHABLE_KEY` set, the backend pushes a real STK prompt to the guest's phone and an IntaSend webhook confirms the booking. Without keys it falls back to the simulated demo flow automatically.
- **Phone verification (demo OTP)** — every booking is verified with a 4-digit code sent to the guest's Safaricom/Airtel number (the demo shows the code on screen instead of an SMS).
- **Swahili toggle** — the whole UI switches between English and Kiswahili (`EN · SW` in the header), persisted in `localStorage` with no first-load flicker.
- **Stima & Maji honesty cards** — power backup, water source and Wi-Fi truth on every listing ("no 12-hour blackout surprises").
- **Airport transfers** — optional pickup add-on priced per destination at checkout.
- **Group & monthly rates** — negotiated Kenyan pricing: 28+ night stays and 5+ guest groups get published discounts.
- **WhatsApp "ask the host"** — one tap opens a pre-filled WhatsApp chat with the host's line.
- **Real data** — 44 real Kenyan properties across 28 counties with published seasonal rates (KES), real coordinates, live weather (Open-Meteo) and live KES⇄USD FX (ExchangeRate-API).
- **Availability everywhere** — booked dates block the calendar, power the click-to-fill availability strip, and get enforced server-side (409 on clashes; cancelling frees the dates).

## Getting started

```bash
# 1. Install
npm install

# 2. Environment
#   Create .env with your Postgres connection string (any Postgres works):
cp .env.example .env      # then set DATABASE_URL=postgres://...

# 3. Create the schema + seed real data
npm run db:push           # drizzle-kit push --force (creates tables/columns)
npm run db:seed           # 44 listings, 77 reviews, 607 bookings

# 4. Run
npm run dev               # http://localhost:3000

# Other scripts
npm run lint              # eslint
npm run typecheck         # tsc --noEmit
npm run build && npm run start
```

### Troubleshooting (Windows)

Next.js 16's Turbopack occasionally fails on Windows with a
`TurbopackInternalError` like `failed to create junction point … The file exists
(os error 80)` when it re-links `node_modules` inside `.next` — it's
intermittent and happens in both `npm run dev` and `npm run build`.

Fix: stop any running dev server, delete `.next` **with a native Windows tool**
(Git Bash's `rm -rf` silently fails to remove Turbopack's junctions), then retry:

```powershell
# stop the dev server (Ctrl+C / taskkill) first, then in PowerShell:
Remove-Item -Recurse -Force .next
npm run build   # or npm run dev — usually works on the retry
```

If it keeps happening, use the **webpack** build instead — it avoids the
Turbopack junction code entirely and is reliable on Windows:

```bash
npm run build:webpack   # next build --webpack
```

`.env.example`:
```
DATABASE_URL=postgres://user:password@host/db?sslmode=require
```

## Deploying

```bash
vercel deploy --prod --yes   # requires `vercel login` + DATABASE_URL set in Vercel
```

The schema is managed with `drizzle-kit push` — after changing `src/db/schema.ts`, run `npm run db:push` against the target database (local or production), then `npm run db:seed` if you want fresh data.

## Demo caveats

- **M-Pesa is simulated unless you add IntaSend keys.** The demo STK push and PIN entry are a UI flow (`PATCH /api/bookings/:id` `{action:"confirm"}`); no real money moves. Add the IntaSend keys below and the same booking flow becomes a real M-Pesa STK push with a webhook confirmation.
- **Host WhatsApp lines are placeholders** using the clearly-fictional `+254 700 000 1xx` block so no real person receives messages.
- **The OTP is shown on screen**, not sent via SMS.
- Listing prices are *published seasonal rates* converted to KES for demonstration.

## M-Pesa payments (IntaSend)

Payments are powered by [IntaSend](https://developers.intasend.com) — a Kenya-first
aggregator that triggers the M-Pesa STK push straight to the guest's phone.

The integration is **on by default but dormant**: until you add credentials the
site keeps running the simulated demo (no money moves), so local dev and preview
deploys work untouched. Set these in your environment (Vercel → Settings →
Environment Variables) to go live:

```
INTASEND_TOKEN=<secret API token>
INTASEND_PUBLISHABLE_KEY=<publishable key>
# optional — use the sandbox while testing:
INTASEND_TEST_MODE=true
# optional — used as the payment `host`; defaults to safaristay.co.ke
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Setup: create an account at intasend.com → API → generate a publishable key and
secret token (use the sandbox first) → set the webhook URL to
`https://yourdomain.com/api/payments/webhook` (HTTPS required, events:
`mpesa.stk.push.*`).

Flow: `POST /api/bookings` creates the booking as `pending` →
`POST /api/payments/initiate` triggers the STK push → the guest enters their PIN
on their phone → IntaSend calls `POST /api/payments/webhook` (signature-verified,
HMAC-SHA256) → booking flips to `confirmed` and the widget updates itself.

## Project structure

```
src/
  app/            # pages + API routes (listings, bookings, availability, health)
  components/     # Header/Footer, BookingWidget, AvailabilityStrip, cards, maps…
  db/             # drizzle schema, connection, seed
  lib/            # data access, seasons/pricing, currency, weather, i18n, wishlist…
```

Key API routes:

| Route | Purpose |
| --- | --- |
| `GET /api/listings` | Filtered/sorted listings (region, type, tier, price, guests, q) |
| `GET /api/listings/[slug]` | (page) Detail with weather, FX, availability |
| `GET /api/availability?listingId=` | Booked ranges, season, weekly stats, FX |
| `POST /api/bookings` | Create a booking (M-Pesa → `pending`, property → `confirmed`) |
| `GET /api/bookings?ref=&email=` | Look up bookings by SS reference / email |
| `PATCH /api/bookings/:id` | `{action:"confirm"}` (STK) or `{action:"cancel"}` (48h window) |
| `POST /api/payments/initiate` | Start the M-Pesa STK push for a pending booking (simulated without keys) |
| `POST /api/payments/webhook` | IntaSend webhook — verifies signature, confirms the booking on completion |
| `GET /api/payments/status` | `{live: bool}` — whether real M-Pesa is configured |
