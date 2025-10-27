import NetInfo from '@react-native-community/netinfo';
import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core';
import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV({ id: 'react-query' });

export const createMMKVPersister = (): Persister => ({
  persistClient: async (client) => {
    try {
      const dataToStore: PersistedClient & { persistedAt: number } = {
        ...client,
        persistedAt: Date.now(),
      };
      const serialized = JSON.stringify(dataToStore);
      mmkv.set('rq-cache', serialized);
    } catch (error) {
    }
  },
  restoreClient: async () => {
    try {
      const cached = mmkv.getString('rq-cache');
      if (cached) {
        const parsed = JSON.parse(cached) as PersistedClient & { persistedAt?: number };
        
        // Check network status
        const netInfo = await NetInfo.fetch();
        
        if (!netInfo.isConnected) {
          return parsed;
        }
        
        // When online, check age (24 hours max)
        const maxAge = 1000 * 60 * 60 * 24; // 24 hours
        const age = parsed.persistedAt ? Date.now() - parsed.persistedAt : 0;
        
        if (age > maxAge) {
          return undefined;
        }
        
        return parsed;
      }
      return undefined;
    } catch (error) {
      mmkv.delete('rq-cache');
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      mmkv.delete('rq-cache');
    } catch (error) {
      console.error(error);
    }
  },
});


