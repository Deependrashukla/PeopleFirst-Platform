import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css'; // Ensure your CSS matches the desired style

const Profile = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const profileRef = useRef(null);

  // Fallback values to avoid undefined errors
  const firstName = user?.firstName || 'User';
  const lastName = user?.lastName || '';
  const email = user?.email || 'Not provided';

  // Toggle the profile details visibility
  const handleProfileClick = () => {
    setShowDetails(!showDetails);
  };

  // Close the dropdown when clicking outside the profile
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
      {/* Profile Circle */}
      <div className="profile-circle" onClick={handleProfileClick}>
        <span className="profile-initials">
          {firstName.charAt(0).toUpperCase()}
          {lastName.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Profile Dropdown */}
      {showDetails && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="profile-avatar-initials">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="profile-name">
              {firstName} {lastName}
            </p>
            <p className="profile-email">{email}</p>
          </div>
          <ul className="profile-actions">
            <li>
              <button onClick={() => console.log('Manage Google Account')}>
                Manage Google Account
              </button>
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
