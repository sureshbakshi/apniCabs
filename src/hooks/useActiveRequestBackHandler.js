import React, { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useCancelAllRequest from './useCancelAllRequest';
import { setDialogStatus } from '../slices/authSlice';
import { store } from '../store';
import debounce from 'lodash/debounce';

let backButtonListener = undefined;

export function useRequestAlertHandler(title = 'Alert!', message = `You currently have a pending request. Would you like to cancel it? If you click 'Yes', your request will be cancelled.`) {
    const { cancelAllActiveRequest } = useCancelAllRequest();
    const dispatch = useDispatch();
    // const { rideRequests, activeRequestInfo } = useSelector(state => state.user)

    const requestAlert = (cb) => {
        const { activeRequestId, activeRequestInfo } = store.getState().user
        // console.log({rideRequests, activeRequestInfo})
        if (activeRequestId || activeRequestInfo?.id) {
            Alert.alert(title, message, [
                {
                    text: 'Close',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES, Cancel',
                    onPress: () => {
                        if (activeRequestId) {
                            cancelAllActiveRequest(cb);
                        } else if (activeRequestInfo?.id) {
                            dispatch(setDialogStatus(true))
                        }
                    }
                },
            ]);
        } else {
            cb?.()
            // BackHandler.exitApp()
        }
       
        return true;
    }
    const requestAlertHandler = debounce(requestAlert, 250)
    return { requestAlertHandler }
}

export function useActiveRequestBackHandler() {
    const { rideRequests, activeRequestInfo } = useSelector(state => state.user);
    const { requestAlertHandler } = useRequestAlertHandler();

    useEffect(() => {
        return () => {
            backButtonListener?.remove();
            backButtonListener = undefined
        }
    }, [])
    useEffect(() => {
        if ((rideRequests?.request_id || activeRequestInfo?.id) && !backButtonListener) {
            // console.log('hardwareBackPress listenner')
            backButtonListener = BackHandler.addEventListener("hardwareBackPress", requestAlertHandler);
        }
    }, [rideRequests, activeRequestInfo, backButtonListener]);
}
