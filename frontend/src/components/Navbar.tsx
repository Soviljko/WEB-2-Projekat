// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate} from 'react-router-dom';

const Navbar: React.FC = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('login');
    };

    const token = localStorage.getItem('token');

    return (
        <nav className='navbar'>
            <div className='navbar-links'>
                <Link to="/">Pocetna</Link>
                {!token && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
                {token && (
                    <>
                        <Link to="/quizzes">Kvizovi</Link>
                        <Link to="/leaderboard">Rang lista</Link>
                        <Link to="/admin/quizzes">Admin Panel</Link>
                    </>
                )}
            </div>

            {token && (
                <button onClick={handleLogout}>Logout</button>
            )}
        </nav>
    );
};

export default Navbar;