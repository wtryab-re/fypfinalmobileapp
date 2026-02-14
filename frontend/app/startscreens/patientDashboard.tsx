import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const PatientDashboard = () => {
  const handleLogout = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync("authToken");
            await SecureStore.deleteItemAsync("userRole");
            await SecureStore.deleteItemAsync("userName");

            console.log("User logged out.");
            router.replace("/startscreens/signinlogin");
          },
        },
      ]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [currentUserInfo, setCurrentUserInfo] = useState<any>({});
  const [userCases, setUserCases] = useState<any[]>([]);

  const currentPatientInformation = async () => {
    const userInfo = await SecureStore.getItemAsync("user");
    const user = userInfo ? JSON.parse(userInfo) : null;
    if (user) setCurrentUserInfo(user);

    const casesInfo = await SecureStore.getItemAsync("userCases");
    const cases = casesInfo ? JSON.parse(casesInfo) : [];
    setUserCases(cases);
  };

  useEffect(() => {
    currentPatientInformation();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{currentUserInfo.name || "Patient"}</Text>
          <Text style={styles.id}>{currentUserInfo.id || "N/A"}</Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.15 }}
      >
        {/* Recent Cases */}
        <View style={styles.casesContainer}>
          {userCases && userCases.length > 0 ? (
            <>
              <Text style={styles.casesHeading}>Your Cases</Text>

              {userCases.map((caseItem, index) => (
                <TouchableOpacity
                  key={caseItem._id || index}
                  style={styles.caseCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    // Navigate to PatientSeeStatus page with caseId
                    router.push({
                      pathname: "/startscreens/patientseestatus",
                      params: { caseId: caseItem._id },
                    });
                  }}
                >
                  <View style={styles.caseInfo}>
                    <Text style={styles.caseId}>
                      Case ID: {caseItem._id?.slice(-8).toUpperCase()}
                    </Text>
                    <Text style={styles.caseStatus}>
                      Status:{" "}
                      <Text style={{ fontWeight: "600", color: "#2974f0" }}>
                        {caseItem.status === "AI_FAILED"
                          ? "Under Review"
                          : String(caseItem.status).toUpperCase()}
                      </Text>
                    </Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text style={styles.noCasesText}>
              You have no recorded cases at the moment.
            </Text>
          )}
        </View>

        {/* Logout 
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Icon name="alert-circle-outline" size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
          <Icon name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
          */}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Icon name="home" size={26} color="#2974f0" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/startscreens/patientprofile")}
        >
          <Icon name="person-outline" size={26} color="#ccc" />
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: height * 0.05,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  id: { fontSize: 15, color: "#444" },

  casesContainer: { marginBottom: 30 },
  casesHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  caseCard: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  caseInfo: { flexDirection: "column" },
  caseId: { fontSize: 16, fontWeight: "500", color: "#333" },
  caseStatus: { fontSize: 14, color: "#555" },
  noCasesText: { fontSize: 16, color: "#555", marginBottom: 30 },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    justifyContent: "space-between",
  },
  logoutText: { color: "red", fontWeight: "500", marginLeft: 10, flex: 1 },

  navbar: {
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

export default PatientDashboard;
