import { useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { useAppDispatch, useAppSelector } from '../store';
import { loginFailure, restoreSession } from '../store/slices/authSlice';
import { useValidateSession } from './api/useAuth';

const storage = new MMKV();

export const useSessionManager = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const validateSession = useValidateSession();

  useEffect(() => {
    const initializeSession = async () => {
      const storedToken = storage.getString('auth_token');
      const storedUserData = storage.getString('user_data');

      if (storedToken && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          
          dispatch(restoreSession({
            user: userData,
            token: storedToken,
          }));

          
          validateSession.refetch();
        } catch {
          
          storage.delete('auth_token');
          storage.delete('user_data');
          dispatch(loginFailure('Invalid session data'));
        }
      }
    };

    if (!isAuthenticated) {
      initializeSession();
    }
  }, [isAuthenticated, dispatch, validateSession]);

  return {
    isAuthenticated,
    token,
    isValidating: validateSession.isFetching,
  };
};