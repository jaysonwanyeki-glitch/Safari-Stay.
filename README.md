# SafariStay — Kenyan Safari Accommodation Platform

A Next.js marketplace for Kenyan safari and coastal stays — beachfront villas, bush
homes, tented camps and hosted bandas run by local hosts, from the Maasai Mara to
Diani Beach.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Drizzle ORM** + PostgreSQL (`pg` pool)
- **Leaflet** maps, Pexels photography

## Getting started

```bash
npm install
cp .env.example .env   # set DATABASE_URL
npm run dev            # http://localhost:3000
```

### Database

Create the schema and load seed data:

```bash
npx drizzle-kit push
npx tsx src/db/seed.ts
```

## Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start the dev server     |
| `npm run build`    | Production build         |
| `npm run start`    | Serve the production build |
| `npm run lint`     | ESLint                   |
| `npm run typecheck`| TypeScript type-check    |

## Environment variables

| Variable        | Required | Description                    |
| --------------- | -------- | ------------------------------ |
| `DATABASE_URL`  | Yes*     | PostgreSQL connection string   |

\* Required only when database-backed pages/APIs are used. The app builds without it.

## Deployment

Deploys on Vercel (zero-config for Next.js). Add `DATABASE_URL` to the project's
environment variables, then push to a Git provider connected to Vercel.
