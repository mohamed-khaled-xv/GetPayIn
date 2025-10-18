import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { authApi, LoginCredentials } from '../../services/api';
import { useAppDispatch } from '../../store';
import { loginFailure, loginStart, loginSuccess, restoreSession } from '../../store/slices/authSlice';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      
      const role = data.username === 'emmaj' ? 'admin' : 'user';
      
      dispatch(loginSuccess({
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
          role: role,
        },
        token: data.accessToken, 
      }));
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Login error details:', error);
      let message = 'Login failed';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      } else if (error.response?.status === 400) {
        message = 'Invalid username or password';
      }
      
      dispatch(loginFailure(message));
    },
  });
};

export const useValidateSession = () => {
  const dispatch = useAppDispatch();
  
  const query = useQuery({
    queryKey: ['validate-session'],
    queryFn: authApi.validateSession,
    enabled: false, 
    retry: false,
    staleTime: 0,
  });

  
  React.useEffect(() => {
    if (query.data) {
      
      const role = query.data.username === 'emmaj' ? 'admin' : 'user';
      
      dispatch(restoreSession({
        user: {
          id: query.data.id,
          username: query.data.username,
          email: query.data.email,
          firstName: query.data.firstName,
          lastName: query.data.lastName,
          gender: query.data.gender,
          image: query.data.image,
          role: role,
        },
        token: query.data.accessToken, 
      }));
    }
  }, [query.data, dispatch]);

  React.useEffect(() => {
    if (query.error) {
      
      dispatch(loginFailure('Session expired'));
    }
  }, [query.error, dispatch]);

  return query;
};