# Football Squad Builder v10

This version connects the Vite React app to MongoDB using a small Express + Prisma backend.

## Important

Do not put your MongoDB URI inside React/Vite frontend code. Prisma must run on the backend only.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in the project root:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/YOUR_DATABASE?retryWrites=true&w=majority"
PORT=4000
VITE_API_URL="http://localhost:4000"
```

3. Generate Prisma Client:

```bash
npm run prisma:generate
```

4. Push the Prisma schema to MongoDB:

```bash
npm run prisma:push
```

5. Run frontend and backend together:

```bash
npm run dev
```

This starts:

- Vite frontend: `http://localhost:5173`
- Express API: `http://localhost:4000`

## API routes

```txt
GET  /api/squads/latest
POST /api/squads
```

## Persistence

The app saves:

- players
- roles
- shirt numbers
- captain selection
- selected formation
- custom formation dragged positions

Data is saved to MongoDB. localStorage is still used as a fallback if the API is unavailable.
