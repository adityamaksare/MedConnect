const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

// Sample doctors data with complete profiles and login credentials
const doctors = [
  // Cardiologists
  {
    userDetails: {
      name: 'Dr. Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      password: 'doctor123',
      phoneNumber: '9876543201',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Cardiology',
      experience: 15,
      fees: 1800,
      phone: '9876543201',
      address: 'Sharma Heart Clinic, 123 Gandhi Road, Mumbai',
      bio: 'Senior cardiologist with expertise in interventional cardiology and cardiac electrophysiology',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 42
    }
  },
  {
    userDetails: {
      name: 'Dr. Sunil Verma',
      email: 'sunil.verma@example.com',
      password: 'doctor123',
      phoneNumber: '9876543202',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Cardiology',
      experience: 12,
      fees: 1600,
      phone: '9876543202',
      address: 'Verma Cardiac Center, 456 Patel Street, Delhi',
      bio: 'Cardiologist specializing in non-invasive cardiology and cardiac imaging',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.7,
      numReviews: 36
    }
  },
  
  // Dermatologists
  {
    userDetails: {
      name: 'Dr. Priya Patel',
      email: 'priya.patel@example.com',
      password: 'doctor123',
      phoneNumber: '9876543203',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Dermatology',
      experience: 10,
      fees: 1400,
      phone: '9876543203',
      address: 'Patel Skin Care, 789 Nehru Avenue, Bangalore',
      bio: 'Dermatologist with specialization in cosmetic dermatology and skin rejuvenation',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:30', '17:30'],
      rating: 4.8,
      numReviews: 32
    }
  },
  {
    userDetails: {
      name: 'Dr. Neha Gupta',
      email: 'neha.gupta@example.com',
      password: 'doctor123',
      phoneNumber: '9876543204',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Dermatology',
      experience: 8,
      fees: 1300,
      phone: '9876543204',
      address: 'Gupta Dermatology Center, 234 Tagore Lane, Chennai',
      bio: 'Expert in clinical dermatology and pediatric skin conditions',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['10:00', '18:00'],
      rating: 4.6,
      numReviews: 28
    }
  },
  
  // Orthopedics
  {
    userDetails: {
      name: 'Dr. Vikram Singh',
      email: 'vikram.singh@example.com',
      password: 'doctor123',
      phoneNumber: '9876543205',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Orthopedics',
      experience: 16,
      fees: 2000,
      phone: '9876543205',
      address: 'Singh Bone & Joint Hospital, 567 Ambedkar Road, Hyderabad',
      bio: 'Orthopedic surgeon specializing in joint replacement surgery and sports injuries',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 45
    }
  },
  {
    userDetails: {
      name: 'Dr. Rahul Mehta',
      email: 'rahul.mehta@example.com',
      password: 'doctor123',
      phoneNumber: '9876543206',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Orthopedics',
      experience: 12,
      fees: 1800,
      phone: '9876543206',
      address: 'Mehta Orthopedic Center, 890 Bose Street, Kolkata',
      bio: 'Specialist in spine surgery and orthopaedic trauma',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 38
    }
  },
  
  // Pediatrics
  {
    userDetails: {
      name: 'Dr. Anjali Desai',
      email: 'anjali.desai@example.com',
      password: 'doctor123',
      phoneNumber: '9876543207',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Pediatrics',
      experience: 14,
      fees: 1500,
      phone: '9876543207',
      address: 'Desai Children\'s Clinic, 345 Rajput Plaza, Ahmedabad',
      bio: 'Experienced pediatrician with focus on newborn care and developmental pediatrics',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 52
    }
  },
  {
    userDetails: {
      name: 'Dr. Sanjay Kumar',
      email: 'sanjay.kumar@example.com',
      password: 'doctor123',
      phoneNumber: '9876543208',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Pediatrics',
      experience: 10,
      fees: 1400,
      phone: '9876543208',
      address: 'Kumar Pediatric Hospital, 678 Indira Nagar, Pune',
      bio: 'Pediatrician specializing in adolescent medicine and pediatric allergies',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['10:00', '18:00'],
      rating: 4.7,
      numReviews: 40
    }
  },
  
  // Gynecology
  {
    userDetails: {
      name: 'Dr. Meenakshi Joshi',
      email: 'meenakshi.joshi@example.com',
      password: 'doctor123',
      phoneNumber: '9876543209',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Gynecology',
      experience: 18,
      fees: 1900,
      phone: '9876543209',
      bio: 'Senior gynecologist with expertise in gynecological surgery and infertility treatments',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 60
    }
  },
  {
    userDetails: {
      name: 'Dr. Deepa Mishra',
      email: 'deepa.mishra@example.com',
      password: 'doctor123',
      phoneNumber: '9876543210',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Gynecology',
      experience: 12,
      fees: 1600,
      phone: '9876543210',
      bio: 'Specializes in obstetrics and high-risk pregnancies',
      availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 48
    }
  },
  
  // Neurology
  {
    userDetails: {
      name: 'Dr. Amit Agarwal',
      email: 'amit.agarwal@example.com',
      password: 'doctor123',
      phoneNumber: '9876543211',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Neurology',
      experience: 15,
      fees: 2000,
      phone: '9876543211',
      bio: 'Neurologist specializing in epilepsy, stroke management, and neuro-immunology',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.8,
      numReviews: 42
    }
  },
  {
    userDetails: {
      name: 'Dr. Rohan Kapoor',
      email: 'rohan.kapoor@example.com',
      password: 'doctor123',
      phoneNumber: '9876543212',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Neurology',
      experience: 14,
      fees: 1900,
      phone: '9876543212',
      bio: 'Expert in headache disorders, movement disorders, and neuromuscular diseases',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.7,
      numReviews: 36
    }
  },
  
  // Ophthalmology
  {
    userDetails: {
      name: 'Dr. Kavita Reddy',
      email: 'kavita.reddy@example.com',
      password: 'doctor123',
      phoneNumber: '9876543213',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Ophthalmology',
      experience: 16,
      fees: 1800,
      phone: '9876543213',
      bio: 'Eye specialist with expertise in cataract surgery and refractive procedures',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:30', '17:30'],
      rating: 4.9,
      numReviews: 50
    }
  },
  {
    userDetails: {
      name: 'Dr. Vivek Malhotra',
      email: 'vivek.malhotra@example.com',
      password: 'doctor123',
      phoneNumber: '9876543214',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Ophthalmology',
      experience: 12,
      fees: 1600,
      phone: '9876543214',
      bio: 'Specializes in glaucoma management and corneal disorders',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 44
    }
  },
  
  // ENT
  {
    userDetails: {
      name: 'Dr. Sunita Sharma',
      email: 'sunita.sharma@example.com',
      password: 'doctor123',
      phoneNumber: '9876543215',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'ENT',
      experience: 14,
      fees: 1700,
      phone: '9876543215',
      bio: 'ENT specialist with focus on sinus disorders and sleep apnea',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.8,
      numReviews: 46
    }
  },
  {
    userDetails: {
      name: 'Dr. Rakesh Sood',
      email: 'rakesh.sood@example.com',
      password: 'doctor123',
      phoneNumber: '9876543216',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'ENT',
      experience: 10,
      fees: 1500,
      phone: '9876543216',
      bio: 'Expert in ear surgeries and pediatric ENT conditions',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.7,
      numReviews: 38
    }
  },
  
  // Psychiatry
  {
    userDetails: {
      name: 'Dr. Arjun Khanna',
      email: 'arjun.khanna@example.com',
      password: 'doctor123',
      phoneNumber: '9876543217',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Psychiatry',
      experience: 15,
      fees: 1900,
      phone: '9876543217',
      bio: 'Psychiatrist specializing in mood disorders and cognitive behavioral therapy',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 42
    }
  },
  {
    userDetails: {
      name: 'Dr. Nisha Rawal',
      email: 'nisha.rawal@example.com',
      password: 'doctor123',
      phoneNumber: '9876543218',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Psychiatry',
      experience: 12,
      fees: 1700,
      phone: '9876543218',
      bio: 'Child and adolescent psychiatrist with expertise in anxiety disorders',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 36
    }
  },
  
  // Endocrinology
  {
    userDetails: {
      name: 'Dr. Prakash Iyer',
      email: 'prakash.iyer@example.com',
      password: 'doctor123',
      phoneNumber: '9876543219',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Endocrinology',
      experience: 16,
      fees: 2000,
      phone: '9876543219',
      bio: 'Endocrinologist specializing in diabetes management and thyroid disorders',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 48
    }
  },
  {
    userDetails: {
      name: 'Dr. Swati Banerjee',
      email: 'swati.banerjee@example.com',
      password: 'doctor123',
      phoneNumber: '9876543220',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Endocrinology',
      experience: 14,
      fees: 1800,
      phone: '9876543220',
      bio: 'Expert in metabolic disorders and reproductive endocrinology',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 40
    }
  },
  
  // Gastroenterology
  {
    userDetails: {
      name: 'Dr. Rajiv Chatterjee',
      email: 'rajiv.chatterjee@example.com',
      password: 'doctor123',
      phoneNumber: '9876543221',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Gastroenterology',
      experience: 18,
      fees: 2100,
      phone: '9876543221',
      bio: 'Senior gastroenterologist with expertise in advanced endoscopy and IBD management',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 52
    }
  },
  {
    userDetails: {
      name: 'Dr. Anand Krishnan',
      email: 'anand.krishnan@example.com',
      password: 'doctor123',
      phoneNumber: '9876543222',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Gastroenterology',
      experience: 14,
      fees: 1900,
      phone: '9876543222',
      bio: 'Specializes in liver diseases and therapeutic endoscopy',
      availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 44
    }
  },
  
  // Urology
  {
    userDetails: {
      name: 'Dr. Mohan Venkatesh',
      email: 'mohan.venkatesh@example.com',
      password: 'doctor123',
      phoneNumber: '9876543223',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Urology',
      experience: 16,
      fees: 2000,
      phone: '9876543223',
      bio: 'Urologist with expertise in minimally invasive urological surgeries',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 46
    }
  },
  {
    userDetails: {
      name: 'Dr. Kishore Nayak',
      email: 'kishore.nayak@example.com',
      password: 'doctor123',
      phoneNumber: '9876543224',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Urology',
      experience: 12,
      fees: 1800,
      phone: '9876543224',
      bio: 'Specializes in urological oncology and kidney stone management',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.7,
      numReviews: 38
    }
  },
  
  // Pulmonology
  {
    userDetails: {
      name: 'Dr. Alok Singhania',
      email: 'alok.singhania@example.com',
      password: 'doctor123',
      phoneNumber: '9876543225',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Pulmonology',
      experience: 15,
      fees: 1900,
      phone: '9876543225',
      bio: 'Pulmonologist specializing in respiratory infections and COPD management',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.8,
      numReviews: 42
    }
  },
  {
    userDetails: {
      name: 'Dr. Divya Mathur',
      email: 'divya.mathur@example.com',
      password: 'doctor123',
      phoneNumber: '9876543226',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Pulmonology',
      experience: 10,
      fees: 1600,
      phone: '9876543226',
      bio: 'Expert in sleep disorders and interventional pulmonology',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timings: ['10:00', '18:00'],
      rating: 4.7,
      numReviews: 36
    }
  },
  
  // Nephrology
  {
    userDetails: {
      name: 'Dr. Ramesh Trivedi',
      email: 'ramesh.trivedi@example.com',
      password: 'doctor123',
      phoneNumber: '9876543227',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Nephrology',
      experience: 18,
      fees: 2100,
      phone: '9876543227',
      bio: 'Senior nephrologist specializing in kidney transplantation and dialysis',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 50
    }
  },
  {
    userDetails: {
      name: 'Dr. Seema Thakur',
      email: 'seema.thakur@example.com',
      password: 'doctor123',
      phoneNumber: '9876543228',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'Nephrology',
      experience: 14,
      fees: 1900,
      phone: '9876543228',
      bio: 'Specializes in glomerular diseases and hypertension management',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 42
    }
  },
  
  // General Medicine
  {
    userDetails: {
      name: 'Dr. Vinay Kulkarni',
      email: 'vinay.kulkarni@example.com',
      password: 'doctor123',
      phoneNumber: '9876543229',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'General Medicine',
      experience: 20,
      fees: 1500,
      phone: '9876543229',
      bio: 'Experienced physician with holistic approach to healthcare',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timings: ['09:00', '17:00'],
      rating: 4.9,
      numReviews: 60
    }
  },
  {
    userDetails: {
      name: 'Dr. Shalini Varma',
      email: 'shalini.varma@example.com',
      password: 'doctor123',
      phoneNumber: '9876543230',
      isDoctor: true,
    },
    doctorDetails: {
      specialization: 'General Medicine',
      experience: 15,
      fees: 1300,
      phone: '9876543230',
      bio: 'Focuses on preventive care and chronic disease management',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      timings: ['10:00', '18:00'],
      rating: 4.8,
      numReviews: 52
    }
  }
];

// Sample patients data with login credentials
const patients = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'patient123',
    phoneNumber: '9876543220',
    isDoctor: false,
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'patient123',
    phoneNumber: '9876543221',
    isDoctor: false,
  },
  {
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    password: 'patient123',
    phoneNumber: '9876543222',
    isDoctor: false,
  },
  {
    name: 'Mary Williams',
    email: 'mary.williams@example.com',
    password: 'patient123',
    phoneNumber: '9876543223',
    isDoctor: false,
  }
];

// Admin user data
const admin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  phoneNumber: '9876543299',
  isDoctor: false,
  isAdmin: true,
};

// Seed data function
const seedData = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Clear existing data (optional, uncomment if needed)
    console.log('Clearing existing data...');
    await Doctor.deleteMany({});
    await User.deleteMany({});
    console.log('Existing data cleared');
    
    // Create admin account
    console.log('\nCreating admin account...');
    const adminUser = await User.create(admin);
    console.log(`Admin created: ${adminUser.name} (${adminUser.email})`);
    
    // Create patient accounts
    console.log('\nCreating patient accounts...');
    const createdPatients = [];
    
    for (const patient of patients) {
      const newPatient = await User.create(patient);
      createdPatients.push(newPatient);
      console.log(`Patient created: ${newPatient.name} (${newPatient.email})`);
    }
    
    // Create doctor accounts and profiles
    console.log('\nCreating doctor accounts and profiles...');
    const createdDoctors = [];
    
    for (const doctor of doctors) {
      // First create the user account
      const doctorUser = await User.create(doctor.userDetails);
      console.log(`Doctor user created: ${doctorUser.name} (${doctorUser.email})`);
      
      // Then create the doctor profile and link it to the user
      const doctorProfile = await Doctor.create({
        user: doctorUser._id,
        name: doctorUser.name,
        ...doctor.doctorDetails
      });
      
      createdDoctors.push({ user: doctorUser, profile: doctorProfile });
      console.log(`Doctor profile created: ${doctorProfile.name} (${doctorProfile.specialization})`);
    }
    
    // Print summary
    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log(`- Admin: 1`);
    console.log(`- Patients: ${createdPatients.length}`);
    console.log(`- Doctors: ${createdDoctors.length}`);
    
    // Print login credentials
    console.log('\n=== LOGIN CREDENTIALS ===');
    
    console.log('\n--- ADMIN ---');
    console.log(`Email: ${admin.email} | Password: ${admin.password}`);
    
    console.log('\n--- PATIENTS ---');
    patients.forEach(p => {
      console.log(`${p.name} | Email: ${p.email} | Password: ${p.password}`);
    });
    
    console.log('\n--- DOCTORS ---');
    doctors.forEach(d => {
      console.log(`${d.userDetails.name} (${d.doctorDetails.specialization}) | Email: ${d.userDetails.email} | Password: ${d.userDetails.password}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
    process.exit(1);
  }
};

// Run the seeding function
seedData(); 