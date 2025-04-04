import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  
  const { login, loading, error } = useContext(AuthContext);
  const { success } = useAlerts();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setDebugInfo('Email and password are required');
      return;
    }
    
    try {
      setDebugInfo('Attempting login...');
      console.log("Attempting login with:", { email, password: '********' });
      const result = await login(email, password);
      console.log("Login successful:", result);
      setDebugInfo(`Login successful: Redirecting...`);
      
      // Show success alert
      success('Login successful! Welcome back.');
      
      // Redirect based on user role
      if (result.isDoctor) {
        navigate('/doctor-dashboard');
      } else if (result.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      console.error("Login error in component:", err);
      setDebugInfo(`Login error: ${err.message || 'Invalid credentials'}`);
      // No need to do anything else as error is handled in AuthContext
    }
  };

  return (
    <div className="auth-form-container">
      <h1 className="auth-form-heading">Welcome Back</h1>
      <p className="auth-form-subtext">Sign in to access your account</p>
      
      {error && (
        <div className="form-error">
          <FaExclamationTriangle /> {error}
        </div>
      )}
      
      {loading && <Loader />}
      
      {debugInfo && (
        <div className="alert alert-info" style={{fontSize: "12px", marginBottom: "10px"}}>
          {debugInfo}
        </div>
      )}
      
      <form onSubmit={submitHandler}>
        <div className="form-row">
          <div className="form-col-full">
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
          <div className="form-col-full">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </div>
      </form>

      <div className="auth-form-footer">
        New User? <Link to="/register" className="auth-form-link">Create an Account</Link>
      </div>
    </div>
  );
};

export default Login;
