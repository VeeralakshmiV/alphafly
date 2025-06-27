const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Register Endpoint (admin only)
router.post('/register', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;

  // Debug log
  console.log('Incoming registration data:', req.body);

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
  'INSERT INTO users (first_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
  [name, email, passwordHash, role]
);

    const userId = result.insertId;
    const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: '24h' });

const [users] = await db.execute(
  'SELECT id, first_name AS name, email, role, created_at FROM users WHERE id = ?',
  [userId]
);

    res.json({ user: users[0], token });

  } catch (error) {
    console.error('Registration error:', error); // log exact DB error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(400).json({ error: 'Registration failed' });
  }
});


// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login request for:', email);

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      console.log('No user found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    console.log('User found:', user);

    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid?', isValid);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});


module.exports = router;