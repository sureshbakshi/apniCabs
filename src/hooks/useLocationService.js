import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from '../util';
import { checkAndroidPermissions, requestIosLocationPermissions } from '../util/location';

export const defaultCurrentLocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 10 * 1000,
    timeout: 30 * 1000,
    forceRequestLocation: true,
    interval: 5 * 1000,
    fastestInterval: 5 * 1000,
    useSignificantChanges: false,
    distanceFilter: 0,
    showLocationDialog: true,
};

const useLocationService = () => {
    const getCoordinates = async (cb) => {
        try {
            let granted = false;

            if (Platform.OS === 'ios') {
                await requestIosLocationPermissions();
                granted = true;
            } else {
                granted = await checkAndroidPermissions();
            }

            if (!granted) {
                showErrorMessage('Location permission denied');
                return null;
            }

            return new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        if (position?.coords) {
                            cb?.(position.coords);
                            resolve(position.coords);
                        } else {
                            reject(new Error('No coordinates found'));
                        }
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        showErrorMessage('Please enable GPS');
                        reject(error);
                    },
                    defaultCurrentLocationOptions,
                );
            });
        } catch (error) {
            console.error('getCoordinates error:', error);
            return null;
        }
    };

    return { getCoordinates };
};

export default useLocationService;
