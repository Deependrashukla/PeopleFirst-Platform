import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css'; // Ensure you have a relevant CSS file
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [authToken, setAuthToken] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const profileRef = useRef(null);


  const navigate = useNavigate();

  ////////////////////////////////////// kirtan 

  

    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('select-role/customer', { replace: true });
      } catch (error) {
        // Safely extract error message
        const match = error.message.match(/\(([^)]+)\)/);
        const errorMessage = match ? match[1] : error.message;
        console.error('Error during logout:', errorMessage);
      }
    };
    
  ////////////////////////////////////////////////////// Kirtan



  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch token and user details when the user is logged in
        console.log(user, "user")

        const token = await user.getIdToken();
        setAuthToken(token);
        setUserDetails({
          name: user.displayName || 'Guest User', // Fallback if displayName is null
          email: user.email || 'No email found', // Fallback if email is null
        });
        console.log('User  logged in', userDetails);

      } else {
        console.log('User not logged in', userDetails);
      }
    });

    return () => {
      // Cleanup the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const handleProfileClick = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="profile-container" ref={profileRef}>
      <div className="profile-circle" onClick={handleProfileClick}>
        <span className="profile-initials">
          {userDetails.name ? userDetails.name.charAt(0).toUpperCase() : '?'}
        </span>
      </div>

      {showDetails && (
        <div className="profile-dropdown">
          <p className="profile-name">{userDetails.name}</p>
          <p className="profile-email">{userDetails.email}</p>
          <hr />
          <ul className="profile-actions">
            <li>
              <button onClick={() => console.log('View Profile')}>View Profile</button>
            </li>
            <li>
              <button onClick={() => console.log('Settings')}>Settings</button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout()
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
