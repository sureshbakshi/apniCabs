import { useEffect, useState } from "react";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, defaultOptions, getLocation } from "../util/location";
import useUpdateDriverLocation from "./useUpdateDriverLocation";

export default () => {
    const [currentLocation, setLocation] = useState({
        latitude: '',
        longitude: '',
        city: '',
        address: '',
    })
    const updateDriverLocationToServer = useUpdateDriverLocation()


    const getCurrentLocation = async (cb, isDriver = false) => {
        if (checkAndroidPermissions()) {
         await Geolocation.getCurrentPosition(
                async (position) => {
                    if (position?.coords) {
                        const locationDetails = await getLocation(position?.coords, setLocation);
                        cb?.(locationDetails)
                        if(isDriver) {
                            updateDriverLocationToServer(locationDetails)
                        }
                        return locationDetails
                    }
                },
                (error) => {
                    // See error code charts below.
                    console.log(error?.code, error?.message);
                    showErrorMessage('Please enable location service');
                },
                defaultOptions
            );
        }
    }

    useEffect(() => {
        getCurrentLocation()
    }, [])
    return { getCurrentLocation, currentLocation }
}