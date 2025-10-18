import { User } from '../store/slices/authSlice';

export const getUserPermissions = (user: User | null) => {
  if (!user) {
    return {
      canDelete: false,
      isAdmin: false,
      roleDisplay: 'Guest',
    };
  }

  const isAdmin = user.role === 'admin';

  return {
    canDelete: isAdmin,
    isAdmin,
    roleDisplay: isAdmin ? 'Admin' : 'User',
  };
};

export const formatUserRole = (role?: string): string => {
  if (role === 'admin') return 'Admin';
  if (role === 'user') return 'User';
  return 'Unknown';
};

// Helper function for easier usage in components
export const canDeleteProducts = (user: User | null): boolean => {
  return getUserPermissions(user).canDelete;
};