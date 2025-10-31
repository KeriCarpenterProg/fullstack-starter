import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "express";
import authRouter from "./routes/auth";
import projectRouter from "./routes/projects";
import { auth } from "./lib/auth";
import { db } from "./lib/db";


const app = express();
app.use(cors({ 
  origin: [
    "http://localhost:5173",
    /^https:\/\/.*\.vercel\.app$/
  ], 
  credentials: true 
}));
app.use(json());

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Debug endpoints (temporary - remove in production)
app.get("/api/debug/users", async (_req, res) => {
  const users = await db.user.findMany({ 
    select: { id: true, email: true, name: true, createdAt: true } 
  });
  res.json(users);
});

app.get("/api/debug/projects", async (_req, res) => {
  const projects = await db.project.findMany({
    include: { owner: { select: { email: true } } }
  });
  res.json(projects);
});

// Auth routes
app.use("/api/auth", authRouter);

// Project routes
app.use("/api/projects", projectRouter);

// Test protected endpoint
app.get("/api/me", auth, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

const port = Number(process.env.PORT) || 4000;

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

export default app;
