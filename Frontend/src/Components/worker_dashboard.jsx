import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config"; // Import auth from Firebase or your auth provider
import "./worker_dashboard.css"; // Updated CSS for styling

const WorkerDashboard = () => {
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [aadharNumber, setAadharNumber] = useState(''); // Store the aadhar number

  const [formData, setFormData] = useState({
    aadharCard: ""
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);

          // Directly use the email from Firebase Auth
          const email = user.email;

          // Fetch user data from the backend using the email
          const userDataResponse = await fetch('http://127.0.0.1:5000/get_user_data', {
            method: 'POST',  // Assuming you use POST to send data
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email })  // Sending the email in the request body
          });

          const userData = await userDataResponse.json();
          console.log("worker data: ", userData.success)

          if (true) {
            // Extract the aadhar_number from the response
            const userAadharNumber = userData.data.aadhar_number;
            console.log("aadhar:", userAadharNumber)
            // Fetch appointments using the aadhar_number
            const appointmentResponse = await fetch('http://127.0.0.1:5000/get_appointment', {
              method: 'POST',  // Assuming you use POST for this request too
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ aadhar_number: userAadharNumber })  // Send aadhar_number to get appointments
            });

            const appointmentData = await appointmentResponse.json();
            console.log("appointment", appointmentData.data)
            console.log("workdata", workerData)
            if (true) {
              setWorkerData(appointmentData.data); // Assign the 'data' field to workerData
            } else {
              setError("No appointments found.");
            }
          } else {
            throw new Error('User data not found');
          }
        } catch (error) {
          console.error("Error fetching data:", error.message);
          setError("An error occurred while fetching the data.");
        } finally {
          setLoading(false);
        }
      } else {
        setAuthToken('');
        setWorkerData(null);
      }
    });

    return () => unsubscribe();
  }, [authToken]);

  const acceptAppointment = async (appointmentId) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/update_appointment_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ appointment_id: appointmentId, status: 'accepted' }),
      });

      const result = await response.json();
      console.log(result)
      console.log("sona")
      if (result.success) {
        // Update the appointment status in the frontend state
        setWorkerData((prevData) =>
          prevData.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: 'accepted' }
              : appointment
          )
        );
      } else {
        console.error("Failed to update appointment status:", result.message);
      }
    } catch (err) {
      console.error("Error updating appointment status:", err.message);
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="worker-dashboard">
      <h1 className="dashboard-title">Worker Dashboard</h1>
      <div className="dashboard-columns">
        {/* Display appointments or tasks */}
        <div className="dashboard-section">
          <h2 className="section-title grey">Awaiting Appointments</h2>
          <div className="job-cards">
            {workerData?.length > 0 ? (
              workerData.map((appointment, index) => (
                <div className="job-card grey-bg" key={index}>
                  <div><strong>Service Type:</strong> {appointment.service_type}</div>
                  {/* <div><strong>User Email:</strong> {appointment.user_email}</div> */}
                  <div><strong>Status:</strong> {appointment.status}</div>
                  <div><strong>Appointment Time:</strong> {new Date(appointment.appointment_time).toLocaleString()}</div> {/* Format date */}
                  {appointment.status === 'Not completed' && (
                    <button onClick={() => acceptAppointment(appointment.id)}>
                      Accept
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="no-jobs"> No awaiting appointments.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
