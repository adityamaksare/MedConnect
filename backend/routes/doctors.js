const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
} = require('../controllers/doctorController');
const { protect, admin, doctor } = require('../middleware/authMiddleware');

// Test endpoint that doesn't require database access
router.get('/test', (req, res) => {
  console.log('Doctor test endpoint hit');
  res.json({
    message: 'Doctor test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/doctors
router.route('/').get(getDoctors).post(protect, admin, createDoctorProfile);

// @route   GET & PUT /api/doctors/:id
router
  .route('/:id')
  .get(getDoctorById)
  .put(protect, updateDoctorProfile);

module.exports = router; 