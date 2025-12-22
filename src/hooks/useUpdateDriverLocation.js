import { useSelector } from "react-redux";
import { useUpdateDriverLocationMutation } from "../slices/apiSlice";
import { isDriver, isDriverBusy, _isDriverOnline } from '../util';
import { DriverAvailableStatus, ROUTES_NAMES } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { useRef, useCallback, useEffect } from 'react';

export default () => {
    const { userInfo: profile, driverInfo } = useSelector(state => state.auth);
    const [updateDriverLocation] = useUpdateDriverLocationMutation();
    const isDriverLogged = isDriver();
    const isBusy = isDriverBusy();
    const isOnline = _isDriverOnline();
    const navigation = useNavigation();
    const is_available = isBusy || isOnline;


    // Debounce refs - shared across all calls
    const queueRef = useRef([]);
    const isProcessingRef = useRef(false);
    const lastProcessedRef = useRef(0);
    const MIN_INTERVAL = 10000; // 10 seconds

    const processQueue = useCallback(async () => {
        const now = Date.now();
        if (isProcessingRef.current || queueRef.current.length === 0 ||
            (now - lastProcessedRef.current < MIN_INTERVAL)) {
            return;
        }

        isProcessingRef.current = true;
        const location = queueRef.current.shift();

        try {
            console.log('calling driver location api with payload:', location);
            const response = updateDriverLocation(location.payload);
            await response.unwrap();
            lastProcessedRef.current = now;
        } catch (err) {
            if (err.status === 404) {
                navigation.navigate(ROUTES_NAMES.serviceUnavailable);
            } else {
                console.log('Error updating location:', err);
                // Re-queue failed update
                queueRef.current.unshift(location);
            }
        } finally {
            isProcessingRef.current = false;
            // Process next after interval
            setTimeout(processQueue, MIN_INTERVAL);
        }
    }, [updateDriverLocation, navigation]);

    const debouncedUpdateDriverLocationToServer = useCallback((location) => {
        if (!Boolean(location?.latitude) || !isDriverLogged || !is_available || !driverInfo?.Vehicle) {
            return;
        }

        const { company, model, colour, type, id: vehicleId } = driverInfo.Vehicle;
        const payload = {
            "driverId": profile.id,
            "location": { latitude: location.latitude, longitude: location.longitude },
            "category": driverInfo?.Vehicle?.VehicleType?.code,
            "status": isBusy ? DriverAvailableStatus.BUSY : DriverAvailableStatus.ONLINE,
            "driver": {
                "name": driverInfo?.name,
                ...(driverInfo?.email ? { email: driverInfo?.email } : {})
            },
            "vehicle": {
                company,
                model,
                colour,
                type: driverInfo?.Vehicle?.VehicleType?.code,
                registrationNumber: driverInfo?.Vehicle?.registration_number,
                type_id: type
            }
        };

        // Queue the update (prevents duplicates)
        queueRef.current.push({ payload, timestamp: Date.now() });
        processQueue();
    }, [profile.id, driverInfo, isDriverLogged, is_available, isBusy, processQueue]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            queueRef.current = [];
            isProcessingRef.current = false;
        };
    }, []);

    return debouncedUpdateDriverLocationToServer;
};
