import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import "./EventList.css";

const EventList = () => {
  const { state } = useLocation();
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState(state?.city || "");
  const [category, setCategory] = useState(state?.category || "");
  const [authToken, setAuthToken] = useState("");

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
        setAuthToken("");
      }
    });

    return () => unsubscribe();
  }, []);

  const apiUrl = "http://127.0.0.1:5000/listwork";

  const fetchData = () => {
    if (!authToken) {
      console.error("No auth token available. Please log in.");
      return;
    }

    const query = new URLSearchParams({ city, category }).toString();
    const url = `${apiUrl}?${query}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("data:", data)
          setEvents(data);
        } else {
          console.error("Unexpected data format, expected an array:", data);
          setEvents([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setEvents([]);
      });
  };

  useEffect(() => {
    if (city && category && authToken) {
      fetchData();
    }
  }, [city, category, authToken]);

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
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={fetchData}>Search</button>
      </div>
      <div className="card-container">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <img src={event.imageUrl} alt={event.title} className="event-image" />
            <h2>{event.title}</h2>
            <p>
              <strong>Category:</strong> {event.category}
            </p>
            <p>
              <strong>Place:</strong> {event.city}
            </p>
            <p>
              <strong>Start Time:</strong> {event.start_time}
            </p>
            <Link to="/event-details" state={{ event }} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
