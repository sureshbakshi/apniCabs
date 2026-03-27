import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { bugLogger, getConfig, showErrorMessage } from '.';
import axios from 'axios';
import filter from 'lodash/filter';
import config from './config';
import { LOCATION_CONFIG } from '../constants';


export const requestIosLocationPermissions = async () => {
    await Geolocation.setRNConfiguration({
        authorizationLevel: 'always', // always,whenInUse
    });
    await Geolocation.requestAuthorization('always');
};

export const checkAndroidPermissions = async () => {
    try {
        if (Platform.OS === 'ios') {
            requestIosLocationPermissions();
            return true;
        }
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Pik bike',
                message:
                    'Pik bike needs to use your location to show routes and to find drivers.',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const showSettingsAlert = () => {
    Alert.alert(
        'Location Required',
        'To track your rides efficiently, please allow "Allow all the time" location access in settings.',
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
    );
};

// ✅ NEW: request background permission on Android (for foreground service)
let lastBackgroundRequestTime = 0;
export const requestAndroidBackgroundPermission = async () => {
    try {
        if (Platform.OS !== 'android') return true;

        // Prevent loop: if requested recently, don't ask again immediately
        const now = Date.now();
        if (now - lastBackgroundRequestTime < 2000) {
            return false;
        }
        lastBackgroundRequestTime = now;

        // 1. Request Notification Permission first (Android 13+)
        if (Platform.Version >= 33) {
            await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
        }

        // 2. Request Fine Location
        // const fine = await checkAndroidPermissions();
        // if (fine !== 'granted') {
        //     console.log('Background location request: fine location not granted');
        //     showSettingsAlert();
        //     return false;
        // }

        // 3. Request Background Location
        if (Platform.Version >= 29) {
            const bg = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
            if (bg === 'granted') {
                return true;
            } else {
                console.log('Background location request: background location not granted');
                showSettingsAlert();
                return false;
            }
        }

        return true;
    } catch (err) {
        return false;
    }
};

export const getLocation = async (coords, cb) => {
    try {
        const { latitude, longitude } = coords;
        const result = await getPlaceDetailsFromCoordinates(latitude, longitude);

        if (result) {
            const { address_components, formatted_address } = result;
            const address = filter(address_components, {
                types: ['locality'],
            });
            if (address.length) {
                const city = address[0]?.long_name;
                const location = {
                    latitude: latitude,
                    longitude: longitude,
                    address: formatted_address,
                    city,
                };
                cb?.(location);
                return location;
            }
        } else {
            showErrorMessage('Error while location request');
        }
    } catch (error) {
        showErrorMessage('Error while fetching location');
    }
};

export const getPlaceDetailsFromCoordinates = async (latitude, longitude) => {
    try {
        const apiKey = config.GOOGLE_PLACES_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        const { data } = await axios.get(url);
        if (data.status === 'OK' && data.results && data.results.length > 0) {
            return data.results[0];
        }
        return null;
    } catch (error) {
        console.log('Error fetching place details:', error);
        return null;
    }
};

// ✅ NEW: simple helper for foreground service to fetch coords once
export const getCurrentCoordsOnce = () => {
    return new Promise((resolve) => {
        Geolocation.getCurrentPosition(
            (position) => {
                if (position?.coords && position?.timestamp) {
                    const { latitude, longitude , heading} = position.coords;
                    // console.log('getCurrentCoordsOnce got coords:', latitude, longitude, position.timestamp);
                    resolve({ latitude, longitude, heading, timestamp: position.timestamp });
                } else {
                    resolve(null);
                }
            },
            (error) => {
                console.log('getCurrentCoordsOnce error:', error);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: LOCATION_CONFIG.WATCHER_TIMEOUT,
                maximumAge: 0,
                distanceFilter: 0,
            },
        );
    });
};
