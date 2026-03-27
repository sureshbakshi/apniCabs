import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import useLocationService from "./useLocationService";

// Global variable to act as a single source of truth for the last processed location.
// This ensures that even if useDriverLocation is used in multiple components,
// we don't process duplicate updates for the same coordinates.
let globalPrevDriverLocation = { latitude: null, longitude: null };

const useDriverLocation = () => {
    const dispatch = useDispatch();
    const { getCoordinates } = useLocationService();
    const debouncedUpdateDriverLocationToServer = useUpdateDriverLocation();

    const dispatchDriverLocation = useCallback((coords) => {
        const { latitude, longitude } = coords;
        if (latitude && longitude) {
            dispatch(setDriverLocation({ latitude, longitude }));
        }
    }, [dispatch]);

    const updateDriverLocation = useCallback((details) => {
        if (!details) return;
        const { latitude, longitude } = details;

        // Compare with the global variable instead of a local ref
        if (globalPrevDriverLocation.latitude !== latitude || globalPrevDriverLocation.longitude !== longitude) {
            debouncedUpdateDriverLocationToServer(details);
            dispatchDriverLocation(details);
            
            // Update the global variable
            globalPrevDriverLocation = { latitude, longitude };
        }
    }, [debouncedUpdateDriverLocationToServer, dispatchDriverLocation]);

    const getDriverCoordinates = useCallback(async () => {
        const coords = await getCoordinates();
        if (coords) {
            dispatchDriverLocation(coords);
        }
        return coords;
    }, [getCoordinates, dispatchDriverLocation]);

    const updateCurrentDriverLocationDetails = useCallback(async () => {
        // console.log('useDriverLocation: Fetching current driver location details');
        await getCoordinates(updateDriverLocation);
    }, [getCoordinates, updateDriverLocation]);

    return {
        updateDriverLocation,
        getDriverCoordinates,
        updateCurrentDriverLocationDetails
    };
};

export default useDriverLocation;
