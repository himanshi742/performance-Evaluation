// controllers/authController.js
const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists and populate their company details
    const user = await User.findOne({ email }).populate('companyId', 'name');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: user.companyId._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Send response (matches what our React frontend expects)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyId.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};