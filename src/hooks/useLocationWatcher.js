import { useEffect, useRef, useCallback } from "react";
import { Platform, AppState } from "react-native";
import Geolocation from "react-native-geolocation-service";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, requestAndroidBackgroundPermission } from "../util/location";
import { useDispatch, useSelector } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import { DriverAvailableStatus, LOCATION_CONFIG } from "../constants";
import {
    startForegroundLocation,
    stopForegroundLocation,
} from "../util/foregroundLocationService";

export const defaultOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,             // Don't accept cached locations
    timeout: LOCATION_CONFIG.WATCHER_TIMEOUT,
    distanceFilter: 0,         // Set to 0 to receive updates even when stationary
    showLocationDialog: true,
    forceRequestLocation: true,
    interval: LOCATION_CONFIG.WATCHER_INTERVAL,
    fastestInterval: LOCATION_CONFIG.WATCHER_FASTEST_INTERVAL,
    useSignificantChanges: false,
    showsBackgroundLocationIndicator: true,
};

export default () => {
    const dispatch = useDispatch();
    const { isConnected } = useNetInfo();
    const driverStatus = useSelector((state) => state.driver.onlineStatus);
    const serviceUnavailable = useSelector(
        (state) => state.driver.serviceUnavailable
    );

    const debouncedUpdateDriverLocationToServer = useUpdateDriverLocation();

    // 1. FIX: Move watchId to useRef so it is scoped to this hook instance
    const watchIdRef = useRef(null);
    const isRequestingPermission = useRef(false);
    const lastPermissionDenialTime = useRef(0);
    const appState = useRef(AppState.currentState);
    const lastPositionRef = useRef(null);
    const lastUpdateTimeRef = useRef(0);

    // Helper to clear watch safely
    const clearWatch = useCallback(() => {
        if (watchIdRef.current !== null) {
            // console.log("Clearing watch ID:", watchIdRef.current);
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    const watchPosition = useCallback(async () => {
        // Prevent re-entry
        if (isRequestingPermission.current || watchIdRef.current !== null) return;

        // Debounce check
        if (Date.now() - lastPermissionDenialTime.current < 2000) {
            console.log("Skipping watchPosition due to recent denial");
            return;
        }

        // console.log("Starting location watch...");
        isRequestingPermission.current = true;
        let granted = false;

        try {
            if (Platform.OS === "ios") {
                await Geolocation.setRNConfiguration({ authorizationLevel: "always" });
                const status = await Geolocation.requestAuthorization("always");
                granted = status === 'granted';
            } else {
                granted = await checkAndroidPermissions();
            }

            if (granted) {
                // Double check we didn't get unmounted or stopped while waiting
                await requestAndroidBackgroundPermission();
                if (watchIdRef.current === null) {
                    watchIdRef.current = Geolocation.watchPosition(
                        (position) => {
                            if (position?.coords) {
                                const { latitude, longitude, heading } = position.coords;
                                const timestamp = position.timestamp;
                                const now = Date.now();
                                // console.log("watcher called at:", new Date(now).toLocaleString());
                                // console.log("New watcher before position:", latitude, longitude, heading, watchIdRef.current);
                                const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

                                // Prevent duplicate updates
                                if (lastPositionRef.current &&
                                    lastPositionRef.current.latitude === latitude &&
                                    lastPositionRef.current.longitude === longitude &&
                                    lastPositionRef.current.heading === heading &&
                                    timeSinceLastUpdate < LOCATION_CONFIG.WATCHER_INTERVAL // Allow update if > 5s has passed
                                ) {
                                    return;
                                }
                                lastPositionRef.current = { latitude, longitude, heading };
                                lastUpdateTimeRef.current = now;
                                // console.log("API called at:", new Date().toLocaleString());
                                // console.log("New watcher position:", new Date().toLocaleString() , '--', latitude, longitude, heading,timestamp, watchIdRef.current);
                                dispatch(setDriverLocation({ latitude, longitude, heading }));
                                debouncedUpdateDriverLocationToServer({ latitude, longitude, heading, timestamp });
                            }
                        },
                        (error) => {
                            console.log("watchPosition error:", error);
                            // Only show error if it's not a permission error we already handled
                            if (error.code !== 1) {
                                showErrorMessage("GPS Error: " + error.message);
                            }
                        },
                        defaultOptions
                    );
                    // console.log("Watch started with ID:", watchIdRef.current);
                }
            } else {
                lastPermissionDenialTime.current = Date.now();
                showErrorMessage("Location permission required for driver mode.");
            }
        } catch (err) {
            console.error("Permission request failed", err);
        } finally {
            isRequestingPermission.current = false;
        }
    }, [dispatch, debouncedUpdateDriverLocationToServer]);

    // 2. FIX: Consolidated Effect for AppState
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            const isOnline = driverStatus !== DriverAvailableStatus.OFFLINE && !serviceUnavailable && isConnected !== false;

            // 3. FIX: CRITICAL - If we are currently requesting permission, 
            // IGNORE AppState changes. The OS dialog causes Background/Active 
            // transitions that trigger the infinite loop.
            if (isRequestingPermission.current) {
                console.log("AppState changed during permission request - Ignoring");
                appState.current = nextAppState;
                return;
            }

            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App came to foreground');
                if (isOnline) {
                    if (Platform.OS === 'android') stopForegroundLocation();
                    watchPosition();
                }
            }

            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                console.log('App went to background');
                if (isOnline) {
                    clearWatch();
                    if (Platform.OS === 'android') startForegroundLocation();
                }
            }

            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [driverStatus, serviceUnavailable, isConnected, watchPosition, clearWatch]);

    // 4. FIX: Consolidated Effect for Driver Status
    // This handles the initial start or when the user toggles the switch
    useEffect(() => {
        const isOnline = driverStatus !== DriverAvailableStatus.OFFLINE && !serviceUnavailable && isConnected !== false;

        // console.log("Driver Status Changed. Online:", isOnline, "AppState:", appState.current, "watchIdRef:", watchIdRef.current);

        if (isOnline) {
            if (appState.current === 'active') {
                stopForegroundLocation();
                watchPosition();
            }
        } else {
            // Offline
            clearWatch();
            if (Platform.OS === 'android') stopForegroundLocation();
        }

        return () => {
            clearWatch();
        };
    }, [driverStatus, serviceUnavailable, isConnected, watchPosition, clearWatch]);

    return { watchPosition, watchId: watchIdRef.current, clearWatch };
};
