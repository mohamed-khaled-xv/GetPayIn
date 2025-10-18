import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Typography } from '../../styles/typography';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontFamily: Typography.fontFamily.semiBold,
      color: '#1a1a1a',
      marginBottom: 12,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: '#f8f9fa',
      borderColor: error 
        ? '#ef4444' 
        : isFocused 
          ? '#007AFF' 
          : '#e9ecef',
      height: 48,
      paddingHorizontal: 16,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: Typography.fontFamily.regular,
      color: '#1a1a1a',
      paddingVertical: 0, 
    },
    leftIcon: {
      marginRight: 12,
    },
    rightIcon: {
      marginLeft: 12,
    },
    error: {
      fontSize: 12,
      fontFamily: Typography.fontFamily.regular,
      color: '#ef4444',
      marginTop: 8,
    },
  });

  const handleSecureTextToggle = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor="#999999"
          secureTextEntry={secureTextEntry && !isSecureTextVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={handleSecureTextToggle}
          >
            <Ionicons 
              name={isSecureTextVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#999999" 
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      {error && (
        <Text style={[styles.error, errorStyle]}>{error}</Text>
      )}
    </View>
  );
};