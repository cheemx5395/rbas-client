import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policiesApi } from '@/api/policies';
import type { Policy } from '@/types';

export const usePolicies = () => {
    return useQuery({
        queryKey: ['policies'],
        queryFn: () => policiesApi.list(),
    });
};

export const usePolicy = (id: number) => {
    return useQuery({
        queryKey: ['policy', id],
        queryFn: () => policiesApi.get(id),
        enabled: !!id,
    });
};

export const useCreatePolicy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Policy, 'id'>) => policiesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['policies'] });
        },
    });
};

export const useUpdatePolicy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Omit<Policy, 'id'> }) => policiesApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['policies'] });
            queryClient.invalidateQueries({ queryKey: ['policy', id] });
        },
    });
};

export const useDeletePolicy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => policiesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['policies'] });
        },
    });
};
