import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }
    const token = authHeader
    //const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "Token malformed" });
      return;
    }

    const secret = process.env.JWT_KEY || "secret_key";
    const decoded = jwt.verify(token, secret) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
