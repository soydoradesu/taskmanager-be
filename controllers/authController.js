const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendErrorResponse } = require('../utils/errorHandler');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return sendErrorResponse(res, 400, 'User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return sendErrorResponse(res, 400, 'Invalid password');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (error) {
    return sendErrorResponse(res, 500, 'Server error');
  }
};

module.exports = { loginUser };
