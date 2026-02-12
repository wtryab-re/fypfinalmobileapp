import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage'; // ADD THIS IMPORT
import { API_ENDPOINTS, apiCall } from '../api';

const { width, height } = Dimensions.get('window');

interface LoginErrors {
  email: string;
  password: string;
}

interface User {
  role: string;
  isApproved: boolean;
  name: string;
  _id: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
  status?: number;
}

const WorkerLoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({ email: '', password: '' });
  
  const passwordTimeoutRef = useRef<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = (): void => {
    setErrors({ email: '', password: '' });
  };

  const handleContactAdmin = (): void => {
    Alert.alert(
      'Contact Administrator',
      'For password recovery or account issues, please contact your administrator.',
      [{ text: 'OK' }]
    );
  };

  // Handle password text visibility with delay
  const handlePasswordChange = (text: string): void => {
    setPassword(text);
    
    // Clear existing timeout
    if (passwordTimeoutRef.current) {
      clearTimeout(passwordTimeoutRef.current);
    }
    
    // Show text temporarily
    setShowPasswordText(true);
    
    // Hide text after 0.6 seconds
    passwordTimeoutRef.current = setTimeout(() => {
      setShowPasswordText(false);
    }, 600) as unknown as number;
    
    if (errors.password) clearErrors();
  };

  // Improved error handling function
  const showErrorAlert = (title: string, message: string): void => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleLogin = async (): Promise<void> => {
    clearErrors();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result: LoginResponse = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      console.log('Login API Response:', result);

      if (result.success && result.data) {
        const { user, token } = result.data;

        // Check if user data exists and has role property
        if (!user || !user.role) {
          showErrorAlert(
            'Login Failed',
            'Invalid response from server. Please try again.'
          );
          return;
        }

        // Check if user is a worker
        if (user.role !== 'worker') {
          showErrorAlert(
            'Access Denied', 
            'This login is for healthcare workers only. Please use the patient login.'
          );
          return;
        }

        // Check if worker is approved
        if (!user.isApproved) {
          showErrorAlert(
            'Account Pending Approval',
            'Your account is pending approval by the administrator. You will be notified once your account has been approved.'
          );
          return;
        }

        // ✅ STORE TOKEN - THIS IS THE FIX
        await AsyncStorage.setItem('workerToken', token);
        
        console.log('Login successful:', user);
        console.log('Token stored successfully');

        Alert.alert('Welcome Back', `Welcome back, ${user.name}!`, [
          {
            text: 'Continue',
            onPress: () => {
              // ✅ FIXED NAVIGATION PATH
              router.replace('/startscreens/healthWorkerDashboard' as any);
            },
          },
        ]);
      } else {
        // DEBUG: Let's see what exactly we're getting
        console.log('Error details:', {
          error: result.error,
          status: result.status,
          fullResult: result
        });

        // Better error messages based on server response
        let errorMessage = 'Invalid email or password. Please try again.';
        
        // Check if we have a specific error message from the server
        if (result.error) {
          // Use the exact error message from the server
          errorMessage = result.error;
          
          // You can still add some custom mapping if needed
          const errorLower = result.error.toLowerCase();
          if (errorLower.includes('account') || errorLower.includes('user') || errorLower.includes('not found') || errorLower.includes('does not exist')) {
            errorMessage = 'Account does not exist. Please check your email or contact administrator.';
          } else if (errorLower.includes('password') || errorLower.includes('invalid credentials') || errorLower.includes('incorrect password')) {
            errorMessage = 'Invalid password. Please try again.';
          }
        } 
        // If no specific error message, use status codes
        else if (result.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (result.status === 404) {
          errorMessage = 'Account not found. Please check your email address.';
        } else if (result.status && result.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        showErrorAlert('Login Failed', errorMessage);
      }
    } catch (error: any) {
      console.error('Login catch error:', error);
      
      // Check if this is actually a server error with response data
      if (error.response?.data?.message) {
        showErrorAlert('Login Failed', error.response.data.message);
      } 
      // Check if error has a message property from apiCall
      else if (error.message && error.message !== 'Network request failed') {
        showErrorAlert('Login Failed', error.message);
      }
      // Handle network errors separately
      else if (error.message?.includes('Network request failed')) {
        showErrorAlert('Network Error', 'Unable to connect to the server. Please check your internet connection.');
      } 
      // Generic error fallback
      else {
        showErrorAlert('Login Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (passwordTimeoutRef.current) {
        clearTimeout(passwordTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name='chevron-back-outline' size={width * 0.08} color="#333" />
          </TouchableOpacity>
          <Text style={styles.heading}>Worker Login</Text>
          <View style={{ width: width * 0.08 }} />
        </View>

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="shield-checkmark" size={width * 0.06} color="#1a78d2" />
            <Text style={styles.infoBannerText}>
              Secure healthcare worker access
            </Text>
          </View>

          {/* Input Fields Section */}
          <View style={styles.inputSection}>
            {/* Email Input Field */}
            <View style={styles.fieldview}>
              <MaterialCommunityIcons 
                name="email-outline" 
                size={width * 0.06} 
                color={errors.email ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder='Enter your email'
                placeholderTextColor="gray"
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                value={email}
                onChangeText={(text: string) => {
                  setEmail(text);
                  if (errors.email) clearErrors();
                }}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            {/* Password Input Field */}
            <View style={styles.fieldview}>
              <FontAwesome 
                name='lock' 
                size={width * 0.06} 
                color={errors.password ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder='Enter your password'
                placeholderTextColor="gray"
                secureTextEntry={!showPassword && !showPasswordText}
                autoCapitalize='none'
                autoCorrect={false}
                value={password}
                onChangeText={handlePasswordChange}
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
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* Forgot Password? & Contact Admin Links */}
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={handleContactAdmin}>
                <Text style={styles.linkText}>Forgot password? Contact admin</Text>
              </TouchableOpacity>
            </View>
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WorkerLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  heading: {
    fontSize: width * 0.06,
    color: '#333',
    fontFamily: "Poppins_Bold",
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    alignItems: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.03,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#1a78d2',
  },
  infoBannerText: {
    flex: 1,
    fontSize: width * 0.035,
    color: '#1565c0',
    marginLeft: width * 0.03,
    fontFamily: 'Poppins_Regular',
  },
  inputSection: {
    width: '100%',
  },
  fieldview: {
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    paddingHorizontal: width * 0.04,
    height: height * 0.07,
    marginBottom: height * 0.015,
    width: '100%',
  },
  inputIcon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#333',
    fontFamily: 'Poppins_Regular',
    paddingVertical: 0,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  passwordToggle: {
    paddingLeft: width * 0.02,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.02,
  },
  linkText: {
    fontSize: width * 0.035,
    color: '#1a78d2',
    fontFamily: 'Poppins_Regular',
  },
  loginButton: {
    backgroundColor: "#1a78d2",
    width: '100%',
    paddingVertical: height * 0.02,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.1,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontFamily: 'Poppins_Bold',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: width * 0.033,
    fontFamily: 'Poppins_Regular',
    marginBottom: height * 0.015,
    marginLeft: width * 0.04,
  },
});