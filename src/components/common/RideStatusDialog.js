import { useMemo, useRef } from "react";
import { RideStatus } from "../../constants"
import ActiveRidePageStyles from "../../styles/ActiveRidePageStyles";
import { Text, View } from "react-native";
import CustomDialog from "./CustomDialog";
import { useDispatch, useSelector } from "react-redux";
import { clearDriverRideStatus } from "../../slices/driverSlice";
import { clearUserRideState, setActiveRequest } from "../../slices/userSlice";
import { isDriver } from "../../util";
import StarRating from "./StarRating";
import { useUpdateRatingMutation } from "../../slices/apiSlice";
import { useTranslation } from "react-i18next";
import DialogButtons from "./DialogButtons";

export default () => {
    const { t } = useTranslation();
    const [updateRating, { data: ratingResponse, error: requestError, isLoading }] =
        useUpdateRatingMutation();
    const isDriverLogged = isDriver();
    const { rideStatusUpdate } = useSelector((state) => isDriverLogged ? state.driver : state.user);
    const dispatch = useDispatch()
    const ratingRef = useRef(null);

    const statusMessages = {
        [RideStatus.USER_CANCELLED]: {
            title: t('ride_status.user_cancelled.title'),
            description: `${t('ride_status.user_cancelled.description')} ${rideStatusUpdate?.user_details?.name || 'passenger'}.`,
            reason: rideStatusUpdate?.reason,
            subText: t('ride_status.user_cancelled.subText')
        },
        [RideStatus.DRIVER_CANCELLED]: {
            title: t('ride_status.driver_cancelled.title'),
            description: t('ride_status.driver_cancelled.description'),
            reason: rideStatusUpdate?.reason,
            subText: t('ride_status.driver_cancelled.subText')
        },
        [RideStatus.COMPLETED]: {
            title: t('ride_status.completed.title'),
            description: isDriverLogged ? t('ride_status.completed.driver_description') : t('ride_status.completed.user_description')
        }
    }
    const rideStatusModalInfo = rideStatusUpdate?.status ? statusMessages[rideStatusUpdate?.status] : null
    const clearRideState = () => {
        dispatch(isDriverLogged ? clearDriverRideStatus() : clearUserRideState())
    }
    const canShowRating = (rideStatusUpdate?.status === RideStatus.COMPLETED) && !isDriverLogged;
    const onSubmit = async () => {
        if (!isDriverLogged && ratingRef?.current && rideStatusUpdate?.id) {
            const rating = ratingRef?.current.getRating();
            if (rating > 0) {
                let payload = { request_id: rideStatusUpdate?.id, rating: rating };
                updateRating(payload).unwrap().then((res) => {
                    clearRideState()
                }).catch((err) => {
                    clearRideState()
                })
            }
        } else {
            clearRideState()
        }
    }

    const actions = <DialogButtons handleSubmit={onSubmit} closeModal={clearRideState} canShowSubmit={canShowRating} />
    const DialogComponent = useMemo(() => {
        return (
            rideStatusModalInfo ? <>
                <CustomDialog title={rideStatusModalInfo.title} closeCb={clearRideState} openDialog={true} actions={actions}>
                    {canShowRating && <View>
                        <StarRating ref={ratingRef} isLoading={false} />
                    </View>}
                    <Text style={[ActiveRidePageStyles.content]}>{rideStatusModalInfo.description}</Text>
                    {rideStatusModalInfo?.reason ? <Text style={[ActiveRidePageStyles.content]}> {t('reason_for_cancel')}: {rideStatusModalInfo.reason}</Text> : null}
                    {rideStatusModalInfo?.subText ? <Text style={[ActiveRidePageStyles.content]}>{rideStatusModalInfo.subText}</Text> : null}
                </CustomDialog>
            </> : null
        )
    }, [
        rideStatusUpdate
    ])
    return DialogComponent
}