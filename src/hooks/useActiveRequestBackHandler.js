import React, { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useCancelAllRequest from './useCancelAllRequest';
import { setDialogStatus } from '../slices/authSlice';
let backButtonListener = undefined;

export function useRequestAlertHandler(title = 'Alert!', message = `You currently have a pending request. Would you like to cancel it? If you click 'Yes', your request will be cancelled.`) {
    const { rideRequests, activeRequest } = useSelector(state => state.user);
    const { cancelAllActiveRequest } = useCancelAllRequest();
    const dispatch = useDispatch();

    const requestAlertHandler = (cb) => {
        if (rideRequests?.request_id || activeRequest?.id) {
            Alert.alert(title, message, [
                {
                    text: 'Close',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES, Cancel',
                    onPress: () => {
                        if (rideRequests?.request_id) {
                            cancelAllActiveRequest(cb);
                        } else if (activeRequest?.id) {
                            dispatch(setDialogStatus(true))
                        }
                    }
                },
            ]);
        } else {
            cb?.()
        }
       
        return true;
    }
    return { requestAlertHandler }
}

export function useActiveRequestBackHandler() {
    const { rideRequests, activeRequest } = useSelector(state => state.user);
    const { requestAlertHandler } = useRequestAlertHandler();

    useEffect(() => {
        return () => {
            backButtonListener?.remove();
            backButtonListener = undefined
        }
    }, [])
    useEffect(() => {
        if ((rideRequests?.request_id || activeRequest?.id) && !backButtonListener) {
            // console.log('hardwareBackPress listenner')
            backButtonListener = BackHandler.addEventListener("hardwareBackPress", requestAlertHandler);
        }
    }, [rideRequests, activeRequest, backButtonListener]);
}
