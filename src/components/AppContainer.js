import React, { useEffect } from 'react';
import { _isDriverOnline, isDriver } from '../util';
import { useUpdateDriverLocationMutation } from '../slices/apiSlice';
import { useSelector } from 'react-redux';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';

function AppContainer(WrappedComponent) {
  return props => {
    const profile = useSelector(state => state.auth?.userInfo);
    const [updateDriverLocation] = useUpdateDriverLocationMutation();
    const isDriverLogged = isDriver()
    const { location, getCurrentLocation } = useGetCurrentLocation(isDriverLogged)

    useEffect(() => {
      if (isDriverLogged && location.latitude && _isDriverOnline()) {
        let payload = { ...location };
        payload.driver_id = profile.id;
        payload.status = '';
        updateDriverLocation(payload);
      } else if (location?.latitude) {
        getCurrentLocation()
      }
    }, [location.latitude]);


    return <WrappedComponent currentLocation={location} {...props} />;
  };
}

export default AppContainer;
