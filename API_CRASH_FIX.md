# Fix for Vercel FUNCTION_INVOCATION_FAILED

v19 fixes a common cause of Vercel function crashes:

The old Mongo helper threw this error at module import time:

```ts
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}
```

On Vercel, import-time throws can show only:

```txt
This Serverless Function has crashed.
FUNCTION_INVOCATION_FAILED
```

v19 now checks environment variables inside the API handler and returns JSON errors instead of crashing.

## Deploy steps

1. Upload this version.
2. In Vercel Environment Variables, set:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/?retryWrites=true&w=majority
MONGODB_DB=football_squad_builder
```

3. Remove production `VITE_API_URL` if it is set to localhost.
4. Redeploy with **Clear Build Cache**.

## Test

Open:

```txt
https://football-omega-one.vercel.app/api/health
```

Expected success:

```json
{
  "ok": true,
  "hasMongoUri": true,
  "database": "football_squad_builder",
  "message": "MongoDB connection OK."
}
```

If it fails now, it should return JSON with the exact error, for example:

- Missing MONGODB_URI
- bad auth Authentication failed
- querySrv ENOTFOUND
- IP/network access issue
