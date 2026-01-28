import apiClient from './client';
import type { Policy } from '@/types';

export const policiesApi = {
    // List all policies
    list: async (): Promise<Policy[]> => {
        const response = await apiClient.get('/api/approval/policies/');
        return response.data;
    },

    // Get single policy
    get: async (id: number): Promise<Policy> => {
        const response = await apiClient.get(`/api/approval/policies/${id}/`);
        return response.data;
    },

    // Create policy
    create: async (data: Omit<Policy, 'id'>): Promise<Policy> => {
        const response = await apiClient.post('/api/approval/policies/', data);
        return response.data;
    },

    // Update policy
    update: async (id: number, data: Omit<Policy, 'id'>): Promise<Policy> => {
        const response = await apiClient.put(`/api/approval/policies/${id}/`, data);
        return response.data;
    },

    // Delete policy
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/approval/policies/${id}/`);
    },
};
