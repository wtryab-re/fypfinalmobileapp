// import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { router } from 'expo-router'; // Assuming you are using Expo Router for navigation
// import React, { useState } from 'react';
// import {
//   Alert,
//   Dimensions,
//   KeyboardAvoidingView, // Use ScrollView for multiple inputs
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width, height } = Dimensions.get('window');

// const SignUpScreen = () => {
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState(''); // Could be for a Picker/Dropdown later
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [cnic, setCnic] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSignUp = () => {
//     // Basic validation
//     if (!name || !age || !gender || !phoneNumber || !cnic || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match.');
//       return;
//     }
//     // Add more complex validation (e.g., password strength, CNIC format, phone format)

//     console.log('Sign Up Data:', {
//       name,
//       age,
//       gender,
//       phoneNumber,
//       cnic,
//       password,
//     });
//     Alert.alert('Success', 'Sign Up functionality would be implemented here!');
//     // router.replace('/home'); // Example navigation after successful sign up
//   };

//   const handleLoginRedirect = () => {
//     console.log('Redirecting to Login');
//     router.replace('/startscreens/login'); // Assuming a login route exists
//   };

//   const handleTermsOfService = () => {
//     console.log('Terms of Service pressed');
//     Alert.alert('Terms of Service', 'Navigate to Terms of Service page.');
//   };

//   const handlePrivacyPolicy = () => {
//     console.log('Privacy Policy pressed');
//     Alert.alert('Privacy Policy', 'Navigate to Privacy Policy page.');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoidingView}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//       >
//         {/* Header Section */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={router.back}>
//             <Ionicons name='chevron-back-outline' size={width * 0.08} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.heading}>Sign Up</Text>
//           <View style={{ width: width * 0.08 }} /> {/* Placeholder for alignment */}
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.scrollViewContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Input Fields Section */}
//           <View style={styles.inputSection}>
//             {/* Name Input Field */}
//             <View style={styles.fieldview}>
//               <Ionicons name="person-outline" size={width * 0.06} color="gray" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder='Enter your name'
//                 placeholderTextColor="gray"
//                 value={name}
//                 onChangeText={setName}
//               />
//             </View>

//             {/* Age Input Field */}
//             <View style={styles.fieldview}>
//               <MaterialCommunityIcons name="calendar-range-outline" size={width * 0.06} color="gray" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder='Enter your age'
//                 placeholderTextColor="gray"
//                 keyboardType='numeric'
//                 value={age}
//                 onChangeText={setAge}
//               />
//             </View>

//             {/* Gender Input Field (Placeholder for dropdown) */}
//             <TouchableOpacity style={styles.fieldview}>
//               <Ionicons name="person-outline" size={width * 0.06} color="gray" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder='Enter your gender'
//                 placeholderTextColor="gray"
//                 value={gender}
//                 onChangeText={setGender}
//                 editable={false} // Make it non-editable to indicate dropdown
//               />
//               <Ionicons name="chevron-down-outline" size={width * 0.05} color="gray" />
//             </TouchableOpacity>

//             {/* Phone Input Field */}
//             <View style={styles.fieldview}>
//               <FontAwesome name="phone" size={width * 0.06} color="gray" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder='Enter your Phone'
//                 placeholderTextColor="gray"
//                 keyboardType='phone-pad'
//                 value={phoneNumber}
//                 onChangeText={setPhoneNumber}
//               />
//             </View>

//             {/* CNIC Input Field */}
//             <View style={styles.fieldview}>
//               <AntDesign name="idcard" size={width * 0.06} color="gray" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder='Enter your CNIC'
//                 placeholderTextColor="gray"
//                 keyboardType='numeric'
//                 value={cnic}
//                 onChangeText={setCnic}
//               />
//             </View>

//             {/* Create New Password Field */}
//             <View style={styles.fieldview}>
//               <FontAwesome name='lock' size={width * 0.06} color={"gray"} style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder='Create new Password'
//                 placeholderTextColor="gray"
//                 secureTextEntry={!showPassword}
//                 value={password}
//                 onChangeText={setPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.passwordToggle}
//               >
//                 <MaterialCommunityIcons
//                   name={showPassword ? "eye-off" : "eye"}
//                   size={width * 0.06}
//                   color="gray"
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Confirm Password Field */}
//             <View style={styles.fieldview}>
//               <FontAwesome name='lock' size={width * 0.06} color={"gray"} style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder='Confirm Password'
//                 placeholderTextColor="gray"
//                 secureTextEntry={!showConfirmPassword}
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                 style={styles.passwordToggle}
//               >
//                 <MaterialCommunityIcons
//                   name={showConfirmPassword ? "eye-off" : "eye"}
//                   size={width * 0.06}
//                   color="gray"
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Terms and Privacy Policy */}
//           <View style={styles.termsContainer}>
//             <Text style={styles.termsText}>
//               I agree to the Pulmovision{' '}
//               <Text style={styles.termsLink} onPress={handleTermsOfService}>
//                 Terms of services
//               </Text>{' '}
//               and{' '}
//               <Text style={styles.termsLink} onPress={handlePrivacyPolicy}>
//                 Privacy Policy
//               </Text>
//             </Text>
//           </View>

//           {/* Sign Up Button */}
//           <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
//             <Text style={styles.signUpButtonText}>Sign Up</Text>
//           </TouchableOpacity>

//           {/* Already have an account? Login */}
//           <View style={styles.loginRedirectContainer}>
//             <Text style={styles.loginRedirectText}>Already have an account? </Text>
//             <TouchableOpacity onPress={handleLoginRedirect}>
//               <Text style={styles.loginRedirectLink}>Login</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default SignUpScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: width * 0.05,
//     paddingTop: Platform.OS === 'ios' ? height * 0.02 : height * 0.02, // Consistent padding for header
//     paddingBottom: height * 0.02,
//     backgroundColor: '#fff',
//     zIndex: 1, // Ensure header is above other content if needed
//   },
//   heading: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//     color: '#333',
//     // fontFamily: "Poppins_Regular", // Uncomment if you have this font loaded
//   },
//   scrollViewContent: {
//     flexGrow: 1, // Allows ScrollView to grow and push content to bottom if needed
//     paddingHorizontal: width * 0.05, // Apply horizontal padding to the scrollable content
//     paddingTop: height * 0.03, // Space between header and first input
//     paddingBottom: height * 0.03, // Padding at the bottom of the scroll view
//     alignItems: 'center', // Center content horizontally within ScrollView
//   },
//   inputSection: {
//     width: '100%', // Input section takes full width of contentArea
//     marginBottom: height * 0.02, // Space before the Terms & Policy
//   },
//   fieldview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 30, // Rounded corners as per image
//     paddingHorizontal: width * 0.04,
//     height: height * 0.07,
//     marginBottom: height * 0.025, // Space between input fields
//     width: '100%',
//   },
//   inputIcon: {
//     marginRight: width * 0.03,
//   },
//   input: {
//     flex: 1, // Take remaining space
//     fontSize: width * 0.04,
//     color: '#333',
//     paddingVertical: 0, // Remove default vertical padding from TextInput
//   },
//   passwordToggle: {
//     paddingLeft: width * 0.02,
//   },
//   termsContainer: {
//     width: '100%',
//     marginBottom: height * 0.03, // Space between terms and Sign Up button
//     paddingHorizontal: width * 0.02, // Indent text slightly
//   },
//   termsText: {
//     fontSize: width * 0.035,
//     color: '#555',
//     textAlign: 'center', // Center the text
//     lineHeight: width * 0.05, // Improve readability
//   },
//   termsLink: {
//     color: '#1a78d2', // Blue color for links
//     fontWeight: 'bold',
//     // fontFamily: 'Poppins_Bold',
//   },
//   signUpButton: {
//     backgroundColor: '#1a78d2', // Blue button as per image
//     width: '100%',
//     paddingVertical: height * 0.02,
//     borderRadius: 30, // Rounded corners
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5, // Android shadow
//   },
//   signUpButtonText: {
//     color: '#fff',
//     fontSize: width * 0.05,
//     fontWeight: 'bold',
//     // fontFamily: 'Poppins_Bold',
//   },
//   loginRedirectContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: height * 0.03, // Space below Sign Up button
//     marginBottom: height * 0.02, // Space from bottom
//   },
//   loginRedirectText: {
//     fontSize: width * 0.04,
//     color: '#555',
//     // fontFamily: 'Poppins_Regular',
//   },
//   loginRedirectLink: {
//     fontSize: width * 0.04,
//     color: '#1a78d2', // Blue color for link
//     fontWeight: 'bold',
//     // fontFamily: 'Poppins_Bold',
//   },
// });