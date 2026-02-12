import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const LoginSelectionScreen = () => {
  const handlePatientLogin = () => {
    router.push('/startscreens/patientlogin');
  };

  const handleWorkerLogin = () => {
    router.push('/startscreens/workerlogin');
  };

  const handleSignUpRedirect = () => {
    router.replace('/startscreens/role-selection');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name='chevron-back-outline' size={width * 0.08} color="#333" />
        </TouchableOpacity>
        <Text style={styles.heading}>Login</Text>
        <View style={{ width: width * 0.08 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Login Type</Text>
        <Text style={styles.subtitle}>
          Select your account type to continue
        </Text>

        {/* Patient Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={handlePatientLogin}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={width * 0.15} color="#1a78d2" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Patient Login</Text>
            <Text style={styles.cardDescription}>
              Access your health records and monitoring
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={width * 0.06} color="#1a78d2" />
        </TouchableOpacity>

        {/* Worker Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={handleWorkerLogin}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="doctor" size={width * 0.15} color="#1a78d2" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Worker Login</Text>
            <Text style={styles.cardDescription}>
              Healthcare worker dashboard access
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={width * 0.06} color="#1a78d2" />
        </TouchableOpacity>
      </View>

      {/* Don't have account */}
      <View style={styles.signUpRedirectContainer}>
        <Text style={styles.signUpRedirectText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleSignUpRedirect}>
          <Text style={styles.signUpRedirectLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins_Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
    fontFamily: 'Poppins_Bold',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.04,
    fontFamily: 'Poppins_Regular',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width * 0.03,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
    fontFamily: 'Poppins_Bold',
  },
  cardDescription: {
    fontSize: width * 0.035,
    color: '#666',
    lineHeight: width * 0.05,
    fontFamily: 'Poppins_Regular',
  },
  signUpRedirectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.03,
  },
  signUpRedirectText: {
    fontSize: width * 0.04,
    color: '#555',
    fontFamily: 'Poppins_Regular',
  },
  signUpRedirectLink: {
    fontSize: width * 0.04,
    color: '#1a78d2',
    fontWeight: 'bold',
    fontFamily: 'Poppins_Bold',
  },
});