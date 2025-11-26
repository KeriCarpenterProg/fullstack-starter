// src/routes/auth.ts
import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { hash, compare } from "bcryptjs";
import { sign } from "../lib/auth";

const router = Router();

const SignUp = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});
const SignIn = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/signup", async (req, res) => {
  try {
    const input = SignUp.parse(req.body);
    const exists = await db.user.findUnique({ where: { email: input.email } });
    if (exists) return res.status(409).json({ error: "Email already in use" });
    const password = await hash(input.password, 12);
    const user = await db.user.create({ data: { ...input, password } });
    const token = sign({
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const input = SignIn.parse(req.body);
    const user = await db.user.findUnique({ where: { email: input.email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return res.status(401).json({ error: "Please sign in with Google" });
    }

    const ok = await compare(input.password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = sign({
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
