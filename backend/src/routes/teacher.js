import express from "express";
import { authMiddleware, teacherOnly } from "../middleware/auth.js";
import { query } from "../db/connection.js";

const router = express.Router();
router.use(authMiddleware, teacherOnly);

// GET /api/teacher/classes
router.get("/classes", async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT c.*, COUNT(ce.student_id) AS student_count
       FROM classes c LEFT JOIN class_enrollments ce ON ce.class_id = c.id
       WHERE c.teacher_id = $1 GROUP BY c.id ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// POST /api/teacher/classes
router.post("/classes", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Class name is required" });

    // Retry loop in case of join_code collision
    let rows;
    for (let i = 0; i < 5; i++) {
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      try {
        const result = await query(
          "INSERT INTO classes (teacher_id, name, join_code) VALUES ($1, $2, $3) RETURNING *",
          [req.user.id, name.trim(), joinCode]
        );
        rows = result.rows;
        break;
      } catch (e) {
        if (e.code !== "23505") throw e; // only retry on unique violation
      }
    }
    if (!rows) return res.status(500).json({ error: "Could not generate unique join code, try again" });
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// GET /api/teacher/classes/:classId/analytics
router.get("/classes/:classId/analytics", async (req, res, next) => {
  try {
    const { classId } = req.params;

    // Verify teacher owns this class
    const { rows: cls } = await query(
      "SELECT id FROM classes WHERE id = $1 AND teacher_id = $2",
      [classId, req.user.id]
    );
    if (!cls[0]) return res.status(403).json({ error: "Not your class" });

    const [students, submissions] = await Promise.all([
      query(
        `SELECT u.id, u.name, u.email,
                COUNT(DISTINCT s.challenge_id) FILTER (WHERE s.passed) AS challenges_completed,
                COUNT(DISTINCT s.id) AS total_submissions,
                MAX(s.submitted_at) AS last_active,
                qr.primary_career
         FROM class_enrollments ce
         JOIN users u ON u.id = ce.student_id
         LEFT JOIN submissions s ON s.user_id = u.id
         LEFT JOIN (
           SELECT DISTINCT ON (user_id) user_id, primary_career
           FROM quiz_results ORDER BY user_id, taken_at DESC
         ) qr ON qr.user_id = u.id
         WHERE ce.class_id = $1
         GROUP BY u.id, qr.primary_career
         ORDER BY challenges_completed DESC`,
        [classId]
      ),
      query(
        `SELECT DATE(s.submitted_at) AS day, COUNT(*) AS count, 
                SUM(CASE WHEN s.passed THEN 1 ELSE 0 END) AS passed
         FROM submissions s
         JOIN class_enrollments ce ON ce.student_id = s.user_id
         WHERE ce.class_id = $1 AND s.submitted_at > NOW() - INTERVAL '30 days'
         GROUP BY DATE(s.submitted_at) ORDER BY day`,
        [classId]
      ),
    ]);

    // Flag struggling students: < 20% completion OR > 60% fail rate
    const struggling = students.rows.filter(s =>
      parseInt(s.challenges_completed) < 2 ||
      (parseInt(s.total_submissions) > 5 &&
       parseInt(s.challenges_completed) / parseInt(s.total_submissions) < 0.2)
    );

    res.json({
      students:    students.rows,
      activity:    submissions.rows,
      struggling,
      summary: {
        totalStudents:      students.rows.length,
        avgCompleted:       (students.rows.reduce((a, s) => a + parseInt(s.challenges_completed), 0) / students.rows.length || 0).toFixed(1),
        strugglingCount:    struggling.length,
      }
    });
  } catch (err) { next(err); }
});

export default router;
