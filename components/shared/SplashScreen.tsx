import React from 'react';
import { ActivityIndicator, Image, StatusBar, StyleSheet, View } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/App-Logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color="red" 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 60,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;