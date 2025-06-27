const db = require('../db');

exports.createContent = async (req, res) => {
  const { section_id, title, content, type, order_index } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO course_content (section_id, title, content, type, order_index) VALUES (?, ?, ?, ?, ?)',
      [section_id, title, content, type, order_index]
    );
    res.status(201).json({ id: result.insertId, section_id, title, content, type, order_index });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContentBySection = async (req, res) => {
  const sectionId = req.params.id;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM course_content WHERE section_id = ?',
      [sectionId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateContent = async (req, res) => {
  const { id } = req.params;
  const { title, content, type, order_index } = req.body;
  try {
    await db.execute(
      'UPDATE course_content SET title = ?, content = ?, type = ?, order_index = ? WHERE id = ?',
      [title, content, type, order_index, id]
    );
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteContent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM course_content WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
