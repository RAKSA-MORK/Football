import "dotenv/config";
import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

const port = Number(process.env.PORT ?? 4000);
const defaultKey = "default";

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/squads/latest", async (_req, res) => {
  try {
    const squad = await prisma.squadState.findUnique({
      where: { key: defaultKey },
    });

    if (!squad) {
      return res.json({
        players: [],
        formationName: "4-4-2",
        customFormation: null,
      });
    }

    return res.json({
      players: squad.players,
      formationName: squad.formationName,
      customFormation: squad.customFormation,
    });
  } catch (error) {
    console.error("Failed to read squad:", error);
    return res.status(500).json({ message: "Failed to read squad data." });
  }
});

app.post("/api/squads", async (req, res) => {
  try {
    const { players, formationName, customFormation } = req.body ?? {};

    if (!Array.isArray(players)) {
      return res.status(400).json({ message: "players must be an array." });
    }

    if (typeof formationName !== "string") {
      return res.status(400).json({ message: "formationName must be a string." });
    }

    if (!customFormation || typeof customFormation !== "object") {
      return res.status(400).json({ message: "customFormation is required." });
    }

    const squad = await prisma.squadState.upsert({
      where: { key: defaultKey },
      update: {
        players,
        formationName,
        customFormation,
      },
      create: {
        key: defaultKey,
        players,
        formationName,
        customFormation,
      },
    });

    return res.json({
      id: squad.id,
      players: squad.players,
      formationName: squad.formationName,
      customFormation: squad.customFormation,
      updatedAt: squad.updatedAt,
    });
  } catch (error) {
    console.error("Failed to save squad:", error);
    return res.status(500).json({ message: "Failed to save squad data." });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
