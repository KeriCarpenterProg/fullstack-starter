// src/lib/auth.ts
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;
export type JwtUser = { id: string; email: string; name?: string };

export function sign(user: JwtUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function auth(
  req: Request & { user?: JwtUser },
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization; // "Bearer <token>"
  if (!header) return res.status(401).json({ error: "Missing Authorization" });

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid Authorization format" });
  }

  const token = parts[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Type guard to ensure we have the right shape
    if (typeof decoded === "object" && decoded !== null && "id" in decoded && "email" in decoded) {
      req.user = decoded as JwtUser;
      next();
    } else {
      res.status(401).json({ error: "Invalid token payload" });
    }
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}