import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { OfflineIndicator } from '../components/shared';
import { resetAutoLockTimer } from '../hooks/useAutoLockSimple';
import AllProductsScreen from '../screens/AllProductsScreen';
import CategoryScreen from '../screens/CategoryScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { Typography } from '../styles/typography';


type RootStackParamList = {
  Main: undefined;
  Login: undefined;
};

type TabParamList = {
  All: undefined;
  Categories: undefined;
  SignOut: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const dispatch = useAppDispatch();
  
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e9ecef',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666666',
        headerStyle: {
          backgroundColor: '#ffffff',
          shadowColor: '#e9ecef',
        },
        headerTintColor: '#1a1a1a',
        headerTitleStyle: {
          fontFamily: Typography.fontFamily.semiBold,
          fontSize: 18,
        },
        headerRight: () => <OfflineIndicator />,
      }}
    >
      <Tabs.Screen 
        name="All" 
        component={AllProductsScreen}
        options={{ 
          title: 'All Products',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'storefront' : 'storefront-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen 
        name="Categories" 
        component={CategoryScreen}
        options={{ 
          title: 'Categories',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'apps' : 'apps-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="SignOut"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            dispatch(logout());
          },
        }}
        options={{ 
          tabBarLabel: 'Sign Out',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'log-out' : 'log-out-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  
  const navigationTheme = {
    dark: false,
    colors: {
      primary: '#007AFF',
      background: '#f8f9fa',
      card: '#ffffff',
      text: '#1a1a1a',
      border: '#e9ecef',
      notification: '#007AFF',
    },
    fonts: {
      regular: {
        fontFamily: Typography.fontFamily.regular,
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: Typography.fontFamily.medium,
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: Typography.fontFamily.bold,
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: Typography.fontFamily.extraBold,
        fontWeight: '800' as const,
      },
    },
  };

  return (
    <NavigationContainer 
      theme={navigationTheme}
      onStateChange={() => {
        
        resetAutoLockTimer();
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#1a1a1a',
          headerTitleStyle: {
            fontFamily: Typography.fontFamily.semiBold,
            fontSize: 18,
          },
          headerShadowVisible: true,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
