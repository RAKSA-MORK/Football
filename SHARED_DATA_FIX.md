# Fix: data disappears in another browser

If another browser cannot see the same squad data, the frontend is not using MongoDB. It is falling back to browser localStorage.

## Most common cause

You set this in Vercel:

```env
VITE_API_URL=http://localhost:4000
```

That is wrong for production.

In production, the frontend should call same-domain Vercel API routes:

```txt
/api/squads/latest
/api/squads
```

## What v17 changes

`src/api.ts` now does this:

```ts
if (import.meta.env.PROD) {
  return "";
}
```

So production always calls same-domain API routes and does not call localhost.

## Required Vercel environment variables

Keep only:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/YOUR_DATABASE?retryWrites=true&w=majority"
```

Remove this from Vercel production if it exists:

```env
VITE_API_URL=http://localhost:4000
```

## Test after deploy

Open:

```txt
https://your-app.vercel.app/api/squads/latest
```

You should see JSON like:

```json
{
  "players": [],
  "formationName": "4-4-2",
  "customFormation": null
}
```

If that URL returns an error, the MongoDB API route is not working.

## UI status

v17 adds a status badge:

- `MongoDB connected` = shared data works
- `Using local browser storage only` = other browsers will not see the data
