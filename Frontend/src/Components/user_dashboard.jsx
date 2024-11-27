import React from "react";
import "./user_dashboard.css";

const UserDashboard = ({ workers = [] }) => {
  if (!Array.isArray(workers)) {
    return <p>Error: workers data is not in the correct format.</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="dashboard-sections">
        {/* Requested Workers Section */}
        <div className="dashboard-section">
          <h2 className="section-title blue">Requested Workers</h2>
          <div className="cards-container">
            {workers.filter(worker => worker.status === "requested").length > 0 ? (
              workers
                .filter(worker => worker.status === "requested")
                .map(worker => (
                  <div className="worker-card blue-bg" key={worker.id}>
                    <h3>{worker.name}</h3>
                    <p>Skill: {worker.skill}</p>
                  </div>
                ))
            ) : (
              <p className="no-workers">No workers requested.</p>
            )}
          </div>
        </div>

        {/* Currently Booked Workers Section */}
        <div className="dashboard-section">
          <h2 className="section-title orange">Currently Booked Workers</h2>
          <div className="cards-container">
            {workers.filter(worker => worker.status === "booked").length > 0 ? (
              workers
                .filter(worker => worker.status === "booked")
                .map(worker => (
                  <div className="worker-card orange-bg" key={worker.id}>
                    <h3>{worker.name}</h3>
                    <p>Skill: {worker.skill}</p>
                  </div>
                ))
            ) : (
              <p className="no-workers">No workers currently booked.</p>
            )}
          </div>
        </div>

        {/* Completed Workers Section */}
        <div className="dashboard-section">
          <h2 className="section-title green">Completed Workers</h2>
          <div className="cards-container">
            {workers.filter(worker => worker.status === "completed").length > 0 ? (
              workers
                .filter(worker => worker.status === "completed")
                .map(worker => (
                  <div className="worker-card green-bg" key={worker.id}>
                    <h3>{worker.name}</h3>
                    <p>Skill: {worker.skill}</p>
                  </div>
                ))
            ) : (
              <p className="no-workers">No completed workers.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
