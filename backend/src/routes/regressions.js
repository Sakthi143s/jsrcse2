const express = require('express');
const router = express.Router();
const controller = require('../controllers/regressionController');

router.get('/', controller.getRegressions);
router.post('/detect', controller.detectRegressions);

module.exports = router;
