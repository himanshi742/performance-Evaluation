const User = require('../models/User');
const FeedbackSubmission = require('../models/FeedbackSubmission');
const FeedbackCycle = require('../models/FeedbackCycle');
const Company = require('../models/Company');

// 1. Get direct reports and their review status for the active cycle
exports.getTeamStatus = async (req, res) => {
  try {
    const managerId = req.user.id;
    const companyId = req.user.companyId;

    // Find active cycle
    const cycle = await FeedbackCycle.findOne({ companyId, status: 'ACTIVE' });
    if (!cycle) return res.status(404).json({ success: false, message: 'No active cycle found.' });

    // Find direct reports
    const reports = await User.find({ managerId, companyId }).select('name designation');

    // Find existing submissions for these reports in this cycle
    const submissions = await FeedbackSubmission.find({
      reviewerId: managerId,
      cycleId: cycle._id
    }).select('revieweeId');

    const submittedIds = new Set(submissions.map(sub => sub.revieweeId.toString()));

    // Combine data to tell the frontend who is pending vs submitted
    const teamStatus = reports.map(report => ({
      id: report._id,
      name: report.name,
      designation: report.designation || 'Employee',
      status: submittedIds.has(report._id.toString()) ? 'SUBMITTED' : 'PENDING'
    }));

    // Fetch the fixed parameters from the company settings to dynamically build the form
    const company = await Company.findById(companyId).select('parameters');

    res.json({ success: true, cycleTitle: cycle.title, team: teamStatus, parameters: company.parameters });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// 2. Submit the 5-parameter feedback form
exports.submitFeedback = async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const companyId = req.user.companyId;
    const { revieweeId, ratings } = req.body;

    const cycle = await FeedbackCycle.findOne({ companyId, status: 'ACTIVE' });
    if (!cycle) return res.status(400).json({ success: false, message: 'No active cycle to submit feedback.' });

    // Verify it isn't already submitted to prevent duplicates
    const existing = await FeedbackSubmission.findOne({ reviewerId, revieweeId, cycleId: cycle._id });
    if (existing) return res.status(400).json({ success: false, message: 'Feedback already submitted for this user this cycle.' });

    // Create the submission
    const submission = await FeedbackSubmission.create({
      companyId,
      cycleId: cycle._id,
      reviewerId,
      revieweeId,
      ratings,
      status: 'SUBMITTED',
      submittedAt: new Date()
    });

    res.status(201).json({ success: true, message: 'Feedback submitted successfully.', submission });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};