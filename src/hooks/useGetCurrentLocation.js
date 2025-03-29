import { useEffect, useState } from "react";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, defaultOptions, getLocation } from "../util/location";
import useUpdateDriverLocation from "./useUpdateDriverLocation";
import { useDispatch } from "react-redux";
import { setDriverLocation } from "../slices/driverSlice";

export default () => {
    const [currentLocation, setLocation] = useState({
        latitude: '',
        longitude: '',
        city: '',
        address: '',
    })
    const updateDriverLocationToServer = useUpdateDriverLocation()
    const dispatch = useDispatch()

    const getCurrentLocation = async (cb, isDriver = false) => {
        const granted = await checkAndroidPermissions();
        if (granted) {
            await Geolocation.getCurrentPosition(
                async (position) => {
                    if (position?.coords) {
                        const locationDetails = await getLocation(position?.coords, setLocation);
                        cb?.(locationDetails)
                        if (isDriver) {
                            updateDriverLocationToServer(locationDetails)
                            const { latitude, longitude } = locationDetails;
                            if (latitude && longitude) dispatch(setDriverLocation({ latitude, longitude }))
                        }
                        return locationDetails
                    }
                },
                (error) => {
                    // See error code charts below.
                    // console.log(error?.code, error?.message);
                    showErrorMessage('Please enable GPS');
                    getCurrentLocation()
                },
                defaultOptions
            );
        }
    }

    useEffect(() => {
        // getCurrentLocation()
    }, [])
    return { getCurrentLocation, currentLocation }
}