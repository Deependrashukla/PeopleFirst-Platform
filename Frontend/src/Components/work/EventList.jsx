import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { auth } from '../../firebase-config'; // Ensure this points to your Firebase configuration

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [authToken, setAuthToken] = useState('');

  // Set up auth state change listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
        } catch (error) {
          console.error("Error fetching auth token:", error.message);
        }
      } else {
        console.log("User not logged in");
        setAuthToken(''); // Clear token when user logs out
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const apiUrl = 'http://127.0.0.1:5000/listworks'; // Replace with your Flask backend endpoint URL

  const fetchData = () => {
    const query = new URLSearchParams({ city, category }).toString();
    const url = `${apiUrl}?${query}`;
  
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}` // Pass the auth token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched Data:", data); // Debug API response
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Unexpected data format, expected an array:", data);
          setEvents([]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setEvents([]); // Reset events to an empty array on error
      });
  };

  useEffect(() => {
    if (city && category) {
      fetchData();
    }
  }, [city, category, authToken]); // Re-fetch when authToken updates

  return (
    <div className="event-list">
      <h1>Event Listings</h1>
      
      {/* Input fields for city and category */}
      <div className="filters">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={fetchData}>Search</button>
      </div>

      {/* Displaying the event data in card format */}
      <div className="card-container">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <img src={event.imageUrl} alt={event.title} className="event-image" />
            <h2>{event.title}</h2>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Place:</strong> {event.city}</p>
            <p><strong>Start Time:</strong> {event.start_time}</p>
            
            {/* Pass the entire event data as state to EventDetails */}
            <Link to="/event-details" state={{ event }} className="view-details-btn">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
