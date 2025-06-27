const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.post('/', contentController.createContent);
router.get('/section/:id', contentController.getContentBySection);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

module.exports = router;
