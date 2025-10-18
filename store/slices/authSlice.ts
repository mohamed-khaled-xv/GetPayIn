import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role?: string; // Add role field
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isSuperAdmin: boolean;
}

// Try to restore token from storage on app start
const getInitialToken = (): string | null => {
  try {
    return storage.getString('auth_token') || null;
  } catch {
    return null;
  }
};

const getInitialUser = (): User | null => {
  try {
    const userData = storage.getString('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();

const initialState: AuthState = {
  isAuthenticated: !!initialToken,
  user: initialUser,
  token: initialToken,
  isLoading: false,
  error: null,
  isSuperAdmin: initialUser?.role === 'admin' || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Check if user is admin
      state.isSuperAdmin = action.payload.user.role === 'admin';
      
      // Store in MMKV with error handling
      try {
        storage.set('auth_token', action.payload.token);
        // Create a clean user object for storage (avoid circular references)
        const userToStore = {
          id: action.payload.user.id,
          username: action.payload.user.username,
          email: action.payload.user.email,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          gender: action.payload.user.gender,
          image: action.payload.user.image,
          role: action.payload.user.role,
        };
        storage.set('user_data', JSON.stringify(userToStore));
      } catch (error) {
        console.error('Failed to store auth data:', error);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isSuperAdmin = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.isSuperAdmin = false;
      
      // Clear storage
      storage.delete('auth_token');
      storage.delete('user_data');
    },
    restoreSession: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isSuperAdmin = action.payload.user.role === 'admin';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  restoreSession,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
