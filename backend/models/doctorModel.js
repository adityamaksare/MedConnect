const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    fees: {
      type: Number,
      required: true,
      default: 500,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      default: 'MedConnect Medical Center, New Delhi',
    },
    timings: {
      type: Array,
      default: ['9:00 AM', '6:00 PM'],
    },
    availableDays: {
      type: Array,
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
      default: '/images/doctor.jpg',
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
doctorSchema.index({ specialization: 1 }); // For filtering by specialization
doctorSchema.index({ fees: 1 }); // For sorting by fees
doctorSchema.index({ experience: -1 }); // For sorting by experience (descending)
doctorSchema.index({ name: 'text' }); // For text search on doctor name

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor; 