const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import Routes
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

// Load environment variables
dotenv.config();

// Log environment variables (without sensitive info)
console.log('==== ENVIRONMENT SETUP ====');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`PORT: ${process.env.PORT || 'not set'}`);
console.log(`MONGO_URI set: ${process.env.MONGO_URI ? 'Yes' : 'No'}`);
console.log(`JWT_SECRET set: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
console.log(`JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN || 'not set'}`);
console.log('==========================');

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
connectDB()
  .then(conn => {
    if (conn) {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`Database Name: ${conn.connection.name}`);
      console.log(`Connection State: ${conn.connection.readyState}`);
    }
  })
  .catch(err => {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error(err);
  });

// Create Express app
const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware - Simplified CORS configuration to debug the issue
app.use(cors({
  origin: '*', // Allow all origins temporarily for troubleshooting
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debug route - always accessible
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint is working',
    timestamp: new Date().toISOString(),
    envMode: process.env.NODE_ENV || 'development',
    headers: req.headers,
    env: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      hasMongoUri: !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Simple health check that doesn't need database access
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Doctor Appointment API is running',
    timestamp: new Date().toISOString(),
    apiEndpoints: {
      test: '/api/test',
      debug: '/api/debug',
      users: '/api/users',
      doctors: '/api/doctors',
      appointments: '/api/appointments'
    }
  });
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Redirect singular doctor endpoint to plural form
app.get('/api/doctor', (req, res) => {
  console.log('Redirecting from singular /api/doctor to plural /api/doctors');
  res.redirect('/api/doctors' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''));
});

// Redirect singular user endpoint to plural form
app.get('/api/user', (req, res) => {
  console.log('Redirecting from singular /api/user to plural /api/users');
  res.redirect('/api/users' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''));
});

// Redirect singular appointment endpoint to plural form
app.get('/api/appointment', (req, res) => {
  console.log('Redirecting from singular /api/appointment to plural /api/appointments');
  res.redirect('/api/appointments' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''));
});

// Test MongoDB connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      res.json({
        message: 'MongoDB connection is working',
        readyState: mongoose.connection.readyState,
        dbName: mongoose.connection.name
      });
    } else {
      res.status(500).json({
        message: 'MongoDB not connected',
        readyState: mongoose.connection.readyState,
        error: 'Database connection not established'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error testing MongoDB connection',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access your API at http://localhost:${PORT}`);
}); 