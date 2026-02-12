import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const {width,height} =Dimensions.get("window")

const image1= require("@/assets/images/onboardscreen1.png");
const image2= require("@/assets/images/onboardscreen2.png");

const text= ["Empowering diagnosis with the precision of AI",
  "Interpretable insights for detection of Tuberculosis and Pneumonia"
]

const Onboarding = () => {
const [currentImage, setCurrentImage] = useState(image1);
const [currentText,setCurrentText] = useState(text[0]);

const handleChangeImage =() => {
  if (currentImage === image1){
    setCurrentImage(image2)
    setCurrentText(text[1])
    return;
  }
  if (currentImage === image2){
    router.replace("/startscreens/signinlogin")
  }
};

  return (
    <SafeAreaView style={styles.outercontainer}>

      <View style={[styles.buttoncontainer]}>
        <Pressable>
          <Text >Back</Text>
        </Pressable>
              
        <Pressable onPressIn={()=>{router.replace("/startscreens/signinlogin")}}>
          <Text>Skip</Text>
        </Pressable>

      </View>
      <View style={[styles.Imagecontainer]}>
        <Image source={currentImage} style={styles.image}/>
      </View>
      <Text style={styles.text}>{currentText}</Text>
      
      <View style={[styles.nextbuttoncontainer]}>
        <TouchableOpacity onPress={handleChangeImage} style={styles.button}>
          <Ionicons name='arrow-forward' size={40} color={"#fff"}></Ionicons>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Onboarding;

const styles = StyleSheet.create({
  buttoncontainer:{
    paddingHorizontal: 25,
    backgroundColor:"white",
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",
  },
  Imagecontainer:{
    backgroundColor:"blue",
    flex:4,
    width:"100%", 
    height:"100%"
  },
  text:{
    fontSize: width * 0.045, // Responsive font size
    textAlign: 'left',
    paddingHorizontal: width*0.05,
    marginTop: width*0.2,
    color: '#333',
    fontFamily: 'Poppins_Bold', // Assuming Poppins_Bold is loaded
    lineHeight: width * 0.08, // Adjust line height for readability
    marginBottom: height * 0.05, // Space below heading
  },
  nextbuttoncontainer:{
    flex:1.5,
    width:"100%",
    alignItems:"flex-end",
    justifyContent: "center",
  },
  outercontainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#fff",
    flex: 1
  },
  image:{
    alignSelf:"center",
    width:height/2,
    height:height/2
  },

  button:{
    width: width * 0.15, // Responsive width
    height: width * 0.15, // Maintain aspect ratio
    borderRadius: (width * 0.15) / 2, // Half of width/height for perfect circle
    backgroundColor: '#1a78d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:width*0.14,
    marginBottom: 70
  }

})