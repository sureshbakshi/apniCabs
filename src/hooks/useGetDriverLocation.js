import { useSelector } from "react-redux";
import useGetCurrentLocation from "./useGetCurrentLocation";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";

export default () => {
    const { currentLocation, getCurrentLocation } = useGetCurrentLocation();
    const { driverLocation: watchedLocation } = useSelector(state => state.driver);

    useEffect(() => {
        if (isEmpty(currentLocation?.latitude)) {
            getCurrentLocation(null, true)
        }
    }, [currentLocation?.latitude])

    const location = (watchedLocation?.latitude) ? watchedLocation : currentLocation;
    return location
}