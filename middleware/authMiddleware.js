const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/errorHandler');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return sendErrorResponse(res, 401, 'Access denied. No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return sendErrorResponse(res, 400, 'Invalid token');
  }
};

module.exports = authMiddleware;
