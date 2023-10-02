import React from 'react';
import {Text, View, TextInput, Pressable, ImageBackground} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';

const SignUpPage = ({navigation}) => {
  return (
    <View style={LoginStyles.container}>
      <ImageBackground
        source={require('../assets/images/bg.jpeg')}
        resizeMode="cover"
        style={LoginStyles.image}>
        <View style={LoginStyles.logoSection}>
          <Text style={LoginStyles.logoTxt}>{'Apni Cabs'.toUpperCase()}</Text>
        </View>
      </ImageBackground>

      <View style={[LoginStyles.section]}>
        <View>
          <TextInput
            placeholder="First Name"
            style={LoginStyles.textInputPickup}
          />
          <TextInput
            placeholder="Last Name"
            style={LoginStyles.textInputPickup}
          />
          <TextInput
            placeholder="Email Address"
            style={LoginStyles.textInputPickup}
          />
          <TextInput
            placeholder="Phone Number"
            style={LoginStyles.textInputPickup}
          />
          <TextInput
            placeholder="Create Password"
            style={LoginStyles.textInputDrop}
          />
        </View>
        <View>
        <View style={CommonStyles.mb10}>
          <Pressable
            style={LoginStyles.button}
            android_ripple={{color: '#fff'}}
            onPress={() => navigation.navigate('SignIn')}>
            <Text style={LoginStyles.text}>{'Sign Up Now'.toUpperCase()}</Text>
          </Pressable>
        </View>
        <View style={LoginStyles.signUpSection}>
          <Text style={LoginStyles.headerText}>Already Registered?</Text>
          <Pressable
            android_ripple={{color: '#fff'}}
            onPress={() => navigation.navigate('SignIn')}>
            <Text style={LoginStyles.greenTxt}>Sign in</Text>
          </Pressable>
        </View>
      </View>
      </View>
      
    </View>
  );
};
export default SignUpPage;
