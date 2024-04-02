import React from 'react';
import { View, Pressable, ScrollView, Linking } from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import { navigate } from '../util/navigationService';
import { Icon, Text } from '../components/common';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useSelector } from 'react-redux';
import ProfileImage from '../components/common/ProfileImage';
import { openOwnerPortal } from '../util/config';
import { isDriver } from '../util';
import useLogout from '../hooks/useLogout';
import SupportLinks from '../components/SupportLinks';


const MorePage = () => {
  const { logOut } = useLogout();
  const { userInfo: profile, driverInfo } = useSelector(state => state.auth);
  useGetDriverDetails(profile?.id, { skip: !driverInfo?.id || !profile?.id, refetchOnMountOrArgChange: true })

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
            {!isDriver() ? <>
              <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => {
                  logOut()
                  openOwnerPortal()
                }}>
                <View style={MoreStyles.listIcon}>
                  <Icon name="account-hard-hat" size="large" color={COLORS.brand_blue} />
                </View>
                <Text style={MoreStyles.name}>Become Driver</Text>
              </Pressable>
              {/* <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => navigate('Contacts')}
              >
                <View style={MoreStyles.listIcon}>
                  <Icon name="account-hard-hat" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>Emergency contacts</Text>
              </Pressable> */}
              <SupportLinks />

            </>
              : null}
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
                onPress={() => navigate(ROUTES_NAMES.refer)}>
                <View style={MoreStyles.listIcon}>
                  <Icon name="cash" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>Refer Now</Text>
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
              <SupportLinks />

            </> : null}


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
