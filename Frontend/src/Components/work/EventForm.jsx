import React, { useState } from 'react';
import "./EventForm.css";

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    place: '',
    startTime: '',
    endTime: '',
    priceRange: '',
    category: ''
  });

  const apiUrl = 'http://127.0.0.1:5000/add-listworker'; // Your Flask backend endpoint URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'ListWorker added successfully') {
        alert('Event added successfully!');
      } else {
        alert('Failed to add event.');
      }
    })
    .catch(error => console.error('Error submitting data:', error));
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>Add New Event</h2>
      
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Place:
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Start Time:
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        End Time:
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Price Range:
        <input
          type="text"
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Category:
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="cook">Cook</option>
          <option value="maid">Cleaner</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="baby_sitter">Baby Sitter</option>
        </select>
      </label>

      <button type="submit">Submit Event</button>
    </form>
  );
};

export default EventForm;
