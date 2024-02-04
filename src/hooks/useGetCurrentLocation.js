import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { filter } from "lodash";
import Geolocation from 'react-native-geolocation-service';
import { getConfig, showErrorMessage } from "../util";
import axios from "axios";
let watchId = undefined;

export default (isWatchPosition = false) => {
    const [location, setLocation] = useState({
        latitude: '',
        longitude: '',
        city: '',
        address: '',
    })

    const defaultOptions = {
        enableHighAccuracy: true,
        maximumAge: 3,
        timeout: 30 * 1000,
        forceRequestLocation: true,
        interval: 3,
        fastestInterval: 3,
        useSignificantChanges: true,
        distanceFilter: 5,
        showLocationDialog: true,
        forceRequestLocation: true
    }

    const requestIosLocationPermissions = async () => {
        await Geolocation.setRNConfiguration({
            authorizationLevel: 'always' //always,whenInUse
        })
        await Geolocation.requestAuthorization('always')
    }

    const checkAndroidPermissions = async () => {
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
                        'Apnicabi needs to use your location to show routes and get taxis',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                checkAndroidPermissions();
                return false
            }
        } catch (err) {
            console.warn(err);
            checkAndroidPermissions();
            return false
        }
    };

    const getLocation = async coords => {
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
                    setLocation(location);
                }
            } else {
                // return new Error('Distance calculation error');
                showErrorMessage('Error while fetching location address')
            }
        } catch (error) {
            showErrorMessage('Error while fetching location')
        }
    };

    const getCurrentLocation = () => {
        if (checkAndroidPermissions()) {
            Geolocation.getCurrentPosition(
                (position) => {
                    if (position?.coords) {
                        getLocation(position?.coords);
                    }
                },
                (error) => {
                    // See error code charts below.
                    console.log(error?.code, error?.message);
                    showErrorMessage('Please enable location service');
                },
                defaultOptions
            );
        }
    }

    useEffect(() => {
        //Get current location and set initial region to this
        if (isWatchPosition) {
            const watchPosition = async () => {
                let granted = false;
                if (Platform.OS === 'ios') {
                    await Geolocation.setRNConfiguration({
                        authorizationLevel: 'always' //always,whenInUse
                    })
                    await Geolocation.requestAuthorization('always')
                    granted = true;
                } else {
                    granted = await checkAndroidPermissions();
                }
                if (granted) {
                    if (!watchId) {
                        watchId = Geolocation.watchPosition(
                            position => {
                                console.log('watchPosition', position)
                                getLocation(position.coords);
                            },
                            error => console.log(error),
                            defaultOptions,
                        );
                    }
                } else {
                    showErrorMessage('Please enable location service');
                }
            };
            watchPosition();
        }
        return () => {
            if (watchId)
                console.log('watchId')
            Geolocation?.clearWatch(watchId)
        };
    }, [isWatchPosition]);

    useEffect(() => {
        getCurrentLocation()
    }, [])
    return { getCurrentLocation, checkAndroidPermissions, location }
}