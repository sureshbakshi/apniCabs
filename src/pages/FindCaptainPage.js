import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {CustomTabs} from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';

import _ from 'lodash';
import {useAppContext} from '../context/App.context';
import {useGetDriverMutation} from '../slices/apiSlice';
import {setDrivers} from '../slices/userSlice';
import {useDispatch} from 'react-redux';

const FindCaptainPage = () => {
  const dispatch = useDispatch();
  const {
    route,
    location: {from, to},
    getDistance,
  } = useAppContext();
  const [GetDriver, {data: driversList, error, isLoading}] =
    useGetDriverMutation();

  useEffect(() => {
    (async () => {
      const {distance, duration} = await getDistance();
      let fromCity = _.filter(from.address_components, {
        types: ['locality'],
      });
      let toCity = _.filter(to.address_components, {
        types: ['locality'],
      });

      let payload = {
        from: {
          location: from.formatted_address,
          City: fromCity[0].long_name,
          Lat: from.geometry.location.lat+'',
          Long: from.geometry.location.lng+'',
        },
        to: {
          location: to.formatted_address,
          City: toCity[0].long_name,
          Lat: to.geometry.location.lat+'',
          Long: to.geometry.location.lng+'',
        },
        Distance: Number((distance.value / 1000).toFixed(1)),
        Duration: duration.text,
      };
      GetDriver(payload);
    })();
  }, [from, to]);

  useEffect(() => {
    if(error){
      console.log({error})
    }
    else if (driversList) {
      dispatch(setDrivers(driversList.data));
    }
  }, [driversList]);

  const extraProps = {
    ...route,
    from: from?.formatted_address || '',
    to: to?.formatted_address || '',
  };
  if (isLoading || error) {
    return null;
  }

  return (
    <View style={FindRideStyles.container}>
      <CustomTabs extraProps={extraProps} />
    </View>
  );
};
export default FindCaptainPage;
