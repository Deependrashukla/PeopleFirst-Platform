import React, { useEffect, useState } from "react";
import './worker_dashboard.css'; // For additional styling

const WorkerDashboard = ({ workerId }) => {
    const [workerData, setWorkerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch worker works data from the API
        const fetchWorkerWorks = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/worker-works/${workerId}`);
                const data = await response.json();

                if (response.ok) {
                    setWorkerData(data);
                } else {
                    setError(data.message);
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
            <h1>Worker Dashboard</h1>

            {/* Completed Works */}
            <div className="work-section">
                <h2 className="section-title">Completed Works</h2>
                <div className="works-list">
                    {workerData.completed_works && workerData.completed_works.length > 0 ? (
                        workerData.completed_works.map((work, index) => (
                            <div className="work-item" key={index}>
                                <div className="work-title">{work.title}</div>
                                <div className="work-description">{work.description}</div>
                                <div className="work-status">Status: {work.status}</div>
                            </div>
                        ))
                    ) : (
                        <p className="no-works">No completed works.</p>
                    )}
                </div>
            </div>

            {/* In-Progress Works */}
            <div className="work-section">
                <h2 className="section-title">In-Progress Works</h2>
                <div className="works-list">
                    {workerData.in_progress_works && workerData.in_progress_works.length > 0 ? (
                        workerData.in_progress_works.map((work, index) => (
                            <div className="work-item" key={index}>
                                <div className="work-title">{work.title}</div>
                                <div className="work-description">{work.description}</div>
                                <div className="work-status">Status: {work.status}</div>
                            </div>
                        ))
                    ) : (
                        <p className="no-works">No in-progress works.</p>
                    )}
                </div>
            </div>

            {/* Awaiting Works */}
            <div className="work-section">
                <h2 className="section-title">Awaiting Works</h2>
                <div className="works-list">
                    {workerData.awaiting_works && workerData.awaiting_works.length > 0 ? (
                        workerData.awaiting_works.map((work, index) => (
                            <div className="work-item" key={index}>
                                <div className="work-title">{work.title}</div>
                                <div className="work-description">{work.description}</div>
                                <div className="work-status">Status: {work.status}</div>
                            </div>
                        ))
                    ) : (
                        <p className="no-works">No awaiting works.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
