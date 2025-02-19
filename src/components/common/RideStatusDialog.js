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
    const { t } = useTranslation();
    const isDriverLogged = isDriver();
    const { statusUpdate, activeRequestInfo } = useSelector((state) => isDriverLogged ? state.driver : state.user);
    const dispatch = useDispatch()
    const statusMessages = {
        [RideStatus.USER_CANCELLED]: {
            title: t('ride_status.user_cancelled.title'),
            description: `${t('ride_status.user_cancelled.description')} ${activeRequestInfo?.user?.name || 'passenger'}.`,
            reason: statusUpdate?.reason,
            subText: t('ride_status.user_cancelled.subText')
        },
        [RideStatus.DRIVER_CANCELLED]: {
            title: t('ride_status.driver_cancelled.title'),
            description:t('ride_status.driver_cancelled.description'),
            reason: statusUpdate?.reason,
            subText: t('ride_status.driver_cancelled.subText')
        },
        [RideStatus.COMPLETED]: {
            title: t('ride_status.completed.title'),
            description: isDriverLogged ? t('ride_status.completed.driver_description'): t('ride_status.completed.user_description')
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
                    {rideStatusModalInfo?.reason ? <Text style={[ActiveRidePageStyles.content]}> {t('reason_for_cancel')}: {rideStatusModalInfo.reason}</Text> : null}
                    {rideStatusModalInfo?.subText ? <Text style={[ActiveRidePageStyles.content]}>{rideStatusModalInfo.subText}</Text> : null}
                </CustomDialog>
            </> : null
        )
    }, [
        statusUpdate
    ])
    return DialogComponent
}