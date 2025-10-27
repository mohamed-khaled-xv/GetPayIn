import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Typography } from '../../styles/typography';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.8));

  React.useEffect(() => {
    if (!isOnline) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOnline, fadeAnim, scaleAnim]);

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.badge}>
        <Ionicons name="cloud-offline" size={14} color="#ffffff" />
        <Text style={styles.text}>Offline</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: Typography.fontFamily.semiBold,
    letterSpacing: 0.3,
  },
});
