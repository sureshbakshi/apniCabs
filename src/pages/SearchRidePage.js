import * as React from 'react';
import {View, TextInput, Pressable, ImageBackground} from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
const SearchRidePage = () => {
  return (
    <ImageBackground
      source={require('../assets/images/bg.jpeg')}
      resizeMode="cover"
      style={SearchRideStyles.image}>
      <View style={SearchRideStyles.container}>
        <View style={SearchRideStyles.section}>
          <View>
            <TextInput
              placeholder="Pickup Location"
              style={SearchRideStyles.textInputPickup}
            />
            <TextInput
              placeholder="Drop Location"
              style={SearchRideStyles.textInputDrop}
            />
            <TextInput
              placeholder="No of seats: 1 - 6"
              style={SearchRideStyles.textInputDrop}
              maxLength={1}
              keyboardType='numeric'
            />
          </View>
          <View>
            <Pressable
              style={SearchRideStyles.button}
              android_ripple={{color: '#fff'}}
              onPress={() => navigate('FindCaptain')}>
              <Text style={SearchRideStyles.text}>{'Search Rides'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
export default SearchRidePage;
