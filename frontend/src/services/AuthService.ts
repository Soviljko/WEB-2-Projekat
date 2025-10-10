// src/services/AuthService.ts

import api from '../api/api.ts';
import { LoginDTO, RegisterDTO, AuthResponse } from '../models/Auth';

export const login = async(data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);

    return response.data;
};

export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const response = await api.post('/api/auth/register', data);
  return response.data;
};