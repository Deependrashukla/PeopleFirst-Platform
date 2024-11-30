import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './EventDetails.css';
import { auth } from '../../firebase-config'; // Ensure this points to your Firebase configuration
import Pusher from 'pusher-js';

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState(''); // State for user's email
  const [notificationStatus, setNotificationStatus] = useState('');
  const [pusherChannel, setPusherChannel] = useState(null);

  if (!event) {
    return <div>Event not found.</div>;
  }

  useEffect(() => {
    let channel = null; // Local variable to hold channel

    // Cache Aadhaar number when the page loads
    if (event?.aadhaar_number) {
      localStorage.setItem('aadhaar_number', event.aadhaar_number);
      console.log('Aadhaar number cached:', event.aadhaar_number);
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
          setUserId(user.uid);
          setUserEmail(user.email);

          if (!channel) {
            const pusher = new Pusher('b472bc7e618991d3b479', {
              cluster: 'ap2',
              forceTLS: true,
            });
            channel = pusher.subscribe(`worker-${event.aadhaar_number}-channel`);
            setPusherChannel(channel);

            channel.bind('new-appointment', (data) => {
              console.log('New appointment received:', data);
            });
          }
        } catch (error) {
          console.error('Error fetching auth token:', error.message);
        }
      } else {
        console.log('User not logged in');
        setAuthToken('');
        setUserId('');
        setUserEmail('');
      }
    });

    return () => {
      if (channel) {
        channel.unsubscribe();
        console.log('Unsubscribed from Pusher channel');
      }
      unsubscribe();
    };
  }, [event]);

  const handleBookAppointment = () => {
    fetch('http://127.0.0.1:5000/book-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        eventId: event.id,
        aadhaar_number: event.aadhaar_number,
        userId: userId, // Dynamically set userId from auth user
        email: userEmail, // Add email to the request
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
