import React from 'react';
import { View, Pressable, ScrollView, Linking, StatusBar } from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import { navigate } from '../util/navigationService';
import { Icon, Text } from '../components/common';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useSelector } from 'react-redux';
import ProfileImage from '../components/common/ProfileImage';
import { openOwnerPortal } from '../util/config';
import { getScreen, isDriver } from '../util';
import useLogout from '../hooks/useLogout';
import SupportLinks from '../components/SupportLinks';
import useGetDriverDetails from '../hooks/useGetDriverDetails';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { useTranslation } from 'react-i18next';


const MorePage = () => {
  const { logOut } = useLogout();
  const { userInfo: profile } = useSelector(state => state.auth);
  const {t} = useTranslation();
  useGetDriverDetails({ refetchOnMountOrArgChange: true })

  return (
    <>
     
      <SafeAreaView style={MoreStyles.container}>
        <ContainerWrapper style={{ height: getScreen().screenHeight - 150 }}>
          <View style={MoreStyles.section}>
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
            <ScrollView persistentScrollbar>
              <View style={MoreStyles.listSection}>
                <Pressable
                  style={MoreStyles.list}
                  android_ripple={{ color: '#ccc' }}
                  onPress={() => navigate('MyProfile')}>
                  <View style={MoreStyles.listIcon}>
                    <Icon name="account" size="large" color={COLORS.primary} />
                  </View>
                  <Text style={MoreStyles.name}>{t('my_profile')}</Text>
                </Pressable>
                {!isDriver() ? <>
                  {/* <Pressable
                    style={MoreStyles.list}
                    android_ripple={{ color: '#ccc' }}
                    onPress={() => {
                      logOut()
                      openOwnerPortal()
                    }}>
                    <View style={MoreStyles.listIcon}>
                      <Icon name="account-hard-hat" size="large" color={COLORS.brand_blue} />
                    </View>
                    <Text style={MoreStyles.name}>{t('become_driver')}</Text>
                  </Pressable> */}
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
                  <Text style={MoreStyles.name}>{t('edit_fare')}</Text>
                </Pressable>
                  <Pressable
                    style={MoreStyles.list}
                    android_ripple={{ color: '#ccc' }}
                    onPress={() => navigate(ROUTES_NAMES.refer)}>
                    <View style={MoreStyles.listIcon}>
                      <Icon name="cash" size="large" color={COLORS.primary} />
                    </View>
                    <Text style={MoreStyles.name}>{t('refer_now')}</Text>
                  </Pressable>
                  <Pressable
                    style={MoreStyles.list}
                    android_ripple={{ color: '#ccc' }}
                    onPress={openOwnerPortal}>
                    <View style={MoreStyles.listIcon}>
                      <Icon name="web" size="large" color={COLORS.primary} />
                    </View>
                    <Text style={MoreStyles.name}>{t('settings')}</Text>
                  </Pressable>
                  <SupportLinks />

                </> : null}
                <Pressable
                  style={MoreStyles.list}
                  android_ripple={{ color: '#ccc' }}
                  onPress={() => navigate(ROUTES_NAMES.language)}>
                  <View style={MoreStyles.listIcon}>
                    <Icon name="account" size="large" color={COLORS.primary} />
                  </View>
                  <Text style={MoreStyles.name}>{t('language')}</Text>
                </Pressable>
                

              </View>
              <Pressable
                android_ripple={{ color: '#ccc' }}
                style={MoreStyles.button}
                onPress={logOut}>
                <Text style={MoreStyles.greenTxt}>{t('logout')}</Text>
              </Pressable>
              <Text style={{textAlign: 'center', padding: 10}}>v{DeviceInfo.getReadableVersion()}</Text>
            </ScrollView>
          </View>
        </ContainerWrapper>
      </SafeAreaView>
    </>
  );
};
export default MorePage;
