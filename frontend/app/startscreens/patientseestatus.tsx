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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

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
  aiResult?: any;
  aiError?: string;
  assignedDoctor?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
// ... rest of imports remain the same

const PatientSeeStatus = () => {
  const { caseId } = useLocalSearchParams();
  const [caseData, setCaseData] = useState<
    (CaseData & { report?: any }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseFromStorage();
  }, [caseId]);

  const loadCaseFromStorage = async () => {
    try {
      const storedCases = await SecureStore.getItemAsync("userCases");
      const cases: CaseData[] = storedCases ? JSON.parse(storedCases) : [];
      const cleanId = String(caseId).replace(/^"|"$/g, "");
      const foundCase = cases.find((c) => c._id === cleanId);
      if (foundCase) setCaseData(foundCase);
    } catch (err) {
      console.error("Error loading case from storage:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCaseId = (id: string) => `C-${id.slice(-6).toUpperCase()}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const getStatusText = (status: CaseStatus) => {
    const map: Record<CaseStatus, string> = {
      PENDING_WORKER_REVIEW: "Pending Review",
      APPROVED_FOR_AI: "Approved for AI",
      AI_PROCESSING: "AI Processing",
      AI_PROCESSED: "AI Processed",
      AI_FAILED: "AI Failed",
      ASSIGNED_TO_DOCTOR: "Assigned to Doctor",
      COMPLETED: "Completed",
      REJECTED: "Rejected",
    };
    return map[status] || "Unknown";
  };

  if (loading)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading case details...</Text>
        </View>
      </SafeAreaView>
    );

  if (!caseData)
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

  const patientDisplayId =
    typeof caseData.patientId === "object"
      ? caseData.patientId._id?.slice(-8).toUpperCase() || "UNKNOWN"
      : String(caseData.patientId);

  const aiResultDisplay =
    typeof caseData.aiResult === "object"
      ? JSON.stringify(caseData.aiResult)
      : caseData.aiResult || "No AI result available";

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
          <Text style={styles.patientId}>Patient ID: P-{patientDisplayId}</Text>
        </View>

        {aiResultDisplay == "null" && caseData.report == null ? (
          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
              paddingHorizontal: 20,
              backgroundColor: "#fff3e0",
              marginHorizontal: 20,
              borderRadius: 10,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: "#e65100",
                fontSize: 14,
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {" "}
              {aiResultDisplay == "null" && caseData.report == null
                ? "Under Doctor Review\nCome back later for results"
                : ""}
            </Text>
          </View>
        ) : (
          ""
        )}
        {/* AI Result */}
        <View style={styles.resultCard}>
          <Image source={{ uri: caseData.imageUrl }} style={styles.xrayImage} />
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultLabel}>AI Result</Text>
            <Text style={styles.resultValue}>
              {aiResultDisplay == "null"
                ? "No AI result available"
                : aiResultDisplay}
            </Text>
            {caseData.aiError && (
              <Text style={styles.errorTextSmall}>{caseData.aiError}</Text>
            )}
          </View>
        </View>

        {/* Case Details */}
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

          {/* Manual Checks */}
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

          {/* Patient History */}
          {caseData.patientHistory && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Patient History:</Text>
              <Text style={styles.historyText}>{caseData.patientHistory}</Text>
            </View>
          )}

          {/* Doctor Report */}
          {caseData.report && (
            <View style={styles.reportContainer}>
              <Text style={styles.reportTitle}>Doctor Report</Text>
              <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={true}
                style={{ maxHeight: 300 }}
              >
                <DetailRow
                  label="Doctor Name"
                  value={caseData.report.doctorName}
                />
                <DetailRow
                  label="Diagnosis"
                  value={caseData.report.diagnosis}
                />
                <DetailRow label="Findings" value={caseData.report.findings} />
                <DetailRow
                  label="Recommendations"
                  value={caseData.report.recommendations}
                />
                <DetailRow
                  label="Medications"
                  value={caseData.report.medications}
                />
                <DetailRow label="Follow Up" value={caseData.report.followUp} />
              </ScrollView>
            </View>
          )}
        </View>

        {/* Back to Dashboard */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow: React.FC<{ label: string; value: any }> = ({
  label,
  value,
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>
      {typeof value === "object"
        ? JSON.stringify(value, null, 2)
        : String(value)}
    </Text>
  </View>
);

export default PatientSeeStatus;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#F44336", fontSize: 16, fontWeight: "bold" },
  errorTextSmall: { color: "#F44336", fontSize: 14, marginTop: 5 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  caseIdContainer: { alignItems: "center", paddingVertical: 15 },
  caseIdLabel: { fontSize: 14, color: "#666" },
  caseIdValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a78d2",
    marginTop: 5,
  },
  patientId: { fontSize: 15, color: "#333", fontWeight: "600", marginTop: 5 },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    margin: 20,
    borderRadius: 15,
    padding: 15,
  },
  xrayImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  resultTextContainer: { marginLeft: 15, flex: 1 },
  resultLabel: { fontSize: 14, color: "#666" },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  detailsContainer: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: { fontSize: 14, color: "#555", flex: 1 },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    flexWrap: "wrap",
  },
  checksContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  checksTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  historyContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  historyText: { fontSize: 14, color: "#555", lineHeight: 20 },
  reportContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e8f0fe",
    borderRadius: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a78d2",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#1a78d2",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
