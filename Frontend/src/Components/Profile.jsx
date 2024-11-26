import React, { useState } from 'react';
import './Navbar.css'; // Make sure to use the same CSS file

const Profile = ({ user }) => {
  // State to toggle the profile details visibility
  const [showDetails, setShowDetails] = useState(false);

  // Handle the click event to toggle the details
  const handleProfileClick = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="profile-container">
      <div
        className="profile-circle"
        onClick={handleProfileClick}
      >
        {/* Here you can add an image as the profile picture */}
        <span className="profile-initials">{user.name.charAt(0)}</span>
      </div>

      {showDetails && (
        <div className="profile-details">
          <p className="profile-name">{user.name}</p>
          <p className="profile-job">{user.job}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
