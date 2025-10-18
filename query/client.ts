// src/query/client.ts
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { QueryClient } from '@tanstack/react-query';
import { createMMKVPersister } from './persistMMKV';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          
      gcTime: 1000 * 60 * 60,
      retry: (failureCount, error) => {
        // Don't retry on cancellation errors
        if (error?.name === 'CancelledError' || error?.message?.includes('CancelledError')) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on cancellation errors
        if (error?.name === 'CancelledError' || error?.message?.includes('CancelledError')) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

persistQueryClient({
  queryClient,
  persister: createMMKVPersister(),
});
