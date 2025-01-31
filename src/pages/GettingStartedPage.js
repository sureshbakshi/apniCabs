import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import GettingStartedStyles from '../styles/GettingStartedPageStyles';
import images from '../util/images';
import CustomButton from '../components/common/CustomButton';
import { COLORS, ROUTES_NAMES, USER_ROLES } from '../constants';
import { useTranslation } from 'react-i18next';
import { navigate } from '../util/navigationService';
import config from '../util/config';

export default () => {
  const { t } = useTranslation();
  return (
    <View style={[GettingStartedStyles.container]}>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={GettingStartedStyles.section}>
        <ImageBackground
          resizeMode='contain'
          source={images.gettingStarted1}
          style={GettingStartedStyles.image1}>
          <Image source={images.gettingStarted2}
            style={GettingStartedStyles.image2} />
        </ImageBackground>

      </View>
      <ScrollView>
        <View style={GettingStartedStyles.subContainer}>
          <View style={GettingStartedStyles.textContainer}>
            <Text style={GettingStartedStyles.heardertext}>{t('get_started_title')} {config.ROLE === USER_ROLES.DRIVER ? 'Driver': 'User'} </Text>
            <Text style={GettingStartedStyles.subtext}>{t('get_started_des')}</Text>
          </View>
          <CustomButton label={t('get_started_btn')} isLowerCase onClick={() => navigate(ROUTES_NAMES.signIn)} styles={{ backgroundColor: COLORS.primary, padding: 10 }} textStyles={{ fontWeight: '400' }} />
        </View>
      </ScrollView>
    </View>
  );
};
