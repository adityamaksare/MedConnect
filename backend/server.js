const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

// Import Routes
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Log environment for debugging
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`MongoDB URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 25) + '...' : 'Not set'}`);

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:3001',
    // Allow all IP addresses with these ports
    /^http:\/\/\d+\.\d+\.\d+\.\d+:3000$/,
    /^http:\/\/\d+\.\d+\.\d+\.\d+:3001$/,
    /^http:\/\/\d+\.\d+\.\d+\.\d+:5000$/,
    // Add production URLs - update these with your actual deployed frontend URL
    'https://doctor-appointment-frontend.onrender.com',
    'https://medconnect.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// For production - Serve frontend build if in production
if (process.env.NODE_ENV === 'production') {
  // Home route
  app.get('/', (req, res) => {
    res.json({ message: 'Doctor Appointment API is running' });
  });
} else {
  // Home route
  app.get('/', (req, res) => {
    res.json({ message: 'Doctor Appointment API is running' });
  });
}

// Test MongoDB connection route
app.get('/api/test-db', (req, res) => {
  res.json({ message: 'MongoDB connection is working' });
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