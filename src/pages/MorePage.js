import React, { useContext } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import { navigate } from '../util/navigationService';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Icon, ImageView, Text } from '../components/common';
import { COLORS } from '../constants';
import { clearAuthData } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../context/Auth.context';
import ProfileImage from '../components/common/ProfileImage';
import { openOwnerPortal } from '../util/config';
import { isDriver } from '../util';
const MorePage = () => {
  const { signOut } = useAuthContext();
  const dispatch = useDispatch();
  const {userInfo: profile, driverInfo} = useSelector(state => state.auth);
  useGetDriverDetails(profile?.id, { skip: !driverInfo?.id || !profile?.id, refetchOnMountOrArgChange: true })
  

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
                <ProfileImage />
              </View>
              <View style={MoreStyles.middle}>
                <Text style={MoreStyles.name}>{profile?.name}</Text>
                {/* <Text style={MoreStyles.review}>11 Reviews</Text> */}
              </View>
            </View>
          </View>
          <View style={MoreStyles.listSection}>
            <Pressable
              style={MoreStyles.list}
              android_ripple={{ color: '#ccc' }}
              onPress={() => navigate('MyProfile')}>
              <View style={MoreStyles.listIcon}>
                <Icon name="account" size="large" color={COLORS.primary} />
              </View>
              <Text style={MoreStyles.name}>My Profile</Text>
            </Pressable>
            {isDriver() ? <><Pressable
              style={MoreStyles.list}
              android_ripple={{ color: '#ccc' }}
              onPress={() => navigate('FareSettings')}>
              <View style={MoreStyles.listIcon}>
                <Icon name="pencil" size="large" color={COLORS.primary} />
              </View>
              <Text style={MoreStyles.name}>Edit Fare</Text>
            </Pressable>
              <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={openOwnerPortal}>
                <View style={MoreStyles.listIcon}>
                  <Icon name="web" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>More settings</Text>
              </Pressable>
            </>: null}


          </View>
          <Pressable
            android_ripple={{ color: '#ccc' }}
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
