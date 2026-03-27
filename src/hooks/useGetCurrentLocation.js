import useLocationService, { defaultCurrentLocationOptions } from "./useLocationService";
import useDriverLocation from "./useDriverLocation";
import useUserLocation from "./useUserLocation";

export { defaultCurrentLocationOptions };

export default () => {
    const { getCoordinates } = useLocationService();
    const { 
        updateDriverLocation, 
        getDriverCoordinates, 
        updateCurrentDriverLocationDetails 
    } = useDriverLocation();
    
    const { 
        currentLocation, 
        getUserCoordinates, 
        getAddress, 
        getCurrentLocationDetails 
    } = useUserLocation();

    return { 
        getCoordinates, 
        getAddress, 
        updateDriverLocation, 
        getCurrentLocationDetails, 
        updateCurrentDriverLocationDetails, 
        currentLocation, 
        getUserCoordinates, 
        getDriverCoordinates 
    };
}   