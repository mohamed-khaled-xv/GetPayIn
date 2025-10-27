// src/query/client.ts
import NetInfo from '@react-native-community/netinfo';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { createMMKVPersister } from './persistMMKV';


onlineManager.setEventListener(setOnline => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setOnline(state.isConnected ?? false);
  });
  return () => unsubscribe();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          
      gcTime: Infinity,
      retry: (failureCount, error) => {
        // Don't retry on cancellation errors
        if (error?.name === 'CancelledError' || error?.message?.includes('CancelledError')) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnReconnect: true,
      refetchOnMount: false, 
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: (failureCount, error) => {
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
  maxAge: Infinity, 
  buster: '', 
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      return query.state.status !== 'pending';
    },
  },
});
