const express = require('express');
const router = express.Router();
const controller = require('../controllers/metricController');

router.post('/', controller.ingestMetric);
router.get('/', controller.getLatestMetrics);
router.get('/stats', controller.getStats);

module.exports = router;
