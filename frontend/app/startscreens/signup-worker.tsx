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

const WorkerSignupScreen = () => {
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
  const [workerID, setWorkerID] = useState("");
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
    workerID: "",
  });

  // ✅ Field-level live validation
  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) error = "Please enter your full name.";
        break;

      case "age":
        if (!value) error = "Please enter your age.";
        else if (parseInt(value) < 18 || parseInt(value) > 100)
          error = "Please enter a valid age between 18 and 100.";
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
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          error = "Please enter a valid email address.";
        break;

      case "password":
        if (!value) error = "Please create a password.";
        else if (value.length < 6)
          error = "Password must be at least 6 characters long.";
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          error =
            "Password must include at least one uppercase letter, one lowercase letter, and one number.";
        break;

      case "confirmPassword":
        if (!value) error = "Please confirm your password.";
        else if (value !== password) error = "Passwords do not match.";
        break;

      case "workerID":
        if (!value.trim()) error = "Please enter your Work ID.";
        else if (!/^[A-Za-z0-9_-]{4,10}$/.test(value))
          error = "Work ID must be 4–10 letters or numbers.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(errors).forEach((key) => {
      if (errors[key as keyof typeof errors]) isValid = false;
    });
    return isValid;
  };

  const handleSignUp = async () => {
    // Run validation before submit
    Object.entries({
      name,
      age,
      gender,
      phoneNumber,
      cnic,
      email,
      password,
      confirmPassword,
      workerID,
    }).forEach(([field, value]) => validateField(field, value));

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          age: parseInt(age),
          gender,
          phoneNumber: phoneNumber.trim(),
          cnic,
          email: email.trim().toLowerCase(),
          password,
          role: "worker",
          workerID: workerID.trim(),
        }),
      });

      if (result.success) {
        setShowSuccessPopup(true);
      } else {
        Alert.alert(
          "Registration Failed",
          "An error occurred during registration. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Network Error",
        "Unable to connect to the server. Please check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    router.replace("/startscreens/workerlogin");
  };

  const handleLoginRedirect = () => {
    router.replace("/startscreens/workerlogin");
  };

  const formatCNIC = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 13);
    setCnic(cleaned);
    validateField("cnic", cleaned);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 11);
    setPhoneNumber(cleaned);
    validateField("phoneNumber", cleaned);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Ionicons
              name="chevron-back-outline"
              size={width * 0.08}
              color="#333"
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Worker Signup</Text>
          <View style={{ width: width * 0.08 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons
              name="information-circle"
              size={width * 0.06}
              color="#1a78d2"
            />
            <Text style={styles.infoBannerText}>
              Worker accounts require admin approval. You'll be notified once
              approved.
            </Text>
          </View>

          <View style={styles.inputSection}>
            {/* Name */}
            <InputField
              icon="person-outline"
              placeholder="Enter your full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                validateField("name", text);
              }}
              error={errors.name}
            />

            {/* Email */}
            <InputField
              icon="email-outline"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateField("email", text);
              }}
              error={errors.email}
              material
            />

            {/* Age */}
            <InputField
              icon="calendar-range-outline"
              placeholder="Enter your age"
              keyboardType="numeric"
              value={age}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, "");
                setAge(cleaned);
                validateField("age", cleaned);
              }}
              error={errors.age}
              material
            />

            {/* Gender */}
            <TouchableOpacity
              style={[styles.fieldview, errors.gender && styles.errorBorder]}
              onPress={() => setShowGenderPicker(true)}
            >
              <Ionicons
                name="person-outline"
                size={width * 0.06}
                color={errors.gender ? "#ff3b30" : "gray"}
                style={styles.inputIcon}
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

            {/* Phone */}
            <InputField
              icon="phone"
              placeholder="Enter your phone number (11 digits)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={formatPhoneNumber}
              error={errors.phoneNumber}
              fontAwesome
              maxLength={11}
            />

            {/* CNIC */}
            <InputField
              icon="idcard"
              placeholder="Enter your CNIC (13 digits)"
              keyboardType="numeric"
              value={cnic}
              onChangeText={formatCNIC}
              error={errors.cnic}
              antDesign
              maxLength={13}
            />

            {/* Work ID */}
            <InputField
              icon="briefcase-outline"
              placeholder="Enter your Work ID"
              value={workerID}
              onChangeText={(text) => {
                setWorkerID(text);
                validateField("workerID", text);
              }}
              error={errors.workerID}
              material
              maxLength={10}
            />

            {/* Password */}
            <PasswordField
              value={password}
              placeholder="Create new password"
              onChangeText={(text) => {
                setPassword(text);
                validateField("password", text);
              }}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              error={errors.password}
            />

            {/* Confirm Password */}
            <PasswordField
              value={confirmPassword}
              placeholder="Confirm password"
              onChangeText={(text) => {
                setConfirmPassword(text);
                validateField("confirmPassword", text);
              }}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              error={errors.confirmPassword}
            />
          </View>

          {/* Sign Up Button */}
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

          {/* Login redirect */}
          <View style={styles.loginRedirectContainer}>
            <Text style={styles.loginRedirectText}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginRedirectLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Picker Modal */}
      <Modal visible={showGenderPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
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

      {/* Success Modal */}
      <Modal visible={showSuccessPopup} transparent animationType="fade">
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Ionicons
              name="checkmark-circle"
              size={width * 0.15}
              color="#4CAF50"
            />
            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successMessage}>
              Your account has been created successfully! Please wait for admin
              approval.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessPopupClose}
            >
              <Text style={styles.successButtonText}>Continue to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// 🔸 Reusable Input Field
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  error,
  antDesign,
  fontAwesome,
  material,
}: any) => {
  const IconComponent = antDesign
    ? AntDesign
    : fontAwesome
      ? FontAwesome
      : material
        ? MaterialCommunityIcons
        : Ionicons;

  return (
    <>
      <View style={[styles.fieldview, error && styles.errorBorder]}>
        <IconComponent
          name={icon}
          size={width * 0.06}
          color={error ? "#ff3b30" : "gray"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="gray"
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );
};

// 🔸 Password Field
const PasswordField = ({
  value,
  onChangeText,
  placeholder,
  showPassword,
  setShowPassword,
  error,
}: any) => (
  <>
    <View style={[styles.fieldview, error && styles.errorBorder]}>
      <FontAwesome
        name="lock"
        size={width * 0.06}
        color={error ? "#ff3b30" : "gray"}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="gray"
        secureTextEntry={!showPassword}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={width * 0.06}
          color="gray"
        />
      </TouchableOpacity>
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.03,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.025,
    borderLeftWidth: 4,
    borderLeftColor: "#1a78d2",
  },
  infoBannerText: {
    flex: 1,
    fontSize: width * 0.035,
    color: "#1565c0",
    marginLeft: width * 0.03,
  },
  inputSection: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  fieldview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    paddingHorizontal: width * 0.04,
    height: height * 0.07,
    marginBottom: height * 0.015,
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
  },
  errorBorder: {
    borderColor: "#ff3b30",
  },
  inputIcon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
  },
  placeholder: {
    color: "gray",
  },
  signUpButton: {
    backgroundColor: "#1a78d2",
    width: "100%",
    paddingVertical: height * 0.02,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },
  successModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  successModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: width * 0.06,
    alignItems: "center",
  },
  successTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    marginTop: height * 0.02,
  },
  successMessage: {
    fontSize: width * 0.04,
    color: "#555",
    textAlign: "center",
    marginVertical: height * 0.02,
  },
  successButton: {
    backgroundColor: "#1a78d2",
    borderRadius: 30,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
  },
  successButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: width * 0.033,
    marginBottom: height * 0.015,
    marginLeft: width * 0.04,
    alignSelf: "flex-start",
  },
});

export default WorkerSignupScreen;
