import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword,setPersistence, browserLocalPersistence} from 'firebase/auth';
import { auth } from '../../firebase-config';
import './Customer.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  


    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Login successful:', user);
      navigate('/select-role'); // Redirect on successful login
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-form">
      <h2> Login</h2>
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
        <p className="register-link">
          Don't have an account? <Link to="/register" style={{ color: 'blue' }}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
