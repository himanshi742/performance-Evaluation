const express = require('express');
const router = express.Router();
const { getMyFeedbackHistory } = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

// GET /api/employee/my-history
router.get('/my-history', protect, getMyFeedbackHistory);

module.exports = router;