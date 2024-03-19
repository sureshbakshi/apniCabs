import { useSelector } from "react-redux";
import { useUpdateDriverLocationMutation } from "../slices/apiSlice";
import { debounce} from 'lodash';
import { isDriver, isDriverAcceptedOrOnline } from '../util';

export default () =>{
    const profile = useSelector(state => state.auth?.userInfo);
    const [updateDriverLocation] = useUpdateDriverLocationMutation();
    const isDriverLogged = isDriver()
    const debouncedLocationUpdate = debounce((location) => {
        if(Boolean(location?.latitude) && isDriverLogged && isDriverAcceptedOrOnline()) {
            let payload = { ...location };
            payload.driver_id = profile.id;
            payload.status = '';
            console.log({payload})
            updateDriverLocation(payload);
        }
    },250)

    const updateDriverLocationToServer = (location) =>{
        debouncedLocationUpdate(location)
    }
    return updateDriverLocationToServer
}