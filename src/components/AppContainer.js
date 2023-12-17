import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { getConfig, _isDriverOnline, isDriver, showErrorMessage } from '../util';
import axios from 'axios';
import filter from 'lodash/filter';
import { useUpdateDriverLocationMutation } from '../slices/apiSlice';
import { useSelector } from 'react-redux';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
let watchId = undefined;

function AppContainer(WrappedComponent) {
  return props => {
    const profile = useSelector(state => state.auth?.userInfo);
    const [updateDriverLocation] = useUpdateDriverLocationMutation();
    const { location, getCurrentLocation } = useGetCurrentLocation(true)
    const driver = isDriver();

    useEffect(() => {
      if (driver && location.latitude && _isDriverOnline()) {
        let payload = { ...location };
        payload.driver_id = profile.id;
        payload.status = '';
        updateDriverLocation(payload)
          .unwrap()
          .then(res => console.log(res))
          .then(err => console.log(err));
      } else if (location?.latitude) {
        getCurrentLocation()
      }
    }, [location.latitude]);


    return <WrappedComponent currentLocation={location} {...props} />;
  };
}

export default AppContainer;
