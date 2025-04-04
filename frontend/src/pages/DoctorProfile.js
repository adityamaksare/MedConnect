import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  ListGroup, 
  Button, 
  Form, 
  Modal,
  Tabs,
  Tab
} from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard, FaMobile, FaGoogle } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import api from '../utils/api';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const { success } = useAlerts();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking state
  const [showModal, setShowModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [step, setStep] = useState(1); // 1: Appointment details, 2: Payment
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Define fetchDoctorDetails before useEffect
  const fetchDoctorDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching doctor details for ID:', id);
      
      const { data } = await api.get(`/doctors/${id}`);
      console.log('Doctor data received:', data);
      
      if (!data) {
        throw new Error('No data received from server');
      }
      
      setDoctor(data);
      
      // Update the page title with doctor's name
      if (data && data.name) {
        document.title = `${data.name} | MedConnect`;
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctor details:', err);
      // Check for specific error types and provide more helpful messages
      if (err.response && err.response.status === 404) {
        setError('Doctor not found. The doctor may have been removed or the URL is incorrect.');
      } else {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Error fetching doctor details. Please try again later.'
        );
      }
      setLoading(false);
    }
  }, [id]);

  // Now use fetchDoctorDetails in useEffect
  useEffect(() => {
    fetchDoctorDetails();
    
    // Cleanup function for component unmount
    return () => {
      // Reset title when component unmounts
      document.title = 'MedConnect';
      // Cancel any pending requests or timers here
    };
  }, [id, fetchDoctorDetails]);

  // Display doctor rating with stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full_${i}`} className="text-warning" />);
    }

    // Add half star if needed
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty_${i}`} className="text-warning" />);
    }

    return stars;
  };

  const handleBooking = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    if (userInfo.isDoctor) {
      setBookingError("Doctors can't book appointments");
      return;
    }
    
    setShowModal(true);
    setStep(1);
    setPaymentSuccess(false);
  };

  const nextStep = () => {
    setBookingError('');
    
    // Better validation with more helpful error messages
    if (!appointmentDate) {
      setBookingError('Please select an appointment date');
      return;
    }
    
    if (!appointmentTime) {
      setBookingError('Please select an appointment time');
      return;
    }
    
    if (!reason || reason.trim().length < 10) {
      setBookingError('Please provide a detailed reason for your visit (minimum 10 characters)');
      return;
    }
    
    // Check if selected date is today
    const today = new Date();
    const selectedDate = new Date(appointmentDate);
    if (selectedDate.toDateString() === today.toDateString()) {
      // For same-day appointments, validate the time
      const now = new Date();
      const [hours, minutes] = appointmentTime.split(':').map(Number);
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hours, minutes);
      
      // Check if appointment time is at least 2 hours from now
      if (appointmentDateTime.getTime() - now.getTime() < 2 * 60 * 60 * 1000) {
        setBookingError('Same-day appointments must be booked at least 2 hours in advance');
        return;
      }
    }
    
    // All validations passed
    setStep(2);
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'card') {
      // Check if all fields are filled
      if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
        setBookingError('Please fill in all card details');
        return false;
      }
      
      // Validate card number (basic check for length and numeric only)
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        setBookingError('Please enter a valid 16-digit card number');
        return false;
      }
      
      // Validate expiry date format (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setBookingError('Please enter a valid expiry date in MM/YY format');
        return false;
      }
      
      // Validate expiry date is in the future
      const [month, year] = cardExpiry.split('/');
      const expiryDate = new Date();
      expiryDate.setFullYear(2000 + parseInt(year, 10));
      expiryDate.setMonth(parseInt(month, 10) - 1);
      expiryDate.setDate(1);
      
      if (expiryDate < new Date()) {
        setBookingError('Card has expired. Please use a valid card');
        return false;
      }
      
      // Validate CVC (3 or 4 digits)
      if (!/^\d{3,4}$/.test(cardCVC)) {
        setBookingError('Please enter a valid 3 or 4 digit CVC code');
        return false;
      }
    }
    
    return true;
  };

  const processPayment = async () => {
    // Simulate payment processing
    setBookingLoading(true);
    
    try {
      // For PhonePe and Google Pay, we're marking the payment as immediately successful
      if (paymentMethod === 'phonepe' || paymentMethod === 'googlepay') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPaymentSuccess(true);
        success(`Payment successful via ${paymentMethod === 'phonepe' ? 'PhonePe' : 'Google Pay'}`);
        setBookingLoading(false);
        return true;
      }
      
      // For card payments, we need to validate the details
      if (paymentMethod === 'card') {
        // Mock payment API call with a delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPaymentSuccess(true);
        success('Credit card payment processed successfully');
        setBookingLoading(false);
        return true;
      }
      
      return true;
    } catch (error) {
      setBookingError('Payment processing failed. Please try again.');
      setBookingLoading(false);
      return false;
    }
  };

  const submitBookingHandler = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Validate based on current step
    if (step === 1) {
      nextStep();
      return;
    }
    
    // Step 2: Process payment and book appointment
    if (!validatePaymentDetails()) {
      return;
    }
    
    try {
      setBookingLoading(true);
      setBookingError('');
      
      // First process payment
      const paymentSuccessful = await processPayment();
      
      if (!paymentSuccessful) {
        return;
      }
      
      // Then book appointment
      await api.post('/appointments', {
        doctor: doctor._id,
        appointmentDate: new Date(appointmentDate).toISOString(),
        timeSlot: appointmentTime,
        reason,
        paymentMethod,
        isPaid: true
      });
      
      // Close modal and redirect after a short delay to show success message
      setTimeout(() => {
      setBookingLoading(false);
      setShowModal(false);
        success(`Appointment booked successfully with Dr. ${doctor.name}`);
      navigate('/appointments');
      }, 1500);
      
    } catch (err) {
      setBookingError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error booking appointment'
      );
      setBookingLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center py-5">
          <Message variant="danger">{error}</Message>
          <Button 
            variant="primary" 
            className="mt-3" 
            onClick={() => navigate('/doctors')}
          >
            View All Doctors
          </Button>
        </div>
      ) : doctor ? (
        <>
          <Row>
            <Col md={8}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title as="h2">{doctor.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {doctor.specialization} | {doctor.experience} years experience
                  </Card.Subtitle>
                  
                  <div className="mb-3">
                    {renderRating(doctor.rating)}
                    <span className="ms-1">({doctor.numReviews} reviews)</span>
                  </div>
                  
                  <Card.Text>{doctor.bio || "No bio information provided"}</Card.Text>
                  
                  <ListGroup variant="flush" className="mt-4">
                    <ListGroup.Item>
                      <FaMapMarkerAlt className="me-2" /> {doctor.address || "Consultation Address Available In-Person"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <FaPhone className="me-2" /> {doctor.phone || "Contact via email"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <FaEnvelope className="me-2" /> {doctor.user?.email || "No email provided"}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Book Appointment</Card.Title>
                  <Card.Text>
                    <strong>Consultation Fee:</strong> ₹{doctor.fees}
                  </Card.Text>
                  
                  <Card.Title className="mt-3">Available Timings</Card.Title>
                  <ListGroup variant="flush" className="mb-3">
                    {doctor.availableDays && doctor.availableDays.length > 0 ? (
                      doctor.availableDays.map((day, index) => (
                        <ListGroup.Item key={index}>
                          <strong>{day}:</strong> {doctor.timings && doctor.timings.length >= 2 
                            ? `${doctor.timings[0]} - ${doctor.timings[1]}`
                            : "Hours not specified"}
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>No available days specified</ListGroup.Item>
                    )}
                  </ListGroup>
                  
                  <Button
                    onClick={handleBooking}
                    variant="primary"
                    className="w-100"
                    disabled={!userInfo || userInfo.isDoctor}
                  >
                    Book Appointment
                  </Button>
                  
                  {!userInfo && (
                    <Card.Text className="text-center mt-2">
                      <small>Please <a href="/login">login</a> to book an appointment</small>
                    </Card.Text>
                  )}
                  {userInfo && userInfo.isDoctor && (
                    <Card.Text className="text-danger text-center mt-2">
                      <small>Doctors can't book appointments</small>
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Booking Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{step === 1 ? 'Book Appointment' : 'Payment Details'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {bookingError && <Message variant="danger">{bookingError}</Message>}
              {paymentSuccess && <Message variant="success">Payment successful! Booking your appointment...</Message>}
              
              <Form onSubmit={submitBookingHandler}>
                {step === 1 ? (
                  // Step 1: Appointment Details
                  <>
                <Form.Group className="mb-3" controlId="appointmentDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="appointmentTime">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="reason">
                  <Form.Label>Reason for Visit</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief description of your condition"
                    required
                  />
                </Form.Group>
                
                    <div className="d-flex justify-content-between mt-4">
                      <div>Consultation Fee: <strong>₹{doctor?.fees}</strong></div>
                      <Button type="submit" variant="primary">
                        Proceed to Payment
                      </Button>
                    </div>
                  </>
                ) : (
                  // Step 2: Payment Details
                  <>
                    <div className="payment-summary mb-4">
                      <h5>Appointment Summary</h5>
                      <p className="mb-1"><strong>Doctor:</strong> {doctor?.name}</p>
                      <p className="mb-1"><strong>Date:</strong> {new Date(appointmentDate).toLocaleDateString()}</p>
                      <p className="mb-1"><strong>Time:</strong> {appointmentTime}</p>
                      <p className="mb-1"><strong>Fee:</strong> ₹{doctor?.fees}</p>
                      <hr />
                    </div>
                    
                    <Tabs 
                      activeKey={paymentMethod} 
                      onSelect={(k) => setPaymentMethod(k)} 
                      className="mb-4"
                    >
                      <Tab eventKey="card" title={<><FaCreditCard className="me-2" /> Credit Card</>}>
                        <Form.Group className="mb-3" controlId="cardName">
                          <Form.Label>Cardholder Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                            placeholder="Name on card"
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="cardNumber">
                          <Form.Label>Card Number</Form.Label>
                          <Form.Control
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            required
                            placeholder="1234 5678 9012 3456"
                            maxLength={16}
                          />
                        </Form.Group>
                        
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3" controlId="cardExpiry">
                              <Form.Label>Expiry Date</Form.Label>
                              <Form.Control
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                                required
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3" controlId="cardCVC">
                              <Form.Label>CVC</Form.Label>
                              <Form.Control
                                type="text"
                                value={cardCVC}
                                onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                required
                                placeholder="123"
                                maxLength={3}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Tab>
                      
                      <Tab eventKey="phonepe" title={<><FaMobile className="me-2" /> PhonePe</>}>
                        <div className="text-center py-4">
                          <div className="mb-4">
                            <img 
                              src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" 
                              alt="PhonePe" 
                              style={{ width: '120px' }}
                            />
                          </div>
                          <div className="bg-light p-4 rounded mb-3">
                            <h5 className="mb-3">Quick Payment</h5>
                            <p className="mb-3">Pay securely using PhonePe for instant confirmation.</p>
                            <Button 
                              variant="primary" 
                              className="w-100" 
                              onClick={async () => {
                                // When the user clicks this button, we process the payment immediately
                                setBookingLoading(true);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                setPaymentSuccess(true);
                                success('PhonePe payment completed successfully');
                                
                                // Book the appointment
                                try {
                                  await api.post('/appointments', {
                                    doctor: doctor._id,
                                    appointmentDate: new Date(appointmentDate).toISOString(),
                                    timeSlot: appointmentTime,
                                    reason,
                                    paymentMethod: 'phonepe',
                                    isPaid: true
                                  });
                                  
                                  // Close modal and redirect after a short delay
                                  setTimeout(() => {
                                    setBookingLoading(false);
                                    setShowModal(false);
                                    success(`Appointment booked successfully with Dr. ${doctor.name}`);
                                    navigate('/appointments');
                                  }, 1500);
                                } catch (err) {
                                  setBookingError(
                                    err.response && err.response.data.message
                                      ? err.response.data.message
                                      : 'Error booking appointment'
                                  );
                                  setBookingLoading(false);
                                }
                              }}
                              disabled={bookingLoading || paymentSuccess}
                            >
                              Pay ₹{doctor?.fees} Now with PhonePe
                            </Button>
                          </div>
                        </div>
                      </Tab>
                      
                      <Tab eventKey="googlepay" title={<><FaGoogle className="me-2" /> Google Pay</>}>
                        <div className="text-center py-4">
                          <div className="mb-4">
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" 
                              alt="Google Pay" 
                              style={{ width: '120px' }}
                            />
                          </div>
                          <div className="bg-light p-4 rounded mb-3">
                            <h5 className="mb-3">Quick Payment</h5>
                            <p className="mb-3">Pay securely using Google Pay for instant confirmation.</p>
                            <Button 
                              variant="primary" 
                              className="w-100" 
                              onClick={async () => {
                                // When the user clicks this button, we process the payment immediately
                                setBookingLoading(true);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                setPaymentSuccess(true);
                                success('Google Pay payment completed successfully');
                                
                                // Book the appointment
                                try {
                                  await api.post('/appointments', {
                                    doctor: doctor._id,
                                    appointmentDate: new Date(appointmentDate).toISOString(),
                                    timeSlot: appointmentTime,
                                    reason,
                                    paymentMethod: 'googlepay',
                                    isPaid: true
                                  });
                                  
                                  // Close modal and redirect after a short delay
                                  setTimeout(() => {
                                    setBookingLoading(false);
                                    setShowModal(false);
                                    success(`Appointment booked successfully with Dr. ${doctor.name}`);
                                    navigate('/appointments');
                                  }, 1500);
                                } catch (err) {
                                  setBookingError(
                                    err.response && err.response.data.message
                                      ? err.response.data.message
                                      : 'Error booking appointment'
                                  );
                                  setBookingLoading(false);
                                }
                              }}
                              disabled={bookingLoading || paymentSuccess}
                            >
                              Pay ₹{doctor?.fees} Now with Google Pay
                            </Button>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                    
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="outline-secondary" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={bookingLoading || paymentSuccess}
                      >
                        {bookingLoading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
                  </>
                )}
              </Form>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <Message>Doctor not found</Message>
      )}
    </Container>
  );
};

export default DoctorProfile; 