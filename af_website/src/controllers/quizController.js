const db = require('../db');

exports.createQuiz = async (req, res) => {
  const { contentId } = req.params;
  const { question, options, correct_answer } = req.body;
  try {
    await db.execute(
      'INSERT INTO quiz_questions (content_id, question, options, correct_answer) VALUES (?, ?, ?, ?)',
      [contentId, question, JSON.stringify(options), correct_answer]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { question, options, correct_answer } = req.body;
  try {
    await db.execute(
      'UPDATE quiz_questions SET question = ?, options = ?, correct_answer = ? WHERE id = ?',
      [question, JSON.stringify(options), correct_answer, id]
    );
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM quiz_questions WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};