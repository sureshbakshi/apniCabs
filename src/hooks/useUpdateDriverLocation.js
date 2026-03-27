import { useDispatch, useSelector } from "react-redux";
import { useUpdateDriverLocationMutation } from "../slices/apiSlice";
import { isDriver, isDriverBusy, _isDriverOnline } from '../util';
import { DriverAvailableStatus } from "../constants";
import { useRef, useCallback, useEffect, useMemo } from 'react';
import { setServiceUnavailable } from "../slices/driverSlice";

export default () => {
    const dispatch = useDispatch();
    const { userInfo: profile, driverInfo } = useSelector(state => state.auth);
    const [updateDriverLocation] = useUpdateDriverLocationMutation();
    const isDriverLogged = isDriver();
    const isBusy = isDriverBusy();
    const isOnline = _isDriverOnline();
    const isAvailable = isBusy || isOnline;

    const shouldUpdate = useMemo(() =>
        Boolean(profile?.id && driverInfo?.Vehicle && isDriverLogged && isAvailable),
        [profile?.id, driverInfo?.Vehicle, isDriverLogged, isAvailable]
    );

    // Single latest location ref (no queue)
    const latestLocationRef = useRef(null);
    const timeoutRef = useRef(null);
    const isProcessingRef = useRef(false);
    const lastProcessedRef = useRef(0);
    const MIN_INTERVAL = 5000; // 10 seconds
    const DEBOUNCE_DELAY = 10; // 10ms for burst handling

    const sendLatestLocation = useCallback(async () => {
        const now = Date.now();

        // Rate limit: skip if too soon
        if (now - lastProcessedRef.current < MIN_INTERVAL) {
            return;
        }

        // No location to send
        if (!latestLocationRef.current) {
            return;
        }

        isProcessingRef.current = true;
        const locationData = latestLocationRef.current;

        try {
            // console.log("updateDriverLocation", new Date().toLocaleString(), locationData.payload.location);
            await updateDriverLocation(locationData.payload).unwrap();
            dispatch(setServiceUnavailable(false));
            lastProcessedRef.current = now;
        } catch (err) {
            if (err?.status === 404) {
                dispatch(setServiceUnavailable(true));
            } else {
                console.error('Location update failed:', err);
                // Don't retry - wait for next valid location
            }
        } finally {
            isProcessingRef.current = false;
            latestLocationRef.current = null; // Clear after processing
        }
    }, [updateDriverLocation, dispatch]);

    const debouncedUpdateDriverLocationToServer = useCallback((location) => {
        if (!location?.latitude || !shouldUpdate) {
            return;
        }

        const vehicle = driverInfo.Vehicle;
        const payload = {
            driverId: profile.id,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
                heading: location.heading,
                timestamp: location.timestamp
            },
            category: vehicle?.VehicleType?.code,
            status: isBusy ? DriverAvailableStatus.BUSY : DriverAvailableStatus.ONLINE,
            driver: {
                name: driverInfo?.name,
                ...(driverInfo?.email && { email: driverInfo?.email })
            },
            vehicle: {
                company: vehicle.company,
                model: vehicle.model,
                colour: vehicle.colour,
                type: vehicle?.VehicleType?.code,
                registrationNumber: vehicle.registration_number,
                type_id: vehicle.type
            }
        };

        // **ALWAYS replace with latest** - discard previous
        latestLocationRef.current = { payload };

        // Cancel previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Schedule send after 10ms debounce (handles 10 requests in 10ms burst)
        timeoutRef.current = setTimeout(() => {
            sendLatestLocation();
        }, DEBOUNCE_DELAY);
    }, [profile.id, driverInfo, shouldUpdate, isBusy, sendLatestLocation]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            latestLocationRef.current = null;
            isProcessingRef.current = false;
        };
    }, []);

    return debouncedUpdateDriverLocationToServer;
};
