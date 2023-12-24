import { useDispatch, useSelector } from "react-redux";
import { DriverAvailableStatus } from "../constants";
import { useDriverActiveRideQuery, useUserActiveRideQuery } from "../slices/apiSlice";
import { useEffect } from "react";
import { clearState, setActiveRide } from "../slices/driverSlice";
import { isDriver } from "../util";
import { cancelActiveRequest, setActiveRequest } from "../slices/userSlice";
import {isEmpty} from 'lodash';

// pickaride, search ride - always
//active page = active ride & drive, active page + user
export default () => {
    const dispatch = useDispatch()
    const { isOnline } = useSelector(state => state.driver);
    const status = isOnline !== DriverAvailableStatus.OFFLINE
    const isDriverLogged = isDriver()
    const { data: activeDriverRideDetails , error: isDriverError} = useDriverActiveRideQuery(undefined, { skip: !status || !isDriverLogged, refetchOnMountOrArgChange: true });
    const { data: activeUserRideDetails , error: isUserError} = useUserActiveRideQuery(undefined, { skip: isDriverLogged, refetchOnMountOrArgChange: true });

    useEffect(() => {
        if(isDriverError){
            dispatch(clearState())
        }else if (activeDriverRideDetails || activeDriverRideDetails === null) {
            console.log({activeDriverRideDetails})
            dispatch(setActiveRide(activeDriverRideDetails))
        }
    }, [activeDriverRideDetails, isDriverLogged])

    useEffect(() => {if(isUserError){
        dispatch(cancelActiveRequest())
    }else if (activeUserRideDetails && !isDriverLogged) {
            dispatch(setActiveRequest(activeUserRideDetails))
        }
    }, [activeUserRideDetails, isDriverLogged])

    return {
        status, activeUserRideDetails, activeDriverRideDetails
    }
}