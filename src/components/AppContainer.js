import React, { useEffect } from 'react';
import { _isDriverOnline, isDriver } from '../util';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import useUpdateDriverLocation from '../hooks/useUpdateDriverLocation';

function AppContainer(WrappedComponent) {
  return props => {
    const isDriverLogged = isDriver()
    const { location, getCurrentLocation } = useGetCurrentLocation(isDriverLogged)
    const updateDriverLocationToServer = useUpdateDriverLocation()
    useEffect(() => {
      if (location.latitude) {
        getCurrentLocation()
        updateDriverLocationToServer(location)
      }
    }, [location.latitude, location.address]);


    return <WrappedComponent currentLocation={location} {...props} />;
  };
}

export default AppContainer;
