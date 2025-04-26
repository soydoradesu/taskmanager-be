const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendErrorResponse } = require('../utils/errorHandler');

// User Registration
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendErrorResponse(res, 400, 'Username and password are required');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendErrorResponse(res, 400, 'Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    return res.status(201).json({ token });
  } catch (error) {
    return sendErrorResponse(res, 500, 'Error registering user');
  }
};

// User Login
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

module.exports = { registerUser, loginUser };
