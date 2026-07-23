const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  parameters: {
    type: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        description: { type: String }
      }
    ],
    default: [
      { id: 'ownership', label: 'Ownership', description: 'Takes accountability and drives results independently.' },
      { id: 'communication', label: 'Communication', description: 'Clear, concise, and proactive.' },
      { id: 'quality_of_work', label: 'Quality of Work', description: 'Delivers thorough, reliable, and high-standard work.' },
      { id: 'teamwork', label: 'Teamwork & Collaboration', description: 'Supports peers and fosters a collaborative environment.' },
      { id: 'problem_solving', label: 'Problem Solving', description: 'Approaches challenges analytically.' }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);