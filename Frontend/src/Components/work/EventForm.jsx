import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './EventForm.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EventForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        place: '',
        startTime: '',
        endTime: '',
        priceRange: '',
        category: '',
        aadhaarNumber: '',
    });
    const navigate = useNavigate(); // Initialize useNavigate


    const [authToken, setAuthToken] = useState('');
    const [submitting, setSubmitting] = useState(false); // Track submission state

    const auth = getAuth(); // Initialize Firebase Auth

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
                setAuthToken('');
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const apiUrl = 'http://127.0.0.1:5000/add-work';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authToken) {
            alert("You must be logged in to submit this form.");
            return;
        }

        setSubmitting(true); // Prevent multiple submissions

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.message === 'ListWorker added successfully') {
                alert('Event added successfully!');
                navigate('/cart');
                setFormData({
                    title: '',
                    description: '',
                    place: '',
                    startTime: '',
                    endTime: '',
                    priceRange: '',
                    category: '',
                    aadhaarNumber: '',
                });
            } else {
                alert('Failed to add event. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        } finally {
            setSubmitting(false);
        }
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
                    <option value="maid">Maid</option>
                    <option value="plumber">Plumber</option>
                    <option value="electrician">Electrician</option>
                    <option value="baby_sitter">Baby Sitter</option>
                </select>
            </label>

            <label>
                Aadhaar Number:
                <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    required
                    pattern="^[0-9]{12}$"
                    title="Aadhaar number should be a 12-digit number"
                />
            </label>

            <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Event'}
            </button>
        </form>
    );
};

export default EventForm;
