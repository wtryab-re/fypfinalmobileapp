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
            // 🧹 Clear stored authentication data
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

  const [currentUserInfo, setcurrentUserInfo] = useState("");
  const [userCases, setUserCases] = useState([]);
  const currentPatientInformation = async () => {
    //fetch patient information from secure store
    const userInfo = await SecureStore.getItemAsync("user");
    const user = userInfo ? JSON.parse(userInfo) : null;
    if (userInfo) {
      setcurrentUserInfo(user);
    }

    const casesInfo = await SecureStore.getItemAsync("userCases");
    const cases = casesInfo ? JSON.parse(casesInfo) : [];
    setUserCases(cases);
    //fetch cases related to patient from api
  };

  useEffect(() => {
    currentPatientInformation();
  }, []);
  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{currentUserInfo.name}</Text>
          <Text style={styles.id}>{currentUserInfo.id}</Text>
        </View>
      </View>

      {/* Case Status Card 
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/startscreens/seeStatus")}
      >
        <Text style={styles.cardTitle}>
          Click to see recent {"\n"}
          <Text style={{ fontWeight: "bold" }}>case status</Text>
        </Text>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => router.push("/startscreens/seeStatus")}
          >
            <Text style={styles.buttonText}>See Status</Text>
          </TouchableOpacity>
          <Image
            source={require("../../assets/images/questionMark2.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              resizeMode: "cover",
              transform: [{ translateY: -25 }, { translateX: -20 }],
            }}
          />
        </View>
      </TouchableOpacity>
*/}
      <View>
        {userCases && userCases.length > 0 ? (
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}
            >
              Your Cases
            </Text>
            {userCases.map((caseItem) => (
              <View
                key={caseItem._id}
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  Case ID: {caseItem._id}
                </Text>
                <Text style={{ fontSize: 14, color: "#555" }}>
                  Status: {caseItem.status}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 16, color: "#555", marginBottom: 30 }}>
            You have no recorded cases at the moment.
          </Text>
        )}
      </View>

      {}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="alert-circle-outline" size={20} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
        <Icon name="chevron-forward" size={20} color="gray" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        <Icon name="home" size={26} color="#2974f0" />

        <Icon name="folder-outline" size={26} color="#ccc" />

        <Icon name="person-outline" size={26} color="#ccc" />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: height * 0.05,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  id: { fontSize: 16, color: "#444" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  card: {
    backgroundColor: "#e5f4ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 0,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusButton: {
    backgroundColor: "#2974f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    transform: [{ translateY: -15 }],
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
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
    bottom: height * 0.05,
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
