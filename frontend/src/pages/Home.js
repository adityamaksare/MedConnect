import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaUserPlus, FaChartLine, FaHospital, FaStethoscope, FaUserNurse, FaTooth, FaBone, FaBrain, FaEye, FaHeartbeat } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import AnimatedHeadline from '../components/AnimatedHeadline';
import { AuthContext } from '../context/AuthContext';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    // Set home page title
    document.title = 'MedConnect | Your Health, Our Priority';
    
    const fetchTopDoctors = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/doctors?limit=4');
        console.log('Fetched top doctors:', data);
        setTopDoctors(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top doctors:', err);
        setError('Failed to fetch top doctors');
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  // Specializations
  const specializations = [
    { name: 'Cardiology', icon: <FaHospital />, description: 'Heart and cardiovascular system specialists' },
    { name: 'Dermatology', icon: <FaUserMd />, description: 'Skin, hair, and nail specialists' },
    { name: 'Pediatrics', icon: <FaUserNurse />, description: 'Medical care for infants, children, and adolescents' },
    { name: 'Orthopedics', icon: <FaBone />, description: 'Bone, joint, and muscle specialists' },
    { name: 'Neurology', icon: <FaBrain />, description: 'Brain and nervous system specialists' },
    { name: 'Ophthalmology', icon: <FaEye />, description: 'Eye and vision care specialists' },
    { name: 'Psychiatry', icon: <FaHeartbeat />, description: 'Mental health specialists' },
    { name: 'Dentistry', icon: <FaTooth />, description: 'Oral health and dental care specialists' }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah Thompson',
      role: 'Patient',
      text: 'MedConnect made it incredibly easy to find a doctor and book an appointment. The whole process was seamless!',
      image: 'https://randomuser.me/api/portraits/women/41.jpg'
    },
    {
      name: 'Michael Johnson',
      role: 'Patient',
      text: 'I was able to find a specialist in my area within minutes. The interface is very user-friendly and intuitive.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Doctor',
      text: 'As a healthcare provider, MedConnect has simplified my appointment scheduling and patient management.',
      image: 'https://randomuser.me/api/portraits/women/63.jpg'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <motion.section 
        className="hero py-5" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ 
          background: 'linear-gradient(135deg, #0a6cb9 0%, #4F9DF9 100%)',
          borderRadius: '20px',
          margin: '20px 0',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-white mb-5 mb-lg-0">
              <AnimatedHeadline />
              <motion.p 
                className="lead mb-4 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Find the right doctor, book an appointment, and get the care you deserve. MedConnect makes healthcare accessible and convenient.
              </motion.p>
              <motion.div 
                className="d-flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button as={Link} to="/doctors" size="lg" variant="light" className="fw-bold">
                  Find Doctors
                </Button>
                {!userInfo && (
                  <Button as={Link} to="/register" size="lg" variant="outline-light" className="fw-bold">
                    Sign Up Now
                  </Button>
                )}
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.img 
                src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg" 
                alt="Healthcare Professionals" 
                className="img-fluid shadow-lg"
                initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: -5, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ rotateY: 0, scale: 1.02 }}
                style={{ 
                  maxHeight: '400px',
                  borderRadius: '15px',
                  transition: 'transform 0.5s ease'
                }}
              />
            </Col>
          </Row>
        </Container>
      </motion.section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <motion.h2 
            className="text-center mb-5 fw-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Why Choose MedConnect
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Row>
              {[
                { title: 'Expert Doctors', icon: <FaUserMd />, text: 'Access to a network of qualified and experienced healthcare professionals.' },
                { title: 'Easy Scheduling', icon: <FaCalendarAlt />, text: 'Book appointments online 24/7 with just a few clicks, no phone calls needed.' },
                { title: 'Patient Profiles', icon: <FaUserPlus />, text: 'Manage your health information and appointment history in one place.' },
                { title: 'Health Tracking', icon: <FaChartLine />, text: 'Keep track of your appointments and health records over time.' }
              ].map((feature, index) => (
                <Col lg={3} md={6} className="mb-4" key={index}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-100 text-center py-4 border-0 shadow-sm">
                      <div className="text-center mb-3">
                        <motion.span 
                          style={{ fontSize: '3rem', color: 'var(--primary-blue)' }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {feature.icon}
                        </motion.span>
                      </div>
                      <Card.Body>
                        <Card.Title className="fw-bold">{feature.title}</Card.Title>
                        <Card.Text>
                          {feature.text}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.h2 
            className="text-center mb-5 fw-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Top Doctors
          </motion.h2>
          
          {loading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <Row>
                {topDoctors && topDoctors.length > 0 ? (
                  topDoctors.slice(0, 4).map((doctor, index) => (
                    <Col key={doctor._id} lg={3} md={6} className="mb-4">
                      <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                      >
                        <Card className="doctor-card h-100 border-0 shadow-sm">
                          <div className="text-center pt-4">
                            <motion.img
                              src={`https://ui-avatars.com/api/?name=${doctor.user?.name || 'Doctor'}&background=random&size=150`}
                              alt={doctor.user?.name || 'Doctor'}
                              className="rounded-circle mb-3 border"
                              width="100"
                              height="100"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            />
                          </div>
                          <Card.Body className="text-center">
                            <Card.Title className="fw-bold">{doctor.user?.name || 'Doctor'}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{doctor.specialization || 'Specialist'}</Card.Subtitle>
                            <div className="mb-2">
                              <small className="text-warning">
                                {'★'.repeat(Math.floor(doctor.rating || 0))}
                                {'☆'.repeat(5 - Math.floor(doctor.rating || 0))}
                                <span className="ms-1 text-muted">({doctor.numReviews || 0} reviews)</span>
                              </small>
                            </div>
                            <Card.Text>
                              <small className="text-muted">{doctor.experience || 0} years of experience</small>
                            </Card.Text>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Button 
                                as={Link} 
                                to={`/doctors/${doctor._id}`} 
                                variant="outline-primary" 
                                size="sm"
                              >
                                View Profile
                              </Button>
                            </motion.div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <div className="text-center py-5">
                      <h5 className="text-muted">No doctors available at the moment</h5>
                      <p>Please check back later for top doctors.</p>
                    </div>
                  </Col>
                )}
              </Row>
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button as={Link} to="/doctors" variant="primary" size="lg">
                View All Doctors
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Specialization Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Our Specializations</h2>
          <Row>
            {specializations.map((spec, index) => (
              <Col key={index} md={3} sm={6} className="mb-4">
                <Card className="h-100 text-center py-4 border-0 shadow-sm">
                  <div className="text-center mb-3">
                    <span style={{ fontSize: '3rem', color: 'var(--primary-blue)' }}>
                      {spec.icon}
                    </span>
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{spec.name}</Card.Title>
                    <Card.Text>
                      {spec.description}
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={`/doctors?specialization=${spec.name}`} 
                      variant="outline-primary" 
                      size="sm"
                      className="mt-2"
                    >
                      Find Specialists
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ 
        background: '#ffffff',
        borderRadius: '20px',
        margin: '20px 0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E6EBF5'
      }}>
        <Container>
          <h2 className="text-center mb-5 fw-bold text-primary">What Our Users Say</h2>
          <Carousel
            indicators={false}
            controls={true}
            interval={5000}
            pause="hover"
            className="testimonial-carousel"
          >
            {testimonials.map((testimonial, index) => (
              <Carousel.Item key={index}>
                <div className="text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-circle mb-4 border testimonial-image"
                    style={{ 
                      borderColor: '#4F9DF9',
                      borderWidth: '3px',
                      boxShadow: '0 5px 15px rgba(79, 157, 249, 0.2)'
                    }}
                    width="100"
                    height="100"
                  />
                  <h5 className="mb-1 fw-bold text-dark">{testimonial.name}</h5>
                  <p className="text-muted mb-4">{testimonial.role}</p>
                  <p className="testimonial-quote lead mb-0 px-md-5 mx-md-5">
                    {testimonial.text}
                  </p>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>
    </>
  );
};

export default Home; 