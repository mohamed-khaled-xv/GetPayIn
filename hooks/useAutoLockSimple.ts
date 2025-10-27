import * as LocalAuth from 'expo-local-authentication';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { lock, unlock } from './../store/slices/lockSlice';
import { useAppDispatch, useAppSelector } from './useTyped';

const INACTIVITY_MS = 10_000; 


let globalTimer: ReturnType<typeof setTimeout> | null = null;
let globalDispatch: any = null;


export const resetAutoLockTimer = () => {
  
  if (globalTimer) {
    clearTimeout(globalTimer);
  }
  
  if (globalDispatch) {
    globalTimer = setTimeout(() => {
      globalDispatch(lock());
    }, INACTIVITY_MS);
  }
};


export const tryBiometricUnlock = async (dispatch: any) => {
  try {
    const hasHardware = await LocalAuth.hasHardwareAsync();
    const isEnrolled = await LocalAuth.isEnrolledAsync();
    
    if (hasHardware && isEnrolled) {
      const result = await LocalAuth.authenticateAsync({
        promptMessage: 'Unlock App',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
      });
      
      if (result.success) {
        dispatch(unlock());
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error)
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
      
      if (nextAppState !== 'active' && isAuthenticated) {
        
        dispatch(lock());
      } else if (nextAppState === 'active' && isAuthenticated && !locked) {
        
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

  return {
    resetTimer: resetAutoLockTimer,
  };
};