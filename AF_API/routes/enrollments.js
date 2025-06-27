const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth'); // ✅ FIX

const router = express.Router();

// Get all enrollments for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [enrollments] = await db.execute(
      'SELECT * FROM enrollments WHERE user_id = ?',
      [userId]
    );
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll a user in a course
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.body;
    await db.execute(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [userId, courseId]
    );
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
