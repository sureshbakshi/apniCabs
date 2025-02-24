import { useSelector } from "react-redux";
import { useUpdateDriverLocationMutation } from "../slices/apiSlice";
import { debounce } from 'lodash';
import { isDriver, isDriverAccepted, _isDriverOnline } from '../util';
import { DriverAvailableStatus } from "../constants";

export default () => {
    const { userInfo: profile, driverInfo } = useSelector(state => state.auth);
    const [updateDriverLocation] = useUpdateDriverLocationMutation();
    const isDriverLogged = isDriver();
    const isAccepted = isDriverAccepted();
    const isOnline = _isDriverOnline();


    const debouncedLocationUpdate = debounce((location) => {
        if (Boolean(location?.latitude) && isDriverLogged && isOnline) {
            const { company, model, colour, type } = driverInfo?.Vehicle;
            const { latitude, longitude } = location
            let payload = {
                "driverId": profile.id,
                "location": { latitude, longitude },
                "category": driverInfo?.Vehicle?.VehicleType?.code,
                "status": isAccepted ? DriverAvailableStatus.BUSY : DriverAvailableStatus.ONLINE,
                "driver": {
                    "name": driverInfo?.name,
                    "email": driverInfo?.email
                },
                "vehicle": { company, model, colour, type: driverInfo?.Vehicle?.VehicleType?.code , registrationNumber: driverInfo?.Vehicle?.registration_number}
            }
            updateDriverLocation(payload);
        }
    }, 250)

    const updateDriverLocationToServer = (location) => {
        debouncedLocationUpdate(location)
    }
    return updateDriverLocationToServer
}