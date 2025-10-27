import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected ?? true);
      setIsConnected(state.isConnected ?? true);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isOnline, isConnected };
};
