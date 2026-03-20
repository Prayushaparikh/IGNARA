// middleware/auth.js
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function teacherOnly(req, res, next) {
  if (req.user?.role !== "teacher") return res.status(403).json({ error: "Teachers only" });
  next();
}
