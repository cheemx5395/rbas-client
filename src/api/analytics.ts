import apiClient from './client';
import type { AnalyticsSummary, AnalyticsFilters } from '@/types';

export const analyticsApi = {
  getSummary: async (filters?: AnalyticsFilters): Promise<AnalyticsSummary> => {
    const params = new URLSearchParams();
    if (filters?.user_id) {
      params.append('user_id', String(filters.user_id));
    }
    if (filters?.grade) {
      params.append('grade', filters.grade);
    }
    if (filters?.month) {
      params.append('month', String(filters.month));
    }
    if (filters?.year) {
      params.append('year', String(filters.year));
    }
    if (filters?.request_type) {
      params.append('request_type', filters.request_type);
    }
    const response = await apiClient.get(`/api/approval/admin/analytics/summary/?${params.toString()}`);
    return response.data;
  },
};
