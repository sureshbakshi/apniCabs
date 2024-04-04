import React, { useEffect } from 'react';
import { checkAndroidPermissions } from '../util/location';

function AppContainer(WrappedComponent) {
  return props => {
    useEffect(() => {
      checkAndroidPermissions();
    }, []);
    return <WrappedComponent  {...props} />;
  };
}

export default AppContainer;
