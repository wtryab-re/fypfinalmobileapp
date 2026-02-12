import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ENDPOINTS, apiCall } from '../api';

const { width, height } = Dimensions.get('window');

const WorkerSignupScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({
    name: '', age: '', gender: '', phoneNumber: '', cnic: '', email: '', password: '', confirmPassword: ''
  });

  const validateForm = () => {
    const newErrors = {
      name: '', age: '', gender: '', phoneNumber: '', cnic: '', email: '', password: '', confirmPassword: ''
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
      isValid = false;
    }

    if (!age) {
      newErrors.age = 'Please enter your age.';
      isValid = false;
    } else if (parseInt(age) < 18 || parseInt(age) > 100) {
      newErrors.age = 'Please enter a valid age between 18 and 100.';
      isValid = false;
    }

    if (!gender) {
      newErrors.gender = 'Please select your gender.';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number.';
      isValid = false;
    } else if (!/^\d{11}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 11-digit phone number.';
      isValid = false;
    }

    if (!cnic) {
      newErrors.cnic = 'Please enter your CNIC.';
      isValid = false;
    } else if (!/^\d{13}$/.test(cnic)) {
      newErrors.cnic = 'CNIC must be exactly 13 digits.';
      isValid = false;
    }

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
      newErrors.password = 'Please create a password.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => {
    setErrors({
      name: '', age: '', gender: '', phoneNumber: '', cnic: '', email: '', password: '', confirmPassword: ''
    });
  };

  const handleSignUp = async () => {
    clearErrors();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          age: parseInt(age),
          gender,
          phoneNumber: phoneNumber.trim(),
          cnic,
          email: email.trim().toLowerCase(),
          password,
          role: 'worker',
        }),
      });

      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        Alert.alert('Registration Failed', result.error || 'An error occurred during registration. Please try again.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.replace('/startscreens/workerlogin');
  };

  const handleLoginRedirect = () => {
    router.replace('/startscreens/workerlogin');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Navigate to terms of service page.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Navigate to privacy policy page.');
  };

  const formatCNIC = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 13);
    setCnic(limited);
    if (errors.cnic) clearErrors();
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 11);
    setPhoneNumber(limited);
    if (errors.phoneNumber) clearErrors();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Ionicons name='chevron-back-outline' size={width * 0.08} color="#333" />
          </TouchableOpacity>
          <Text style={styles.heading}>Worker Signup</Text>
          <View style={{ width: width * 0.08 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={width * 0.06} color="#1a78d2" />
            <Text style={styles.infoBannerText}>
              Worker accounts require admin approval. You'll be notified once approved.
            </Text>
          </View>

          {/* Input Fields Section */}
          <View style={styles.inputSection}>
            {/* Name Input Field */}
            <View style={styles.fieldview}>
              <Ionicons 
                name="person-outline" 
                size={width * 0.06} 
                color={errors.name ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder='Enter your full name'
                placeholderTextColor="gray"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) clearErrors();
                }}
              />
            </View>
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

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
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) clearErrors();
                }}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            {/* Age Input Field */}
            <View style={styles.fieldview}>
              <MaterialCommunityIcons 
                name="calendar-range-outline" 
                size={width * 0.06} 
                color={errors.age ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder='Enter your age'
                placeholderTextColor="gray"
                keyboardType='numeric'
                value={age}
                onChangeText={(text) => {
                  setAge(text.replace(/[^0-9]/g, ''));
                  if (errors.age) clearErrors();
                }}
                maxLength={3}
              />
            </View>
            {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

            {/* Gender Input Field */}
            <TouchableOpacity 
              style={[styles.fieldview, errors.gender && styles.inputError]}
              onPress={() => setShowGenderPicker(true)}
            >
              <Ionicons 
                name="person-outline" 
                size={width * 0.06} 
                color={errors.gender ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <Text style={[styles.input, !gender && styles.placeholder]}>
                {gender || 'Select your gender'}
              </Text>
              <Ionicons name="chevron-down-outline" size={width * 0.05} color="gray" />
            </TouchableOpacity>
            {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

            {/* Phone Input Field */}
            <View style={styles.fieldview}>
              <FontAwesome 
                name="phone" 
                size={width * 0.06} 
                color={errors.phoneNumber ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.phoneNumber && styles.inputError]}
                placeholder='Enter your phone number (11 digits)'
                placeholderTextColor="gray"
                keyboardType='phone-pad'
                value={phoneNumber}
                onChangeText={formatPhoneNumber}
                maxLength={11}
              />
            </View>
            {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

            {/* CNIC Input Field */}
            <View style={styles.fieldview}>
              <AntDesign 
                name="idcard" 
                size={width * 0.06} 
                color={errors.cnic ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.cnic && styles.inputError]}
                placeholder='Enter your CNIC (13 digits)'
                placeholderTextColor="gray"
                keyboardType='numeric'
                value={cnic}
                onChangeText={formatCNIC}
                maxLength={13}
              />
            </View>
            {errors.cnic ? <Text style={styles.errorText}>{errors.cnic}</Text> : null}

            {/* Create New Password Field */}
            <View style={styles.fieldview}>
              <FontAwesome 
                name='lock' 
                size={width * 0.06} 
                color={errors.password ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder='Create new password'
                placeholderTextColor="gray"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) clearErrors();
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={width * 0.06}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* Confirm Password Field */}
            <View style={styles.fieldview}>
              <FontAwesome 
                name='lock' 
                size={width * 0.06} 
                color={errors.confirmPassword ? '#ff3b30' : "gray"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder='Confirm password'
                placeholderTextColor="gray"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) clearErrors();
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={width * 0.06}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          {/* Terms and Privacy Policy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              I agree to the Pulmovision{' '}
              <Text style={styles.termsLink} onPress={handleTermsOfService}>
                terms of service
              </Text>{' '}
              and{' '}
              <Text style={styles.termsLink} onPress={handlePrivacyPolicy}>
                privacy policy
              </Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.signUpButton, loading && styles.buttonDisabled]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Already have an account? Login */}
          <View style={styles.loginRedirectContainer}>
            <Text style={styles.loginRedirectText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginRedirectLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                <Ionicons name="close" size={width * 0.07} color="#333" />
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => {
                setGender(itemValue);
                setShowGenderPicker(false);
                if (errors.gender) clearErrors();
              }}
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Success Popup Modal */}
      <Modal
        visible={showSuccessPopup}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={width * 0.15} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successMessage}>
              Your account has been created successfully! Please wait for administrator approval before you can log in. You will be notified once your account is approved.
            </Text>
            <TouchableOpacity 
              style={styles.successButton}
              onPress={handleSuccessPopupClose}
            >
              <Text style={styles.successButtonText}>Continue to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WorkerSignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingTop: Platform.OS === 'ios' ? height * 0.02 : height * 0.02,
    paddingBottom: height * 0.02,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
    alignItems: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.025,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#1a78d2',
  },
  infoBannerText: {
    flex: 1,
    fontSize: width * 0.035,
    color: '#1565c0',
    marginLeft: width * 0.03,
    lineHeight: width * 0.05,
  },
  inputSection: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  fieldview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    paddingVertical: 0,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  placeholder: {
    color: 'gray',
  },
  passwordToggle: {
    paddingLeft: width * 0.02,
  },
  termsContainer: {
    width: '100%',
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.02,
  },
  termsText: {
    fontSize: width * 0.035,
    color: '#555',
    textAlign: 'center',
    lineHeight: width * 0.05,
  },
  termsLink: {
    color: '#1a78d2',
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#1a78d2',
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
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  loginRedirectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  loginRedirectText: {
    fontSize: width * 0.04,
    color: '#555',
  },
  loginRedirectLink: {
    fontSize: width * 0.04,
    color: '#1a78d2',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: height * 0.03,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  // Success Popup Styles
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: width * 0.05,
  },
  successModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: width * 0.06,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: height * 0.02,
  },
  successTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    lineHeight: width * 0.06,
    marginBottom: height * 0.03,
  },
  successButton: {
    backgroundColor: '#1a78d2',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: width * 0.033,
    marginBottom: height * 0.015,
    marginLeft: width * 0.04,
    alignSelf: 'flex-start',
  },
});