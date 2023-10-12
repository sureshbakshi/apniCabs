import * as React from 'react';
import { View, TextInput, Pressable, ImageBackground } from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import GooglePlaces from '../components/GooglePlaces';
import Timeline from '../components/common/timeline/Timeline';
import { useAppContext } from '../context/App.context';
import { isEmpty } from 'lodash';
import { COLORS } from '../constants';

const SearchRidePage = () => {

  const { location, updateLocation, getDistance, setNoOfSeats, noOfSeats } = useAppContext()
  const searchHandler = async () => {
    const { distance, duration } = await getDistance()
    if (distance && duration) {
      navigate('FindCaptain')
    }
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
          <View style={{ position: 'absolute', zIndex: 3, top: 10, left: 2 }}>
            <Timeline data={['', '']} height={25} />
          </View>
          <GooglePlaces placeholder={'Pickup Location'} containerStyles={{ zIndex: 2 }} locationKey='from' onSelection={updateLocation} />
          <GooglePlaces placeholder={'Drop Location'} containerStyles={{ zIndex: 1 }} locationKey='to' onSelection={updateLocation} />
          <TextInput
            placeholder="No of seats: 1 - 6"
            style={SearchRideStyles.textInputDrop}
            maxLength={1}
            keyboardType='numeric'
            onChangeText={val => setNoOfSeats(val)}
          />
          <View>
            <Pressable
              style={isSearchDisabled() ? [SearchRideStyles.button, { backgroundColor: COLORS.gray }] : [SearchRideStyles.button]}
              android_ripple={{ color: '#fff' }}
              disabled={isSearchDisabled()}
              onPress={searchHandler}>
              <Text style={SearchRideStyles.text}>{'Find Captain'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
export default SearchRidePage;
