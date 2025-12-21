import React, { useEffect } from 'react';
import { checkAndroidPermissions } from '../util/location';
import { StatusBar } from 'react-native';
import { COLORS } from '../constants';

function AppContainer(WrappedComponent) {
  return props => {
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
