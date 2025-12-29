import { useEffect, useRef } from "react";
import { Platform, AppState, PermissionsAndroid } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, requestAndroidBackgroundPermission } from "../util/location";
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
            const grantedBackground = await requestAndroidBackgroundPermission();
            if (grantedBackground && watchId === undefined) {
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

    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            const isOnline = driverStatus !== DriverAvailableStatus.OFFLINE && !serviceUnavailable;

            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
                if (isOnline) {
                    if (Platform.OS === 'android') {
                        stopForegroundLocation();
                    }
                    watchPosition();
                }
            }

            if (
                appState.current === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                console.log('App has gone to the background!', isOnline);
                if (isOnline) {
                    clearWatch();
                    if (Platform.OS === 'android') {
                        startForegroundLocation();
                    }
                }
            }

            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [driverStatus, serviceUnavailable]);

    useEffect(() => {
        console.log(
            "useLocationWatcher: driverStatus changed to",
            driverStatus,
            " Current watchId:",
            watchId
        );

        const isOnline =
            driverStatus !== DriverAvailableStatus.OFFLINE && !serviceUnavailable;

        if (isOnline) {
            if (appState.current === 'active') {
                if (Platform.OS === 'android') {
                    stopForegroundLocation();
                }
                if (!watchId) {
                    watchPosition();
                }
            } else {
                if (Platform.OS === 'android') {
                    startForegroundLocation();
                }
            }
        } else {
            clearWatch();
            if (Platform.OS === 'android') {
                stopForegroundLocation();
            }
        }

        return () => {
            clearWatch();
        };
    }, [driverStatus, serviceUnavailable]);

    return { watchPosition, watchId, clearWatch };
};
