import { Stack } from "expo-router";



import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';

export default function RootLayout() {
   const [fontsLoaded, fontError] = useFonts({
    // Map your font names to the imported font assets
    'Poppins_Regular': Poppins_400Regular, // This is the name you'll use in StyleSheet
    'Poppins_Bold': Poppins_700Bold,     // This is the name you'll use in StyleSheet
    // You can use different names here if you prefer, but keep them consistent
  })

  return <Stack >
    <Stack.Screen
      name="startscreens"
      options={{ headerShown: false }}
    />
  </Stack>;
}
