import { useEffect } from "react";
import { Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { showErrorMessage } from "../util";
import { checkAndroidPermissions } from "../util/location";
import { useDispatch, useSelector } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import { DriverAvailableStatus } from "../constants";
import {
    startForegroundLocation,
    stopForegroundLocation,
} from "../util/foregroundLocationService";

let watchId = undefined;

export const defaultOptions = {
    enableHighAccuracy: true,
    maximumAge: 20 * 1000,
    timeout: 60 * 1000,
    distanceFilter: 0,
    showLocationDialog: true,
    forceRequestLocation: true,
    interval: 30 * 1000,
    fastestInterval: 25 * 1000,
    useSignificantChanges: false,
    showsBackgroundLocationIndicator: false,
};

export default () => {
    const dispatch = useDispatch();
    const driverStatus = useSelector((state) => state.driver.onlineStatus);
    const serviceUnavailable = useSelector(
        (state) => state.driver.serviceUnavailable
    );
    const debouncedUpdateDriverLocationToServer = useUpdateDriverLocation();

    const watchPosition = async () => {
        console.log("Starting location watch with id:", watchId);
        let granted = false;

        if (Platform.OS === "ios") {
            await Geolocation.setRNConfiguration({
                authorizationLevel: "always",
            });
            await Geolocation.requestAuthorization("always");
            granted = true;
        } else {
            granted = await checkAndroidPermissions();
        }

        if (granted) {
            if (watchId === undefined) {
                watchId = Geolocation.watchPosition(
                    async (position) => {
                        if (position?.coords) {
                            const { latitude, longitude } = position.coords;
                            console.log(
                                "LocationWatcher: debouncedUpdateDriverLocationToServer",
                                position,
                                watchId
                            );
                            dispatch(setDriverLocation({ latitude, longitude }));
                            debouncedUpdateDriverLocationToServer({ latitude, longitude });
                        }
                    },
                    (error) => {
                        console.log("watchPosition error:", error);
                        showErrorMessage("Please enable GPS");
                    },
                    defaultOptions
                );
            }
        } else {
            showErrorMessage("Please enable GPS");
        }
    };

    const clearWatch = () => {
        if (watchId !== undefined) {
            Geolocation.clearWatch(watchId);
            watchId = undefined;
        }
    };

    useEffect(() => {
        console.log(
            "useLocationWatcher: driverStatus changed to",
            driverStatus,
            " Current watchId:",
            watchId
        );

        const isOnline =
            driverStatus !== DriverAvailableStatus.OFFLINE && !serviceUnavailable;

        if (Platform.OS === "android") {
            if (isOnline) {
                // startForegroundLocation();
            } else {
                stopForegroundLocation();
            }
        }

        if (isOnline) {
            if (!watchId) {
                watchPosition();
            }
        } else {
            clearWatch();
        }

        return () => {
            clearWatch();
            // if (Platform.OS === "android") {
            //     stopForegroundLocation();
            // }
        };
    }, [driverStatus, serviceUnavailable]);

    return { watchPosition, watchId, clearWatch };
};
