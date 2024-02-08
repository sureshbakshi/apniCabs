import React, { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserState } from '../slices/userSlice';
import useCancelAllRequest from './useCancelAllRequest';
import { setDialogStatus } from '../slices/authSlice';
import { delay } from 'lodash';
let backButtonListener = undefined;

export function useRequestAlertHandler() {
    const { rideRequests, activeRequest } = useSelector(state => state.user);
    const { cancelAllActiveRequest } = useCancelAllRequest();
    const dispatch = useDispatch();

    const requestAlertHandler = (cb) => {
        if(rideRequests?.request_id || activeRequest?.id){
            Alert.alert('Hold on!', 'Are you sure you want to go back?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => {
                        if (rideRequests?.request_id) {
                           cancelAllActiveRequest(cb);
                        } else if (activeRequest?.id) {
                            dispatch(setDialogStatus(true))
                        }
                    }
                },
            ]);
        }else{
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
            console.log('hardwareBackPress listenner')
            backButtonListener = BackHandler.addEventListener("hardwareBackPress", requestAlertHandler);
        }
    }, [rideRequests, activeRequest, backButtonListener]);
}
