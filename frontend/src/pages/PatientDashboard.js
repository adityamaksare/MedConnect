import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { FaUser, FaCalendarAlt, FaClock, FaUserMd } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Message from '../components/Message';
import Loader from '../components/Loader';
import api from '../utils/api';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    // Redirect doctor users to doctor dashboard
    if (userInfo.isDoctor) {
      navigate('/doctor-dashboard');
      return;
    }
    
    fetchAppointments();
  }, [userInfo, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');  // Clear any previous errors
      setAppointments([]); // Initialize with empty array to prevent undefined

      console.log('Fetching appointments...');
      const response = await api.get('/appointments');
      console.log('Appointments response:', response);
      
      // Check if we got a response at all
      if (!response) {
        console.error('No response received from appointments API');
        setError('Server did not respond. Please try again later.');
        return;
      }
      
      // Check the structure of the response
      if (response.data === null || response.data === undefined) {
        console.error('Appointments response has no data property');
        setError('Unexpected response format from server');
        return;
      }
      
      // Handle the different possible response structures
      if (Array.isArray(response.data)) {
        // If response.data is already an array
        console.log('Appointments received as array:', response.data.length);
        setAppointments(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        // If response.data has a nested data property that's an array
        console.log('Appointments received in nested data property:', response.data.data.length);
        setAppointments(response.data.data);
      } else {
        // Fallback to empty array if response structure is unexpected
        console.error('Unexpected appointments response structure:', response.data);
        setError('Unexpected data format from server');
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error fetching appointments. Please try again later.'
      );
      setAppointments([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
    return <Badge bg={variant}>{status}</Badge>;
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!appointments || !Array.isArray(appointments)) {
      return [];
    }
    
    return appointments.filter(app => {
      const appDate = new Date(app.appointmentDate);
      appDate.setHours(0, 0, 0, 0);
      return appDate >= today && app.status !== 'cancelled';
    }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  };

  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!appointments || !Array.isArray(appointments)) {
      return [];
    }
    
    return appointments.filter(app => {
      const appDate = new Date(app.appointmentDate);
      appDate.setHours(0, 0, 0, 0);
      return appDate < today || app.status === 'cancelled';
    }).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  };

  const handleCancelAppointment = async (id) => {
    try {
      console.log('Cancelling appointment with ID:', id);
      // Use the cancellation-specific endpoint
      const response = await api.put(`/appointments/${id}/cancel`);
      console.log('Cancel response:', response.data);
      
      // Update local state
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, status: 'cancelled' } : app
      ));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      // Could display an error message here if needed
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Patient Dashboard</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>
                    <FaUser className="me-2" /> {userInfo.name}
                  </Card.Title>
                  <Card.Text>
                    Welcome to your patient dashboard
                  </Card.Text>
                  <Button 
                    onClick={() => navigate('/profile')} 
                    variant="outline-primary" 
                    className="w-100"
                  >
                    Edit Profile
                  </Button>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>
                    <FaCalendarAlt className="me-2" /> Appointment Summary
                  </Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      Upcoming Appointments: <span className="fw-bold">{Array.isArray(appointments) ? getUpcomingAppointments().length : 0}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Past Appointments: <span className="fw-bold">{Array.isArray(appointments) ? getPastAppointments().length : 0}</span>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Total Appointments: <span className="fw-bold">{Array.isArray(appointments) ? appointments.length : 0}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
              
              <Button 
                onClick={() => navigate('/doctors')} 
                variant="primary" 
                className="w-100 mb-4"
              >
                Book New Appointment
              </Button>
            </Col>
            
            <Col md={8}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>
                    <FaClock className="me-2" /> Upcoming Appointments
                  </Card.Title>
                  
                  {!Array.isArray(appointments) ? (
                    <Loader />
                  ) : getUpcomingAppointments().length === 0 ? (
                    <Message>No upcoming appointments</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {getUpcomingAppointments().slice(0, 5).map(appointment => (
                        <ListGroup.Item key={appointment._id}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <h5 className="mb-0">
                                <FaUserMd className="me-2" />
                                {appointment.doctor ? 
                                  (appointment.doctor.name ? 
                                    `Dr. ${appointment.doctor.name} (${appointment.doctor.specialization || 'Specialist'})` :
                                    (appointment.doctor.user && appointment.doctor.user.name ?
                                      `Dr. ${appointment.doctor.user.name} (${appointment.doctor.specialization || 'Specialist'})` :
                                      'Doctor information unavailable')
                                  ) : 
                                  'Doctor information unavailable'
                                }
                              </h5>
                              <p className="text-muted mb-0">
                                {formatDate(appointment.appointmentDate)} at {appointment.timeSlot || appointment.appointmentTime}
                              </p>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <p className="mb-2"><strong>Reason:</strong> {appointment.reason}</p>
                          
                          <div className="d-flex gap-2">
                            <Button 
                              onClick={() => navigate(`/appointments/${appointment._id}`)} 
                              variant="outline-primary" 
                              size="sm"
                            >
                              View Details
                            </Button>
                            {appointment.status !== 'cancelled' && (
                              <Button 
                                onClick={() => handleCancelAppointment(appointment._id)} 
                                variant="outline-danger" 
                                size="sm"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  
                  {Array.isArray(appointments) && getUpcomingAppointments().length > 5 && (
                    <div className="text-center mt-3">
                      <Button 
                        onClick={() => navigate('/appointments')} 
                        variant="link"
                      >
                        View all upcoming appointments
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <Card>
                <Card.Body>
                  <Card.Title>
                    <FaCalendarAlt className="me-2" /> Recent Appointment History
                  </Card.Title>
                  
                  {!Array.isArray(appointments) ? (
                    <Loader />
                  ) : getPastAppointments().length === 0 ? (
                    <Message>No past appointments</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {getPastAppointments().slice(0, 3).map(appointment => (
                        <ListGroup.Item key={appointment._id}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <h5 className="mb-0">
                                <FaUserMd className="me-2" />
                                {appointment.doctor ? 
                                  (appointment.doctor.name ? 
                                    `Dr. ${appointment.doctor.name} (${appointment.doctor.specialization || 'Specialist'})` :
                                    (appointment.doctor.user && appointment.doctor.user.name ?
                                      `Dr. ${appointment.doctor.user.name} (${appointment.doctor.specialization || 'Specialist'})` :
                                      'Doctor information unavailable')
                                  ) : 
                                  'Doctor information unavailable'
                                }
                              </h5>
                              <p className="text-muted mb-0">
                                {formatDate(appointment.appointmentDate)} at {appointment.timeSlot || appointment.appointmentTime}
                              </p>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <Button 
                            onClick={() => navigate(`/appointments/${appointment._id}`)} 
                            variant="outline-secondary" 
                            size="sm"
                            className="mt-2"
                          >
                            View Details
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  
                  {Array.isArray(appointments) && getPastAppointments().length > 3 && (
                    <div className="text-center mt-3">
                      <Button 
                        onClick={() => navigate('/appointments')} 
                        variant="link"
                      >
                        View full appointment history
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default PatientDashboard; 