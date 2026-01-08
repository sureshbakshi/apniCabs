// useCityLookup.ts
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useCityLookupMutation } from '../slices/apiSlice';
import { DriverAvailableStatus, ROUTES_NAMES } from '../constants';
import { useUpdateDriverStatus } from './useGetDriverDetails';
import useGetCurrentLocation from './useGetCurrentLocation';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { setServiceUnavailable } from '../slices/driverSlice';

const useCityLookup = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { driverInfo } = useSelector(state => state.auth);
    const vehicleTypeId = driverInfo?.Vehicle?.type;
    const navigation = useNavigation();
    const [updateCityLookup] = useCityLookupMutation();
    const updateDriverStatus = useUpdateDriverStatus();
    const { getDriverCoordinates } = useGetCurrentLocation();


    const onRefresh = useCallback(
        async () => {
            const { latitude, longitude } = await getDriverCoordinates() || {};
            if (!latitude || !longitude || !vehicleTypeId) {
                return;
            }
            try {
                setIsLoading(true);
                const payload = {
                    latitude,
                    longitude,
                    vehicleType: vehicleTypeId,
                };

                const response = await updateCityLookup(payload).unwrap();

                if (!isEmpty(response?.data)) {
                    setIsLoading(false);
                    updateDriverStatus(Boolean(DriverAvailableStatus.ONLINE));
                    navigation.navigate(ROUTES_NAMES.searchRide);
                    dispatch(setServiceUnavailable(false))
                }
            } catch (error) {
                setIsLoading(false);
                if (error.status === 404) {
                    dispatch(setServiceUnavailable(true))
                } else {
                    console.log('Error updating location:', error);
                }
            }
        },
        [navigation, updateCityLookup, updateDriverStatus]
    );

    return { onRefresh, updateDriverStatus, isLoading };
};

export default useCityLookup;
