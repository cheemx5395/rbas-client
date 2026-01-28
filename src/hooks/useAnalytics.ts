import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import type { AnalyticsFilters } from '@/types';

export const useAnalytics = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsApi.getSummary(filters),
  });
};
