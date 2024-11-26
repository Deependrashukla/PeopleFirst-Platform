import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const apiUrl = 'http://127.0.0.1:5000/listworkers';

  const fetchData = () => {
    const query = new URLSearchParams({ city, category }).toString();
    const url = `${apiUrl}?${query}`;

    fetch(url)
      .then(response => response.json())
      .then(data => setEvents(data || []))
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    if (city && category) {
      fetchData();
    }
  }, [city, category]);

  const handleEventClick = (event) => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  return (
    <div className="event-list">
      <h1>Event Listings</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="cook">Cook</option>
          <option value="maid">Maid</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="baby_sitter">Baby Sitter</option>
        </select>

        <button onClick={fetchData}>Search</button>
      </div>

      <div className="event-cards-container">
        {events.map((event, index) => (
          <div key={index} className="event-card" onClick={() => handleEventClick(event)}>
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
    </div>
  );
};

export default EventList;
