import * as React from 'react';
import { View, TextInput, Pressable, ImageBackground } from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import GooglePlaces from '../components/GooglePlaces';
import Timeline from '../components/common/timeline/Timeline';
import { useAppContext } from '../context/App.context';
import { isEmpty } from 'lodash';
import Ripple from 'react-native-material-ripple';
import { COLORS } from '../constants';

const SearchRidePage = () => {

  const {location, distance, updateLocation, getDistance, setNoOfSeats, noOfSeats} = useAppContext()
  const searchHandler = () =>{
      const distance = getDistance()
      if(distance) 
        navigate('FindCaptain')
  }
  const isSearchDisabled = () => {
    return isEmpty(location.from) || isEmpty(location.to) || isEmpty(noOfSeats)
  }



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
            <View style={{position: 'absolute', zIndex: 3, top: 10, left: 2}}>
            <Timeline data={['','']} height={25}/>
            </View>
            <GooglePlaces placeholder={'Pickup Location'} containerStyles={{zIndex: 2}} locationKey='from' onSelection={updateLocation}/>
            <GooglePlaces placeholder={'Drop Location'} containerStyles={{zIndex: 1}} locationKey='to' onSelection={updateLocation}/>
            <TextInput
              placeholder="No of seats: 1 - 6"
              style={SearchRideStyles.textInputDrop}
              maxLength={1}
              keyboardType='numeric'
              onChangeText={val => setNoOfSeats(val)}
            />
          <View>
            <Ripple
              style={ isSearchDisabled() ? [SearchRideStyles.button, {backgroundColor: COLORS.gray}]: [SearchRideStyles.button]}
              disabled={isSearchDisabled()}
              onPress={searchHandler}>
              <Text style={SearchRideStyles.text}>{'Search Rides'}</Text>
            </Ripple>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
export default SearchRidePage;
