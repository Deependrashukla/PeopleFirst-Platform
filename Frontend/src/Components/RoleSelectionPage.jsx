// src/RoleSelectionPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelectionPage.css'; // Optional: Add custom styles
import customer from '../assets/customer.png';
import worker from '../assets/worker.png';

const RoleSelectionPage = () => {
  const [email, setEmail] = useState(''); // Replace with the user's email, perhaps fetched from a context or authentication state
  const [choice, setChoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user choice when the component loads
    const fetchChoice = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get-choice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email : email}),
        });

        const result = await response.json();
        if (response.ok) {
          setChoice(result.choice);

          // Redirect if the choice is already set
          if (result.choice === true) {
            navigate('/cart');
          } else if (result.choice === false) {
            navigate('/select-role/worker/register');
          } else if (result.choice === null) {
            navigate('/select-role');
          }
        } else {
          console.error('Error fetching choice:', result.message);
        }
      } catch (error) {
        console.error('Error fetching choice:', error);
      }
    };

    if (email) {
      fetchChoice();
    }
  }, [email, navigate]);

  const handleRoleSelection = async (role) => {
    if (!email) {
      console.error("Email is required but not provided.");
      return;
    }
  
    try {
      // Save the user choice to the backend
      const response = await fetch('http://127.0.0.1:5000/add-choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, choice: role }),
      });
  
      const result = await response.json();
      console.log('role', result);
  
      if (response.ok) {
        // Navigate to the respective role page
        if (role === 'customer') {
          navigate('/cart');
        } else if (role === 'worker') {
          navigate('/select-role/worker/register');
        }
      } else {
        console.error('Error saving choice:', result.error);
      }
    } catch (error) {
      console.error('Error saving choice:', error);
    }
  };
  
  return (
    <div className="role-selection-container">
      <h1>Select Your Role</h1>

      <div className="role-buttons">
        <button onClick={() => handleRoleSelection(true)}>
          <img src={customer} alt="Customer" className="image" />
          Customer
        </button>

        <button onClick={() => handleRoleSelection(false)}>
          <img src={worker} alt="Worker" className="image" />
          Worker
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
