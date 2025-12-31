import { useEffect, useRef, useCallback } from "react";
import { Platform, AppState } from "react-native";
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
    
    // 1. FIX: Move watchId to useRef so it is scoped to this hook instance
    const watchIdRef = useRef(null);
    const isRequestingPermission = useRef(false);
    const lastPermissionDenialTime = useRef(0);
    const appState = useRef(AppState.currentState);

    // Helper to clear watch safely
    const clearWatch = useCallback(() => {
        if (watchIdRef.current !== null) {
            console.log("Clearing watch ID:", watchIdRef.current);
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

        console.log("Starting location watch...");
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
                                const { latitude, longitude } = position.coords;
                                dispatch(setDriverLocation({ latitude, longitude }));
                                debouncedUpdateDriverLocationToServer({ latitude, longitude });
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
                    console.log("Watch started with ID:", watchIdRef.current);
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
            const isOnline = driverStatus !== DriverAvailableStatus.OFFLINE && !serviceUnavailable;
            
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
    }, [driverStatus, serviceUnavailable, watchPosition, clearWatch]);

    // 4. FIX: Consolidated Effect for Driver Status
    // This handles the initial start or when the user toggles the switch
    useEffect(() => {
        const isOnline = driverStatus !== DriverAvailableStatus.OFFLINE && !serviceUnavailable;
        
        console.log("Driver Status Changed. Online:", isOnline, "AppState:", appState.current,"watchIdRef:" , watchIdRef.current);

        if (isOnline) {
            if (appState.current === 'active') {
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
    }, [driverStatus, serviceUnavailable, watchPosition, clearWatch]);

    return { watchPosition, watchId: watchIdRef.current, clearWatch };
};
