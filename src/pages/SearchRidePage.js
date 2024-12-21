import React, { useCallback, useEffect } from 'react';
import { View, Pressable, ImageBackground, Alert, Share } from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import GooglePlaces from '../components/GooglePlaces';
import Timeline from '../components/common/timeline/Timeline';
import { useAppContext } from '../context/App.context';
import { isEmpty } from 'lodash';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import SocketStatus from '../components/common/SocketStatus';
import images from '../util/images';
import { useGetRideRequestMutation } from '../slices/apiSlice';
import { filter } from 'lodash';
import { requestInfo, setRideRequest } from '../slices/userSlice';
import CustomButton from '../components/common/CustomButton';
import SearchLoader from '../components/common/SearchLoader';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

const SearchRidePage = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { isSocketConnected } = useSelector((state) => state.auth);
  const list = useSelector(state => state.user?.rideRequests?.vehicles);
  const { location, updateLocation, getDistance, resetState } = useAppContext();
  const [getRideRequest, { data: rideList, error, isLoading }] = useGetRideRequestMutation();
  let focusKey = 'from'
  useEffect(() => {
    if (error) {
      console.log({ error });
    } else if (rideList) {
      dispatch(setRideRequest(rideList));
    }
  }, [error, rideList]);

  useEffect(() => {
    resetState()
  }, [])

  const searchHandler = async () => {
    const { distance, duration } = await getDistance();
    const { from, to } = location;
    if (from && to && distance && duration) {
      let fromCity = filter(from.address_components, {
        types: ['locality'],
      });
      let toCity = filter(to.address_components, {
        types: ['locality'],
      });
      let payload = {
        from: {
          location: from.formatted_address,
          City: fromCity[0]?.long_name,
          Lat: from.geometry.location.lat + '',
          Long: from.geometry.location.lng + '',
        },
        to: {
          location: to.formatted_address,
          City: toCity[0]?.long_name,
          Lat: to.geometry.location.lat + '',
          Long: to.geometry.location.lng + '',
        },
        Distance: Number((distance.value / 1000).toFixed(1)),
        Duration: duration.text,
      };
      dispatch(requestInfo(payload))
      getRideRequest(payload);
    }
  }
  const isSearchDisabled = () => {
    return isEmpty(location.from) || isEmpty(location.to)
  }

  const navigateToSelectOnMapPage = () => {
    console.log('focusKey', focusKey)
    navigate(ROUTES_NAMES.selectonMap, { focusKey })
  }


  const inputFocusHandler = (key) => {
    focusKey = key
  }


  return (
    // <ImageBackground
    //   source={images.backgroundImage}
    //   resizeMode="cover"
    //   style={SearchRideStyles.image}>
    <SafeAreaView style={SearchRideStyles.container}>
      <ContainerWrapper>
        {isSocketConnected ? <View style={SearchRideStyles.section}>
          <View style={{ position: 'absolute', zIndex: 3, top: 10, left: 2 }}>
            <Timeline data={['', '']} height={25} />
          </View>
          <GooglePlaces
            placeholder={'Pickup Location'}
            containerStyles={{ zIndex: 2, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            textContainerStyles={{ borderBottomWidth: 0.5 }}
            locationKey='from'
            onSelection={updateLocation}
            currentLocation={true}
            onInputFocus={inputFocusHandler}
            mapParams={route?.params}
          />
          <GooglePlaces onInputFocus={inputFocusHandler} placeholder={'Drop Location'} containerStyles={{ zIndex: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} locationKey='to' onSelection={updateLocation} mapParams={route?.params} />
          <View style={{ marginVertical: 10, width: 140 }}>
            <CustomButton
              label={'Select on Map'}
              isLowerCase
              styles={{ backgroundColor: COLORS.white, borderWidth: 1 }}
              textStyles={{ fontSize: 15, textAlign: 'center', color: COLORS.black }}
              onClick={navigateToSelectOnMapPage}
            />
          </View>

          <View style={{ marginTop: 5 }}>
            {/* <Pressable
              style={isSearchDisabled() ? [SearchRideStyles.button, { backgroundColor: COLORS.gray }] : [SearchRideStyles.button]}
              android_ripple={{ color: '#fff' }}
              disabled={isSearchDisabled()}
              onPress={searchHandler}
              >
              <Text style={SearchRideStyles.text}>{'Find Captain'}</Text>
            </Pressable> */}

            <CustomButton
              styles={isSearchDisabled() ? { backgroundColor: COLORS.gray } : {}}
              disabled={isSearchDisabled()}
              label={'Find Captain'}
              isLowerCase
              onClick={searchHandler}
            />
          </View>
          <SearchLoader msg=' ' />
        </View> : <SocketStatus multipleMsg={false} textStyles={{ color: COLORS.white }} />}
      </ContainerWrapper>
    </SafeAreaView>

    // </ImageBackground>
  );
};
export default SearchRidePage;
