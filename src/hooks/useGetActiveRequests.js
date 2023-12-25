import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useDriverActiveRideQuery, useUserActiveRideQuery } from "../slices/apiSlice";
import { useEffect } from "react";
import { clearDriverState, setActiveRide } from "../slices/driverSlice";
import { isDriver } from "../util";
import { clearUserState, setActiveRequest } from "../slices/userSlice";
import {isEmpty} from 'lodash';

// pickaride, search ride - always
//active page = active ride & drive, active page + user
export default () => {
    const dispatch = useDispatch()
    const { isOnline } = useSelector(state => state.driver);
    const status = isOnline !== DriverAvailableStatus.OFFLINE
    const isDriverLogged = isDriver()
    const { data: activeDriverRideDetails , error: isDriverError,  refetch: fetchDriverActiveRequest} = useDriverActiveRideQuery(undefined, { skip: !status || !isDriverLogged, refetchOnMountOrArgChange: true });
    const { data: activeUserRideDetails , error: isUserError, refetch: fetchUserActiveRequest} = useUserActiveRideQuery(undefined, { skip: isDriverLogged});


    useEffect(() => {
        if(isDriverError){
            dispatch(clearDriverState())
        }else if (activeDriverRideDetails || activeDriverRideDetails === null) {
            console.log({activeDriverRideDetails})
            dispatch(setActiveRide(activeDriverRideDetails))
        }
    }, [activeDriverRideDetails, isDriverLogged])

    useEffect(() => {if(isUserError){
        dispatch(clearUserState())
    }else if (activeUserRideDetails && !isDriverLogged) {
            dispatch(setActiveRequest(activeUserRideDetails))
        }
    }, [activeUserRideDetails, isDriverLogged])

    return {
        status, activeUserRideDetails, activeDriverRideDetails
    }
}