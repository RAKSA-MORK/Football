# Fix for Prisma CLI 7.8.0 build error

Your Vercel log shows:

```txt
Prisma CLI Version : 7.8.0
The datasource property `url` is no longer supported in schema files
```

This means the deployment is still running Prisma 7.

For MongoDB, use Prisma 6.19.0. This project forces it in 3 places:

1. package.json dependencies

```json
"@prisma/client": "6.19.0",
"prisma": "6.19.0"
```

2. package.json overrides

```json
"overrides": {
  "prisma": "6.19.0",
  "@prisma/client": "6.19.0"
}
```

3. build script

```json
"build": "npx prisma@6.19.0 generate && tsc -b && vite build"
```

## Important deployment steps

1. Replace your deployed project files with this version.
2. Delete old lock file if your GitHub repo has one:
   - package-lock.json
   - pnpm-lock.yaml
   - yarn.lock
3. Run locally:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

4. Commit the updated package.json.
5. In Vercel, redeploy with **Clear Build Cache** enabled.

## Why not Prisma 7?

Prisma's MongoDB docs currently say to use Prisma ORM v6.19 for MongoDB compatibility. Prisma 7 moved datasource URLs out of schema.prisma and does not yet support MongoDB.
