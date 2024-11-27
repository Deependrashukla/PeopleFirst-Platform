import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css'; // Make sure to use the same CSS file

const Profile = ({ user }) => {
  // State to toggle the profile details visibility
  const [showDetails, setShowDetails] = useState(false);
  const profileRef = useRef(null);

  // Handle the click event to toggle the details
  const handleProfileClick = () => {
    setShowDetails(!showDetails);
  };

  // Close dropdown when clicking outside the profile component
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
      <div
        className="profile-circle"
        onClick={handleProfileClick}
      >
        <span className="profile-initials">{user.name.charAt(0)}</span>
      </div>

      {showDetails && (
        <div className="profile-dropdown">
          <p className="profile-name">{user.name}</p>
          <p className="profile-job">{user.job}</p>
          <hr />
          <ul className="profile-actions">
            <li>
              <button onClick={() => console.log('View Profile')}>View Profile</button>
            </li>
            <li>
              <button onClick={() => console.log('Settings')}>Settings</button>
            </li>
            <li>
              <button onClick={() => console.log('Logout')}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
