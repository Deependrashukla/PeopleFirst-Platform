// src/Components/work/EventDetail.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './EventDetail.css';

const EventDetail = () => {
  const location = useLocation();
  const event = location.state?.event;

  // State to control modal visibility and form inputs
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  if (!event) {
    return <p>No event details available. Please go back and select an event.</p>;
  }

  const handleBookEvent = () => {
    setShowModal(true); // Show the modal when "Book Event" is clicked
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (price && startTime && endTime) {
      alert(`You have booked the event!\nPrice: ${price}\nStart Time: ${startTime}\nEnd Time: ${endTime}`);
      setShowModal(false); // Close the modal after submitting
    } else {
      alert('Please fill in all fields (price, start time, and end time).');
    }
  };

  return (
    <div className="event-detail">
      <h1>{event.title}</h1>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Location:</strong> {event.city}</p>
      <p><strong>Start Time:</strong> {event.start_time}</p>
      <p><strong>End Time:</strong> {event.end_time}</p>
      <p><strong>Price Range:</strong> {event.price}</p>
      <p><strong>Description:</strong> {event.work_description}</p>
      
      <button className="book-event-button" onClick={handleBookEvent}>Book Event</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Book Your Event</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Price:
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </label>
              <br />
              <label>
                Start Time:
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </label>
              <br />
              <label>
                End Time:
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </label>
              <br />
              <button type="submit" className="submit-button">Submit</button>
              <button
                type="button"
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
