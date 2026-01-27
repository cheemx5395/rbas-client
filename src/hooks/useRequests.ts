import { requestApi } from '@/api/requests'
import type { DiscountRequestCreate, ExpenseRequestCreate, FlagRequest, LeaveRequestCreate, RequestAction, RequestType, ApprovalRequest } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UseRequestsOptions {
    mine?: boolean
    status?: string
}

export const useRequests = (options?: UseRequestsOptions) => {
    return useQuery<ApprovalRequest[]>({
        queryKey: ['requests', options],
        queryFn: () => requestApi.list(options),
    })
}

export const useRequest = (id: number) => {
    return useQuery<ApprovalRequest>({
        queryKey: ['request', id],
        queryFn: () => requestApi.get(id),
        enabled: !!id,
    })
}

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  const createLeave = useMutation({
    mutationFn: (data: LeaveRequestCreate) => requestApi.createLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const createExpense = useMutation({
    mutationFn: (data: ExpenseRequestCreate) => requestApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const createDiscount = useMutation({
    mutationFn: (data: DiscountRequestCreate) => requestApi.createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  return {
    createLeave,
    createExpense,
    createDiscount,
    createRequest: (type: RequestType, data: LeaveRequestCreate | ExpenseRequestCreate | DiscountRequestCreate) => {
      switch (type) {
        case 'LEAVE':
          return createLeave.mutateAsync(data as LeaveRequestCreate);
        case 'EXPENSE':
          return createExpense.mutateAsync(data as ExpenseRequestCreate);
        case 'DISCOUNT':
          return createDiscount.mutateAsync(data as DiscountRequestCreate);
      }
    },
    isLoading: createLeave.isPending || createExpense.isPending || createDiscount.isPending,
  };
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LeaveRequestCreate | ExpenseRequestCreate | DiscountRequestCreate }) =>
      requestApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
    },
  });
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requestApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
};

export const useRequestAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RequestAction }) => requestApi.action(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
    },
  });
};

export const useFlagRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FlagRequest }) => requestApi.flag(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
    },
  });
};
