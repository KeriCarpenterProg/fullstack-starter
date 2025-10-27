import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "express";
import authRouter from "./routes/auth";
import projectRouter from "./routes/projects";
import { auth } from "./lib/auth";


const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Auth routes
app.use("/api/auth", authRouter);

// Project routes
app.use("/api/projects", projectRouter);

// Test protected endpoint
app.get("/api/me", auth, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
