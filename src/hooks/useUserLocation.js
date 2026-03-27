import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUserLocation } from "../slices/userSlice";
import { getLocation } from "../util/location";
import useLocationService from "./useLocationService";

const useUserLocation = () => {
    const dispatch = useDispatch();
    const { getCoordinates } = useLocationService();
    const [currentLocation, setLocation] = useState({
        latitude: '',
        longitude: '',
        city: '',
        address: '',
    });

    const dispatchUserLocation = useCallback((coords) => {
        const { latitude, longitude } = coords;
        if (latitude && longitude) {
            dispatch(setUserLocation({ latitude, longitude }));
        }
    }, [dispatch]);

    const getUserCoordinates = useCallback(async () => {
        const coords = await getCoordinates();
        if (coords) {
            dispatchUserLocation(coords);
        }
        return coords;
    }, [getCoordinates, dispatchUserLocation]);

    const getAddress = useCallback(async (coords) => {
        try {
            return await getLocation(coords, setLocation);
        } catch (error) {
            console.error('getAddress error:', error);
            return null;
        }
    }, []);

    const getCurrentLocationDetails = useCallback(async (cb) => {
        const coords = await getCoordinates();
        if (coords) {
            const details = await getAddress(coords);
            if (details) {
                cb?.(details);
                return details;
            }
        }
        return null;
    }, [getCoordinates, getAddress]);

    return {
        currentLocation,
        getUserCoordinates,
        getAddress,
        getCurrentLocationDetails
    };
};

export default useUserLocation;
