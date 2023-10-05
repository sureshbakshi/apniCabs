import React, {useContext} from 'react';
import {Text, View, Pressable, ScrollView} from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import {AuthContext} from '../context/Auth.context';
import {navigate} from '../util/navigationService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const MorePage = () => {
  const {logout} = useContext(AuthContext);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      logout();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={MoreStyles.container}>
      <View style={MoreStyles.section}>
        <ScrollView>
          <View style={MoreStyles.card}>
            <View style={MoreStyles.cardtop}>
              <View style={MoreStyles.left}>
                <View style={MoreStyles.profileIcon}></View>
              </View>
              <View style={MoreStyles.middle}>
                <Text style={MoreStyles.name}>David Johnson</Text>
                <Text style={MoreStyles.review}>11 Reviews</Text>
              </View>
            </View>
          </View>
          <View style={MoreStyles.listSection}>
            <Pressable
              style={MoreStyles.list}
              android_ripple={{color: '#ccc'}}
              onPress={() => navigate('MyProfile')}>
              <View style={MoreStyles.listIcon}></View>
              <Text style={MoreStyles.name}>My Profile</Text>
            </Pressable>
            <View style={MoreStyles.list}>
              <View style={MoreStyles.listIcon}></View>
              <Text style={MoreStyles.name}>Notifications</Text>
            </View>
            <Pressable
              style={MoreStyles.list}
              android_ripple={{color: '#ccc'}}
              onPress={() => navigate('TermsAndConditions')}>
              <View style={MoreStyles.listIcon}></View>
              <Text style={MoreStyles.name}>Terms and Conditions</Text>
            </Pressable>

            <View style={MoreStyles.list}>
              <View style={MoreStyles.listIcon}></View>
              <Text style={MoreStyles.name}>Refer and Earn</Text>
            </View>
            <View style={MoreStyles.list}>
              <View style={MoreStyles.listIcon}></View>
              <Text style={MoreStyles.name}>Help</Text>
            </View>
          </View>
          <Pressable
            android_ripple={{color: '#ccc'}}
            style={MoreStyles.button}
            onPress={signOut}>
            <Text style={MoreStyles.greenTxt}>{'Logout'}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};
export default MorePage;
