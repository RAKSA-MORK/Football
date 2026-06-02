# Football Squad Builder v12

This version removes MongoDB/Prisma and uses a local JSON file data store instead.

## New in v12

- Removed Prisma
- Removed MongoDB connection
- Backend stores squad data in `server/data/squad-state.json`
- Added **Real name** input when adding a new player
- Kept **Shirt size** combo box: `S, M, L, XL, 2XL, 3XL, 4XL, 5XL`

## Setup

```bash
npm install
npm run dev
```

This starts:

- Vite frontend: `http://localhost:5173`
- Express API: `http://localhost:4000`

## Optional `.env`

```env
PORT=4000
DATA_FILE_PATH="./server/data/squad-state.json"
VITE_API_URL="http://localhost:4000"
```

## API routes

```txt
GET    /api/squads/latest
POST   /api/squads
DELETE /api/squads
```

## Stored data

The backend writes the current squad state to:

```txt
server/data/squad-state.json
```

The app still uses localStorage as a browser fallback if the backend is offline.
