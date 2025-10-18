import * as LocalAuth from 'expo-local-authentication';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { lock, unlock } from './../store/slices/lockSlice';
import { useAppDispatch, useAppSelector } from './useTyped';

const INACTIVITY_MS = 10_000; 


let globalTimer: ReturnType<typeof setTimeout> | null = null;
let globalDispatch: any = null;


export const resetAutoLockTimer = () => {
  console.log('User activity detected - resetting auto-lock timer');
  
  if (globalTimer) {
    clearTimeout(globalTimer);
  }
  
  if (globalDispatch) {
    globalTimer = setTimeout(() => {
      console.log('Auto-lock triggered after 10 seconds of inactivity');
      globalDispatch(lock());
    }, INACTIVITY_MS);
  }
};


export const tryBiometricUnlock = async (dispatch: any) => {
  try {
    const hasHardware = await LocalAuth.hasHardwareAsync();
    const isEnrolled = await LocalAuth.isEnrolledAsync();
    
    if (hasHardware && isEnrolled) {
      console.log('Attempting manual biometric authentication');
      const result = await LocalAuth.authenticateAsync({
        promptMessage: 'Unlock App',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
      });
      
      if (result.success) {
        console.log('Manual biometric authentication successful');
        dispatch(unlock());
        return true;
      } else {
        console.log('Manual biometric authentication failed or cancelled');
        return false;
      }
    } else {
      console.log('Biometric authentication not available');
      return false;
    }
  } catch (error) {
    console.error('Manual biometric authentication error:', error);
    return false;
  }
};

export const useAutoLock = () => {
  const dispatch = useAppDispatch();
  const locked = useAppSelector(s => s.lock.locked);
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);

  
  globalDispatch = dispatch;

  
  useEffect(() => {
    if (isAuthenticated && !locked) {
      console.log('Starting auto-lock timer for authenticated user');
      resetAutoLockTimer();
    } else if (!isAuthenticated || locked) {
      
      if (globalTimer) {
        clearTimeout(globalTimer);
        globalTimer = null;
      }
    }
  }, [isAuthenticated, locked]);

  
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('App state changed to:', nextAppState);
      
      if (nextAppState !== 'active' && isAuthenticated) {
        
        console.log('App backgrounded - locking immediately');
        dispatch(lock());
      } else if (nextAppState === 'active' && isAuthenticated && !locked) {
        
        console.log('App foregrounded - resetting timer');
        resetAutoLockTimer();
      }
    });

    return () => {
      appStateSubscription.remove();
      if (globalTimer) {
        clearTimeout(globalTimer);
        globalTimer = null;
      }
    };
  }, [dispatch, isAuthenticated, locked]);

  
  useEffect(() => {
    if (locked) {
      (async () => {
        try {
          const hasHardware = await LocalAuth.hasHardwareAsync();
          const isEnrolled = await LocalAuth.isEnrolledAsync();
          
          if (hasHardware && isEnrolled) {
            console.log('Attempting biometric authentication');
            const result = await LocalAuth.authenticateAsync({
              promptMessage: 'Unlock App',
              cancelLabel: 'Use Password',
              fallbackLabel: 'Use Password',
            });
            
            if (result.success) {
              console.log('Biometric authentication successful');
              dispatch(unlock());
            } else {
              console.log('Biometric authentication failed or cancelled');
            }
          } else {
            console.log('Biometric authentication not available');
          }
        } catch (error) {
          console.error('Biometric authentication error:', error);
        }
      })();
    }
  }, [locked, dispatch]);

  return {
    resetTimer: resetAutoLockTimer,
  };
};