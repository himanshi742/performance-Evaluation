const User = require('../models/User');
const FeedbackSubmission = require('../models/FeedbackSubmission');
const FeedbackCycle = require('../models/FeedbackCycle');

exports.getPendingSubmissions = async (req, res) => {
  try {
    // The companyId is securely pulled from the JWT token via our auth middleware
    const companyId = req.user.companyId;

    // 1. Find the currently active feedback cycle
    const cycle = await FeedbackCycle.findOne({ companyId, status: 'ACTIVE' });
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'No active cycle found.' });
    }

    // 2. Fetch all users for the company
    const allUsers = await User.find({ companyId }).lean();
    
    // Group direct reports by their manager's ID
    const managerMap = new Map();
    const directReports = {};

    allUsers.forEach(user => {
      managerMap.set(user._id.toString(), user);
      if (user.managerId) {
        const mId = user.managerId.toString();
        if (!directReports[mId]) directReports[mId] = [];
        directReports[mId].push(user);
      }
    });

    // 3. Fetch all completed submissions for this cycle
    const submissions = await FeedbackSubmission.find({ companyId, cycleId: cycle._id });
    
    // Create a fast lookup Set of "ReviewerID_RevieweeID" strings
    const submittedSet = new Set(submissions.map(s => `${s.reviewerId.toString()}_${s.revieweeId.toString()}`));

    // 4. Build the final audit report
    const auditReport = [];
    for (const [mId, reports] of Object.entries(directReports)) {
      const manager = managerMap.get(mId);
      if (!manager) continue;

      // Filter out reports that do NOT exist in the submitted set
      const pending = reports.filter(r => !submittedSet.has(`${mId}_${r._id.toString()}`));

      auditReport.push({
        id: manager._id,
        name: manager.name,
        department: manager.department || 'General',
        totalReports: reports.length,
        completedReviews: reports.length - pending.length,
        pendingReports: pending.map(p => p.name),
        status: pending.length === 0 ? 'COMPLETE' : 'INCOMPLETE'
      });
    }

    res.json({ success: true, cycleTitle: cycle.title, managers: auditReport });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};