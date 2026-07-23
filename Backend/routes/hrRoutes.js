const express = require('express');
const router = express.Router();
const { getPendingSubmissions } = require('../controllers/hrController');
const { protect } = require('../middleware/auth');

// GET /api/hr/pending-track
router.get('/pending-track', protect, getPendingSubmissions);

module.exports = router;