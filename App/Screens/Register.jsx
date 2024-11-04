import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView,Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Register = () => {
    const [name, setName] = useState('');
    const [nameVerify, setNameVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [mobile, setMobile] = useState('');
    const [mobileVerify, setMobileVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(){
      const userData = {
        name: name,
        email: email,
        mobile: mobile,
        password: password,
      };
      if (nameVerify && emailVerify && passwordVerify && mobileVerify) {
        fetch('http://192.168.0.102:5001/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === "ok") {
            Alert.alert('Success', 'User registered successfully!');
          } else {
            Alert.alert('Error', data.data || 'Registration failed');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Alert.alert('Error', 'Network error');
        });
      } else {
        Alert.alert("Fill the Necessary Details");
      }
      

    }
    

    function handleName(e) {
        const nameVar = e.nativeEvent.text;
        setName(nameVar);
        setNameVerify(false);
        if(nameVar.length > 5){
            setNameVerify(true);
        }
    }
    function handleEmail(e){
      const emailVar = e.nativeEvent.text;
      setEmail(emailVar);
      setEmailVerify(false);

      if(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/.test(emailVar))
      {
        setEmail(emailVar);
        setEmailVerify(true);
      }
    }
    function handleMobile(e){
      const mobileVar = e.nativeEvent.text;
      setMobile(mobileVar);
      setMobileVerify(false);

      if(/[6-9]{1}[0-9]{9}/.test(mobileVar))
      {
        setMobile(mobileVar);
        setMobileVerify(true);
      }
    }
    function handlePassword(e){
      const passwordVar = e.nativeEvent.text;
      setPassword(passwordVar);
      setPasswordVerify(false);

      if(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar))
      {
        setPassword(passwordVar);
        setPasswordVerify(true);
      }
    }
  return (
    <ScrollView contentContainerStyle ={{flexGrow: 1}} 
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps={'always'}>
    <LinearGradient colors={['#609966','#EDF1D6']} 
    start={{x : 0.5, y : 0.3}}
    end={{x : 1.4, y : 0.7}}
    style={styles.Maincontainer}>
      <View style={styles.InputContainer}>
            <Text style={styles.label1}>Create An EcoWear Account</Text>
        <View style = {styles.Imageinput}>
        <FontAwesome name="user-plus" color="#EDF1D6"
        style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="USERNAME"
          placeholderTextColor="#EDF1D6"
          onChange={e => handleName(e)}
        />
          {name.length < 1 ? null : nameVerify ? (
            <FontAwesome name="check-circle" color="green" size={20} />
          ) : (
            <FontAwesome name="times-circle" color="red" size={20} />
          )}


        </View>
           {
            name.length < 1 ? null : nameVerify ? null :(
              <Text
              style={{
                marginLeft: 20,
                color:'red',
              }}>Name Should be More than 5 characters.</Text>
            )
           } 

        <View style = {styles.Imageinput}>
        <FontAwesome name="envelope" color="#EDF1D6"
        style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="EMAIL ID"
          placeholderTextColor="#EDF1D6"
          onChange={e => handleEmail(e)}
        />
          {email.length < 1 ? null : emailVerify ? (
            <FontAwesome name="check-circle" color="green" size={20} />
          ) : (
            <FontAwesome name="times-circle" color="red" size={20} />
          )}
        </View>
        {
            email.length < 1 ? null : emailVerify ? null :(
              <Text
              style={{
                marginLeft: 20,
                color:'red',
              }}>Enter Proper Email Address</Text>
            )
          } 

              <View style = {styles.Imageinput}>
              <FontAwesome name="mobile-phone" color="#EDF1D6"
              style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="MOBILE/PHONE NO."
                placeholderTextColor="#EDF1D6"
                onChange={e => handleMobile(e)}
                maxLength={10}
              />
                {mobile.length < 1 ? null : mobileVerify ? (
                  <FontAwesome name="check-circle" color="green" size={20} />
                ) : (
                  <FontAwesome name="times-circle" color="red" size={20} />
                )}
              </View>
              {
                  mobile.length < 1 ? null : mobileVerify ? null :(
                    <Text
                    style={{
                      marginLeft: 20,
                      color:'red',
                    }}>Enter 10 digits.</Text>
                  )
                 } 

        <View style = {styles.Imageinput}>
        <FontAwesome name="lock" color="#EDF1D6"
        style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#EDF1D6"
          secureTextEntry = {showPassword}
          onChange={e => handlePassword(e)}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        {password.length < 1 ? null : showPassword ? (
                  <FontAwesome name="eye" color="green" size={20} />
                ) : (
                  <FontAwesome name="eye-slash" color="green" size={20} />
                )}
        </TouchableOpacity>
        </View>
        {
                  password.length < 1 ? null : passwordVerify ? null :(
                    <Text
                    style={{
                      marginLeft: 20,
                      color:'red',
                    }}>Uppercase, Lowercase, Number and 6 or more Characters.</Text>
                  )
                 } 

        <TouchableOpacity style={styles.RegisterButton} activeOpacity={0.8} onPress={()=> handleSubmit()}>
        <FontAwesome name="sign-in" color="#EDF1D6"
        style={styles.signsicon}/>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
      
    <Image source={require('../Assets/shop2.png')}style={styles.MainImage}/>
</LinearGradient>
</ScrollView>
  );
};


const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding:30,
  },
  label1:{
    fontSize:28,
    color:'#EDF1D6',
    marginBottom:20,
  },
  InputContainer:{
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:60,
  },

  MainImage:{
        width: 250,
        height: 250,
        position: 'relative',
        bottom: -50,
        right: -50,
        margin: 10,
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
    color: '#EDF1D6',
  },

  signsicon:{
    fontSize:25,
    marginRight:10,
  },

  RegisterButton: {
    width: 160,
    height: 50,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#609966',
    borderRadius: 25,
    marginVertical: 10,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#EDF1D6',
  },

  icon: {
    fontSize:30,
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

});

export default Register;
