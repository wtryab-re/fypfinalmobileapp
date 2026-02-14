import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

// Types
interface Patient {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  age?: number;
  gender?: string;
  createdAt: string;
}

const PatientProfile: React.FC = () => {
  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      const userInfo = await SecureStore.getItemAsync("user");
      const user = userInfo ? JSON.parse(userInfo) : null;
      setPatientData(user);
      console.log(user);
    } catch (err) {
      console.error("Error loading patient data:", err);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("authToken");
          await SecureStore.deleteItemAsync("userRole");
          await SecureStore.deleteItemAsync("userName");
          router.replace("/startscreens/signinlogin");
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!patientData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading patient profile...</Text>
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
        <Text style={styles.headerTitle}>Patient Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeaderCard}>
          <Ionicons name="person-circle" size={width * 0.28} color="#1a78d2" />
          <Text style={styles.profileName}>{patientData.name}</Text>
          <Text style={styles.profileRole}>Patient</Text>
          <View style={styles.patientIdBadge}>
            <Text style={styles.patientIdText}>P</Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            {/* Email */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={22} color="#1a78d2" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{patientData.email}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />

            {/* Phone */}
            {patientData.phoneNumber && (
              <>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="call-outline" size={22} color="#1a78d2" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>
                      {patientData.phoneNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoDivider} />
              </>
            )}

            {/* Age */}
            {patientData.age && (
              <>
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={22}
                      color="#1a78d2"
                    />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Age</Text>
                    <Text style={styles.infoValue}>
                      {patientData.age} years
                    </Text>
                  </View>
                </View>
                <View style={styles.infoDivider} />
              </>
            )}

            {/* Gender */}
            {patientData.gender && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons
                    name={
                      patientData.gender === "Male"
                        ? "male-outline"
                        : "female-outline"
                    }
                    size={22}
                    color="#1a78d2"
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>{patientData.gender}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password coming soon</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#F44336" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: height * 0.05 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.push("/startscreens/patientDashboard")}
        >
          <Ionicons name="home-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={width * 0.07} color="#1a78d2" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PatientProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: width * 0.045, color: "#666" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: width * 0.05, fontWeight: "bold", color: "#333" },
  scrollContent: { paddingBottom: height * 0.02 },
  profileHeaderCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: height * 0.04,
    marginBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.005,
  },
  profileRole: {
    fontSize: width * 0.04,
    color: "#666",
    marginBottom: height * 0.015,
  },
  patientIdBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 20,
  },
  patientIdText: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#1a78d2",
  },
  section: { marginBottom: height * 0.02 },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
  },
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: width * 0.05,
    borderRadius: 12,
    paddingVertical: height * 0.01,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.04,
  },
  infoIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: width * 0.035, color: "#999", marginBottom: 2 },
  infoValue: { fontSize: width * 0.04, fontWeight: "600", color: "#333" },
  infoDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: width * 0.04,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F44336",
    marginTop: height * 0.02,
  },
  logoutButtonText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#F44336",
    marginLeft: 10,
  },
  bottomNav: {
    position: "absolute",
    bottom: height * 0.03,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
});
