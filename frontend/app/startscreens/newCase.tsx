import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { API_ENDPOINTS, apiCall } from '../api';

const { width, height } = Dimensions.get('window');

const NewCaseScreen = () => {
  const [patientId, setPatientId] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Manual verification checks
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);

  const FOOTER_HEIGHT = height * 0.07 + 30;

  const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return Alert.alert('Permission required', 'Camera roll permissions needed!');
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // Don't force crop - allow full image
    quality: 1, // Maximum quality (was 0.8)
  });
  if (!result.canceled && result.assets.length > 0) setSelectedImage(result.assets[0].uri);
};

const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return Alert.alert('Permission required', 'Camera permissions needed!');
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false, // Don't force crop - allow full image
    quality: 1, // Maximum quality (was 0.8)
  });
  if (!result.canceled && result.assets.length > 0) setSelectedImage(result.assets[0].uri);
};

  const showImagePickerOptions = () => {
    Alert.alert('Upload Image', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeImage = () => setSelectedImage(null);

  const handleSubmit = async () => {
    if (!patientId || !patientHistory || !selectedImage) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    if (!(check1 && check2 && check3)) {
      Alert.alert("Error", "Please answer Yes to all verification questions.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("patientHistory", patientHistory);
    formData.append(
      "manualChecks",
      JSON.stringify({ isLungs: check1, isClear: check2, isVerified: check3 })
    );

    const uriParts = selectedImage.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("image", {
      uri: selectedImage,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      const response = await fetch(API_ENDPOINTS.USER.CREATE_CASE, {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Received text instead of JSON:", text);
        throw new Error("Server returned unexpected response.");
      }

      if (response.ok) {
        Alert.alert("Success", "Case submitted successfully!");
        setPatientId("");
        setPatientHistory("");
        setSelectedImage(null);
        setCheck1(false);
        setCheck2(false);
        setCheck3(false);
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Could not submit case. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kindly provide{'\n'}necessary details{'\n'}below</Text>
        <Image source={require('../../assets/placeholders/1.png')} style={styles.profileImage} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -FOOTER_HEIGHT}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: FOOTER_HEIGHT }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputContainer}>
            <Ionicons name="medical-outline" size={width * 0.05} color="gray" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter Patient ID"
              placeholderTextColor="gray"
              value={patientId}
              onChangeText={setPatientId}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.sectionTitle}>Patient History</Text>
          <TextInput
            placeholder="Enter text here"
            placeholderTextColor="gray"
            value={patientHistory}
            onChangeText={setPatientHistory}
            multiline
            style={styles.textArea}
            maxLength={100}
          />
          <Text style={styles.descriptionHint}>
            Please enter a guide description   {patientHistory.length}/100
          </Text>

          <TouchableOpacity style={styles.uploadContainer} onPress={showImagePickerOptions}>
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Ionicons name="close-circle" size={width * 0.06} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Ionicons name="image-outline" size={width * 0.1} color="#ccc" />
                <Text style={styles.uploadText}>Upload Image</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Manual Verification Section */}
          <Text style={styles.sectionTitle}>Manual Verification</Text>
          {[
            { label: "Is the picture of lungs?", state: check1, setState: setCheck1 },
            { label: "Is the X-ray clear?", state: check2, setState: setCheck2 },
            { label: "Have you verified all details?", state: check3, setState: setCheck3 },
          ].map((q, i) => (
            <View key={i} style={styles.verificationRow}>
              <Text style={styles.verificationLabel}>{q.label}</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleButton, q.state && styles.toggleButtonYes]}
                  onPress={() => q.setState(true)}
                >
                  <Text style={[styles.toggleText, q.state && styles.toggleTextActive]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleButton, !q.state && styles.toggleButtonNo]}
                  onPress={() => q.setState(false)}
                >
                  <Text style={[styles.toggleText, !q.state && styles.toggleTextActive]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Case</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerNav}>
        <TouchableOpacity onPress={() => router.push('/startscreens/healthWorkerDashboard')}>
          <Ionicons name="home-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('./startscreens/notifications')}>
          <Ionicons name="notifications-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person-outline" size={width * 0.07} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NewCaseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingContainer: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: width * 0.03 },
  profileImage: { width: width * 0.14, height: width * 0.14, borderRadius: (width * 0.2) / 2, marginRight: width * 0.05 },
  title: { fontSize: width * 0.06, fontWeight: 'bold', color: '#333', marginTop: height * 0.02, marginHorizontal: width * 0.05 },
  scrollViewContent: { flexGrow: 1, paddingHorizontal: width * 0.07, paddingTop: height * 0.03 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: width * 0.04, marginTop: height * 0.02 },
  inputIcon: { marginRight: width * 0.03, marginLeft: width * 0.01 },
  textInput: { flex: 1, fontSize: width * 0.04, color: '#333', paddingVertical: height * 0.015 },
  sectionTitle: { fontSize: width * 0.06, fontWeight: 'bold', color: '#333', marginTop: height * 0.03, marginBottom: height * 0.02 },
  textArea: { backgroundColor: '#f5f5f5', borderRadius: 15, paddingHorizontal: width * 0.04, paddingVertical: height * 0.02, minHeight: height * 0.17, textAlignVertical: 'top' },
  descriptionHint: { fontSize: width * 0.035, color: '#999', marginTop: height * 0.02 },
  uploadContainer: { backgroundColor: '#f5f5f5', borderRadius: 20, alignItems: 'center', justifyContent: 'center', height: height * 0.18, marginTop: height * 0.01 },
  uploadText: { fontSize: width * 0.035, color: '#999', marginTop: height * 0.01 },
  imagePreviewContainer: { position: 'relative', width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden' },
  selectedImage: { width: '100%', height: '100%', borderRadius: 20 },
  removeImageButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'white', borderRadius: 15 },
  verificationRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginVertical: height * 0.01,
    paddingVertical: height * 0.01,
  },
  verificationLabel: { 
    flex: 1, 
    fontSize: width * 0.04, 
    color: '#333',
    marginRight: width * 0.02,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleButton: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    backgroundColor: '#f5f5f5',
  },
  toggleButtonYes: {
    backgroundColor: '#4CAF50',
  },
  toggleButtonNo: {
    backgroundColor: '#f44336',
  },
  toggleText: {
    fontSize: width * 0.035,
    color: '#666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: { backgroundColor: '#1a78d2', borderRadius: 30, paddingVertical: height * 0.02, paddingHorizontal: width * 0.3, alignSelf: 'center', marginTop: height * 0.03, marginBottom: height * 0.02 },
  submitButtonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold' },
  footerNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: height * 0.015, borderTopWidth: 1, borderTopColor: '#eee', position: 'relative', bottom: 0, left: 0, right: 0, backgroundColor: '#fff' },
});