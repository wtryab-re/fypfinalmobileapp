import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../api";

const { width, height } = Dimensions.get("window");

type CaseStatus =
  | "PENDING_WORKER_REVIEW"
  | "APPROVED_FOR_AI"
  | "AI_PROCESSING"
  | "AI_PROCESSED"
  | "AI_FAILED"
  | "ASSIGNED_TO_DOCTOR"
  | "COMPLETED"
  | "REJECTED";

interface CaseData {
  _id: string;
  patientId: any;
  patientHistory: string;
  imageUrl: string;
  uploadedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
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
  } | null;
  createdAt: string;
  updatedAt: string;
}

const StatusScreen = () => {
  const { caseId } = useLocalSearchParams();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails();
    }
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("workerToken");

      if (!token) {
        router.replace("/startscreens/login" as any);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/worker/case/${caseId}`,
        {
          headers: { token },
        },
      );

      console.log("Case data received:", response.data); // DEBUG

      if (response.data.success) {
        setCaseData(response.data.case);
      } else {
        console.error("Failed to fetch case:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching case details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCaseId = (id: string): string => {
    return `C-${id.slice(-6).toUpperCase()}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: CaseStatus): string => {
    const statusMap: Record<CaseStatus, string> = {
      PENDING_WORKER_REVIEW: "Pending Review",
      APPROVED_FOR_AI: "Approved for AI",
      AI_PROCESSING: "AI Processing",
      AI_PROCESSED: "AI Processed",
      AI_FAILED: "AI Failed",
      ASSIGNED_TO_DOCTOR: "Assigned to Doctor",
      COMPLETED: "Completed",
      REJECTED: "Rejected",
    };
    return statusMap[status] || "Unknown";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a78d2" />
          <Text style={styles.loadingText}>Loading case details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!caseData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Case not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Case Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Case ID */}
        <View style={styles.caseIdContainer}>
          <Text style={styles.caseIdLabel}>Case ID</Text>
          <Text style={styles.caseIdValue}>{formatCaseId(caseData._id)}</Text>
          <Text style={styles.patientId}>
            Patient ID: P-{caseData.patientId}
          </Text>
        </View>

        {/* X-ray and Classification Result */}
        <View style={styles.resultCard}>
          <Image source={{ uri: caseData.imageUrl }} style={styles.xrayImage} />
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultLabel}>AI Result</Text>
            <Text style={styles.resultValue}>
              {caseData.aiResult || "No AI result available"}
            </Text>
            {caseData.aiError && (
              <Text style={styles.errorTextSmall}>{caseData.aiError}</Text>
            )}
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <DetailRow
            label="Submission Date"
            value={formatDate(caseData.createdAt)}
          />
          <DetailRow label="Time" value={formatTime(caseData.createdAt)} />
          <DetailRow
            label="Case Status"
            value={getStatusText(caseData.status)}
          />

          {/* ✅ NULL CHECK: Only show if uploadedBy exists */}
          {caseData.uploadedBy && (
            <>
              <DetailRow
                label="Submitted by"
                value={caseData.uploadedBy.name}
              />
              <DetailRow
                label="Worker ID"
                value={`HW-${caseData.uploadedBy._id.slice(-8).toUpperCase()}`}
              />
            </>
          )}

          {/* ✅ NULL CHECK: Only show if assignedDoctor exists */}
          {caseData.assignedDoctor && (
            <>
              <DetailRow
                label="Assigned Doctor"
                value={`Dr. ${caseData.assignedDoctor.name}`}
              />
              <DetailRow
                label="Doctor Email"
                value={caseData.assignedDoctor.email}
              />
            </>
          )}

          <View style={styles.checksContainer}>
            <Text style={styles.checksTitle}>Manual Checks:</Text>
            <DetailRow
              label="Lungs Visible"
              value={caseData.manualChecks?.isLungs ? "✓ Yes" : "✗ No"}
            />
            <DetailRow
              label="Image Clear"
              value={caseData.manualChecks?.isClear ? "✓ Yes" : "✗ No"}
            />
            <DetailRow
              label="Verified"
              value={caseData.manualChecks?.isVerified ? "✓ Yes" : "✗ No"}
            />
          </View>

          {caseData.patientHistory && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Patient History:</Text>
              <Text style={styles.historyText}>{caseData.patientHistory}</Text>
            </View>
          )}
        </View>

        {/* Back to Home button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.push("/startscreens/healthWorkerDashboard" as any)
          }
        >
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default StatusScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  errorText: {
    color: "#F44336",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  errorTextSmall: {
    color: "#F44336",
    fontSize: width * 0.035,
    marginTop: height * 0.005,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
  },
  caseIdContainer: {
    alignItems: "center",
    paddingVertical: height * 0.02,
  },
  caseIdLabel: {
    fontSize: width * 0.035,
    color: "#666",
  },
  caseIdValue: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#1a78d2",
    marginTop: height * 0.005,
  },
  patientId: {
    fontSize: width * 0.04,
    color: "#333",
    fontWeight: "600",
    marginTop: height * 0.005,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    margin: width * 0.05,
    borderRadius: 15,
    padding: width * 0.04,
  },
  xrayImage: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  resultTextContainer: { marginLeft: width * 0.05, flex: 1 },
  resultLabel: { fontSize: width * 0.04, color: "#666" },
  resultValue: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#333",
    marginTop: height * 0.005,
  },
  detailsContainer: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    padding: width * 0.04,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.015,
  },
  detailLabel: { fontSize: width * 0.04, color: "#555", flex: 1 },
  detailValue: {
    fontSize: width * 0.04,
    color: "#333",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  checksContainer: {
    marginTop: height * 0.02,
    paddingTop: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  checksTitle: {
    fontSize: width * 0.042,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
  },
  historyContainer: {
    marginTop: height * 0.02,
    paddingTop: height * 0.02,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  historyTitle: {
    fontSize: width * 0.042,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.01,
  },
  historyText: {
    fontSize: width * 0.038,
    color: "#555",
    lineHeight: width * 0.055,
  },
  backButton: {
    backgroundColor: "#1a78d2",
    borderRadius: 30,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    alignSelf: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.03,
  },
  backButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
