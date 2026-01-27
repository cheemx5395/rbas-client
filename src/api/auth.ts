import type { LoginRequest, RegisterRequest, TokenResponse, User } from "@/types";
import apiClient from "./client";

export const authApi = {
    register: async (data: RegisterRequest): Promise<{
        message: string
        user: User
    }> => {
        const response = await apiClient.post('/api/auth/register/', data)
        return response.data
    },
    
    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const response = await apiClient.post('/api/auth/login/', data)
        return response.data
    },

    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post('/api/auth/logout/', { refresh: refreshToken})
    },

    getMe: async (): Promise<User> => {
        const response = await apiClient.get('/api/auth/me/')
        return response.data
    }
}