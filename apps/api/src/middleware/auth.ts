import { jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";
import { config } from "@sora/config/config";

const SECRET = new TextEncoder().encode(config.NEXTAUTH_SECRET);

export async function authenticate(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, SECRET);

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(role: string) {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.user.role !== role && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}