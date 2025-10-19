import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const username = localStorage.getItem('userName') || 'Admin';

    return (
        <div className="admin-dashboard-container">
            <div className="welcome-section">
                <h1>Welcome to Admin Dashboard</h1>
                <p className="welcome-message">Hello, {username}! Manage your quizzes and view results.</p>
            </div>

            <div className="dashboard-cards">
                <Link to="/admin/quizzes" className="dashboard-card">
                    <div className="card-icon">📝</div>
                    <h3>Manage Quizzes</h3>
                    <p>Create, edit, and delete quizzes</p>
                </Link>

                <Link to="/admin/quiz/create" className="dashboard-card">
                    <div className="card-icon">➕</div>
                    <h3>Create New Quiz</h3>
                    <p>Add a new quiz with questions</p>
                </Link>

                <Link to="/admin/results" className="dashboard-card">
                    <div className="card-icon">📊</div>
                    <h3>View All Results</h3>
                    <p>See all user quiz results</p>
                </Link>

                <Link to="/quizzes" className="dashboard-card">
                    <div className="card-icon">🎯</div>
                    <h3>Take Quizzes</h3>
                    <p>Test your knowledge</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
