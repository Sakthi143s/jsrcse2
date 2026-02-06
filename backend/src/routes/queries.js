const express = require('express');
const router = express.Router();
const controller = require('../controllers/queryController');

router.get('/', controller.getQueries);
router.post('/analyze', controller.analyzeQuery);

module.exports = router;
