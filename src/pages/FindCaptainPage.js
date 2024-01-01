import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { CustomTabs } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';

import { filter, isEmpty } from 'lodash';
import { useAppContext } from '../context/App.context';
import { useGetRideRequestMutation } from '../slices/apiSlice';
import { setRideRequest } from '../slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import SearchLoader from '../components/common/SearchLoader';
import CaptainsCard from '../components/common/Tabs/CaptainsCard';
import { COLORS, VEHICLE_TYPES } from '../constants';
import { Text } from 'react-native-paper';
import { Icon } from '../components/common';

const FindCaptainPage = () => {
  const dispatch = useDispatch();
  const list = useSelector(state => state.user?.rideRequests?.vehicles);

  const {
    route,
    location: { from, to },
    getDistance,
  } = useAppContext();
  const [getRideRequest, { data: rideList, error, isLoading }] =
    useGetRideRequestMutation();

  useEffect(() => {
    (async () => {
      const { distance, duration } = await getDistance();
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
      getRideRequest(payload);
    })();
  }, [from, to]);

  useEffect(() => {
    if (error) {
      console.log({ error });
    } else if (rideList) {
      dispatch(setRideRequest(rideList));
    }
  }, [rideList]);

  const extraProps = {
    ...route,
    from: from?.formatted_address || '',
    to: to?.formatted_address || '',
  };
  if (isLoading || error || isEmpty(rideList)) {
    return <SearchLoader msg='Finding best captains. Please wait...' />;
  }
  if (isEmpty(list)) {
    return <SearchLoader msg='No Captains found. Please try after sometime.' isLoader={false} />
  }
  return (
    <View style={FindRideStyles.container}>
      {
        list?.length > 1 ? <CustomTabs extraProps={extraProps} /> :
          <>
            <View style={{ backgroundColor: COLORS.white, marginBottom: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderColor: COLORS.primary, borderBottomWidth: 2, maxWidth: 120 }}>
                <Icon name={VEHICLE_TYPES[list[0].name]} size="extraLarge" color={COLORS.primary} />
                <Text style={{ marginLeft: 8 }} >{list[0].name}</Text>
              </View>
            </View>
            <ScrollView>
              <CaptainsCard
                list={list[0]?.drivers}
                keyProp={0}
                extraProps={extraProps}
              />
            </ScrollView>
          </>
      }

    </View>
  );
};
export default FindCaptainPage;
