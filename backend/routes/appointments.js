const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById,
} = require('../controllers/appointmentController');
const { protect, doctor } = require('../middleware/authMiddleware');

// @route   GET /api/appointments/test
router.route('/test').get((req, res) => {
  res.json({
    message: 'Appointments API is working',
    timestamp: new Date().toISOString(),
    endpoint: '/api/appointments/test'
  });
});

// @route   POST & GET /api/appointments
router
  .route('/')
  .post(protect, createAppointment)
  .get(protect, getUserAppointments);

// @route   GET /api/appointments/doctor
router.route('/doctor').get(protect, doctor, getDoctorAppointments);

// @route   PUT /api/appointments/:id
router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, doctor, updateAppointmentStatus);

// @route   PUT /api/appointments/:id/cancel
router.route('/:id/cancel').put(protect, cancelAppointment);

module.exports = router; 