# Football Squad Builder v13

This version uses **MongoDB Atlas + Prisma + Vercel API routes**.

It keeps the latest UI features:

- display name
- real name
- shirt number
- shirt size: `S, M, L, XL, 2XL, 3XL, 4XL, 5XL`
- role
- captain
- custom draggable formation
- reserve bench

## Important security note

Do not put `MONGODB_URI` in frontend code. Add it only in `.env` locally and in Vercel Environment Variables.

If you already pasted your real MongoDB password in chat or committed it somewhere, rotate/change that MongoDB Atlas password.

## Local setup

```bash
npm install
```

Create `.env`:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/YOUR_DATABASE?retryWrites=true&w=majority"
VITE_API_URL="http://localhost:4000"
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Push Prisma model to MongoDB:

```bash
npm run prisma:push
```

Run locally:

```bash
npm run dev
```

This runs:

- Vite frontend
- Vercel API routes locally through `vercel dev --listen 4000`

## Vercel deployment

In Vercel Project Settings → Environment Variables, add:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/YOUR_DATABASE?retryWrites=true&w=majority"
```

For Vercel production, you normally do not need `VITE_API_URL`, because the frontend calls same-domain API routes:

```txt
/api/squads/latest
/api/squads
```

## API routes

```txt
GET    /api/squads/latest
POST   /api/squads
DELETE /api/squads
```

## About `lib/mongodb.ts`

The project includes your requested Vercel MongoDB helper:

```ts
import { MongoClient, type MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";
```

That helper is useful for native MongoDB-driver endpoints.

The current squad APIs use Prisma through `lib/prisma.ts`. Prisma does not use the native `MongoClient` instance directly.
