import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS, apiCall } from '../api';

const { width, height } = Dimensions.get('window');

const PatientLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery feature coming soon!');
  };

  const handleSignUp = () => {
    router.push('/startscreens/signup-patient');
  };

 const handleLogin = async () => {
  // Input validation
  if (!email || !password) {
    Alert.alert('Missing Information', 'Please enter both email and password to continue.');
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    Alert.alert('Invalid Email', 'Please enter a valid email address (e.g., example@email.com).');
    return;
  }

  setLoading(true);

  try {
    const result = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ 
        email: email.trim().toLowerCase(), 
        password 
      }),
    });

    setLoading(false);

    if (result.success && result.data) {
      const { user, token } = result.data;

      // Verify user data exists
      if (!user || !user.role) {
        Alert.alert(
          'Login Error',
          'Invalid response from server. Please try again or contact support.'
        );
        return;
      }

      // Role verification
      if (user.role !== 'patient') {
        Alert.alert(
          'Wrong Account Type', 
          'This login is for patients only. Please use the healthcare worker login if you are a medical professional.'
        );
        return;
      }

      try {
        // Store authentication data securely
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('userRole', user.role);
        await SecureStore.setItemAsync('userName', user.name);
        console.log('Token stored securely.');
      } catch (error) {
        console.error('Error storing token:', error);
      }

      console.log('✅ Login successful, navigating to dashboard...');
      router.replace('/startscreens/patientDashboard');
      
    } else {
      // Handle specific error cases with user-friendly messages
      let errorTitle = 'Login Failed';
      let errorMessage = 'Email or password is incorrect. Please try again.';

      // Check for error in result
      if (result.error) {
        const errorLower = result.error.toLowerCase();
        
        // Account not found or incorrect email
        if (errorLower.includes('user') && (errorLower.includes('not found') || errorLower.includes('does not exist') || errorLower.includes('doesn\'t exist') || errorLower.includes('no user') || errorLower.includes('invalid email'))) {
          errorTitle = 'Account Not Found';
          errorMessage = 'No account found with this email. Please check your email or sign up for a new account.';
        }
        // Wrong password
        else if (errorLower.includes('password') || errorLower.includes('incorrect') || errorLower.includes('invalid credentials') || errorLower.includes('wrong password')) {
          errorTitle = 'Incorrect Password';
          errorMessage = 'The password you entered is incorrect. Please try again or use "Forgot Password".';
        }
        // Email not verified (if applicable)
        else if (errorLower.includes('verify') || errorLower.includes('verification')) {
          errorTitle = 'Email Not Verified';
          errorMessage = 'Please verify your email address before logging in. Check your inbox for the verification link.';
        }
        // Account suspended/disabled
        else if (errorLower.includes('suspend') || errorLower.includes('disabled') || errorLower.includes('deactivated')) {
          errorTitle = 'Account Suspended';
          errorMessage = 'Your account has been suspended. Please contact support for assistance.';
        }
        // Network/connection errors
        else if (errorLower.includes('network') || errorLower.includes('connection') || errorLower.includes('timeout')) {
          errorTitle = 'Connection Error';
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        }
        // Server errors
        else if (errorLower.includes('server') || errorLower.includes('500')) {
          errorTitle = 'Server Error';
          errorMessage = 'Our servers are experiencing issues. Please try again in a few moments.';
        }
        // Use backend error message if it's user-friendly
        else if (result.error.length < 100) {
          errorMessage = result.error;
        }
      }
      // If we have an error but couldn't categorize it specifically, show generic incorrect credentials message
      Alert.alert(errorTitle, errorMessage);
    }
  } catch (error) {
    setLoading(false);
    console.error('Login error:', error);
    
    // Handle network errors or other exceptions
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('internet') || errorMessage.includes('failed to fetch')) {
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      } else {
        Alert.alert(
          'Login Error',
          'Email or password is incorrect. Please try again.'
        );
      }
    } else {
      Alert.alert(
        'Login Error',
        'Email or password is incorrect. Please try again.'
      );
    }
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Ionicons name='chevron-back-outline' size={width * 0.08} color="#333" />
          </TouchableOpacity>
          <Text style={styles.heading}>Patient Login</Text>
          <View style={{ width: width * 0.08 }} />
        </View>

        {/* Main Content */}
        <View style={styles.contentArea}>
          <View style={styles.inputSection}>
            {/* Email */}
            <View style={styles.fieldview}>
              <MaterialCommunityIcons 
                name="email-outline" 
                size={width * 0.06} 
                color="gray" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                placeholderTextColor="gray"
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldview}>
              <FontAwesome name='lock' size={width * 0.06} color={"gray"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your password'
                placeholderTextColor="gray"
                secureTextEntry={!showPassword}
                autoCapitalize='none'
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={width * 0.06}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't Have an Account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PatientLoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', paddingHorizontal: width * 0.05, paddingTop: height * 0.02,
    paddingBottom: height * 0.02, backgroundColor: '#fff', zIndex: 1,
  },
  heading: { fontSize: width * 0.06, color: '#333', fontFamily: "Poppins_Bold" },
  contentArea: {
    flex: 1, paddingHorizontal: width * 0.05, paddingTop: height * 0.05, alignItems: 'center',
  },
  inputSection: { width: '100%', marginBottom: height * 0.02 },
  fieldview: {
    flexDirection: 'row', alignItems: "center", backgroundColor: "#f5f5f5",
    borderRadius: 30, paddingHorizontal: width * 0.04, height: height * 0.07,
    marginBottom: height * 0.025, width: '100%',
  },
  inputIcon: { marginRight: width * 0.03 },
  input: {
    fontFamily: 'Poppins_Regular', flex: 1, fontSize: width * 0.04,
    color: '#333', paddingVertical: 0,
  },
  passwordToggle: { paddingLeft: width * 0.02 },
  forgotPasswordContainer: {
    width: '100%', alignItems: 'flex-end', marginTop: -height * 0.01,
    marginBottom: height * 0.03,
  },
  forgotPasswordText: { fontSize: width * 0.035, color: '#1a78d2', fontFamily: 'Poppins_Regular' },
  loginButton: {
    backgroundColor: "#1a78d2", width: '100%', paddingVertical: height * 0.02,
    borderRadius: 30, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
  },
  buttonDisabled: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontSize: width * 0.05, fontFamily: 'Poppins_Bold' },
  signUpContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: height * 0.04, marginBottom: height * 0.02,
  },
  signUpText: { fontSize: width * 0.04, color: '#555', fontFamily: 'Poppins_Regular' },
  signUpLink: { fontSize: width * 0.04, color: '#1a78d2', fontFamily: 'Poppins_Bold' },
});