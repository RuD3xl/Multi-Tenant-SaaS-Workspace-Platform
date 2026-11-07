import { api } from './api';
import type { LoginRequest, AuthResponse, RegisterRequest } from '../types/auth.types';

export const authService = {

    login: async (request: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', request);
        return response.data;
    },

    register: async (request: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', request);
        return response.data;
    }

};