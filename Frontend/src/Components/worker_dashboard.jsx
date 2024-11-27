import React, { useEffect, useState } from "react";
import "./worker_dashboard.css"; // Updated CSS for styling

const WorkerDashboard = () => {
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] =  useState('');

  useEffect(() => {
    const fetchAuthToken = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                setAuthToken(token);
            } else {
                console.log("User not logged in");
            }
        } catch (error) {
            const errorMessage = error.message.match(/\(([^)]+)\)/)[1];
            console.error("Error fetching auth token:", errorMessage);
        }
    };




    fetchAuthToken();
    }, []);

  useEffect(() => {
    const fetchWorkerWorks = async () => {
      try {
        const data = workerId; // Replace with API call if required
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
            {workerData.completed_works && workerData.completed_works.length > 0 ? (
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
            {workerData.in_progress_works && workerData.in_progress_works.length > 0 ? (
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
            {workerData.awaiting_works && workerData.awaiting_works.length > 0 ? (
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
