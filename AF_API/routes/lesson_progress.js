const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get lesson progress for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [progress] = await db.execute(
      'SELECT * FROM lesson_progress WHERE user_id = ?',
      [userId]
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark lesson as complete
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId, sectionId, lessonId } = req.body;
    await db.execute(
      'INSERT INTO lesson_progress (user_id, course_id, section_id, lesson_id, completed_at) VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE completed_at = NOW()',
      [userId, courseId, sectionId, lessonId]
    );
    res.status(201).json({ message: 'Lesson marked as complete' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
