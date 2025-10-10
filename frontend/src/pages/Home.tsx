// src/pages/Home.tsx

import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to QuizHub application</h1>
            <div className="home-buttons">
                <Link to="/login">
                    <button className="home-button">Login</button>
                </Link>
                <Link to="/register">
                    <button className="home-button">Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;