# Football Squad Builder v11

This version adds a shirt size combo box when creating a new player.

## Shirt size values

```txt
S, M, L, XL, 2XL, 3XL, 4XL, 5XL
```

The size is saved together with each player and exported to Excel/CSV.

## MongoDB + Prisma setup

Create `.env`:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/YOUR_DATABASE?retryWrites=true&w=majority"
PORT=4000
VITE_API_URL="http://localhost:4000"
```

Run:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```
