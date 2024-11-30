import React, { useEffect, useState } from "react";
import Pusher from "pusher-js"; // Import Pusher library
import { auth } from "../firebase-config"; // Import auth from Firebase or your auth provider
import "./worker_dashboard.css"; // Updated CSS for styling

const WorkerDashboard = () => {
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [pusherChannel, setPusherChannel] = useState(null);

  // Set up authentication state change listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);

          // After successful login, subscribe to the Pusher channel
          const channel = new Pusher('b472bc7e618991d3b479', {
            cluster: 'ap2',
            forceTLS: true,
            disableStats: true, // Optional: to reduce bandwidth usage
            enabledTransports: ['ws', 'wss', 'xhr_polling', 'xhr_streaming'],
          }).subscribe(`worker-${user.email}-channel`); // Example: dynamic channel based on user email

          setPusherChannel(channel);

          // Listen to events on the channel (for example, 'new-appointment')
          const taskHandler = (data) => {
            console.log('New task received:', data);
            // Update workerData based on the new event if necessary
            setWorkerData((prevData) => ({
              ...prevData,
              new_task: data,
            }));
          };

          channel.bind('new-appointment', taskHandler);

          // Cleanup function to unsubscribe from the Pusher channel when the user logs out
          return () => {
            channel.unbind('new-appointment', taskHandler); // Unbind the event listener
            pusherChannel?.unsubscribe(); // Unsubscribe from the channel if it's already set
          };

        } catch (error) {
          console.error("Error fetching auth token:", error.message);
        }
      } else {
        // User is logged out, clean up
        setAuthToken('');
        if (pusherChannel) {
          pusherChannel.unsubscribe(); // Unsubscribe from the Pusher channel
        }
        console.log("User logged out");
      }
    });

    // Cleanup on component unmount
    return () => unsubscribe();

  }, [pusherChannel]); // Only subscribe/unsubscribe when the pusherChannel changes

  // Handle the worker data fetching based on workerId
  useEffect(() => {
    const fetchWorkerWorks = async () => {
      try {
        const data = workerId; // Replace with actual API call if required
        if (data) {
          setWorkerData(data);
        } else {
          setError("No data found.");
        }
      } catch (err) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerWorks();
  }, [workerId]);

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
        {/* Completed Works */}
        <div className="dashboard-section">
          <h2 className="section-title green">Completed Works</h2>
          <div className="job-cards">
            {workerData?.completed_works?.length > 0 ? (
              workerData.completed_works.map((work, index) => (
                <div className="job-card green-bg" key={index}>
                  <div>{work.title}</div>
                  <div>{work.description}</div>
                  <div>Status: {work.status}</div>
                </div>
              ))
            ) : (
              <p className="no-jobs">No completed works.</p>
            )}
          </div>
        </div>

        {/* In-Progress Works */}
        <div className="dashboard-section">
          <h2 className="section-title orange">In-Progress Works</h2>
          <div className="job-cards">
            {workerData?.in_progress_works?.length > 0 ? (
              workerData.in_progress_works.map((work, index) => (
                <div className="job-card orange-bg" key={index}>
                  <div>{work.title}</div>
                  <div>{work.description}</div>
                  <div>Status: {work.status}</div>
                </div>
              ))
            ) : (
              <p className="no-jobs">No in-progress works.</p>
            )}
          </div>
        </div>

        {/* Awaiting Works */}
        <div className="dashboard-section">
          <h2 className="section-title grey">Awaiting Works</h2>
          <div className="job-cards">
            {workerData?.awaiting_works?.length > 0 ? (
              workerData.awaiting_works.map((work, index) => (
                <div className="job-card grey-bg" key={index}>
                  <div>{work.title}</div>
                  <div>{work.description}</div>
                  <div>Status: {work.status}</div>
                </div>
              ))
            ) : (
              <p className="no-jobs">No awaiting works.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
