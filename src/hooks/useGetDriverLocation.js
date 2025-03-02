import { useSelector } from "react-redux";
import useGetCurrentLocation from "./useGetCurrentLocation";

export default (isDriverLogged) => {
    const { currentLocation } = useGetCurrentLocation();
    const { driverLocation: watchedLocation } = useSelector(state => state.driver);
    const location = (isDriverLogged && watchedLocation?.latitude) ? watchedLocation : currentLocation;
    return location
}