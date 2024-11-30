import React, { useState, useEffect } from 'react';
import './Worker.css';

const WorkerLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [authToken, setAuthToken] = useState('');


  useEffect(() => {
    const fetchAuthToken = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                setAuthToken(token);
            } else {
                console.log("User not logged in");
            }
        } catch (error) {
            const errorMessage = error.message.match(/\(([^)]+)\)/)[1];
            console.error("Error fetching auth token:", errorMessage);
        }
    };

    fetchAuthToken();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const workerData = { email, password };

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, 
        },
        body: JSON.stringify(workerData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Error occurred during login');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="worker-login-form">
      <h2>Worker Login</h2>
      {message && <p>{message}</p>}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default WorkerLoginForm;
