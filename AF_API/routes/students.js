const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Create a new student
router.post('/', async (req, res) => {
  try {
    const { name, phone, parentsName, parentsOccupation, profession, course, courseDuration, fees, advance, balance } = req.body;
    const [result] = await db.execute(
      'INSERT INTO students (name, phone, parentsName, parentsOccupation, profession, course, courseDuration, fees, advance, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, phone, parentsName, parentsOccupation, profession, course, courseDuration, fees, advance, balance]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const [students] = await db.execute('SELECT * FROM students');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, parentsName, parentsOccupation, profession, course, courseDuration, fees, advance, balance } = req.body;
    const { id } = req.params;
    await db.execute(
      'UPDATE students SET name=?, phone=?, parentsName=?, parentsOccupation=?, profession=?, course=?, courseDuration=?, fees=?, advance=?, balance=? WHERE id=?',
      [name, phone, parentsName, parentsOccupation, profession, course, courseDuration, fees, advance, balance, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
