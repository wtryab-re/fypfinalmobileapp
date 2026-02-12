import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logo from '../../assets/images/Logoblue.png';

const goToOnboarding = ()=>{  
  router.replace('/startscreens/onboarding') 
}

const {width,height} =Dimensions.get("window")

const Index = ()=> {
  return (
    <View  style={styles.container}>
       <LinearGradient
        // Background Linear Gradient
        colors={['#52E5E7', "#1a78d2",'#130CB7']}
        style={styles.background}
        start={[0,0]}
        end={[1,1]}
      />
      <Image source={logo}/>
      <Text style={[styles.commonstyles,styles.heading]}>PulmoVision </Text>
      
      <Text style={[styles.description, styles.commonstyles]}>Vision for Healthier Lungs</Text>
      
      <TouchableOpacity style={styles.button} onPress={goToOnboarding}>
        <Ionicons name='arrow-forward' size={40} color={"#1a78d2"}></Ionicons>
        </TouchableOpacity>
      </View>
  );
}
export default Index;


const styles = StyleSheet.create({
  
 container: {
  width:"100%",
    flex: 1,
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom:0
  },
  commonstyles: {
    color: "white",
    fontFamily: "Poppins_Regular"
  },
  heading: { 
    fontFamily: "Poppins_Bold",
    fontSize:  width * 0.1,
    marginTop: 5
  }, 
  description: {
    marginTop:0,
    textAlign:"center",
    fontSize: width*0.05
  }, 
  button:{
    width: width * 0.15, // Responsive width
    height: width * 0.15, // Maintain aspect ratio
    borderRadius: (width * 0.15) / 2, // Half of width/height for perfect circle
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
    top: height*0.15,
    left: width*0.3
  }
  ,
  
})