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

const PatientSignupScreen = () => {
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

  const handleSignUp = async () => {
    // Basic validation
    if (!name || !age || !gender || !phoneNumber || !cnic || !email || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords you entered do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long for security.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address (e.g., example@email.com).');
      return;
    }

    // CNIC validation (13 digits)
    if (!/^\d{13}$/.test(cnic)) {
      Alert.alert('Invalid CNIC', 'CNIC must be exactly 13 digits. Please check and try again.');
      return;
    }

    // Phone validation (11 digits)
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 11) {
      Alert.alert('Invalid Phone Number', 'Phone number must be 11 digits. Please check and try again.');
      return;
    }

    // Age validation
    const ageNum = parseInt(age);
    if (ageNum < 1 || ageNum > 150) {
      Alert.alert('Invalid Age', 'Please enter a valid age.');
      return;
    }

    setLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          age: ageNum,
          gender,
          phoneNumber: cleanedPhone,
          cnic,
          email: email.trim().toLowerCase(),
          password,
          role: 'patient',
        }),
      });

      setLoading(false);

      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        // Handle specific error messages from backend
        let errorTitle = 'Registration Failed';
        let errorMessage = result.error || 'Unable to create account. Please try again.';

        // Check for common backend error messages and provide user-friendly versions
        const errorLower = (result.error || '').toLowerCase();
        
        if (errorLower.includes('email') && errorLower.includes('already')) {
          errorTitle = 'Email Already Registered';
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (errorLower.includes('cnic') && errorLower.includes('already')) {
          errorTitle = 'CNIC Already Registered';
          errorMessage = 'This CNIC is already registered in our system. Please contact support if you think this is an error.';
        } else if (errorLower.includes('phone') && errorLower.includes('already')) {
          errorTitle = 'Phone Number Already Registered';
          errorMessage = 'This phone number is already registered. Please use a different number or contact support.';
        } else if (errorLower.includes('network') || errorLower.includes('connection')) {
          errorTitle = 'Network Error';
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (errorLower.includes('timeout')) {
          errorTitle = 'Connection Timeout';
          errorMessage = 'The request took too long. Please check your internet connection and try again.';
        } else if (errorLower.includes('validation') || errorLower.includes('invalid')) {
          errorTitle = 'Invalid Information';
          errorMessage = 'Some information provided is invalid. Please check all fields and try again.';
        }

        Alert.alert(errorTitle, errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      Alert.alert(
        'Network Error',
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.replace('/startscreens/patientlogin');
  };

  const handleLoginRedirect = () => {
    router.replace('/startscreens/patientlogin');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Navigate to Terms of Service page.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Navigate to Privacy Policy page.');
  };

  const formatCNIC = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');
    // Limit to 13 digits
    const limited = cleaned.slice(0, 13);
    setCnic(limited);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 11);
    setPhoneNumber(limited);
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
          <Text style={styles.heading}>Patient Signup</Text>
          <View style={{ width: width * 0.08 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Input Fields Section */}
          <View style={styles.inputSection}>
            {/* Name Input Field */}
            <View style={styles.fieldview}>
              <Ionicons name="person-outline" size={width * 0.06} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your name'
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input Field */}
            <View style={styles.fieldview}>
              <MaterialCommunityIcons name="email-outline" size={width * 0.06} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                placeholderTextColor="gray"
                keyboardType='email-address'
                autoCapitalize='none'
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Age Input Field */}
            <View style={styles.fieldview}>
              <MaterialCommunityIcons name="calendar-range-outline" size={width * 0.06} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your age'
                placeholderTextColor="gray"
                keyboardType='numeric'
                value={age}
                onChangeText={setAge}
              />
            </View>

            {/* Gender Input Field */}
            <TouchableOpacity 
              style={styles.fieldview}
              onPress={() => setShowGenderPicker(true)}
            >
              <Ionicons name="person-outline" size={width * 0.06} color="gray" style={styles.inputIcon} />
              <Text style={[styles.input, !gender && styles.placeholder]}>
                {gender || 'Select your gender'}
              </Text>
              <Ionicons name="chevron-down-outline" size={width * 0.05} color="gray" />
            </TouchableOpacity>

            {/* Phone Input Field */}
            <View style={styles.fieldview}>
              <FontAwesome name="phone" size={width * 0.06} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your phone number (11 digits)'
                placeholderTextColor="gray"
                keyboardType='phone-pad'
                value={phoneNumber}
                onChangeText={formatPhoneNumber}
                maxLength={11}
              />
            </View>

            {/* CNIC Input Field */}
            <View style={styles.fieldview}>
              <AntDesign name="idcard" size={width * 0.06} color="gray" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Enter your CNIC (13 digits)'
                placeholderTextColor="gray"
                keyboardType='numeric'
                value={cnic}
                onChangeText={formatCNIC}
                maxLength={13}
              />
            </View>

            {/* Create New Password Field */}
            <View style={styles.fieldview}>
              <FontAwesome name='lock' size={width * 0.06} color={"gray"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Create new password (min 6 characters)'
                placeholderTextColor="gray"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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

            {/* Confirm Password Field */}
            <View style={styles.fieldview}>
              <FontAwesome name='lock' size={width * 0.06} color={"gray"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder='Confirm password'
                placeholderTextColor="gray"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
          </View>

          {/* Terms and Privacy Policy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              I agree to the Pulmovision{' '}
              <Text style={styles.termsLink} onPress={handleTermsOfService}>
                Terms of services
              </Text>{' '}
              and{' '}
              <Text style={styles.termsLink} onPress={handlePrivacyPolicy}>
                Privacy Policy
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
              }}
            >
              <Picker.Item label="Select Gender" value="" />
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
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successMessage}>
              Account created successfully! You can now login.
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

export default PatientSignupScreen;

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
    paddingTop: height * 0.03,
    paddingBottom: height * 0.03,
    alignItems: 'center',
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
    marginBottom: height * 0.025,
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
});