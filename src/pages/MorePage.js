import React, {useContext} from 'react';
import {View, Pressable, ScrollView} from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import {navigate} from '../util/navigationService';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Icon, ImageView, Text} from '../components/common';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import {COLORS} from '../constants';
import {clearAuthData} from '../slices/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useAuthContext} from '../context/Auth.context';
const MorePage = () => {
  const {signOut} = useAuthContext();
  const dispatch = useDispatch();
  const profile = useSelector(state => state.auth?.profileInfo);

  const logOut = async () => {
    try {
      const sucess = signOut();
      if (sucess) {
        await GoogleSignin.signOut();
        dispatch(clearAuthData());
      }
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
                {/* <View style={MoreStyles.profileIcon}></View> */}
                <ImageView
                  source={images[`captain4`]}
                  style={[styles.avatar]}
                />
              </View>
              <View style={MoreStyles.middle}>
                <Text style={MoreStyles.name}>{profile?.name}</Text>
                <Text style={MoreStyles.review}>11 Reviews</Text>
              </View>
            </View>
          </View>
          <View style={MoreStyles.listSection}>
            <Pressable
              style={MoreStyles.list}
              android_ripple={{color: '#ccc'}}
              onPress={() => navigate('MyProfile')}>
              <View style={MoreStyles.listIcon}>
                <Icon name="account" size="large" color={COLORS.primary} />
              </View>
              <Text style={MoreStyles.name}>My Profile</Text>
            </Pressable>
            <View style={MoreStyles.list}>
              <View style={MoreStyles.listIcon}>
                <Icon name="bell-ring" size="large" color={COLORS.primary} />
              </View>
              <Text style={MoreStyles.name}>Notifications</Text>
            </View>
            <Pressable
              style={MoreStyles.list}
              android_ripple={{color: '#ccc'}}
              onPress={() => navigate('TermsAndConditions')}>
              <View style={MoreStyles.listIcon}>
                <Icon name="notebook" size="large" color={COLORS.primary} />
              </View>
              <Text style={MoreStyles.name}>Terms and Conditions</Text>
            </Pressable>

            <View style={MoreStyles.list}>
              <View style={MoreStyles.listIcon}>
                <Icon
                  name="account-tie-voice"
                  size="large"
                  color={COLORS.primary}
                />
              </View>
              <Text style={MoreStyles.name}>Refer and Earn</Text>
            </View>
            <View style={MoreStyles.list}>
              <View style={MoreStyles.listIcon}>
                <Icon name="help" size="large" color={COLORS.primary} />
              </View>
              <Text style={MoreStyles.name}>Help</Text>
            </View>
          </View>
          <Pressable
            android_ripple={{color: '#ccc'}}
            style={MoreStyles.button}
            onPress={logOut}>
            <Text style={MoreStyles.greenTxt}>{'Logout'}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};
export default MorePage;
