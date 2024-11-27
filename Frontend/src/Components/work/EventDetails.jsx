import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './EventDetails.css';

const EventDetails = () => {
  const location = useLocation(); // Get the location object from React Router
  const { event } = location.state || {}; // Retrieve the event data passed from the card
  const [authToken, setAuthToken] = useState('');

  const [notificationStatus, setNotificationStatus] = useState("");
  


  if (!event) {
    return <div>Event not found.</div>; // If no event data is found, show an error message
  }

  // Handle the "Book Appointment" button click
  // Handle the "Book Appointment" button click


  useEffect(() => {
    const fetchAuthToken = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                setAuthToken(token);
            } else {
                console.log("User not logged in");
            }
        } catch (error) {
            const errorMessage = error.message.match(/\(([^)]+)\)/)[1];
            console.error("Error fetching auth token:", errorMessage);
        }
    };

    fetchAuthToken();
}, []);
  const handleBookAppointment = () => {
    console.log("evebt", event)
    // Send a request to the backend (your Flask server) to trigger a Pusher event
    fetch('http://127.0.0.1:5000/book-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, 
      },
      body: JSON.stringify({
        eventId: event.id,  // Assuming event has an 'id' field
        aadhaar_number: event.aadhaar_number,  // Assuming event has 'workerId' field
        userId: 123,  // Replace with actual userId (could be from authentication)
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNotificationStatus("Your appointment request has been sent to the worker! Please wait until the worker approves.");
        }
      })
      .catch((error) => console.error('Error:', error));
  };


  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <img src={event.imageUrl} alt={event.title} className="event-image" />
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Place:</strong> {event.city}</p>
      <p><strong>Start Time:</strong> {event.start_time}</p>
      <p><strong>End Time:</strong> {event.end_time}</p>
      <p><strong>Price Range:</strong> {event.price}</p>
      <p><strong>Description:</strong> {event.work_description}</p>

      {/* Notification message after booking */}
      {notificationStatus && (
        <div className="notification-message">{notificationStatus}</div>
      )}

      {/* Book Appointment Button */}
      <div className="button-container">
        <button
          className="book-button"
          onClick={handleBookAppointment}>
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
