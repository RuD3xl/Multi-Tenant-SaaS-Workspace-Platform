import { api }  from './api';
import type {UserResponse} from '../types/user.types.ts';

export const userService = {
    getProfile: async (): Promise<UserResponse> => {
        const response = await api.get<UserResponse>('/me');
        return response.data;
    }
};