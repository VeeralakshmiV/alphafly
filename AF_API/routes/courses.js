const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
    try {
        const [courses] = await db.execute(`
            SELECT c.*, u.first_name, u.last_name 
            FROM courses c 
            LEFT JOIN users u ON c.created_by = u.id
            ORDER BY c.created_at DESC
        `);

        // Get sections and lessons for each course
        for (let course of courses) {
            const [sections] = await db.execute(`
                SELECT s.*, 
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('id', l.id, 'title', l.title, 'content', l.content, 'order_index', l.order_index)
                    ORDER BY l.order_index
                ) FROM lessons l WHERE l.section_id = s.id) as lessons
                FROM sections s 
                WHERE s.course_id = ? 
                ORDER BY s.order_index
            `, [course.id]);

            course.sections = sections.map(section => ({
                ...section,
                lessons: section.lessons || []
            }));
        }

        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create course

router.post('/', authenticateToken , async (req, res) => {
    try {
        const { title, description, sections } = req.body;
        const userId = req.user.userId;

        // Debug log incoming data and user
        console.log('POST /api/courses', { title, description, sections, userId });

        // Insert course
        const [courseResult] = await db.execute(
            'INSERT INTO courses (title, description, created_by) VALUES (?, ?, ?)',
            [title, description, userId]
        );

        const courseId = courseResult.insertId;

        // Insert sections and lessons
        if (sections && sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const [sectionResult] = await db.execute(
                    'INSERT INTO sections (course_id, title, order_index) VALUES (?, ?, ?)',
                    [courseId, section.title, i]
                );

                const sectionId = sectionResult.insertId;

                if (section.lessons && section.lessons.length > 0) {
                    for (let j = 0; j < section.lessons.length; j++) {
                        const lesson = section.lessons[j];
                        await db.execute(
                            'INSERT INTO lessons (section_id, title, content, order_index) VALUES (?, ?, ?, ?)',
                            [sectionId, lesson.title, lesson.content, j]
                        );
                    }
                }
            }
        }

        res.status(201).json({ message: 'Course created successfully', courseId });
    } catch (error) {
        // Log error details
        console.error('Error in POST /api/courses:', error, req.body);
        res.status(500).json({ error: error.message });
    }
});

// Update course
router.put('/:id', authenticateToken , async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description, sections } = req.body;

        // Update course
        await db.execute(
            'UPDATE courses SET title = ?, description = ? WHERE id = ?',
            [title, description, courseId]
        );

        // Delete existing sections and lessons
        await db.execute('DELETE FROM sections WHERE course_id = ?', [courseId]);

        // Insert new sections and lessons
        if (sections && sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const [sectionResult] = await db.execute(
                    'INSERT INTO sections (course_id, title, order_index) VALUES (?, ?, ?)',
                    [courseId, section.title, i]
                );

                const sectionId = sectionResult.insertId;

                if (section.lessons && section.lessons.length > 0) {
                    for (let j = 0; j < section.lessons.length; j++) {
                        const lesson = section.lessons[j];
                        await db.execute(
                            'INSERT INTO lessons (section_id, title, content, order_index) VALUES (?, ?, ?, ?)',
                            [sectionId, lesson.title, lesson.content, j]
                        );
                    }
                }
            }
        }

        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete course
router.delete('/:id', authenticateToken , async (req, res) => {
    try {
        const courseId = req.params.id;
        await db.execute('DELETE FROM courses WHERE id = ?', [courseId]);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
