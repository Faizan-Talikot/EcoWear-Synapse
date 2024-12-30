import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env'

const LoginScreen = ({ onLoginSuccess }) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const userData = {
      name: name,
      password: password,
    };
  
    fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "ok") {
        Alert.alert('Success', 'Login successful!');
        AsyncStorage.setItem('token',data.data);
        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        onLoginSuccess(); // Call the success function passed as a prop
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error');
    });
  };


  return (
    
    <LinearGradient colors={['#EDF1D6', '#609966']} 
    start={{x : 0.5, y : 0.3}}
    end={{x : 1, y : 0.7}}
    style={styles.Maincontainer}>
      <View style ={styles.IconsContainer}>
      <Image 
        source={require('../Assets/icons8-suit-50.png')} 
        style={styles.IconsAbove1} 
        />
      <Image 
        source={require('../Assets/icons8-jeans-50.png')} 
        style={styles.IconsAbove2} 
      />
      <Image 
        source={require('../Assets/icons8-cloth-50.png')} 
        style={styles.IconsAbove2} 
      />
      <Image 
        source={require('../Assets/icons8-cloth-50.png')} 
        style={styles.IconsAbove3} 
      />
      <Image 
        source={require('../Assets/icons8-cloth-64 (1).png')} 
        style={styles.IconsAbove4} 
      />
      <Image 
        source={require('../Assets/icons8-cloth-64 (3).png')} 
        style={styles.IconsAbove5} 
      />
      <Image 
        source={require('../Assets/icons8-cloth-64 (2).png')} 
        style={styles.IconsAbove6} 
      />
      
      <Image 
        source={require('../Assets/icons8-anzac-slouch-hat-100.png')} 
        style={styles.IconsAbove7} 
      />
      <Image 
        source={require('../Assets/icons8-bow-tie-50.png')} 
        style={styles.IconsAbove8} 
      />
      <Image 
        source={require('../Assets/icons8-bathrobe-80.png')} 
        style={styles.IconsAbove9} 
      />
      <Image 
        source={require('../Assets/icons8-little-black-dress-50.png')} 
        style={styles.IconsAbove10} 
      />
      <Image 
        source={require('../Assets/icons8-suit-50.png')} 
        style={styles.IconsAbove11} 
      />
      </View>
      <View style={styles.Maincontainer}>
        <View style={styles.LogoContainer}>
          <Image 
            source={require('../Assets/shop1.png')} 
            style={styles.Logo}
          />
        </View>
        <View style = {styles.Imageinput}>
        <Image 
        source={require('../Assets/profile.png')} 
        style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="USERNAME"
          placeholderTextColor="#000"
          value={name}
          onChangeText={setName}
        />
        </View>
        <View style = {styles.Imageinput}>
        <Image 
        source={require('../Assets/padlock.png')} 
        style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#000"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
        
         <TouchableOpacity>
          <Text style={styles.newUserText} onPress={()=>navigation.navigate("Register")}>Don't have an account? 
          <Text style={styles.registertext}> Register</Text></Text>
          </TouchableOpacity>
        
        <TouchableOpacity style={styles.registerButton}
        onPress={
            () =>{
              navigation.navigate('Register');
            }}>
        </TouchableOpacity>
      </View>


</LinearGradient>
  );
};


const styles = StyleSheet.create({
  Maincontainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:30,
    height:'100%'
  },
 LogoContainer: {
    marginBottom: 20,
    
  },
  Logo: {
    marginTop: 80,
    width: 300,
    height: 150,
    resizeMode: 'contain',
    
  },
  input: {
    width: 300,
    paddingRight: 100,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
    borderColor: '#609966', // Border color
    borderWidth: 0.2, // Border width
    shadowColor:'#EDF1D6',
    elevation: 1,

  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 5,
    color: '#000',
  },
  loginButton: {
    width: 160,
    height: 50,
    backgroundColor: '#EDF1D6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#000',
  },
  newUserText: {
    marginTop: 20,
    color: '#000',
  },

  icon: {
    width: 30,
    height: 30,
    marginleft: 10,
  },
  Imageinput:{
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 0,
  },
  IconsAbove1: {
    width:40,
    height:40,
    marginRight:280,
    transform: [{ rotate: '-15deg' }]
  },
  IconsAbove2: {
    width:40,
    height:40,
    marginLeft:80,
    marginTop:30,
    marginBottom:-180,
    transform: [{ rotate: '-25deg' }] //jeans
  },
  IconsAbove3: {
    width:40,
    height:40,
    marginLeft:130,
    marginTop:320,
    marginBottom:-400,
    transform: [{ rotate: '25deg' }] //tshirt
  },
  IconsAbove4: {
    width:40,
    height:40,
    marginLeft:280,
    marginTop:250,
    marginBottom:-400,
    transform: [{ rotate: '35deg' }]
  },
  IconsAbove5: {
    width:40,
    height:40,
    marginLeft:-15,
    marginTop:410,
    marginBottom:-400,
    transform: [{ rotate: '30deg' }]
  },
  IconsAbove6: {
    width:40,
    height:40,
    marginLeft:35,
    marginTop:420,
    marginBottom:-400,
    transform: [{ rotate: '30deg' }]
  },
  IconsAbove7: {
    width:50,
    height:50,
    marginLeft:5,
    marginTop:420,
    marginBottom:-400,
    transform: [{ rotate: '-30deg' }]
  },
  IconsAbove8: {
    width:40,
    height:40,
    marginLeft:280,
    marginTop:250,
    marginBottom:-400,
    transform: [{ rotate: '-30deg' }]
  },
  IconsAbove9: {
    width:40,
    height:40,
    marginLeft:180,
    marginTop:250,
    marginBottom:-400,
    transform: [{ rotate: '-30deg' }]
  },
  IconsAbove10: {
    width:40,
    height:40,
    marginLeft:180,
    marginTop:450,
    marginBottom:-400,
    transform: [{ rotate: '-30deg' }]
  },
  IconsAbove11: {
    width:40,
    height:40,
    marginLeft:200,
    marginTop:450,
    marginBottom:-400,
    transform: [{ rotate: '-30deg' }]
  },
  newUserText:{
    fontSize:15,
    marginTop:15
  },
  registertext:{
    color:'blue'
  }

});

export default LoginScreen;
