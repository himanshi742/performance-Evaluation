const mongoose = require('mongoose');

const FeedbackCycleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  title: { type: String, required: true }, // e.g., "July 2026"
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'CLOSED'], default: 'ACTIVE' },
  dueDate: { type: Date, required: true }
}, { timestamps: true });

// Ensures a company can only have one cycle per specific month/year
FeedbackCycleSchema.index({ companyId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('FeedbackCycle', FeedbackCycleSchema);