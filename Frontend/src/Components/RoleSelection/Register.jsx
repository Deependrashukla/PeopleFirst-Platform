import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication imports
import { auth } from '../../firebase-config'; // Import the Firebase auth instance
import './Customer.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use Firebase createUserWithEmailAndPassword method to register the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Registration successful:', user);

      // Redirect to the select-role page on successful registration
      navigate('/select-role'); 
    } catch (error) {
      // Handle Firebase errors
      console.error('Error during registration:', error);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p className="error-message">{error}</p>} {/* Display error if any */}
        <button type="submit">Register</button>
        <p className="register-link">
          Already have an account? <Link to="/select-role/customer" style={{ color: 'blue' }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
