import React, {  useEffect, useState } from 'react';
import { View } from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
import { navigate } from '../util/navigationService';
import GooglePlaces from '../components/GooglePlaces';
import Timeline from '../components/common/timeline/Timeline';
import { useAppContext } from '../context/App.context';
import { isEmpty } from 'lodash';
import { COLORS, ROUTES_NAMES } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import SocketStatus from '../components/common/SocketStatus';
import { useGetRideRequestMutation } from '../slices/apiSlice';
import { filter } from 'lodash';
import { requestInfo, setRideRequest, setRecentSearchHistory } from '../slices/userSlice';
import CustomButton from '../components/common/CustomButton';
import SearchLoader from '../components/common/SearchLoader';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import RecentSearchHistory from '../components/RecentSearchHistory';

const SearchRidePage = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { isSocketConnected } = useSelector((state) => state.auth);
  const list = useSelector(state => state.user?.rideRequests?.vehicles);
  const searchHistory = useSelector(state => state.user.recentSearchHistory);

  const { location, updateLocation, getDistance, resetState } = useAppContext();
  const [getRideRequest, { data: rideList, error, isLoading }] = useGetRideRequestMutation();
  const [focusKey, setFocuskey] = useState('from');
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
      dispatch(requestInfo(payload));
      getRideRequest(payload);
      const history = {
        from: {
          address_components:from.address_components,
          geometry: from.geometry,
          place_id: from.place_id,
          formatted_address: from.formatted_address,
          city: fromCity[0]?.long_name
        },
        to: {
          address_components:to.address_components,
          geometry: to.geometry,
          place_id: to.place_id,
          formatted_address: to.formatted_address,
          city: toCity[0]?.long_name
        }
      }
      dispatch(setRecentSearchHistory(history))
    }
  }
  const isSearchDisabled = () => {
    return isEmpty(location.from) || isEmpty(location.to)
  }

  const navigateToSelectOnMapPage = () => {
    navigate(ROUTES_NAMES.selectonMap, { focusKey, location })
  }
  const inputFocusHandler = (key) => {
    setFocuskey(key);
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
            locationDetails={location.from}
          />
          <GooglePlaces onInputFocus={inputFocusHandler} placeholder={'Drop Location'} containerStyles={{ zIndex: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} locationKey='to' onSelection={updateLocation} locationDetails={location.to} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
            <CustomButton
              iconLeft={{ name: 'map-marker-radius-outline', size: 'medium', color: COLORS.black }}
              label={'Select on map'}
              isLowerCase
              styles={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.bg_secondary, borderRadius: 20, width: 170, height: 40 }}
              textStyles={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold', color: COLORS.black, lineHeight: 17 }}
              onClick={navigateToSelectOnMapPage}
            />
            <CustomButton
              label={`For me`}
              styles={{ borderWidth: 1, borderRadius: 20, borderColor: COLORS.bg_secondary, backgroundColor: COLORS.white, height: 40 }}
              textStyles={{ color: COLORS.text_dark, fontWeight: 600, fontSize: 14, lineHeight: 18 }}
              isLowerCase
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
          {!isEmpty(searchHistory[focusKey]) ? <View>
            <RecentSearchHistory searchHistory={searchHistory} focusKey={focusKey} updateLocation={updateLocation} />
          </View> : <SearchLoader msg=' ' />}
        </View> : <SocketStatus multipleMsg={false} textStyles={{ color: COLORS.white }} />}
      </ContainerWrapper>
    </SafeAreaView>

    // </ImageBackground>
  );
};
export default SearchRidePage;
