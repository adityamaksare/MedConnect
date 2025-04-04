import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import Loader from '../components/Loader';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserMd, FaExclamationTriangle } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('patient');
  const [formError, setFormError] = useState('');
  
  const { register, loading, error } = useContext(AuthContext);
  const { success } = useAlerts();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      // Convert role to isDoctor flag
      const isDoctor = role === 'doctor';
      
      console.log("Attempting registration with:", { 
        name, 
        email, 
        password: password ? "provided" : "not provided", 
        phoneNumber, 
        isDoctor 
      });
      
      const result = await register({ 
        name, 
        email, 
        password, 
        phoneNumber, 
        isDoctor 
      });
      
      console.log("Registration successful:", result);
      
      // Show success alert
      success('Account created successfully! Welcome to MedConnect.');
      
      // Redirect based on user role
      if (result.isDoctor) {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      console.error("Registration error in component:", err);
      // Set form error message
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Registration failed. Please try again.';
      
      setFormError(errorMessage);
      // Error is handled in the AuthContext
    }
  };

  return (
    <div className="auth-form-container">
      <h1 className="auth-form-heading">Create Account</h1>
      <p className="auth-form-subtext">Join us to book or manage appointments</p>
      
      {(error || formError) && (
        <div className="form-error">
          <FaExclamationTriangle /> {error || formError}
        </div>
      )}
      
      {loading && <Loader />}
      
      <form onSubmit={submitHandler}>
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <div className="input-group">
                <FaUser />
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-group">
                <FaEnvelope />
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">
                Phone Number
              </label>
              <div className="input-group">
                <FaPhone />
                <input
                  type="tel"
                  id="phoneNumber"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="role">
                Register as
              </label>
              <select 
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
              <small className="text-muted" style={{display: 'block', marginTop: '0.5rem', fontSize: '14px', color: '#6c757d'}}>
                {role === 'doctor' ? 'You will need to set up your profile after registration' : 'You can book appointments after registration'}
              </small>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Create a password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
            </div>
          </div>
          
          <div className="form-col">
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col-full">
            <button 
              type="submit" 
              className="auth-form-button" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </form>

      <div className="auth-form-footer">
        Already have an account? <Link to="/login" className="auth-form-link">Sign In</Link>
      </div>
    </div>
  );
};

export default Register; 