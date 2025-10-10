// src/pages/Login.tsx

import React, {useState} from "react";
import { login } from "../services/AuthService.ts";
import { LoginDTO } from "../models/Auth.ts";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../utils/token.ts";

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginDTO> ({
        EmailOrUsername: '',
        Password: '',
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({...formData, [e.target.name]: e.target.value});
       } ;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try
        {
            console.log('Attempting login with:', formData);
            const response = await login(formData);
            console.log('Login response:', response);

            localStorage.setItem('token', response.Token);
            setError(null);

            const payload = parseJwt(response.Token);
            console.log('Parsed JWT payload:', payload);

            if (!payload) {
                throw new Error('Failed to parse JWT token');
            }

            const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            const userId = payload["id"];
            const userName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            localStorage.setItem("userId", userId);
            localStorage.setItem("userName", userName);

            console.log('Role:', role, 'UserID:', userId, 'Username:', userName);

            if(role === 'Admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/quizzes');
            }
        } catch(err: any){
            console.error('Login error:', err);
            console.error('Error response:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials...';
            setError(errorMessage);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p>{error}</p>}
                <input 
                    type="text"
                    name="EmailOrUsername"
                    placeholder="Enter Username or Email"
                    value={formData.EmailOrUsername}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                />

                <input
                    type="password"
                    name="Password"
                    placeholder="Enter password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;