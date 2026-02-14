import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Map your font names to the imported font assets
    Poppins_Regular: Poppins_400Regular, // This is the name you'll use in StyleSheet
    Poppins_Bold: Poppins_700Bold, // This is the name you'll use in StyleSheet
    // You can use different names here if you prefer, but keep them consistent
  });

  //hides ugly header//
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="signinlogin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="workerlogin" options={{ headerShown: false }} />
      <Stack.Screen name="role-selection" options={{ headerShown: false }} />
      <Stack.Screen name="signup-patient" options={{ headerShown: false }} />
      <Stack.Screen name="signup-worker" options={{ headerShown: false }} />
      <Stack.Screen name="patientlogin" options={{ headerShown: false }} />
      <Stack.Screen name="login-worker" options={{ headerShown: false }} />
      <Stack.Screen
        name="signin-role-selection"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="worker-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="patientDashboard" options={{ headerShown: false }} />
      <Stack.Screen
        name="healthWorkerDashboard"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="newCase" options={{ headerShown: false }} />
      <Stack.Screen name="patientHistory" options={{ headerShown: false }} />

      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="AllCases" options={{ headerShown: false }} />
      <Stack.Screen name="seeStatus" options={{ headerShown: false }} />
      <Stack.Screen name="patientseestatus" options={{ headerShown: false }} />
      <Stack.Screen name="patientprofile" options={{ headerShown: false }} />
    </Stack>
  );
}
