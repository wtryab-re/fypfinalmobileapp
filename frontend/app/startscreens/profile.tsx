import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { 
  Dimensions, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  ScrollView,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const { width, height } = Dimensions.get('window');

// Types
interface Worker {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  cnic: string;
  age: number;
  gender: string;
  role: string;
  isApproved: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

const WorkerProfile: React.FC = () => {
  const [workerData, setWorkerData] = useState<Worker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchWorkerProfile();
  }, []);

  // Fetch worker profile
  const fetchWorkerProfile = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('workerToken');

      if (!token) {
        router.replace('/startscreens/login' as any);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/worker/profile`, {
        headers: { token }
      });

      if (response.data.success) {
        setWorkerData(response.data.worker);
      } else {
        console.error('Failed to fetch worker profile:', response.data.message);
        Alert.alert('Error', 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching worker profile:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('workerToken');
            router.replace('/startscreens/login' as any);
          }
        }
      ]
    );
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a78d2" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workerData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWorkerProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          {/* Profile Icon */}
          <View style={styles.profileIconContainer}>
            <Ionicons name="person-circle" size={width * 0.28} color="#1a78d2" />
          </View>
          
          <Text style={styles.profileName}>{workerData.name}</Text>
          <Text style={styles.profileRole}>Health Worker</Text>
          <View style={styles.workerIdBadge}>
            <Text style={styles.workerIdText}>
              HW-{workerData._id.slice(-8).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={22} color="#1a78d2" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{workerData.email}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={22} color="#1a78d2" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{workerData.phoneNumber}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="card-outline" size={22} color="#1a78d2" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>CNIC</Text>
                <Text style={styles.infoValue}>{workerData.cnic}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar-outline" size={22} color="#1a78d2" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{workerData.age} years</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons 
                  name={workerData.gender === 'Male' ? 'male-outline' : 'female-outline'} 
                  size={22} 
                  color="#1a78d2" 
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{workerData.gender}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#4CAF50" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <View style={styles.approvedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.approvedText}>Approved</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time-outline" size={22} color="#1a78d2" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>{formatDate(workerData.createdAt)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/startscreens/healthWorkerDashboard')}>
          <Ionicons name="home-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('./notifications' as any)}>
          <Ionicons name="notifications-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('./profile' as any)}>
          <Ionicons name="person" size={width * 0.07} color="#1a78d2" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WorkerProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
  },
  errorText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#999',
    marginTop: height * 0.02,
  },
  retryButton: {
    backgroundColor: '#1a78d2',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.015,
    borderRadius: 25,
    marginTop: height * 0.03,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    paddingBottom: height * 0.02,
  },
  profileHeaderCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: height * 0.04,
    marginBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileIconContainer: {
    marginBottom: height * 0.02,
  },
  profileName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  profileRole: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.015,
  },
  workerIdBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 20,
  },
  workerIdText: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#1a78d2',
  },
  section: {
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    borderRadius: 12,
    paddingVertical: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
  },
  infoIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: width * 0.035,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: width * 0.04,
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  approvedText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#4CAF50',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F44336',
    marginTop: height * 0.02,
  },
  logoutButtonText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#F44336',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: height * 0.02,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height * 0.08,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
});