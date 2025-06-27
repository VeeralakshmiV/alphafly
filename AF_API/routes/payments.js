const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  const [payments] = await db.execute('SELECT * FROM payments ORDER BY date DESC');
  res.json(payments);
});

// Add a new payment
router.post('/', async (req, res) => {
  const { studentId, studentName, courseName, amount, status, date, invoiceNumber } = req.body;
  await db.execute(
    'INSERT INTO payments (studentId, studentName, courseName, amount, status, date, invoiceNumber) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [studentId, studentName, courseName, amount, status, date, invoiceNumber]
  );
  res.status(201).json({ success: true });
});

module.exports = router;