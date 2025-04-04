import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Container, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import DoctorCard from '../components/DoctorCard';
import Message from '../components/Message';
import Loader from '../components/Loader';
import api from '../utils/api';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
    extractSpecializations();
  }, []);

  // Fetch all doctors and extract unique specializations
  const extractSpecializations = async () => {
    try {
      const { data } = await api.get('/doctors?limit=100'); // Increase limit to get all doctors
      const doctorsData = data || [];
      
      // Extract unique specializations from the doctor data
      const uniqueSpecializations = [...new Set(doctorsData.map(doctor => doctor.specialization))];
      setSpecializations(uniqueSpecializations.sort());
    } catch (err) {
      console.error('Error extracting specializations:', err);
    }
  };

  const fetchDoctors = async (filterSpecialization = '', query = '') => {
    try {
      setLoading(true);
      let endpoint = '/doctors';
      const params = new URLSearchParams();
      
      if (filterSpecialization) {
        params.append('specialization', filterSpecialization);
      }
      
      if (query) {
        params.append('search', query);
      }
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      console.log('Fetching doctors with endpoint:', endpoint);
      const { data } = await api.get(endpoint);
      setDoctors(data); // Fixed to use direct data instead of data.data
      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Error fetching doctors'
      );
      setLoading(false);
    }
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setSpecialization(value);
    fetchDoctors(value, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors(specialization, searchQuery);
  };

  return (
    <Container>
      <h1 className="my-4">Find Doctors</h1>

      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form onSubmit={handleSearchSubmit}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by doctor name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <InputGroup.Text 
                as="button" 
                type="submit"
                className="btn btn-primary"
              >
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Form>
        </Col>
        <Col md={6}>
          <Form.Group controlId="specialization">
            <InputGroup>
              <InputGroup.Text><FaFilter /></InputGroup.Text>
              <Form.Select
                value={specialization}
                onChange={handleSpecializationChange}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !doctors || doctors.length === 0 ? (
        <Message>No doctors found matching your criteria</Message>
      ) : (
        <>
          <p className="text-muted mb-4">Found {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}</p>
          <Row>
            {doctors && doctors.map((doctor) => (
              <Col key={doctor._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                <DoctorCard doctor={doctor} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default DoctorList; 