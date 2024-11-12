import * as React from 'react';
import { View, ScrollView } from 'react-native';
import MyProfileStyles from '../styles/MyProfilePageStyles';
import { Text } from '../components/common';
import { useSelector } from 'react-redux';
import ProfileImage from '../components/common/ProfileImage';

const MyProfilePage = () => {
  const profile = useSelector(state => state.auth?.userInfo);
  if (!profile) return null;


  return (
    <View style={MyProfileStyles.container}>
      <View style={MyProfileStyles.section}>
        <ScrollView>
          <View style={MyProfileStyles.card}>
            <View style={MyProfileStyles.cardtop}>
              <View style={MyProfileStyles.left}>
                <ProfileImage />
              </View>
              <View style={MyProfileStyles.middle}>
                <Text style={MyProfileStyles.name}>{profile.name}</Text>
                {/* <Text style={MyProfileStyles.review}>11 Reviews</Text> */}
              </View>
            </View>
          </View>
          <View style={MyProfileStyles.listSection}>
            <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.greenTxt}>Personal Info</Text>
            </View>
            {profile?.email && <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.review}>Email address</Text>
              <Text style={MyProfileStyles.name}>{profile.email}</Text>
            </View>}
            <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.review}>Phone Number</Text>
              <Text style={MyProfileStyles.name}>{profile.phone}</Text>
            </View>
            {profile?.referral_phone_number ? <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.review}>Referral Number</Text>
              <Text style={MyProfileStyles.name}>{profile.referral_phone_number}</Text>
            </View>: null}
          </View>
        </ScrollView>
      </View>
      {/* <Pressable
        android_ripple={{ color: '#ccc' }}
        style={MyProfileStyles.button}
        onPress={() => navigate('SearchRide')}>
        <Text style={MyProfileStyles.buttonTxt}>{'Update Info'}</Text>
      </Pressable> */}
    </View>
  );
};
export default MyProfilePage;
