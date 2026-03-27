import { useSelector } from "react-redux";
import useGetCurrentLocation from "./useGetCurrentLocation";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";

export default () => {
    const { updateCurrentDriverLocationDetails } = useGetCurrentLocation();
    const { driverLocation: watchedLocation } = useSelector(state => state.driver);

    useEffect(() => {
        if (!watchedLocation?.latitude) {
            console.log("useGetDriverLocation: watchedLocation changed:", watchedLocation);
            updateCurrentDriverLocationDetails()
        }
    }, [watchedLocation?.latitude])

    return watchedLocation
}