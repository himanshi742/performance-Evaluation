const mongoose = require('mongoose');

const ParameterScoreSchema = new mongoose.Schema({
  parameterId: { type: String, required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  reason: { type: String, required: true, minlength: 5 }
}, { _id: false });

const FeedbackSubmissionSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  cycleId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeedbackCycle', required: true, index: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: {
    type: [ParameterScoreSchema],
    validate: [arr => arr.length === 5, 'Feedback must cover all 5 parameters.']
  },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED'], default: 'DRAFT' },
  submittedAt: { type: Date }
}, { timestamps: true });

// Prevents a manager from submitting duplicate evaluations for the same employee in the same cycle
FeedbackSubmissionSchema.index({ cycleId: 1, reviewerId: 1, revieweeId: 1 }, { unique: true });

module.exports = mongoose.model('FeedbackSubmission', FeedbackSubmissionSchema);