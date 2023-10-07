import * as React from 'react';
import { View, Pressable, ScrollView} from 'react-native';
import MyProfileStyles from '../styles/MyProfilePageStyles';
import styles from '../styles/MyRidePageStyles';
import { navigate } from '../util/navigationService';
import { ImageView, Text } from '../components/common';
import images from '../util/images';
const MyProfilePage = () => {
  return (
    <View style={MyProfileStyles.container}>
      <View style={MyProfileStyles.section}>
        <ScrollView>
          <View style={MyProfileStyles.card}>
            <View style={MyProfileStyles.cardtop}>
              <View style={MyProfileStyles.left}>
              <ImageView source={images[`captain4`]} style={[styles.avatar]}/>
              </View>
              <View style={MyProfileStyles.middle}>
                <Text style={MyProfileStyles.name}>Rajesh babu</Text>
                <Text style={MyProfileStyles.review}>11 Reviews</Text>
              </View>
            </View>
          </View>
          <View style={MyProfileStyles.listSection}>
            <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.greenTxt}>Personal Info</Text>
            </View>
            <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.review}>Email address</Text>
              <Text style={MyProfileStyles.name}>
                rajesh.shingapuram@gmail.com
              </Text>
            </View>
            <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.review}>Phone Number</Text>
              <Text style={MyProfileStyles.name}>+91 8096056401</Text>
            </View>
            <View style={MyProfileStyles.list}>
              <Text style={MyProfileStyles.review}>Profession</Text>
              <Text style={MyProfileStyles.name}>Senior Software Engineer</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <Pressable
        android_ripple={{color: '#ccc'}}
        style={MyProfileStyles.button}
        onPress={() => navigate('SearchRide')}>
        <Text style={MyProfileStyles.buttonTxt}>{'Update Info'}</Text>
      </Pressable>
    </View>
  );
};
export default MyProfilePage;
