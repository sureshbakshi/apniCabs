import { useEffect, useState } from "react";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, defaultOptions, getLocation } from "../util/location";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import { useDispatch } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";

export default () => {
    const [currentLocation, setLocation] = useState({
        latitude: '',
        longitude: '',
        city: '',
        address: '',
    })
    const updateDriverLocationToServer = useUpdateDriverLocation()
    const dispatch = useDispatch()

    const getCurrentLocation = async (cb, isDriver = false) => {
        try {
            const granted = await checkAndroidPermissions();
            if (!granted) {
                showErrorMessage('Location permission denied');
                return null;
            }

            return new Promise(async (resolve, reject) => {
                await Geolocation.getCurrentPosition(
                    async (position) => {
                        if (position?.coords) {
                            const details = await getLocation(position.coords, setLocation);
                            cb?.(details);
                            if (isDriver) {
                                updateDriverLocationToServer(details);
                                const { latitude, longitude } = details;
                                if (latitude && longitude) {
                                    dispatch(setDriverLocation({ latitude, longitude }));
                                }
                            }
                            resolve(details);
                        } else {
                            reject(new Error('No coordinates found'));
                        }
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        showErrorMessage('Please enable GPS');
                        reject(error);
                    },
                    defaultOptions
                );
            });
        } catch (error) {
            console.error('getCurrentLocation error:', error);
            return null;
        }
    };

    useEffect(() => {
        // getCurrentLocation()
    }, [])
    return { getCurrentLocation, currentLocation }
}