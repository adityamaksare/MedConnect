const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Set global mongoose options
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Longer timeout for selection
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000, // Longer connect timeout
      writeConcern: {
        w: 'majority',
        journal: true,
        wtimeoutMS: 10000
      },
      retryWrites: true, // Enable retry for write operations
      retryReads: true,  // Enable retry for read operations
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState}`);
    
    // Set up connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected, attempting to reconnect...');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error}`);
    
    // Don't exit process in production to allow reconnect attempts
    if (process.env.NODE_ENV === 'production') {
      console.log('Connection failed, will retry automatically...');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB; 