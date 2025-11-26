// src/types/express.d.ts
import { JwtUser } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
