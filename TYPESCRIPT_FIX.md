# Fix for react-dom/client TypeScript error

The Vercel build error was:

```txt
Could not find a declaration file for module 'react-dom/client'
Try npm i --save-dev @types/react-dom
```

v16 fixes it by adding:

```json
"devDependencies": {
  "@types/react": "latest",
  "@types/react-dom": "latest"
}
```

It also pins React runtime packages:

```json
"react": "19.2.1",
"react-dom": "19.2.1"
```

Before deploying, delete old lock files and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

Then commit/push and redeploy on Vercel with Clear Build Cache enabled.
