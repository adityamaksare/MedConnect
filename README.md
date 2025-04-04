# Doctor Appointment System

A full-stack web application for managing doctor appointments, built with the MERN stack.

## Author
Aditya Maksare

## Technologies Used

- **Frontend**
  - React.js
  - React Bootstrap
  - React Router DOM
  - Axios
  - Framer Motion (for animations)
  - React Icons

- **Backend**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JWT Authentication
  - Bcrypt.js (for password hashing)

- **Development Tools**
  - npm
  - nodemon
  - concurrently

## Features

- User authentication and authorization (JWT)
- Patient and doctor role-based access control
- Doctor profile creation and management
- Search and filter doctors by specialization
- Appointment scheduling and management
- Payment processing simulation
- Reviews and ratings for doctors
- Responsive design for mobile and desktop

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd doctor-appointment-system
```

### 2. Install dependencies

```bash
npm run install-all
```

This will install dependencies for the root project, backend, and frontend.

### 3. Environment Setup

Create a `.env` file in the backend directory with the following variables:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Seed the database

To populate the database with sample data:

```bash
cd backend && npm run seed-data
```

This will create admin, doctor, and patient accounts with test credentials.

> **Important**: When uploading to GitHub, make sure to include the `seedData.js` file located in `backend/utils/` directory. This file contains all the sample data used to initialize the database with doctors, patients, and admin accounts.

### 5. Start the application

```bash
npm start
```

This will concurrently start both the backend server (port 5001) and the frontend development server (port 3000).

## Account Credentials

### Admin Account

- Email: admin@example.com
- Password: admin123

### Doctor Accounts

The database is seeded with 30 doctors across 15 specialties:
- Cardiology, Dermatology, Orthopedics, Pediatrics, Gynecology
- Neurology, Ophthalmology, ENT, Psychiatry, Endocrinology
- Gastroenterology, Urology, Pulmonology, Nephrology, General Medicine

All doctor accounts have the same password:
- Password: doctor123

### Sample Doctors:

1. **Dr. Rajesh Sharma (Cardiologist)**
   - Email: rajesh.sharma@example.com
   - Specialization: Cardiology
   - Experience: 15 years
   - Fees: ₹1800

2. **Dr. Priya Patel (Dermatologist)**
   - Email: priya.patel@example.com
   - Specialization: Dermatology
   - Experience: 10 years
   - Fees: ₹1400

3. **Dr. Vikram Singh (Orthopedics)**
   - Email: vikram.singh@example.com
   - Specialization: Orthopedics
   - Experience: 16 years
   - Fees: ₹2000

*Note: There are 27 more doctors in the database. All doctors can be accessed using their email and the password "doctor123".*

### Patient Accounts

All patient accounts have the same password:
- Password: patient123

1. **John Doe**
   - Email: john.doe@example.com

2. **Jane Smith**
   - Email: jane.smith@example.com

3. **Robert Johnson**
   - Email: robert.johnson@example.com

4. **Mary Williams**
   - Email: mary.williams@example.com

## Project Structure

- **`/backend`** - Express server, MongoDB connection, API endpoints
  - `/controllers` - Request handlers for each API endpoint
  - `/models` - Mongoose schemas for database collections
  - `/routes` - Express routes for API endpoints
  - `/middleware` - Authentication and error handling middleware
  - `/utils` - Utility functions

- **`/frontend`** - React application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Page components
  - `/src/context` - React context providers
  - `/src/utils` - Utility functions

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure your MongoDB Atlas cluster is properly configured and the connection string is correct.
2. **Port Conflicts**: If ports 3000 or 5001 are in use, modify the respective configuration.
3. **Authentication Issues**: Check JWT implementation and user credentials.

## License

MIT 