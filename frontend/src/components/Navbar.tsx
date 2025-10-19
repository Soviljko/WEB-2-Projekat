// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import '../styles/Navbar.css';

interface DecodedToken {
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

const Navbar: React.FC = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const token = localStorage.getItem('token');
    let userRole = '';

    if (token) {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        } catch (error) {
            console.error('Invalid token');
        }
    }

    return (
        <nav className='navbar'>
            <div className='navbar-links'>
                {!token && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
                {token && (
                    <>
                        <Link to="/quizzes">Kvizovi</Link>
                        <Link to="/my-results">Moji rezultati</Link>
                        <Link to="/leaderboard">Rang lista</Link>
                        {userRole === 'Admin' && (
                            <>
                                <Link to="/admin/quizzes">Admin Panel</Link>
                                <Link to="/admin/results">Rezultati korisnika</Link>
                            </>
                        )}
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