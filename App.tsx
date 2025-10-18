import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AppRegistry } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { DeleteAlertProvider, LockOverlay, SplashScreen } from './components/shared';
import { useAutoLock } from './hooks/useAutoLockSimple';
import { useFonts } from './hooks/useFonts';
import { useSessionManager } from './hooks/useSessionManager';
import RootNavigator from './navigator/RootNavigator';
import { queryClient } from './query/client';
import { store } from './store';

function AppInner(){
  const fontsLoaded = useFonts();
  useAutoLock();
  useSessionManager();
  
  if (!fontsLoaded) {
    return <SplashScreen />;
  }
  
  return (
    <DeleteAlertProvider>
      <RootNavigator />
      <LockOverlay />
      <Toast />
    </DeleteAlertProvider>
  );
}

function App(){
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </Provider>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;
