// src/RoleSelectionPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelectionPage.css'; // Optional: Add custom styles
import customer from '../assets/customer.png';
import worker from '../assets/worker.png';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  // Function to handle selection
  const handleRoleSelection = (role) => {
    // Navigate to the respective login page based on the role
    if (role === 'customer') {
      navigate('/services');
    } else if (role === 'worker') {
      navigate('/select-role/worker/register');
    }
  };

  return (
    <div className="role-selection-container">
      <h1>Select Your Role</h1>

      <div className="role-buttons">
        <button onClick={() => handleRoleSelection('customer')}>
        <img
          src={customer}
          alt="Slideshow"
          className="image"
        />
        Customer
        </button>

        <button onClick={() => handleRoleSelection('worker')}>
        <img
          src={worker}
          alt="Slideshow"
          className="image"
        />
        Worker
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
