# Football Squad Builder v18

This version removes Prisma from the production path and uses the native MongoDB driver with Vercel API routes.

Why: your deployed function crashed at `/api/squads/latest`. The Prisma v6/v7 MongoDB setup was causing deployment/runtime issues. This version uses your requested Vercel MongoDB pattern:

```ts
import { MongoClient, type MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";
```

## Environment variables in Vercel

Set:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/?retryWrites=true&w=majority"
MONGODB_DB="football_squad_builder"
```

Do not set this in Vercel production:

```env
VITE_API_URL=http://localhost:4000
```

The production frontend automatically calls same-domain API routes.

## API routes

```txt
GET    /api/health
GET    /api/squads/latest
POST   /api/squads
DELETE /api/squads
```

## Test after deployment

Open:

```txt
https://your-app.vercel.app/api/health
```

Expected:

```json
{
  "ok": true,
  "database": "football_squad_builder",
  "hasMongoUri": true
}
```

Then open:

```txt
https://your-app.vercel.app/api/squads/latest
```

Expected JSON squad data.

## Local setup

```bash
npm install
npm run dev
```

For local `.env`:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/?retryWrites=true&w=majority"
MONGODB_DB="football_squad_builder"
VITE_API_URL="http://localhost:4000"
```

## Security note

If you pasted your real MongoDB password into chat or committed it, rotate/change it in MongoDB Atlas.
