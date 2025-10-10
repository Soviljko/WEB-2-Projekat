// src/models/Auth.ts

export interface LoginDTO {
    EmailOrUsername: string;
    Password: string;  // Changed to match backend
}

export interface RegisterDTO{
    Username: string;  // Changed to match backend
    Email: string;     // Changed to match backend
    Password: string;  // Changed to match backend
    ImageUrl?: string; // Changed to match backend
}

export interface AuthResponse{
    Token: string;     // Changed to match backend (UserDTO)
    Username: string;  // Changed to match backend (UserDTO)
    Email: string;     // Changed to match backend (UserDTO)
}