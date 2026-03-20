import express from "express";
import bcrypt  from "bcryptjs";
import jwt     from "jsonwebtoken";
import { z }   from "zod";
import { query } from "../db/connection.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const RegisterSchema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  password: z.string().min(8),
  role:     z.enum(["student", "teacher"]).default("student"),
});

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = RegisterSchema.parse(req.body);
    const hash = await bcrypt.hash(password, 12);

    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, hash, role]
    );

    const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ user: rows[0], token });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already registered" });
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash)))
      return res.status(401).json({ error: "Invalid credentials" });

    const { password_hash, ...user } = rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get("/me", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await query(
      "SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1",
      [decoded.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch { res.status(401).json({ error: "Invalid token" }); }
});

export default router;
