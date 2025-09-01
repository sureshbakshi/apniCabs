import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetVehicleTypesQuery } from '../slices/apiSlice';
import { setVehicleTypes } from '../slices/authSlice';

export const useVehicleTypes = () => {
  const dispatch = useDispatch();
  const storedVehicleTypes = useSelector(state => state.auth.vehicleTypes);
  const { data: vehicleTypes, refetch } = useGetVehicleTypesQuery();

  useEffect(() => {
    if (vehicleTypes && vehicleTypes.length > 0) {
      dispatch(setVehicleTypes(vehicleTypes));
    }
  }, [vehicleTypes, dispatch]);

  useEffect(() => {
    if (!storedVehicleTypes || storedVehicleTypes.length === 0) {
      refetch();
    }
  }, [storedVehicleTypes, refetch]);
};