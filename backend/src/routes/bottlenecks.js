const express = require('express');
const router = express.Router();
const controller = require('../controllers/bottleneckController');

router.get('/', controller.getBottlenecks);
router.get('/:id', controller.getBottleneckById);
router.post('/analyze', controller.analyzeBottlenecks);

module.exports = router;
