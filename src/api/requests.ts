import type { ApprovalRequest, DiscountRequestCreate, ExpenseRequestCreate, FlagRequest, LeaveRequestCreate, RequestAction } from "@/types"
import apiClient from "./client"

interface RequestFilters {
    mine?: boolean
    status?: string
}

export const requestApi = {
    // List Requests
    list: async (filters?:RequestFilters): Promise<ApprovalRequest[]> => {
        const params: Record<string, any> = {}
        if (filters?.mine !== undefined) {
            params.mine = filters.mine
        }
        if (filters?.status) {
            params.status = filters.status
        }
        const response = await apiClient.get('/api/approval/requests/', {params})
        return response.data
    },

    // Get Single Request
    get: async (id: number): Promise<ApprovalRequest> => {
        const response = await apiClient.get(`/api/approval/requests/${id}/`)
        return response.data
    },

    // Create Leave Request
    createLeave: async (data: LeaveRequestCreate): Promise<ApprovalRequest> => {
        const response = await apiClient.post('/api/approval/leave/', data)
        return response.data
    },

    // Create Expense Request
    createExpense: async (data: ExpenseRequestCreate): Promise<ApprovalRequest> => {
        const response = await apiClient.post('/api/approval/expense/', data)
        return response.data
    },

    // Create Discount Request
    createDiscount: async (data: DiscountRequestCreate): Promise<ApprovalRequest> => {
        const response = await apiClient.post('/api/approval/discount/', data)
        return response.data
    },

    // Update Request
    update: async (id: number, data: LeaveRequestCreate | ExpenseRequestCreate | DiscountRequestCreate): Promise<ApprovalRequest> => {
        const response = await apiClient.put(`/api/approval/requests/${id}/`, data)
        return response.data
    },

    // Delete Request
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/approval/requests/${id}/`)
    },

    // Perform action on request (approve/reject/needs_review)
    action: async (id: number, data: RequestAction):Promise<ApprovalRequest> => {
        const response = await apiClient.post(`/api/approval/requests/${id}/action/`, data)
        return response.data
    },

    // Flag/Unflag request
    flag: async (id: number, data: FlagRequest): Promise<ApprovalRequest> => {
        const response = await apiClient.post(`/api/approval/requests/${id}/flag/`, data)
        return response.data
    }
} 