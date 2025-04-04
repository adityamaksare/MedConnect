const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const mongoose = require('mongoose');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login attempt'
    });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, isDoctor, phoneNumber } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    console.log(`Checking if user exists with email: ${email}`);
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log(`User already exists with email: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    console.log(`Creating new user with email: ${email}`);
    
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password,
      isDoctor: isDoctor || false,
      phoneNumber: phoneNumber || '',
    });
    
    // Use a session to ensure atomicity of the operation
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      
      // Save the user with transaction
      const user = await newUser.save({ session });
      console.log(`User saved in transaction: ${user._id}`);
      
      // Commit the transaction
      await session.commitTransaction();
      console.log('Transaction committed successfully');
      
      // Verify the user was created outside the transaction
      console.log(`Verifying user creation for: ${email}`);
      const createdUser = await User.findOne({ email }).lean();
      
      if (!createdUser) {
        console.error(`Failed to verify user creation for: ${email}`);
        return res.status(500).json({
          success: false,
          message: 'User creation failed verification'
        });
      }
      
      console.log(`User successfully created and verified: ${email}`);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error('Transaction error:', error);
      await session.abortTransaction();
      return res.status(500).json({
        success: false,
        message: error.message || 'Server Error'
      });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isDoctor: user.isDoctor,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isDoctor: updatedUser.isDoctor,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
}; 