// Color palette based on your design attachments
export const Colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  
  // Neutral colors (from darkest to lightest)
  black: '#1C1C1E',
  darkGray: '#2C2C2E', 
  mediumGray: '#3A3A3C',
  gray: '#48484A',
  lightGray: '#8E8E93',
  lightGray2: '#AEAEB2',
  lightGray3: '#C7C7CC',
  lightGray4: '#D1D1D6',
  lightGray5: '#E5E5EA',
  lightGray6: '#F2F2F7',
  white: '#FFFFFF',
  
  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  
  // Social colors
  facebook: '#1877F2',
  google: '#DB4437',
  
  // Background colors
  background: '#F2F2F7',
  surface: '#FFFFFF',
  
  // Text colors
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  
  // Border colors
  border: '#C7C7CC',
  borderLight: '#E5E5EA',
} as const;

export const DarkColors = {
  // Primary colors (keep same for consistency)
  primary: '#007AFF',
  primaryDark: '#0056CC',
  
  // Neutral colors (inverted for dark mode)
  black: '#FFFFFF',
  darkGray: '#F2F2F7',
  mediumGray: '#E5E5EA',
  gray: '#D1D1D6',
  lightGray: '#C7C7CC',
  lightGray2: '#AEAEB2',
  lightGray3: '#8E8E93',
  lightGray4: '#48484A',
  lightGray5: '#3A3A3C',
  lightGray6: '#2C2C2E',
  white: '#1C1C1E',
  
  // Status colors (slightly adjusted for dark mode)
  success: '#30D158',
  error: '#FF453A',
  warning: '#FF9F0A',
  
  // Social colors (same)
  facebook: '#1877F2',
  google: '#DB4437',
  
  // Background colors
  background: '#000000',
  surface: '#1C1C1E',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary: '#8E8E93',
  
  // Border colors
  border: '#3A3A3C',
  borderLight: '#2C2C2E',
} as const;