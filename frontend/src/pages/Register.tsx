// src/pages/Register.tsx

import React, {useState} from "react";
import { register } from "../services/AuthService.ts";
import { RegisterDTO } from "../models/Auth.ts";
import '../styles/Register.css';

const Register: React.FC = () => {
    const[formData, setFormData] = useState<RegisterDTO>({
        Username: '',
        Email: '',
        Password: '',
        ImageUrl: '',
    });

    const[error, setError] = useState<string | null>(null);
    const[success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try
        {
            const response = await register(formData);

            localStorage.setItem('token', response.Token);
            setSuccess(true);
            setError(null);
            alert('Registration successfull');

        }catch(err: any){
            setError('Error during registration. Check entered data.');
        }
    };

    return (
        <div className="register-container">
            <h2>Registration</h2>
            {error && <p style={{ color: 'red'}}>{error}</p>}
            {success && <p style={{ color: 'green'}}>Successfull registration!</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Username"
                    placeholder="Username"
                    value={formData.Username}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                type="email"
                name="Email"
                placeholder="Email"
                value={formData.Email}
                onChange={handleChange}
                required
                />
                <br />
                <input
                type="password"
                name="Password"
                placeholder="Lozinka"
                value={formData.Password}
                onChange={handleChange}
                required
                />
                <br />
                <input
                type="text"
                name="ImageUrl"
                placeholder="URL slike (opciono)"
                value={formData.ImageUrl}
                onChange={handleChange}
                />
                <br />
                {formData.ImageUrl && (
                    <div className="image-preview">
                        <img src={formData.ImageUrl} alt="Preview"/>
                    </div>
                )}
                <button type="submit">Register button</button>
            </form>
        </div>
    );
};

export default Register;