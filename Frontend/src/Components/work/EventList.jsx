import React, { useEffect, useState } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  
  const apiUrl = 'http://127.0.0.1:5000/listworkers'; // Replace with your Flask backend endpoint URL

  const fetchData = () => {
    // Construct the query URL with city and category parameters
    const query = new URLSearchParams({ city, category }).toString();
    const url = `${apiUrl}?${query}`;  // Correct URL format with `?` to start query parameters
    
    fetch(url)
      .then(response => response.json())
      .then(data => setEvents(data || []))  // Assuming response is the list of events
      .catch(error => console.error('Error fetching data:', error));
  };

  // Fetch data whenever city or category changes
  useEffect(() => {
    if (city && category) {
      fetchData();
    }
  }, [city, category]);

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

      {/* Displaying the event data */}
      {events.map((event, index) => (
        <div key={index} className="event-card">
          <img src={event.imageUrl} alt={event.title} className="event-image" />
          <h2>{event.title}</h2>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Place:</strong> {event.city}</p>
          <p><strong>Start Time:</strong> {event.start_time}</p>
          <p><strong>End Time:</strong> {event.end_time}</p>
          <p><strong>Price Range:</strong> {event.price}</p>
          <p>{event.work_description}</p>
        </div>


      ))}
    </div>
  );
};

export default EventList;
