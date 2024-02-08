import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCancelAllRequestMutation } from "../slices/apiSlice";
import { cancelRideRequest } from "../slices/userSlice";

export default () => {
    const dispatch = useDispatch();
    const { rideRequests } = useSelector(state => state.user);
    const [cancelAllRequest] = useCancelAllRequestMutation();

    const cancelAllActiveRequest = (cb) => {
        if (rideRequests?.request_id) {
            cancelAllRequest(rideRequests?.request_id).unwrap().then((res) => {
                dispatch(cancelRideRequest());
                cb?.()
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    return { cancelAllActiveRequest };
}