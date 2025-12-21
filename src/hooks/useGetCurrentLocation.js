import { useEffect, useState } from "react";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, defaultOptions, getLocation } from "../util/location";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import { useDispatch } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";
import { setUserLocation } from "../slices/userSlice";

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
    forceRequestLocation: true
}

export default () => {
    const [currentLocation, setLocation] = useState({
        latitude: '',
        longitude: '',
        city: '',
        address: '',
    })
    const debouncedUpdateDriverLocationToServer = useUpdateDriverLocation()
    const dispatch = useDispatch()

    const getCoordinates = async (cb) => {
        try {
            const granted = await checkAndroidPermissions();
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
                    defaultCurrentLocationOptions
                );
            });
        } catch (error) {
            console.error('getCoordinates error:', error);
            return null;
        }
    };


    const dispatchUserLocation = (coords) => {
        const { latitude, longitude } = coords;
        if (latitude && longitude) {
            dispatch(setUserLocation({ latitude, longitude }));
        }
    }

    const dispatchDriverLocation = (coords) => {
        const { latitude, longitude } = coords;
        if (latitude && longitude) {
            dispatch(setDriverLocation({ latitude, longitude }));
        }
    }

    const getUserCoordinates = async () => {
        const coords = await getCoordinates();
        dispatchUserLocation(coords);
        return coords;
    };

    const getDriverCoordinates = async () => {
        const coords = await getCoordinates();
        dispatchDriverLocation(coords);
        return coords;
    }
        

    const getAddress = async (coords) => {
        try {
            return await getLocation(coords, setLocation);
        } catch (error) {
            console.error('getAddress error:', error);
            return null;
        }
    };

    const updateDriverLocation = (details) => {
        if (!details) return;
        debouncedUpdateDriverLocationToServer(details);
        dispatchDriverLocation(details);
    };

    const getCurrentLocationDetails = async (cb) => {
        const coords = await getCoordinates();
        if (coords) {
            const details = await getAddress(coords);
            if (details) {
                cb?.(details);
                return details;
            }
        }
        return null;
    }

    const updateCurrentDriverLocationDetails = async () => {
        await getCoordinates(updateDriverLocation)
    };
    
    return { getCoordinates, getAddress, updateDriverLocation, getCurrentLocationDetails, updateCurrentDriverLocationDetails, currentLocation, getUserCoordinates, getDriverCoordinates }
}   