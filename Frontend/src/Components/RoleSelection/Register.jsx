import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Firebase Authentication imports
import { auth } from '../../firebase-config'; // Import the Firebase auth instance
import './Customer.css';

const Register = () => {
  const [firstName, setFirstName] = useState(''); // State for first name
  const [lastName, setLastName] = useState(''); // State for last name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming password
  const [error, setError] = useState(null); // State to store error messages
  const [message, setMessage] = useState(null); // State to store success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Use Firebase createUserWithEmailAndPassword method to register the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Registration successful:', user);

      // Send email verification
      await sendEmailVerification(user);

      console.log('Email verification sent.');

      // Post registration details to the backend
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: user.email,
          uid : user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user details to the server.');
      }

      console.log('User details saved to the server.');

      setMessage('Registration successful! Please verify your email.');

      // Redirect to the select-role page after a delay
      setTimeout(() => navigate('/select-role'), 5000);
    } catch (error) {
      // Handle Firebase and network errors
      console.error('Error during registration:', error);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error if any */}
        {message && <p className="success-message">{message}</p>} {/* Display success message */}
        <button type="submit">Register</button>
        <p className="register-link">
          Already have an account? <Link to="/select-role/customer" style={{ color: 'blue' }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
