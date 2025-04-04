import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUser, FaUserMd, FaNotesMedical } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import api from '../utils/api';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const { success } = useAlerts();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data } = await api.get(`/appointments/${id}`);
      
      if (!data) {
        setError('No data received from server');
        setLoading(false);
        return;
      }
      
      // Extract appointment data from response format
      const appointment = data.data || data;
      
      // Validate that we have the expected data structure
      if (!appointment.doctor || !appointment.user) {
        console.warn('Appointment data is missing doctor or user information:', appointment);
      }
      
      // Assign user as patient for easier reference
      const enhancedAppointment = {
        ...appointment,
        patient: appointment.user
      };
      
      setAppointment(enhancedAppointment);
      
      // Update page title with appointment information
      if (appointment.doctor && appointment.doctor.name) {
        const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString();
        document.title = `Appointment with Dr. ${appointment.doctor.name} on ${formattedDate} | MedConnect`;
      } else if (appointment.doctor && appointment.doctor.user && appointment.doctor.user.name) {
        const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString();
        document.title = `Appointment with Dr. ${appointment.doctor.user.name} on ${formattedDate} | MedConnect`;
      } else {
        document.title = `Appointment Details | MedConnect`;
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error fetching appointment details'
      );
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    fetchAppointmentDetails();
  }, [id, userInfo, navigate, fetchAppointmentDetails]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'pending':
        variant = 'warning';
        break;
      case 'confirmed':
        variant = 'success';
        break;
      case 'cancelled':
        variant = 'danger';
        break;
      case 'completed':
        variant = 'dark';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status.toUpperCase()}</Badge>;
  };

  const handleStatusUpdate = async (status) => {
    try {
      setUpdateLoading(true);
      setUpdateError('');
      
      await api.put(`/appointments/${id}`, { status });
      
      // Update local state
      setAppointment({ ...appointment, status });
      
      // Show success message using alert system
      const statusMessage = status === 'confirmed' 
        ? 'Appointment confirmed successfully'
        : status === 'cancelled'
        ? 'Appointment cancelled successfully'
        : status === 'completed'
        ? 'Appointment marked as completed'
        : `Appointment status updated to ${status}`;
        
      success(statusMessage);
      setUpdateLoading(false);
    } catch (err) {
      setUpdateError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error updating appointment status'
      );
      setUpdateLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Appointment Details</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : appointment ? (
        <>
          {updateError && <Message variant="danger">{updateError}</Message>}
          
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Appointment {appointment._id}</h5>
              {getStatusBadge(appointment.status)}
            </Card.Header>
            
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>Appointment Information</h5>
                  <p className="mb-2">
                    <FaCalendarAlt className="me-2" />
                    <strong>Date:</strong> {formatDate(appointment.appointmentDate)}
                  </p>
                  <p className="mb-2">
                    <FaClock className="me-2" />
                    <strong>Time:</strong> {appointment.appointmentTime}
                  </p>
                  <p className="mb-3">
                    <FaNotesMedical className="me-2" />
                    <strong>Reason:</strong> {appointment.reason}
                  </p>
                  <p className="mb-3">
                    <strong>Fee:</strong> ₹{appointment.fees} 
                    {appointment.isPaid ? (
                      <Badge bg="success" className="ms-2">Paid</Badge>
                    ) : (
                      <Badge bg="warning" className="ms-2">Unpaid</Badge>
                    )}
                  </p>
                </Col>
                
                <Col md={6}>
                  <h5>Doctor Information</h5>
                  {appointment.doctor ? (
                    <>
                      <p className="mb-2">
                        <FaUserMd className="me-2" />
                        <strong>Name:</strong> {appointment.doctor.name || (appointment.doctor.user && appointment.doctor.user.name) || 'Doctor'}
                      </p>
                      <p className="mb-2">
                        <strong>Specialization:</strong> {appointment.doctor.specialization || 'Not specified'}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {appointment.doctor.phone || (appointment.doctor.user && appointment.doctor.user.phoneNumber) || 'Not available'}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {appointment.doctor.email || (appointment.doctor.user && appointment.doctor.user.email) || 'Not available'}
                      </p>
                    </>
                  ) : (
                    <p>Doctor information not available</p>
                  )}
                  
                  <h5 className="mt-4">Patient Information</h5>
                  {appointment.patient ? (
                    <>
                      <p className="mb-2">
                        <FaUser className="me-2" />
                        <strong>Name:</strong> {appointment.patient.name}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {appointment.patient.phoneNumber}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {appointment.patient.email}
                      </p>
                    </>
                  ) : (
                    <p>Patient information not available</p>
                  )}
                </Col>
              </Row>
            </Card.Body>
            
            <Card.Footer>
              <h5 className="mb-3">Manage Appointment</h5>
              
              {userInfo && appointment && appointment.status && (
                <>
                  {userInfo.role === 'doctor' && appointment.status === 'pending' && (
                    <Button
                      onClick={() => handleStatusUpdate('confirmed')}
                      variant="success"
                      className="me-2"
                      disabled={updateLoading}
                    >
                      Confirm Appointment
                    </Button>
                  )}
                  
                  {userInfo.role === 'doctor' && appointment.status === 'confirmed' && (
                    <Button
                      onClick={() => handleStatusUpdate('completed')}
                      variant="dark"
                      className="me-2"
                      disabled={updateLoading}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <Button
                      onClick={() => handleStatusUpdate('cancelled')}
                      variant="danger"
                      disabled={updateLoading}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </>
              )}
            </Card.Footer>
          </Card>
        </>
      ) : (
        <Message>Appointment not found</Message>
      )}
    </Container>
  );
};

export default AppointmentDetails; 