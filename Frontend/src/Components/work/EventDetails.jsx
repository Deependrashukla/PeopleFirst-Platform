import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./EventDetails.css";
import { auth } from "../../firebase-config"; // Ensure this points to your Firebase configuration
import RazorpayPayment from '../razor';

const EventDetails = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [authToken, setAuthToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState(""); // State for user's email
  const [notificationStatus, setNotificationStatus] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState(""); // Track appointment status
  const [showPayment, setShowPayment] = useState(false); // Control visibility of the payment method
  const [amount, setAmount] = useState(1000); // Default amount in paise
  const [paymentStatus, setPaymentStatus] = useState("");
  const [workerDetails, setWorkerDetails] = useState(null); // Store worker details

  if (!event) {
    return <div>Event not found.</div>;
  }
  console.log(event)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
          setUserId(user.uid);
          setUserEmail(user.email);
        } catch (error) {
          console.error("Error fetching auth token:", error.message);
        }
      } else {
        setAuthToken("");
        setUserId("");
        setUserEmail("");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleBookAppointment = () => {
    fetch("http://127.0.0.1:5000/post_appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        user_email: userEmail,
        service_type: event.title,
        appointment_time: event.start_time,
        status: "Not completed",
        worker_aadhar: event.aadhaar_number,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setNotificationStatus(
            "Your appointment request has been sent to the worker! Please wait until the worker approves."
          );
          checkAppointmentStatus(); // Start polling the server for updates
        } else {
          setNotificationStatus("Failed to send appointment request. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setNotificationStatus("An error occurred while sending the request.");
      });
  };

  const checkAppointmentStatus = () => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/get_appointment_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user_email: userEmail,
          worker_aadhar: event.aadhaar_number,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.success){
            setAppointmentStatus("accepted");
            setShowPayment(true); // Show payment method
            clearInterval(interval); // Stop polling
          }
        })
        .catch((error) => console.error("Error checking appointment status:", error));
    }, 5000); // Poll every 5 seconds
  };

  const handleAmountChange = (change) => {
    setAmount((prevAmount) => prevAmount + change);
  };

  const handlePayment = () => {
    setPaymentStatus("Payment Processing...");
    // Simulate payment success
    setTimeout(() => {
      setPaymentStatus("Payment Successful!");
      fetchWorkerDetails(); // Fetch worker details after payment is successful
    }, 2000); // Simulate a delay for payment processing
  };

  const fetchWorkerDetails = () => {
    // Fetch worker details from the server (for demonstration, assuming the worker data is available)
    fetch(`http://127.0.0.1:5000/get_worker_details?aadhaar=${event.aadhaar_number}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setWorkerDetails(data.worker); // Store worker details
        } else {
          setNotificationStatus("Failed to fetch worker details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching worker details:", error);
        setNotificationStatus("An error occurred while fetching worker details.");
      });
  };

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      {/* <img src={event.imageUrl} alt={event.title} className="event-image" /> */}
      <div className="event-info">
        <p><strong>Category:</strong> {event.title}</p>
        <p><strong>Place:</strong> {event.city}</p>
        <p><strong>Start Time:</strong> {event.start_time}</p>
        <p><strong>End Time:</strong> {event.end_time}</p>
        <p><strong>Price Range:</strong> {event.price}</p>
        <p><strong>Description:</strong> {event.work_description}</p>
      </div>

      {notificationStatus && appointmentStatus !== "accepted" && (
        <div className="notification-message">{notificationStatus}</div>
      )}

      
      {appointmentStatus === "accepted" ? (
        <div className="payment-method">
          <h3>Payment Method</h3>
          <p>Your Appointment has been Confirmed</p>
          <p>Please proceed with the payment to confirm your booking.</p>
          <div className="amount-control">
            <button onClick={() => handleAmountChange(-100)}>-</button>
            <input
              type="number"
              value={amount}
              readOnly
              className="amount-input"
            />
            <button onClick={() => handleAmountChange(100)}>+</button>
          </div>
          <button className="pay-button" onClick={handlePayment}>
            {paymentStatus ? paymentStatus : "Pay Now"}
          </button>
        </div>
      ) : (
        <div className="button-container">
          <button className="book-button" onClick={handleBookAppointment}>
            Book Appointment
          </button>
        </div>
      )}

      {workerDetails && paymentStatus === "Payment Successful!" && (
        <div className="worker-details">
          <h3>Worker Details</h3>
            <p><strong>Name:</strong> {workerDetails.first_name} {workerDetails.last_name}</p>
            <p><strong>Contact:</strong> {workerDetails.mobile}</p>
            <p><strong>Address:</strong> {workerDetails.address}</p>
            <p><strong>Occupation:</strong> {workerDetails.occupation}</p>
            <p><strong>Email:</strong> {workerDetails.email}</p>
            <p><strong>Experience:</strong> {workerDetails.experience} years</p>
            <p><strong>Age:</strong> {workerDetails.age}</p>
            <p><strong>Date of Birth:</strong> {workerDetails.dob}</p>

          {/* Add more worker details as needed */}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
