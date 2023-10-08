import * as React from 'react';
import { View, TextInput, Pressable, ImageBackground } from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import GooglePlaces from '../components/GooglePlaces';

const SearchRidePage = () => {
  return (
    <ImageBackground
      source={require('../assets/images/bg.jpeg')}
      resizeMode="cover"
      style={SearchRideStyles.image}>
      <View style={SearchRideStyles.container}>
        <View style={SearchRideStyles.section}>
            {/* <TextInput
              placeholder="Pickup Location"
              style={SearchRideStyles.textInputPickup}
            />
              
            <TextInput
              placeholder="Drop Location"
              style={SearchRideStyles.textInputDrop}
            /> */}
            <GooglePlaces placeholder={'Pickup Location'} containerStyles={{zIndex: 2}}/>
            <GooglePlaces placeholder={'Drop Location'} containerStyles={{zIndex: 1}}/>
            <TextInput
              placeholder="No of seats: 1 - 6"
              style={SearchRideStyles.textInputDrop}
              maxLength={1}
              keyboardType='numeric'
            />
          <View>
            <Pressable
              style={SearchRideStyles.button}
              android_ripple={{ color: '#fff' }}
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
