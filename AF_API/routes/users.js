const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth'); // ✅ fixed

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, first_name, last_name, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [users] = await db.execute(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
