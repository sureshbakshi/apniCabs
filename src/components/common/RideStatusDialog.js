import { useMemo } from "react";
import { RideStatus } from "../../constants"
import ActiveRidePageStyles from "../../styles/ActiveRidePageStyles";
import { Text, View } from "react-native";
import CustomDialog from "./CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { clearDriverState } from "../../slices/driverSlice";
import { clearUserState } from "../../slices/userSlice";
import { delay } from 'lodash';
import { isDriver } from "../../util";
import StarRating from "./StarRating";

export default () => {
    const isDriverLogged = isDriver();
    const { statusUpdate, activeRequestInfo } = useSelector((state) => isDriverLogged ? state.driver : state.user);
    const dispatch = useDispatch()
    const statusMessages = {
        [RideStatus.USER_CANCELLED]: {
            title: "Booking Cancelled",
            description: `We're sorry, but your ride has been canceled by the ${activeRequestInfo?.user?.name || 'passenger'}.`,
            reason: statusUpdate?.reason,
            subText: `We understand that unexpected situations may arise, and we appreciate your understanding. Your availability is now back to active, and you are ready to receive new ride requests.`
        },
        [RideStatus.DRIVER_CANCELLED]: {
            title: "Booking Cancelled",
            description: `We're sorry, but your ride has been canceled by the driver. `,
            reason: statusUpdate?.reason,
            subText: `We apologize for any inconvenience caused. Thank you for using Apnicabi. We appreciate your understanding.`
        },
        [RideStatus.COMPLETED]: {
            title: "Trip Completed",
            description: isDriverLogged ? `Thank you for completing the ride with Apnicabi. We appreciate your dedication to providing a safe and reliable transportation experience for our passengers.
    `: 'Thank you for riding with Apnicabi! Your trip has been successfully completed  and look forward to serving you again soon.'
        }
    }
    const rideStatusModalInfo = statusUpdate?.status ? statusMessages[statusUpdate?.status] : null
    const clearRideState = () => {
        delay(() => {
            dispatch(isDriverLogged ? clearDriverState() : clearUserState())
        }, 1000)
    }
    const canShowRating = (statusUpdate?.status === RideStatus.COMPLETED) && !isDriverLogged;
    const onSubmit = (rating) => {
        //invoke rating submit
        console.log('rating', rating)
    }
    const DialogComponent = useMemo(() => {
        return (
            rideStatusModalInfo ? <>
                <CustomDialog title={rideStatusModalInfo.title} closeCb={clearRideState} openDialog={true}>
                    {canShowRating && <View>
                        <StarRating onSubmit={onSubmit} isLoading={false} />
                    </View>}
                    <Text style={[ActiveRidePageStyles.content]}>{rideStatusModalInfo.description}</Text>
                    {rideStatusModalInfo?.reason ? <Text style={[ActiveRidePageStyles.content]}> Reason for Cancellation: {rideStatusModalInfo.reason}</Text> : null}
                    {rideStatusModalInfo?.subText ? <Text style={[ActiveRidePageStyles.content]}>{rideStatusModalInfo.subText}</Text> : null}
                </CustomDialog>
            </> : null
        )
    }, [
        statusUpdate
    ])
    return DialogComponent
}