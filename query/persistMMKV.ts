import { MMKV } from 'react-native-mmkv';
import type { Persister } from '@tanstack/query-persist-client-core';

export const mmkv = new MMKV({ id: 'react-query' });

export const createMMKVPersister = (): Persister => ({
  persistClient: async client =>
    mmkv.set('rq-cache', JSON.stringify(client)),
  restoreClient: async () => {
    const s = mmkv.getString('rq-cache');
    return s ? JSON.parse(s) : undefined;
  },
  removeClient: async () => mmkv.delete('rq-cache'),
});
