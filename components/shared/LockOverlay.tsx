import { Ionicons } from '@expo/vector-icons';
import * as LocalAuth from 'expo-local-authentication';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { tryBiometricUnlock } from '../../hooks/useAutoLockSimple';
import { useAppDispatch } from '../../hooks/useTyped';
import { RootState } from '../../store';
import { unlock } from '../../store/slices/lockSlice';
import { Typography } from '../../styles/typography';

const FALLBACK_PASSWORD = process.env.EXPO_PUBLIC_FALLBACK_PASSWORD || '1111';

export default function LockOverlay() {
  const locked = useSelector((s: RootState) => s.lock.locked);
  const dispatch = useAppDispatch();
  
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);
  
  if (!locked) return null;

  const handleUnlock = async () => {
    const success = await tryBiometricUnlock(dispatch);
    
    if (!success) {
      const hasHardware = await LocalAuth.hasHardwareAsync();
      const isEnrolled = await LocalAuth.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        setIsBiometricAvailable(false);
        setShowPasswordInput(true);
      }
    }
  };

  const handlePasswordUnlock = () => {
    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your password',
      });
      return;
    }

    if (password === FALLBACK_PASSWORD) {
      dispatch(unlock());
      setPassword('');
      setShowPasswordInput(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'App unlocked successfully',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Incorrect password',
      });
      setPassword('');
    }
  };

  const handleUseFallback = () => {
    setShowPasswordInput(true);
  };


  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.lockIconBackground}>
            <Ionicons 
              name="lock-closed" 
              size={48} 
              color="#ffffff" 
            />
          </View>
        </View>
        <Text style={styles.title}>App Locked</Text>
        <Text style={styles.subtitle}>
          {showPasswordInput 
            ? 'Enter your account password to unlock' 
            : 'The app is locked for security. Please unlock to continue.'}
        </Text>
        
        {showPasswordInput ? (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="#999999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoFocus
                onSubmitEditing={handlePasswordUnlock}
              />
            </View>
            
            <TouchableOpacity style={styles.unlockButton} onPress={handlePasswordUnlock}>
              <View style={styles.unlockButtonContent}>
                <Ionicons 
                  name="lock-open" 
                  size={20} 
                  color="#ffffff" 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.unlockButtonText}>Unlock with Password</Text>
              </View>
            </TouchableOpacity>

            {isBiometricAvailable && (
              <TouchableOpacity style={styles.fallbackButton} onPress={handleUnlock}>
                <Ionicons 
                  name="finger-print" 
                  size={18} 
                  color="#007AFF" 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.fallbackButtonText}>Use Biometric</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
              <View style={styles.unlockButtonContent}>
                <Ionicons 
                  name="finger-print" 
                  size={20} 
                  color="#ffffff" 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.unlockButtonText}>Unlock with Biometric</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fallbackButton} onPress={handleUseFallback}>
              <Ionicons 
                name="key-outline" 
                size={18} 
                color="#007AFF" 
                style={styles.buttonIcon} 
              />
              <Text style={styles.fallbackButtonText}>Use Password</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  lockIconBackground: {
    backgroundColor: '#007AFF',
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: Typography.fontFamily.bold,
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.regular,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  unlockButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  unlockButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  unlockButtonText: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.semiBold,
    color: '#ffffff',
  },
  fallbackButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fallbackButtonText: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
    color: '#007AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: Typography.fontFamily.regular,
    color: '#1a1a1a',
  },
});
