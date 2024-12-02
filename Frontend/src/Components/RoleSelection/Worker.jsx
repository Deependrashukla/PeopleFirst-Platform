import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Worker.css';

const WorkerLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [authToken, setAuthToken] = useState('');
  const navigate = useNavigate();

  // Function to fetch user choice and handle navigation
  const fetchChoice = async (userEmail) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get-choice', {
        method: 'POST', // Ensure method matches backend's expectation
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        const userChoice = result.choice;
        if (userChoice === true) {
          navigate('/worker_dashboard');
        } else if (userChoice === false) {
          navigate('/user_dashboard');
        } else if (userChoice === null) {
          navigate('/select-role');
        }
      } else {
        console.error('Error fetching choice:', result.error || result.message);
      }
    } catch (error) {
      console.error('Error fetching choice:', error);
    }
  };

  // Function to handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the input values for debugging
    console.log("Form submitted with email:");

    // Ensure email and password are not empty
    if (!email || !password) {
      console.error("Email or password is missing");
      setMessage('Please provide both email and password');
      return;
    }

    const workerData = { email, password };

    try {
      // Add more logging for debugging
      console.log("Sending login request with data:", workerData);

      const response = await fetch('https://peoplefirst-platform.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(workerData),
      });

      const result = await response.json();

      console.log("Response from backend:", result); // Log backend response for debugging

      if (response.ok) {
        setMessage('Login successful!');
        localStorage.setItem('email', email); // Save email to localStorage
        console.log(email, 'Email saved to localStorage');
        await fetchChoice(email); // Fetch user choice and navigate accordingly
      } else {
        setMessage(result.message || 'Login failed');
        console.error('Login failed:', result.message);
      }
    } catch (error) {
      setMessage('Error occurred during login');
      console.error('Login error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        const token = user.getIdToken(); // Get the token
        setAuthToken(token);
        console.log('User logged in', { email: user.email, name: user.displayName });
        setEmail(user.email); // Update the email state
        setName(user.displayName); // Update the name state
      } else {
        // User is logged out
        console.log('User not logged in');
        setEmail(''); // Reset email in state
        setName(''); // Reset name in state
      }
    });
  
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);
  

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
