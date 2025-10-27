import * as LocalAuth from 'expo-local-authentication';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, PanResponder } from 'react-native';
import { lock, unlock } from './../store/slices/lockSlice';
import { useAppDispatch, useAppSelector } from './useTyped';

const INACTIVITY_MS = 10_000; 

export const useAutoLock = () => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useAppDispatch();
  const locked = useAppSelector(s => s.lock.locked);
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);

  const resetTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    
    
    if (isAuthenticated && !locked) {
      timer.current = setTimeout(() => {
        dispatch(lock());
      }, INACTIVITY_MS);
    }
  }, [isAuthenticated, locked, dispatch]);

  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        resetTimer();
        return false; 
      },
      onMoveShouldSetPanResponder: () => {
        resetTimer();
        return false;
      },
    })
  ).current;

  useEffect(() => {
    
    if (isAuthenticated && !locked) {
      resetTimer();
    }

    
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active' && isAuthenticated) {
        
        dispatch(lock());
      } else if (nextAppState === 'active' && isAuthenticated && !locked) {
        
        resetTimer();
      }
    });

    return () => {
      appStateSubscription.remove();
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [isAuthenticated, locked, dispatch, resetTimer]);

  
  useEffect(() => {
    if (locked && isAuthenticated) {
      (async () => {
        try {
          const hasHardware = await LocalAuth.hasHardwareAsync();
          const isEnrolled = await LocalAuth.isEnrolledAsync();
          
          if (hasHardware && isEnrolled) {
            const result = await LocalAuth.authenticateAsync({
              promptMessage: 'Unlock App',
              cancelLabel: 'Use Password',
              fallbackLabel: 'Use Password',
            });
            
            if (result.success) {
              dispatch(unlock());
            }
          }
        } catch (error) {
          console.log(error)
        }
      })();
    }
  }, [locked, isAuthenticated, dispatch]);

  return {
    panResponder,
    resetTimer,
  };
};
