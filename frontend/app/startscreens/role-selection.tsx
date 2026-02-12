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

const RoleSelectionScreen = () => {
  const handlePatientSignup = () => {
    router.push('./signup-patient');
  };

  const handleWorkerSignup = () => {
    router.push('./signup-worker');
  };

  const handleLoginRedirect = () => {
    router.replace('/startscreens/signin-role-selection');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name='chevron-back-outline' size={width * 0.08} color="#333" />
        </TouchableOpacity>
        <Text style={styles.heading}>Sign Up</Text>
        <View style={{ width: width * 0.08 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Account Type</Text>
        <Text style={styles.subtitle}>
          Select how you want to use Pulmovision
        </Text>

        {/* Patient Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={handlePatientSignup}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={width * 0.15} color="#1a78d2" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Patient Signup</Text>
            <Text style={styles.cardDescription}>
              Get instant access to respiratory health monitoring and analysis
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={width * 0.06} color="#1a78d2" />
        </TouchableOpacity>

        {/* Worker Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={handleWorkerSignup}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="doctor" size={width * 0.15} color="#1a78d2" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Worker Signup</Text>
            <Text style={styles.cardDescription}>
              Register as a healthcare worker (requires admin approval)
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={width * 0.06} color="#1a78d2" />
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={width * 0.05} color="#666" />
          <Text style={styles.infoText}>
            Worker accounts require admin verification for security purposes
          </Text>
        </View>
      </View>

      {/* Already have account */}
      <View style={styles.loginRedirectContainer}>
        <Text style={styles.loginRedirectText}>Already have an account? </Text>
        <TouchableOpacity onPress={handleLoginRedirect}>
          <Text style={styles.loginRedirectLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoleSelectionScreen;

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
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.04,
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
  },
  cardDescription: {
    fontSize: width * 0.035,
    color: '#666',
    lineHeight: width * 0.05,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    padding: width * 0.04,
    marginTop: height * 0.02,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  infoText: {
    flex: 1,
    fontSize: width * 0.035,
    color: '#666',
    marginLeft: width * 0.02,
    lineHeight: width * 0.05,
  },
  loginRedirectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.03,
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
});