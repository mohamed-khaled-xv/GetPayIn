import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { tryBiometricUnlock } from '../../hooks/useAutoLockSimple';
import { useAppDispatch } from '../../hooks/useTyped';
import { RootState } from '../../store';
import { Typography } from '../../styles/typography';

export default function LockOverlay() {
  const locked = useSelector((s: RootState) => s.lock.locked);
  const dispatch = useAppDispatch();
  
  if (!locked) return null;

  const handleUnlock = async () => {
    await tryBiometricUnlock(dispatch);
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
          The app is locked for security. Please unlock to continue.
        </Text>
        
        <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
          <View style={styles.unlockButtonContent}>
            <Ionicons 
              name="finger-print" 
              size={20} 
              color="#ffffff" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.unlockButtonText}>Unlock</Text>
          </View>
        </TouchableOpacity>
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
});
