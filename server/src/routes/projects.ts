// src/routes/projects.ts
import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { auth } from "../lib/auth";

const router = Router();

// All routes require authentication
router.use(auth);

const CreateProject = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
});

const UpdateProject = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

// GET /api/projects - List user's projects
router.get("/", async (req, res) => {
  try {
    const projects = await db.project.findMany({
      where: { ownerId: req.user!.id },
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
    const project = await db.project.create({
      data: {
        ...input,
        ownerId: req.user!.id,
      },
    });
    res.status(201).json(project);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/projects/:id - Get specific project
router.get("/:id", async (req, res) => {
  try {
    const project = await db.project.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.id, // Ensure user owns this project
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
    const existingProject = await db.project.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.id,
      },
    });
    
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const project = await db.project.update({
      where: { id: req.params.id },
      data: input,
    });
    
    res.json(project);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete("/:id", async (req, res) => {
  try {
    // Check if project exists and user owns it
    const existingProject = await db.project.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.id,
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