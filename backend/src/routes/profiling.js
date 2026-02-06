const express = require('express');
const router = express.Router();
const controller = require('../controllers/profilingController');

router.get('/', controller.getProfiles);
router.post('/', controller.createProfile);

module.exports = router;
