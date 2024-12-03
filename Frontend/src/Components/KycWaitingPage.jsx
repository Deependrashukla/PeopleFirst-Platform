import React, { useState, useEffect } from "react";
import "./kycWaitingPage.css"; // Import the CSS for styling

const KycWaitingPage = () => {
  const [kycStatus, setKycStatus] = useState("waiting"); // Set initial status as 'waiting'
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Simulate waiting for KYC status update (for example, it can be fetched from an API or backend)
    setTimeout(() => {
      setKycStatus("done"); // After some time, we update the KYC status to 'done'
      setNotification("Your KYC is successfully verified!"); // Show notification when KYC is done
    }, 5000); // Simulate a delay of 5 seconds
  }, []);

  return (
    <div className="kyc-waiting-page">
      <h1 className="kyc-title">KYC Verification</h1>
      <div className="kyc-message">
        {kycStatus === "waiting" ? (
          <>
            <p>We have received your documents for verification.</p>
            <p>Our team will review them shortly.</p>
            <p><strong>You'll be notified once your KYC is completed.</strong></p>
          </>
        ) : (
          <p>{notification}</p> // Notification when KYC is done
        )}
      </div>
      <div className="notification-section">
        {kycStatus === "waiting" && <p className="waiting-notification">Please be patient while we process your KYC.</p>}
      </div>
    </div>
  );
};

export default KycWaitingPage;
