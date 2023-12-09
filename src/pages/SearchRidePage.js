import React, { useEffect } from 'react';
import { View, TextInput, Pressable, ImageBackground } from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import GooglePlaces from '../components/GooglePlaces';
import Timeline from '../components/common/timeline/Timeline';
import { useAppContext } from '../context/App.context';
import { isEmpty } from 'lodash';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useUserActiveRideQuery } from '../slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequest } from '../slices/userSlice';
import styles from '../components/common/imageView/ImageView.styles';
import useGetActiveRequests from '../hooks/useGetActiveRequests';

const SearchRidePage = () => {
  const { isSocketConnected } = useSelector((state) => state.user)
  useGetActiveRequests()
  const { location, updateLocation, getDistance, setNoOfSeats, noOfSeats } = useAppContext()
  const searchHandler = async () => {
    const { distance, duration } = await getDistance()
    if (distance && duration) {
      navigate(ROUTES_NAMES.findCaptain)
    }
  }
  const isSearchDisabled = () => {
    return isEmpty(location.from) || isEmpty(location.to)
  }

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpeg')}
      resizeMode="cover"
      style={SearchRideStyles.image}>
      <View style={SearchRideStyles.container}>
        <View style={SearchRideStyles.section}>
        <Text style={{ backgroundColor: COLORS.brand_blue, padding: 5 }}>Socket ID: {isSocketConnected}</Text>
          <View style={{ position: 'absolute', zIndex: 3, top: 10, left: 2 }}>
            <Timeline data={['', '']} height={25} />
          </View>
          <GooglePlaces placeholder={'Pickup Location'} containerStyles={{ zIndex: 2 }} locationKey='from' onSelection={updateLocation} />
          <GooglePlaces placeholder={'Drop Location'} containerStyles={{ zIndex: 1 }} locationKey='to' onSelection={updateLocation} />
          {/* <TextInput
            placeholder="No of seats: 1 - 6"
            style={SearchRideStyles.textInputDrop}
            maxLength={1}
            keyboardType='numeric'
            onChangeText={val => setNoOfSeats(val)}
          /> */}
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
