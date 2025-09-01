import React, { useEffect } from 'react';
import { checkAndroidPermissions } from '../util/location';
import { StatusBar } from 'react-native';
import { COLORS } from '../constants';
import { useVehicleTypes } from '../hooks/useVehicleTypes';

function AppContainer(WrappedComponent) {
  return props => {
    useVehicleTypes();

    const fetchLocation = async () => {
      await checkAndroidPermissions()
    }
    useEffect(() => {
      fetchLocation();
    }, []);
    return <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <WrappedComponent  {...props} />
    </>;
  };
}

export default AppContainer;
