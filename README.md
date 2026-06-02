# Football Squad Builder v20

This version adds a server-side file fallback.

Storage priority:

```txt
1. MongoDB
2. Server file fallback
3. Browser localStorage fallback
```

## Important Vercel note

On Vercel, the server file fallback writes to `/tmp`. This can help avoid browser-only localStorage, but it is not a permanent database. It may reset when the serverless function instance is recycled.

For real shared permanent data, MongoDB still needs to work.

## API behavior

If MongoDB works:

```json
{ "storage": "mongodb" }
```

If MongoDB fails:

```json
{ "storage": "server-file-fallback", "warning": "MongoDB save failed..." }
```

## Test after deploy

Open:

```txt
https://football-omega-one.vercel.app/api/health
```

It should no longer crash. It should return either:

```json
{
  "mongodb": true,
  "fileFallback": false
}
```

or:

```json
{
  "mongodb": false,
  "fileFallback": true,
  "mongoError": "..."
}
```

## Vercel env

For MongoDB, set:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/?retryWrites=true&w=majority
MONGODB_DB=football_squad_builder
```

Remove this in production:

```env
VITE_API_URL=http://localhost:4000
```
