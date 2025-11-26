import "dotenv/config";
import express from "express";
import cors from "cors";
import { json } from "express";
import authRouter from "./routes/auth";
import projectRouter from "./routes/projects";
import oauthRouter from "./routes/oauth";
import { auth } from "./lib/auth";
import { db } from "./lib/db";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", /^https:\/\/.*\.vercel\.app$/],
    credentials: true,
  }),
);
app.use(json());

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Debug endpoints (temporary - remove in production)
app.get("/api/debug/users", async (_req, res) => {
  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
  });
  res.json(users);
});

app.get("/api/debug/projects", async (_req, res) => {
  const projects = await db.project.findMany({
    include: { owner: { select: { email: true } } },
  });
  res.json(projects);
});

// Auth routes
app.use("/api/auth", authRouter);

// OAuth routes
app.use("/api/oauth", oauthRouter);

// Project routes
app.use("/api/projects", projectRouter);

// ML prediction endpoint (proxy to external ML microservice)
app.post("/api/ml/predict-category", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const baseUrl = process.env.ML_SERVICE_URL || "http://localhost:5002";
  const url = `${baseUrl.replace(/\/$/, "")}/predict`;
  const mlApiKey = process.env.ML_API_KEY;

  // Timeout + single retry strategy
  const attemptFetch = async (attempt: number): Promise<Response> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add API key if configured
      if (mlApiKey) {
        headers["X-API-Key"] = mlApiKey;
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === 0) throw err; // no more retries
      return attemptFetch(attempt - 1);
    }
  };

  try {
    const response = await attemptFetch(1); // 1 retry allowed
    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }
    const prediction = await response.json();
    res.json(prediction);
  } catch (error: any) {
    console.error("ML service error:", error);
    res.status(503).json({
      error: "ML service unavailable",
      message:
        error.name === "AbortError" ? "ML request timed out" : error.message,
    });
  }
});

// Test protected endpoint (temporarily commented due to TypeScript issues)
// app.get("/api/me", auth, (req, res) => {
//   res.json({ message: "You are authenticated!", user: req.user });
// });

const port = Number(process.env.PORT) || 4000;

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  const mlUrl = process.env.ML_SERVICE_URL;
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
    if (mlUrl) {
      console.log(`ML service URL configured: ${mlUrl}`);
    } else {
      console.warn(
        "ML_SERVICE_URL not set; falling back to http://localhost:5002. Set ML_SERVICE_URL in server/.env or deployment env vars.",
      );
    }
  });
}

export default app;
