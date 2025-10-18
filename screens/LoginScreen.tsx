import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLogin } from '../hooks/api/useAuth';
import { Typography } from '../styles/typography';

interface TestCredential {
  username: string;
  password: string;
  role: 'user' | 'admin';
  label: string;
}

const testCredentials: TestCredential[] = [
  { username: 'evelyns', password: 'evelynspass', role: 'user', label: 'User Account' },
  { username: 'emmaj', password: 'emmajpass', role: 'admin', label: 'Admin Account' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    loginMutation.mutate(
      {
        username: email.trim(),
        password: password.trim(),
      },
      {
        onError: (error) => {
          Alert.alert(
            'Login Failed',
            error.message || 'Invalid credentials. Please try again.'
          );
        },
      }
    );
  };

  const handleTestCredentialSelect = (credential: TestCredential) => {
    setEmail(credential.username);
    setPassword(credential.password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999999"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999999"
                secureTextEntry={!showPassword}
                autoComplete="current-password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              loginMutation.isPending && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={loginMutation.isPending}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testCredentials}>
          <Text style={styles.testTitle}>Choose an account for testing</Text>
          {testCredentials.map((credential, index) => (
            <TouchableOpacity
              key={index}
              style={styles.testCredentialButton}
              onPress={() => handleTestCredentialSelect(credential)}
              activeOpacity={0.7}
            >
              <View style={styles.testCredentialContent}>
                <Text style={styles.testCredentialLabel}>
                  {credential.label}
                </Text>
                <Text style={styles.testCredentialUsername}>
                  {credential.username}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 24,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 28,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    color: '#666666',
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    fontFamily: Typography.fontFamily.regular,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  testCredentials: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  testCredentialButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  testCredentialContent: {
    alignItems: 'center',
  },
  testCredentialLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  testCredentialUsername: {
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  signUpLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});