import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions, Image,
    ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const patients = [
  { name: 'Ali Hassan', id: 'P-5632-2', status: 'Pending...', image: require('../../assets/placeholders/1.png') },
  { name: 'Ayeza Rashid', id: 'P-7682-1', status: 'Further Review...', image: require('../../assets/placeholders/5.jpg') },
  { name: 'Aliza Khan', id: 'P-6891-2', status: 'Further Review...', image: require('../../assets/placeholders/4.jpeg') },
  { name: 'Shahnawaz', id: 'P-8111-0', status: 'Reviewed', image: require('../../assets/placeholders/3.jpeg') },
  { name: 'Haider Ali', id: 'P-7042-7', status: 'Reviewed', image: require('../../assets/placeholders/6.png') },
  { name: 'Ayesha Riaz', id: 'P-4072-4', status: 'Reviewed', image: require('../../assets/placeholders/8.jpeg') },
  { name: 'Haider Hassan', id: 'P-7042-8', status: 'Reviewed', image: require('../../assets/placeholders/7.jpeg') },
];

const RecentCasesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>

        <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Search patient by ID"
                  placeholderTextColor="gray"
                  style={styles.searchInput}
                />
                <TouchableOpacity style={styles.searchIcon}>
                  <Ionicons name="search" size={width * 0.06} color="#fff" />
                </TouchableOpacity>
              </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {patients.map((patient, index) => (
          <TouchableOpacity key={index} style={styles.patientRow}>
            <Image source={patient.image} style={styles.patientImage} />
            <View>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientId}>{patient.id}</Text>
              <Text style={styles.patientStatus}>{patient.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footerNav}>
        <TouchableOpacity onPress={() => router.push('/startscreens/healthWorkerDashboard')}>
            <Ionicons name="home-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
            <Ionicons name="notifications-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screens/profile')}>
            <Ionicons name="person-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>
</View>

    </SafeAreaView>
  );
};

export default RecentCasesScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: width * 0.05, 
  },
  headerTitle: { 
    fontSize: width * 0.05, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0eeee',
    borderRadius: 30,
    marginBottom: width * 0.05,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#333',
    paddingHorizontal: width * 0.06,
  },
  searchIcon: {
    backgroundColor: '#1a78d2',
    borderRadius: 30,
    padding: width * 0.025,
  },
  patientRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: width * 0.05, 
    marginVertical: height * 0.015 
  },
  patientImage: { 
    width: width * 0.18, 
    height: width * 0.18, 
    borderRadius: 10, 
    marginRight: width * 0.04 
  },
  patientName: { 
    fontSize: width * 0.045, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  patientId: { 
    fontSize: width * 0.035, 
    color: '#888' 
  },
  patientStatus: { 
    fontSize: width * 0.035, 
    color: '#999' 
  },
  footerNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: height * 0.015, 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    backgroundColor: '#fff' 
  }
});
