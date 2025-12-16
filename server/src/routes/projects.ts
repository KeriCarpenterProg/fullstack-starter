// src/routes/projects.ts
import { Router } from "express";
import type { JwtUser } from "../lib/auth";
import { z } from "zod";
import { db } from "../lib/db";
import { auth } from "../lib/auth";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5002";

/**
 * Generate embedding for project text using ML service
 * Combines title and description for semantic search
 */
async function generateEmbedding(
  title: string,
  description?: string | null
): Promise<number[] | null> {
  try {
    const text = description ? `${title} ${description}` : title;
    const response = await fetch(`${ML_SERVICE_URL}/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: [text] }),
    });

    if (!response.ok) {
      console.error("ML service error:", await response.text());
      return null; // Fail gracefully - don't block project creation
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error("Failed to generate embedding:", error);
    return null; // Fail gracefully
  }
}

const router = Router();

// All routes require authentication
router.use(auth as any); // Cast to any to satisfy Express overload inference in some build environments

const CreateProject = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
  // Allow blank or missing category; transform blank -> undefined
  category: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      const trimmed = val.trim();
      return trimmed.length ? trimmed : undefined;
    }),
});

const UpdateProject = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      const trimmed = val.trim();
      return trimmed.length ? trimmed : undefined;
    }),
});

// GET /api/projects - List user's projects
router.get("/", async (req, res) => {
  try {
    const userId = (req.jwtUser as JwtUser)?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });
    const projects = await db.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
    });
    res.json(projects);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/projects - Create new project
router.post("/", async (req, res) => {
  try {
    const input = CreateProject.parse(req.body);
    const userId = (req.jwtUser as JwtUser)?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const { category, ...rest } = input;

    // Generate embedding for semantic search
    const embedding = await generateEmbedding(input.title, input.description);

    const project = await db.project.create({
      data: {
        ...rest,
        category: category ?? "uncategorized",
        ownerId: userId,
        ...(embedding ? { embedding } : {}), // Only set if embedding was generated
      },
    });
    return res.status(201).json(project);
  } catch (e: any) {
    // Differentiate validation vs internal errors
    if (e?.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid project data", details: e.errors });
    }
    console.error("Project create error:", e);
    return res
      .status(500)
      .json({ error: "Failed to create project", message: e.message });
  }
});

// GET /api/projects/:id - Get specific project
router.get("/:id", async (req, res) => {
  try {
    const userId = (req.jwtUser as JwtUser)?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });
    const project = await db.project.findFirst({
      where: {
        id: req.params.id,
        ownerId: userId, // Ensure user owns this project
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/projects/:id - Update project
router.put("/:id", async (req, res) => {
  try {
    const input = UpdateProject.parse(req.body);

    // Check if project exists and user owns it
    const userId = (req.jwtUser as JwtUser)?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });
    const existingProject = await db.project.findFirst({
      where: {
        id: req.params.id,
        ownerId: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { category, ...rest } = input;

    // Regenerate embedding if title or description changed
    let embedding = undefined;
    if (input.title !== undefined || input.description !== undefined) {
      const newTitle = input.title ?? existingProject.title;
      const newDescription =
        input.description !== undefined
          ? input.description
          : existingProject.description;
      embedding = await generateEmbedding(newTitle, newDescription);
    }

    const project = await db.project.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(category ? { category } : {}),
        ...(embedding ? { embedding } : {}),
      },
    });

    res.json(project);
  } catch (e: any) {
    if (e?.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid update data", details: e.errors });
    }
    console.error("Project update error:", e);
    return res
      .status(500)
      .json({ error: "Failed to update project", message: e.message });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete("/:id", async (req, res) => {
  try {
    // Check if project exists and user owns it
    const userId = (req.jwtUser as JwtUser)?.id;
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });
    const existingProject = await db.project.findFirst({
      where: {
        id: req.params.id,
        ownerId: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    await db.project.delete({
      where: { id: req.params.id },
    });

    res.status(204).send(); // No content
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
