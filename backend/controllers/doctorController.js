const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { specialization, search, limit = 20 } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add specialization filter if provided
    if (specialization) {
      filter.specialization = specialization;
    }
    
    // Add search filter if provided
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    // Log the filter to help with debugging
    console.log('Doctor filter:', filter);
    
    // Execute query with filters
    const doctors = await Doctor.find(filter)
      .populate('user', 'name email')
      .limit(parseInt(limit));
      
    console.log(`Found ${doctors.length} doctors matching criteria`);
    
    res.json(doctors);
  } catch (error) {
    console.error('Error in getDoctors:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server Error' 
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    console.log('Fetching doctor with ID:', req.params.id);
    
    const doctor = await Doctor.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (doctor) {
      console.log('Doctor found:', doctor.name);
      res.json(doctor);
    } else {
      console.log('No doctor found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching doctor'
    });
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctorProfile = async (req, res) => {
  const {
    name,
    specialization,
    experience,
    fees,
    phone,
    timings,
    availableDays,
    bio,
    image,
  } = req.body;

  // Create doctor user
  const user = await User.create({
    name,
    email: req.body.email,
    password: req.body.password,
    isDoctor: true,
  });

  if (user) {
    // Create doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      name,
      specialization,
      experience,
      fees,
      phone,
      timings,
      availableDays,
      bio,
      image,
    });

    if (doctor) {
      res.status(201).json(doctor);
    } else {
      res.status(400);
      throw new Error('Invalid doctor data');
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Admin/Doctor
const updateDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    doctor.name = req.body.name || doctor.name;
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.experience = req.body.experience || doctor.experience;
    doctor.fees = req.body.fees || doctor.fees;
    doctor.phone = req.body.phone || doctor.phone;
    doctor.timings = req.body.timings || doctor.timings;
    doctor.availableDays = req.body.availableDays || doctor.availableDays;
    doctor.bio = req.body.bio || doctor.bio;
    doctor.image = req.body.image || doctor.image;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
}; 