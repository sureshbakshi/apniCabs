
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { bugLogger, getConfig, showErrorMessage } from '.';
import axios from 'axios';
import {filter} from 'lodash'
import config from './config';

export  const defaultOptions = {
    enableHighAccuracy: true,
    maximumAge: 3 * 1000,
    timeout: 30 * 1000,
    forceRequestLocation: true,
    interval: 3 * 1000,
    useSignificantChanges: true,
    distanceFilter: 3,
    showLocationDialog: true,
    forceRequestLocation: true
}

export const requestIosLocationPermissions = async () => {
    await Geolocation.setRNConfiguration({
        authorizationLevel: 'always' //always,whenInUse
    })
    await Geolocation.requestAuthorization('always')
}

export const checkAndroidPermissions = async () => {
    try {
        if (Platform.OS === 'ios') {
            requestIosLocationPermissions()
            return true
        }
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Apnicabi',
                message:
                    'Apnicabi needs to use your location to show routes and to find drivers.',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            await checkAndroidPermissions();
            return false
        }
    } catch (err) {
        console.warn(err);
        await checkAndroidPermissions();
        return false
    }
};


export const getLocation = async (coords, cb) => {
    try {
        const apiKey = getConfig().GOOGLE_PLACES_KEY;
        const { latitude, longitude } = coords;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        const {
            data: { status, results },
        } = await axios.get(url);
        if (status == 'OK') {
            const { address_components, formatted_address } = results[0] || {};
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
                return location
            }
        } else {
            // return new Error('Distance calculation error');
            bugLogger({status, results, gk: apiKey})
            showErrorMessage(`Error while location request ${status}`)
        }
    } catch (error) {
        showErrorMessage('Error while fetching location')
    }
};