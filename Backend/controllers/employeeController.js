const FeedbackSubmission = require('../models/FeedbackSubmission');

exports.getMyFeedbackHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all submissions where this user is the reviewee
    // Populate the cycle (to get the month/year) and reviewer (to get manager's name)
    const submissions = await FeedbackSubmission.find({ revieweeId: userId })
      .populate('cycleId', 'title month year')
      .populate('reviewerId', 'name')
      // Sort by year and month ascending so the chart flows left-to-right chronologically
      .sort({ 'cycleId.year': 1, 'cycleId.month': 1 });

    const history = submissions.map(sub => ({
      cycleTitle: sub.cycleId.title,
      managerName: sub.reviewerId.name,
      date: sub.submittedAt,
      ratings: sub.ratings
    }));

    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};