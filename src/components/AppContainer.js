import React, { useEffect } from 'react';
import { checkAndroidPermissions } from '../util/location';

function AppContainer(WrappedComponent) {
  return props => {
    const fetchLocation = async () => {
      await checkAndroidPermissions()
    }
    useEffect(() => {
      fetchLocation();
    }, []);
    
    return <WrappedComponent  {...props} />;
  };
}

export default AppContainer;
