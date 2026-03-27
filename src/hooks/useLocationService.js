import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from '../util';
import { checkAndroidPermissions, requestIosLocationPermissions } from '../util/location';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { Linking } from 'react-native';

export const defaultCurrentLocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 30 * 1000,
    forceRequestLocation: true,
    interval: 5 * 1000,
    fastestInterval: 5 * 1000,
    useSignificantChanges: false,
    distanceFilter: 0,
    showLocationDialog: true,
};

const useLocationService = () => {
    const getCoordinates = useCallback(async (cb) => {
        try {
            let granted = false;

            if (Platform.OS === 'ios') {
                await requestIosLocationPermissions();
                granted = true;
            } else {
                granted = await checkAndroidPermissions();
            }

            if (!granted) {
                // showErrorMessage('Location permission denied');
                Alert.alert(
                    'Location Required',
                    'To track your rides efficiently, please allow "Allow all the time" location access in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ],
                );
                return false;
            }

            return new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        if (position?.coords) {
                            cb?.({...position.coords, timestamp: position.timestamp});
                            resolve(position.coords);
                        } else {
                            reject(new Error('No coordinates found'));
                        }
                    },
                    (error) => {
                        showErrorMessage('getCoordinates: Please enable GPS');
                        reject(error);
                    },
                    defaultCurrentLocationOptions,
                );
            });
        } catch (error) {
            console.error('getCoordinates error:', error);
            return null;
        }
    }, []);

    return { getCoordinates };
};

export default useLocationService;
