const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['EMPLOYEE', 'MANAGER', 'HR_ADMIN', 'FOUNDER'], 
    default: 'EMPLOYEE' 
  },
  designation: { type: String },
  department: { type: String },
  // This points to another User document. It will be null for top-level leaders (Founder/COO).
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);