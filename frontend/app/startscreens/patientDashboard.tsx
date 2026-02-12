import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const PatientDashboard = () => {

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              // 🧹 Clear stored authentication data
              await SecureStore.deleteItemAsync('authToken');
              await SecureStore.deleteItemAsync('userRole');
              await SecureStore.deleteItemAsync('userName');

              console.log("User logged out.");

              // ✅ Navigate to SignInLogin screen
              router.replace('/startscreens/signinlogin');
            },
          },
        ]
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>Ali Hassan</Text>
          <Text style={styles.id}>P-5632-8</Text>
        </View>
        <Image
          source={require('../../assets/placeholders/1.png')}
          style={styles.avatar}
        />
      </View>

      {/* Case Status Card */}
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>
          Click to {"\n"}
          <Text style={{ fontWeight: 'bold' }}>case status</Text>
        </Text>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => router.push('/startscreens/seeStatus')}
          >
            <Text style={styles.buttonText}>See Status</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/questionMark2.png')}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              resizeMode: 'cover',
              transform: [{ translateY: -25 }, { translateX: -20 }],
            }}
          />
        </View>
      </TouchableOpacity>

      {/* ✅ Logout */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="alert-circle-outline" size={20} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
        <Icon name="chevron-forward" size={20} color="gray" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        <Icon name="home" size={26} color="#2974f0" />
        <Icon name="calendar-outline" size={26} color="#ccc" />
        <Icon name="person-outline" size={26} color="#ccc" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: width * 0.05,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  id: { fontSize: 16, color: '#444' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  card: {
    backgroundColor: '#e5f4ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 0,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusButton: {
    backgroundColor: '#2974f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    transform: [{ translateY: -15 }],
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  logoutText: { color: 'red', fontWeight: '500', marginLeft: 10, flex: 1 },
  navbar: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default PatientDashboard;
