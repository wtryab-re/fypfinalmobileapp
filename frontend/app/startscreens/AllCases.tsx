import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../api'; // IMPORT THIS

const { width, height } = Dimensions.get('window');

// Types
interface Case {
  _id: string;
  patientId: string;
  patientHistory: string;
  imageUrl: string;
  uploadedBy: string;
  status: CaseStatus;
  manualChecks: {
    isLungs: boolean;
    isClear: boolean;
    isVerified: boolean;
  };
  aiResult?: string;
  aiError?: string;
  assignedDoctor?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

type CaseStatus = 
  | 'PENDING_WORKER_REVIEW'
  | 'APPROVED_FOR_AI'
  | 'AI_PROCESSING'
  | 'AI_PROCESSED'
  | 'AI_FAILED'
  | 'ASSIGNED_TO_DOCTOR'
  | 'COMPLETED'
  | 'REJECTED';

interface StatusDisplay {
  text: string;
  color: string;
  bgColor: string;
}

const AllCases: React.FC = () => {
  const [allCases, setAllCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchAllCases();
  }, []);

  // Fetch all cases submitted by worker
  const fetchAllCases = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('workerToken');
      
      if (!token) {
        router.replace('/startscreens/login' as any);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/worker/cases`, {
        headers: { token }
      });

      if (response.data.success) {
        setAllCases(response.data.cases);
      } else {
        console.error('Failed to fetch cases:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull to refresh
  const onRefresh = (): void => {
    setRefreshing(true);
    fetchAllCases();
  };

  // Get status display info
  const getStatusDisplay = (status: CaseStatus): StatusDisplay => {
    const statusMap: Record<CaseStatus, StatusDisplay> = {
      'PENDING_WORKER_REVIEW': { text: 'Pending Review', color: '#FFA500', bgColor: '#FFF3E0' },
      'APPROVED_FOR_AI': { text: 'Approved', color: '#4CAF50', bgColor: '#E8F5E9' },
      'AI_PROCESSING': { text: 'Processing...', color: '#2196F3', bgColor: '#E3F2FD' },
      'AI_PROCESSED': { text: 'AI Processed', color: '#00BCD4', bgColor: '#E0F7FA' },
      'AI_FAILED': { text: 'Failed', color: '#F44336', bgColor: '#FFEBEE' },
      'ASSIGNED_TO_DOCTOR': { text: 'With Doctor', color: '#9C27B0', bgColor: '#F3E5F5' },
      'COMPLETED': { text: 'Completed', color: '#4CAF50', bgColor: '#E8F5E9' },
      'REJECTED': { text: 'Rejected', color: '#F44336', bgColor: '#FFEBEE' },
    };
    return statusMap[status] || { text: 'Unknown', color: '#999', bgColor: '#F5F5F5' };
  };

  // Format case ID
  const formatCaseId = (caseId: string): string => {
    return `C-${caseId.slice(-6).toUpperCase()}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Render each case item
  const renderCaseItem: ListRenderItem<Case> = ({ item }) => {
    const statusInfo = getStatusDisplay(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.caseCard}
        onPress={() => router.push({
          pathname: '/startscreens/seeStatus' as any,
          params: { caseId: item._id }
        })}
      >
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.caseImage} 
        />
        
        <View style={styles.caseInfo}>
          <View style={styles.caseHeader}>
            <Text style={styles.caseId}>{formatCaseId(item._id)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>
          
          <Text style={styles.patientId}>Patient: P-{item.patientId}</Text>
          <Text style={styles.caseDate}>
            <Ionicons name="calendar-outline" size={14} color="#999" /> {formatDate(item.createdAt)}
          </Text>
          
          {item.assignedDoctor && (
            <Text style={styles.doctorInfo}>
              <Ionicons name="person-outline" size={14} color="#1a78d2" /> 
              {' '}Dr. {item.assignedDoctor.name}
            </Text>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a78d2" />
          <Text style={styles.loadingText}>Loading cases...</Text>
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
        <Text style={styles.headerTitle}>All Cases</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Cases List */}
      {allCases.length > 0 ? (
        <FlatList
          data={allCases}
          renderItem={renderCaseItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No cases yet</Text>
          <Text style={styles.emptySubtext}>Submit your first case to get started</Text>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => router.push('/startscreens/newCase')}
          >
            <Text style={styles.submitButtonText}>Submit New Case</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AllCases;

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
  listContainer: {
    padding: width * 0.05,
  },
  caseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseImage: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: width * 0.04,
  },
  caseInfo: {
    flex: 1,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  caseId: {
    fontSize: width * 0.042,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: width * 0.025,
    paddingVertical: height * 0.005,
    borderRadius: 12,
  },
  statusText: {
    fontSize: width * 0.03,
    fontWeight: '600',
  },
  patientId: {
    fontSize: width * 0.036,
    color: '#666',
    marginBottom: height * 0.005,
  },
  caseDate: {
    fontSize: width * 0.032,
    color: '#999',
    marginBottom: height * 0.003,
  },
  doctorInfo: {
    fontSize: width * 0.032,
    color: '#1a78d2',
    marginTop: height * 0.003,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
  },
  emptyText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#999',
    marginTop: height * 0.02,
  },
  emptySubtext: {
    fontSize: width * 0.038,
    color: '#bbb',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1a78d2',
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.018,
    borderRadius: 25,
    marginTop: height * 0.03,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});