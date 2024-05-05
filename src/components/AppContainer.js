import React, { useEffect } from 'react';
import { checkAndroidPermissions } from '../util/location';
import { useGetVehicleTypesQuery } from '../slices/apiSlice';
import { useDispatch } from 'react-redux';
import { setVehicleTypes } from '../slices/authSlice';

function AppContainer(WrappedComponent) {
  return props => {
    const { data: vehicleTypes } = useGetVehicleTypesQuery()
    const dispatch = useDispatch()
    
    useEffect(() => {
      if (vehicleTypes) {
        dispatch(setVehicleTypes(vehicleTypes))
      }
    }, [vehicleTypes])

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
