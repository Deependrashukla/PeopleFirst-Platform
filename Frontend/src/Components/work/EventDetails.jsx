import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './EventDetails.css';
import { auth } from '../../firebase-config'; // Ensure this points to your Firebase configuration

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState(''); // State for user's email
  const [notificationStatus, setNotificationStatus] = useState('');

  if (!event) {
    return <div>Event not found.</div>;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
          setUserId(user.uid);
          setUserEmail(user.email);
        } catch (error) {
          console.error('Error fetching auth token:', error.message);
        }
      } else {
        setAuthToken('');
        setUserId('');
        setUserEmail('');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleBookAppointment = () => {

    console.log("event", event)
    fetch('http://127.0.0.1:5000/post_appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        // aadhaar_number: event.aadhaar_number,
        user_email : userEmail,
        service_type: "cook",
        appointment_time:event.start_time,
        status:"Not completed",
        worker_aadhar: event.aadhaar_number
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNotificationStatus(
            'Your appointment request has been sent to the worker! Please wait until the worker approves.'
          );
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <img src={event.imageUrl} alt={event.title} className="event-image" />
      <p>
        <strong>Category:</strong> {event.category}
      </p>
      <p>
        <strong>Place:</strong> {event.city}
      </p>
      <p>
        <strong>Start Time:</strong> {event.start_time}
      </p>
      <p>
        <strong>End Time:</strong> {event.end_time}
      </p>
      <p>
        <strong>Price Range:</strong> {event.price}
      </p>
      <p>
        <strong>Description:</strong> {event.work_description}
      </p>

      {notificationStatus && (
        <div className="notification-message">{notificationStatus}</div>
      )}

      <div className="button-container">
        <button className="book-button" onClick={handleBookAppointment}>
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
