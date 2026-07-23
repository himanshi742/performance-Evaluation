const express = require('express');
const router = express.Router();
const { getTeamStatus, submitFeedback } = require('../controllers/managerController');
const { protect } = require('../middleware/auth');

// GET /api/manager/team-status
router.get('/team-status', protect, getTeamStatus);

// POST /api/manager/submit-feedback
router.post('/submit-feedback', protect, submitFeedback);

module.exports = router;