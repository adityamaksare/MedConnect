const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
} = require('../controllers/doctorController');
const { protect, admin, doctor } = require('../middleware/authMiddleware');

// @route   GET /api/doctors
router.route('/').get(getDoctors).post(protect, admin, createDoctorProfile);

// @route   GET & PUT /api/doctors/:id
router
  .route('/:id')
  .get(getDoctorById)
  .put(protect, updateDoctorProfile);

module.exports = router; 