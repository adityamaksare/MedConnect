const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  const { doctor, appointmentDate, timeSlot, reason, paymentMethod, isPaid } = req.body;

  // Verify doctor exists
  const doctorExists = await Doctor.findById(doctor);
  if (!doctorExists) {
    res.status(400);
    throw new Error('Doctor not found');
  }

  // Create appointment with payment information
  const appointment = await Appointment.create({
    doctor,
    user: req.user._id,
    appointmentDate,
    timeSlot,
    reason,
    paymentMethod: paymentMethod || 'card',
    isPaid: isPaid || false,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctor',
        select: 'name specialization fees phone email user',
        populate: {
          path: 'user',
          select: 'name email phoneNumber'
        }
      })
      .populate('user', 'name email phoneNumber');

    if (appointment) {
      // Check if logged in user is either the patient or the doctor for this appointment
      const isPatient = appointment.user && appointment.user._id.equals(req.user._id);
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      const isDoctor = doctorProfile && appointment.doctor && 
                      doctorProfile._id.equals(appointment.doctor._id);

      if (!isPatient && !isDoctor && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to view this appointment');
      }

      res.json({
        success: true,
        data: appointment
      });
    } else {
      res.status(404);
      throw new Error('Appointment not found');
    }
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
const getUserAppointments = async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate('doctor', 'name specialization fees')
    .sort('-createdAt');

  res.json(appointments);
};

// @desc    Get all appointments for a doctor
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  // Get doctor profile based on user ID
  const doctorProfile = await Doctor.findOne({ user: req.user._id });

  if (!doctorProfile) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  // Get all appointments for this doctor
  const appointments = await Appointment.find({ doctor: doctorProfile._id })
    .populate('user', 'name email')
    .sort('-appointmentDate');

  res.json(appointments);
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  const { status, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if logged in user is the doctor for this appointment
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    
    if (!doctorProfile || !doctorProfile._id.equals(appointment.doctor)) {
      res.status(401);
      throw new Error('Not authorized to update this appointment');
    }

    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if logged in user is the patient who made this appointment
    if (!appointment.user.equals(req.user._id)) {
      res.status(401);
      throw new Error('Not authorized to cancel this appointment');
    }

    // Only allow cancellation if status is pending or confirmed
    if (appointment.status === 'completed') {
      res.status(400);
      throw new Error('Cannot cancel a completed appointment');
    }

    appointment.status = 'cancelled';
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
};

module.exports = {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById,
}; 