const express = require('express');
const router = express.Router();
const { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// @route   GET /api/users/test-connection
router.get('/test-connection', (req, res) => {
  res.json({ message: 'Backend connection successful', timestamp: new Date().toISOString() });
});

// @route   GET /api/users/verify-db
router.get('/verify-db', async (req, res) => {
  try {
    // Check if database is accessible
    const count = await User.countDocuments();
    const lastUser = await User.findOne().sort({ createdAt: -1 }).select('email createdAt -_id');
    
    res.json({ 
      success: true, 
      message: 'MongoDB connection verified', 
      userCount: count,
      lastRegistered: lastUser ? {
        email: lastUser.email,
        createdAt: lastUser.createdAt,
        timeSinceCreation: new Date() - lastUser.createdAt + ' ms'
      } : null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify MongoDB connection',
      error: error.message
    });
  }
});

// @route   POST /api/users/login
router.post('/login', authUser);

// @route   POST /api/users
router.post('/', registerUser);

// @route   GET & PUT /api/users/profile
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router; 