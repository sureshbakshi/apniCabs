import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
import { checkAndroidPermissions } from "../util/location";
import { useDispatch, useSelector } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import { DriverAvailableStatus } from "../constants";
let watchId = undefined;

export const defaultOptions = {
    enableHighAccuracy: true,
    maximumAge: 20 * 1000,
    timeout: 60 * 1000,
    distanceFilter: 0,
    // Android-specific options
    showLocationDialog: true,
    forceRequestLocation: true,
    interval: 30 * 1000,
    fastestInterval: 25 * 1000, 
    // iOS-specific options
    useSignificantChanges: false,
    showsBackgroundLocationIndicator: false, 
};

export default () => {
    const dispatch = useDispatch();
    const driverStatus = useSelector((state) => state.driver.onlineStatus);
    const debouncedUpdateDriverLocationToServer = useUpdateDriverLocation()

    const watchPosition = async () => {
        console.log('Starting location watch with id:', watchId);
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
            if (watchId === undefined) {
                watchId = Geolocation.watchPosition(
                    async (position) => {
                        //    getLocation(position.coords, setLocation);
                        if (position?.coords) {
                            const { latitude, longitude } = position.coords
                            console.log('LocationWatcher: debouncedUpdateDriverLocationToServer', position, watchId)
                            dispatch(setDriverLocation({ latitude, longitude }))
                            debouncedUpdateDriverLocationToServer({ latitude, longitude })

                        }
                    },
                    (error) => {
                        // See error code charts below.
                        showErrorMessage('Please enable GPS');
                    },
                    defaultOptions,
                );
            }
        } else {
            showErrorMessage('Please enable GPS');
        }
    };

    const clearWatch = () => {
        if (watchId !== undefined) {
            Geolocation.clearWatch(watchId)
            watchId = undefined
        }
    }


    useEffect(() => {
        console.log('useLocationWatcher: driverStatus changed to', driverStatus, ' Current watchId:', watchId);
        if (driverStatus === DriverAvailableStatus.OFFLINE) {
            clearWatch()
        } else if (!watchId) {
            watchPosition()
        }
        return () => {
            clearWatch()
        };
    }, [driverStatus]);

    return { watchPosition, watchId }
}