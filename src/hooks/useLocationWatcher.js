import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, defaultOptions, getLocation } from "../util/location";
import { useDispatch, useSelector } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import { DriverAvailableStatus } from "../constants";
let watchId = undefined;

export default () => {
    const dispatch = useDispatch();
    const driverStatus = useSelector((state) => state.driver.driverStatus)
    const updateDriverLocationToServer = useUpdateDriverLocation()

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
            if (watchId === undefined) {
                watchId = Geolocation.watchPosition(
                    async (position) => {
                        console.log('watchPosition', position)
                        //    getLocation(position.coords, setLocation);
                        if (position?.coords) {
                            const { latitude, longitude } = position.coords
                            dispatch(setDriverLocation({ latitude, longitude }))
                            updateDriverLocationToServer({ latitude, longitude })

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
        if (watchId) {
            Geolocation.clearWatch(watchId)
            watchId = undefined
        }
    }

    useEffect(() => {
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