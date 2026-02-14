import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../api";

const { width, height } = Dimensions.get("window");

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
}

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
  | "PENDING_WORKER_REVIEW"
  | "APPROVED_FOR_AI"
  | "AI_PROCESSING"
  | "AI_PROCESSED"
  | "AI_FAILED"
  | "ASSIGNED_TO_DOCTOR"
  | "COMPLETED"
  | "REJECTED";

interface StatusDisplay {
  text: string;
  color: string;
}

const HealthWorkerDashboard: React.FC = () => {
  const [workerData, setWorkerData] = useState<Worker | null>(null);
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Fetch worker profile and recent cases on component mount
  useEffect(() => {
    fetchWorkerData();
    fetchRecentCases();
  }, []);

  // Fetch worker profile
  const fetchWorkerData = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("workerToken");

      if (!token) {
        router.replace("/startscreens/login" as any);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/worker/profile`, {
        headers: { token },
      });

      if (response.data.success) {
        setWorkerData(response.data.worker);
      } else {
        console.error("Failed to fetch worker data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching worker data:", error);
    }
  };

  // Fetch recent cases (6 most recent)
  const fetchRecentCases = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("workerToken");

      if (!token) {
        router.replace("/startscreens/login" as any);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/worker/recent-cases`,
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        console.log("\n\n\n\n\nHERERERER", response.data.cases);

        setRecentCases(response.data.cases);
      } else {
        console.error("Failed to fetch cases:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get status text and color based on case status
  const getStatusDisplay = (status: CaseStatus): StatusDisplay => {
    const statusMap: Record<CaseStatus, StatusDisplay> = {
      PENDING_WORKER_REVIEW: { text: "Pending Review", color: "#FFA500" },
      APPROVED_FOR_AI: { text: "Approved", color: "#4CAF50" },
      AI_PROCESSING: { text: "Processing...", color: "#2196F3" },
      AI_PROCESSED: { text: "AI Processed", color: "#00BCD4" },
      AI_FAILED: { text: "AI Failed\n Under Doctor Review", color: "#F44336" },
      ASSIGNED_TO_DOCTOR: { text: "With Doctor", color: "#9C27B0" },
      COMPLETED: { text: "Completed", color: "#4CAF50" },
      REJECTED: { text: "Rejected", color: "#F44336" },
    };
    return statusMap[status] || { text: "Unknown", color: "#999" };
  };

  // Format case ID for display
  const formatCaseId = (caseId: string): string => {
    return `C-${caseId.slice(-6).toUpperCase()}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a78d2" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hwName}>
              {workerData?.name || "Health Worker"}
            </Text>
            <Text style={styles.hwId}>
              HW-{workerData?._id?.slice(-8).toUpperCase() || "UNKNOWN"}
            </Text>
          </View>

          {/* Profile Icon */}
          <TouchableOpacity
            style={styles.profileIconContainer}
            onPress={() => router.push("/startscreens/profile" as any)}
          >
            <Ionicons
              name="person-circle-outline"
              size={width * 0.13}
              color="#1a78d2"
            />
          </TouchableOpacity>
        </View>

        {/* Submit New Case */}
        <TouchableOpacity
          style={styles.submitCaseContainer}
          onPress={() => router.push("/startscreens/newCase")}
        >
          <View style={styles.submitCaseContent}>
            <Text style={styles.submitCaseTitle}>Submit New{"\n"}Case</Text>
            <Image
              source={require("../../assets/images/newCase.png")}
              style={styles.customImageStyle}
            />
          </View>
          <TouchableOpacity
            style={styles.newCaseButton}
            onPress={() => router.push("/startscreens/newCase")}
          >
            <Text style={styles.newCaseButtonText}>New Case</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Recent Records */}
        <View style={styles.recentRecordsHeader}>
          <Text style={styles.recentRecordsTitle}>Recent Records</Text>
          <TouchableOpacity
            onPress={() => router.push("/startscreens/AllCases" as any)}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Display MY CREATED Recent Cases */}
        {recentCases.length > 0 ? (
          <View style={styles.casesGridContainer}>
            {recentCases.map((caseItem, index) => {
              const statusInfo = getStatusDisplay(caseItem.status);
              return (
                <TouchableOpacity
                  key={caseItem._id || index}
                  style={styles.recordCardGrid}
                  onPress={() => {
                    router.push({
                      pathname: "/startscreens/seeStatus" as any,
                      params: { caseId: JSON.stringify(caseItem._id) },
                    });
                  }}
                >
                  <Image
                    source={{ uri: caseItem.imageUrl }}
                    style={styles.recordImage}
                  />
                  <Text style={styles.recordName} numberOfLines={1}>
                    {formatCaseId(caseItem._id)}
                  </Text>
                  <Text style={styles.recordId} numberOfLines={1}>
                    P-{caseItem.patientId?.slice(-4) || "UNKNOWN"}...
                  </Text>

                  <Text
                    style={[styles.recordStatus, { color: statusInfo.color }]}
                  >
                    {statusInfo.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.noCasesContainer}>
            <Text style={styles.noCasesText}>No cases yet</Text>
            <Text style={styles.noCasesSubtext}>
              Submit your first case to get started
            </Text>
          </View>
        )}

        {/* Add bottom padding to ScrollView content to prevent overlap with fixed bottom nav */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation - FIXED outside ScrollView */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => router.push("/startscreens/healthWorkerDashboard")}
        >
          <Ionicons name="home" size={width * 0.07} color="#1a78d2" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/startscreens/profile" as any)}
        >
          <Ionicons name="person-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HealthWorkerDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.02,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  hwName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
  },
  hwId: {
    fontSize: width * 0.04,
    color: "#666",
    fontWeight: "600",
  },
  profileIconContainer: {
    width: width * 0.13,
    height: width * 0.13,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0eeee",
    borderRadius: 30,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
  },
  searchIcon: {
    backgroundColor: "#1a78d2",
    borderRadius: 30,
    padding: width * 0.025,
    marginRight: width * 0.01,
  },
  submitCaseContainer: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: height * 0.03,
    marginTop: height * 0.03,
  },
  submitCaseContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitCaseTitle: {
    fontSize: width * 0.06,
    fontWeight: "800",
    color: "#333",
  },
  newCaseButton: {
    backgroundColor: "#1a78d2",
    borderRadius: 20,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    alignSelf: "flex-start",
    marginTop: height * 0.01,
  },
  newCaseButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "700",
  },
  customImageStyle: {
    width: width * 0.3,
    height: width * 0.22,
    top: height * 0.03,
  },
  recentRecordsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  recentRecordsTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: width * 0.035,
    color: "#1a78d2",
    fontWeight: "800",
    borderBottomWidth: 1,
    borderBottomColor: "#1a78d2",
  },
  recordImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    marginBottom: height * 0.01,
    backgroundColor: "#f0f0f0",
  },
  recordName: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  recordId: {
    fontSize: width * 0.03,
    color: "#666",
    textAlign: "center",
  },
  recordStatus: {
    fontSize: width * 0.03,
    fontWeight: "600",
    textAlign: "center",
  },
  noCasesContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.05,
  },
  noCasesText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#999",
  },
  noCasesSubtext: {
    fontSize: width * 0.035,
    color: "#bbb",
    marginTop: height * 0.01,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: height * 0.08,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  casesGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: width * 0.05,
    justifyContent: "space-between",
  },
  recordCardGrid: {
    width: width * 0.28,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: height * 0.015,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: height * 0.02,
  },
  bottomPadding: {
    height: height * 0.02,
  },
});
