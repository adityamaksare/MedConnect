import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUser, FaUserMd, FaCreditCard } from 'react-icons/fa';

const AppointmentItem = ({ appointment, showPatient = false }) => {
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

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'card':
        return 'Credit Card';
      case 'phonepe':
        return 'PhonePe';
      case 'googlepay':
        return 'Google Pay';
      case 'cash':
        return 'Cash';
      default:
        return method;
    }
  };

  return (
    <div className={`appointment-item ${appointment.status}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">
          {showPatient ? (
            <>
              <FaUser className="me-2" />
              {appointment.patient ? 
                (typeof appointment.patient === 'string' ? appointment.patient : appointment.patient.name || 'Unknown Patient') 
                : 'Unknown Patient'
              }
            </>
          ) : (
            <>
              <FaUserMd className="me-2" />
              {appointment.doctor ? 
                (appointment.doctor.name ? 
                  `Dr. ${appointment.doctor.name}` : 
                  (appointment.doctor.user && appointment.doctor.user.name ? 
                    `Dr. ${appointment.doctor.user.name}` : 'Unknown Doctor')
                ) 
                : 'Unknown Doctor'
              }
            </>
          )}
        </h5>
        {getStatusBadge(appointment.status)}
      </div>

      <p className="mb-1">
        <FaCalendarAlt className="me-2" />
        <strong>Date:</strong> {formatDate(appointment.appointmentDate)}
      </p>
      <p className="mb-1">
        <FaClock className="me-2" />
        <strong>Time:</strong> {appointment.timeSlot || appointment.appointmentTime || 'Not specified'}
      </p>
      <p className="mb-2">
        <strong>Reason:</strong> {appointment.reason}
      </p>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">
          <strong>Fee:</strong> {appointment.fees ? `₹${appointment.fees}` : 'Not specified'}
        </p>
        <div>
          {appointment.isPaid ? (
            <Badge bg="success" className="me-2">Paid</Badge>
          ) : (
            <Badge bg="warning" className="me-2">Unpaid</Badge>
          )}
          {appointment.paymentMethod && (
            <Badge bg="info">
              <FaCreditCard className="me-1" /> 
              {getPaymentMethodLabel(appointment.paymentMethod)}
            </Badge>
          )}
        </div>
      </div>

      <Button as={Link} to={`/appointments/${appointment._id}`} variant="primary" size="sm">
        View Details
      </Button>
    </div>
  );
};

export default AppointmentItem; 