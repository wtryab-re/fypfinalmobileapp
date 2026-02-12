import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_ENDPOINTS, apiCall } from "../api";

const { width, height } = Dimensions.get("window");

const PatientSignupScreen = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
    phoneNumber: "",
    cnic: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) error = "Please enter your full name.";
        break;
      case "age":
        if (!value) error = "Please enter your age.";
        else if (parseInt(value) < 1 || parseInt(value) > 150)
          error = "Enter a valid age between 1 and 150.";
        break;
      case "gender":
        if (!value) error = "Please select your gender.";
        break;
      case "phoneNumber":
        if (!value.trim()) error = "Please enter your phone number.";
        else if (!/^03\d{9}$/.test(value))
          error = "Phone number must start with 03 and be 11 digits long.";
        break;
      case "cnic":
        if (!value.trim()) error = "Please enter your CNIC.";
        else if (!/^\d{13}$/.test(value))
          error = "CNIC must be exactly 13 digits.";
        break;
      case "email":
        if (!value.trim()) error = "Please enter your email address.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Please enter a valid email address.";
        break;
      case "password":
        if (!value) error = "Please create a password.";
        else if (value.length < 6)
          error = "Password must be at least 6 characters long.";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          error =
            "Password must include at least one uppercase, one lowercase, and one number.";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password.";
        else if (value !== password) error = "Passwords do not match.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSignUp = async () => {
    // Validate all fields before submit
    const fields = {
      name,
      age,
      gender,
      phoneNumber,
      cnic,
      email,
      password,
      confirmPassword,
    };

    Object.entries(fields).forEach(([field, value]) =>
      validateField(field, value),
    );

    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors) {
      Alert.alert(
        "Invalid Input",
        "Please fix the highlighted errors before continuing.",
      );
      return;
    }

    setLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          age: parseInt(age),
          gender,
          phoneNumber,
          cnic,
          email: email.trim().toLowerCase(),
          password,
          role: "patient",
        }),
      });
      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        Alert.alert(
          "Registration Failed",
          result.error || "Something went wrong.",
        );
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.replace("/startscreens/patientlogin");
  };

  const handleLoginRedirect = () => {
    router.replace("/startscreens/patientlogin");
  };

  const formatCNIC = (text) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 13);
    setCnic(cleaned);
    validateField("cnic", cleaned);
  };

  const formatPhoneNumber = (text) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 0 && cleaned[0] !== "0") cleaned = "0" + cleaned;
    if (cleaned.length >= 2 && cleaned.substring(0, 2) !== "03") cleaned = "03";
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
    setPhoneNumber(cleaned);
    validateField("phoneNumber", cleaned);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Ionicons
              name="chevron-back-outline"
              size={width * 0.08}
              color="#333"
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Patient Sign Up</Text>
          <View style={{ width: width * 0.08 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputSection}>
            {/* Name */}
            <View style={[styles.fieldview, errors.name && styles.errorBorder]}>
              <Ionicons
                name="person-outline"
                size={width * 0.06}
                color={errors.name ? "#ff3b30" : "gray"}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  validateField("name", text);
                }}
              />
            </View>
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            {/* Email */}
            <View
              style={[styles.fieldview, errors.email && styles.errorBorder]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={width * 0.06}
                color={errors.email ? "#ff3b30" : "gray"}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateField("email", text);
                }}
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            {/* Age */}
            <View style={[styles.fieldview, errors.age && styles.errorBorder]}>
              <MaterialCommunityIcons
                name="calendar-range-outline"
                size={width * 0.06}
                color={errors.age ? "#ff3b30" : "gray"}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                  validateField("age", text);
                }}
              />
            </View>
            {errors.age ? (
              <Text style={styles.errorText}>{errors.age}</Text>
            ) : null}

            {/* Gender */}
            <TouchableOpacity
              style={[styles.fieldview, errors.gender && styles.errorBorder]}
              onPress={() => setShowGenderPicker(true)}
            >
              <Ionicons
                name="person-outline"
                size={width * 0.06}
                color={errors.gender ? "#ff3b30" : "gray"}
              />
              <Text style={[styles.input, !gender && styles.placeholder]}>
                {gender || "Select your gender"}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={width * 0.05}
                color="gray"
              />
            </TouchableOpacity>
            {errors.gender ? (
              <Text style={styles.errorText}>{errors.gender}</Text>
            ) : null}

            {/* Gender Picker Modal */}
            <Modal visible={showGenderPicker} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Gender</Text>
                    <TouchableOpacity
                      onPress={() => setShowGenderPicker(false)}
                    >
                      <Ionicons name="close" size={width * 0.07} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => {
                      setGender(itemValue);
                      setShowGenderPicker(false);
                      validateField("gender", itemValue);
                    }}
                  >
                    <Picker.Item label="Select gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              </View>
            </Modal>

            {/* Success Popup Modal */}
            <Modal
              visible={showSuccessPopup}
              transparent={true}
              animationType="fade"
            >
              <View style={styles.successModalContainer}>
                <View style={styles.successModalContent}>
                  <View style={styles.successIconContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={width * 0.15}
                      color="#4CAF50"
                    />
                  </View>
                  <Text style={styles.successTitle}>Success!</Text>
                  <Text style={styles.successMessage}>
                    Account created successfully! You can now login.
                  </Text>
                  <TouchableOpacity
                    style={styles.successButton}
                    onPress={handleSuccessPopupClose}
                  >
                    <Text style={styles.successButtonText}>
                      Continue to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Phone */}
            <View
              style={[
                styles.fieldview,
                errors.phoneNumber && styles.errorBorder,
              ]}
            >
              <FontAwesome
                name="phone"
                size={width * 0.06}
                color={errors.phoneNumber ? "#ff3b30" : "gray"}
              />
              <TextInput
                style={styles.input}
                placeholder="03XXXXXXXXX"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={formatPhoneNumber}
              />
            </View>
            {errors.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}

            {/* CNIC */}
            <View style={[styles.fieldview, errors.cnic && styles.errorBorder]}>
              <AntDesign
                name="idcard"
                size={width * 0.06}
                color={errors.cnic ? "#ff3b30" : "gray"}
              />
              <TextInput
                style={styles.input}
                placeholder="13-digit CNIC"
                keyboardType="numeric"
                value={cnic}
                onChangeText={formatCNIC}
                maxLength={13}
              />
            </View>
            {errors.cnic ? (
              <Text style={styles.errorText}>{errors.cnic}</Text>
            ) : null}

            {/* Password */}
            <View
              style={[styles.fieldview, errors.password && styles.errorBorder]}
            >
              <FontAwesome
                name="lock"
                size={width * 0.06}
                color={errors.password ? "#ff3b30" : "gray"}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validateField("password", text);
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={width * 0.06}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            {/* Confirm Password */}
            <View
              style={[
                styles.fieldview,
                errors.confirmPassword && styles.errorBorder,
              ]}
            >
              <FontAwesome
                name="lock"
                size={width * 0.06}
                color={errors.confirmPassword ? "#ff3b30" : "gray"}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  validateField("confirmPassword", text);
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={width * 0.06}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          {/* Terms and Privacy Policy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to the Pulmovision Terms of Service and
              Privacy Policy
            </Text>
          </View>

          <View style={styles.loginRedirectContainer}>
            <Text style={styles.loginRedirectText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginRedirectLink}>Login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PatientSignupScreen;

const styles = StyleSheet.create({
  loginRedirectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.03,
  },
  loginRedirectText: {
    fontSize: width * 0.04,
    color: "#555",
  },
  loginRedirectLink: {
    fontSize: width * 0.04,
    color: "#1a78d2",
    fontWeight: "bold",
  },
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  heading: { fontSize: width * 0.06, fontWeight: "bold", color: "#333" },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  inputSection: { width: "100%" },
  fieldview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    paddingHorizontal: width * 0.04,
    height: height * 0.07,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
    marginStart: width * 0.03,
  },
  placeholder: { color: "gray" },
  errorText: {
    color: "#ff3b30",
    fontSize: width * 0.033,
    marginBottom: height * 0.015,
    marginLeft: width * 0.04,
  },
  errorBorder: { borderColor: "#ff3b30" },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: height * 0.03,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
  },
  signUpButton: {
    backgroundColor: "#1a78d2",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.02,
    marginTop: height * 0.03,
  },
  buttonDisabled: { opacity: 0.6 },
  signUpButtonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },

  termsContainer: {
    width: "100%",
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.02,
  },
  termsText: {
    fontSize: width * 0.035,
    color: "#555",
    textAlign: "center",
    lineHeight: width * 0.05,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: width * 0.05,
  },
  successModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: width * 0.06,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: height * 0.02,
  },
  successTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.015,
    textAlign: "center",
  },
  successMessage: {
    fontSize: width * 0.04,
    color: "#555",
    textAlign: "center",
    lineHeight: width * 0.06,
    marginBottom: height * 0.03,
  },
  successButton: {
    backgroundColor: "#1a78d2",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  successButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
