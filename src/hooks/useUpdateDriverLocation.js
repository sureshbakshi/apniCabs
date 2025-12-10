import { useSelector } from "react-redux";
import { useUpdateDriverLocationMutation } from "../slices/apiSlice";
import { isDriver, isDriverAccepted, _isDriverOnline } from '../util';
import { DriverAvailableStatus, ROUTES_NAMES } from "../constants";
import { useNavigation } from "@react-navigation/native";

export default () => {
    const { userInfo: profile, driverInfo } = useSelector(state => state.auth);
    const [updateDriverLocation] = useUpdateDriverLocationMutation();
    const isDriverLogged = isDriver();
    const isAccepted = isDriverAccepted();
    const isOnline = _isDriverOnline();
    const navigation = useNavigation();
    const is_available = isAccepted || isOnline

    const updateDriverLocationToServer = (location) => {
        if (Boolean(location?.latitude) && isDriverLogged && is_available && driverInfo?.Vehicle) {
            const { company, model, colour, type, id: vehicleId } = driverInfo?.Vehicle;
            const { latitude, longitude } = location
            let payload = {
                "driverId": profile.id,
                "location": { latitude, longitude },
                "category": driverInfo?.Vehicle?.VehicleType?.code,
                "status": isAccepted ? DriverAvailableStatus.BUSY : DriverAvailableStatus.ONLINE,
                "driver": {
                    "name": driverInfo?.name,
                    ...(driverInfo?.email ? { email: driverInfo?.email } : {})
                },
                "vehicle": { company, model, colour, type: driverInfo?.Vehicle?.VehicleType?.code, registrationNumber: driverInfo?.Vehicle?.registration_number, type_id: vehicleId }
            }
            let response = updateDriverLocation(payload);
            response.unwrap().then((res) => {
            }).catch((err) => {
                if (err.status === 404) {
                    navigation.navigate(ROUTES_NAMES.serviceUnavailable)
                } else {
                    console.log('Error updating location:', err);
                }
            });
        }
    }

    // const updateDriverLocationToServer = (location) => {
    //     debouncedLocationUpdate(location)
    // }
    return updateDriverLocationToServer
}