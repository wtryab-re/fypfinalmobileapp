import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const EditProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Text style={styles.subTitle}>Ali Hassan</Text>
            <Text style={styles.subTitle}>P-5632-8</Text>
          </View>
          <Image 
            source={require('../../assets/placeholders/1.png')} 
            style={styles.profileImage} 
          />
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={width * 0.05} color="gray" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter New Username"
            placeholderTextColor="gray"
            value={username}
            onChangeText={setUsername}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={width * 0.05} color="gray" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter New Phone Number"
            placeholderTextColor="gray"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={width * 0.05} color="gray" style={styles.inputIcon} />
          <TextInput
            placeholder="Enter New Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={width * 0.05} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={width * 0.05} color="gray" style={styles.inputIcon} />
          <TextInput
            placeholder="Confirm New Password"
            placeholderTextColor="gray"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={width * 0.05} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Footer Nav */}
        <View style={styles.footerNav}>
          <Ionicons name="home-outline" size={width * 0.07} color="#999" />
          <Ionicons name="notifications-outline" size={width * 0.07} color="#999" />
          <Ionicons name="calendar-outline" size={width * 0.07} color="#999" />
          <Ionicons name="person" size={width * 0.07} color="#1a78d2" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.09,
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333'
  },
  subTitle: {
    fontSize: width * 0.04,
    color: '#333'
  },
  profileImage: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: (width * 0.2) / 2
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.03,
    marginHorizontal: width * 0.05
  },
  inputIcon: {
    marginRight: width * 0.02
  },
  textInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#333',
    paddingVertical: height * 0.015
  },
  saveButton: {
    backgroundColor: '#1a78d2',
    borderRadius: 30,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.3,
    alignSelf: 'center',
    marginTop: height * 0.03
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold'
  },
  footerNav: {
    flexDirection: 'row',
    marginBottom:30,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  }
});
