import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../context/Auth.context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { clearAuthData } from "../slices/authSlice";
import { useRequestAlertHandler } from './useActiveRequestBackHandler';
import {disconnectSocket} from '../sockets/socketConfig'
import { isDriver } from '../util';
export default useLogout = () => {
  const { signOut } = useAuthContext();
  const isDriverLogged = isDriver()
  const dispatch = useDispatch();
  const { requestAlertHandler } = useRequestAlertHandler();

  const logOutHandler = async () => {
    disconnectSocket()
    dispatch(clearAuthData());
  }

  const logOut = () => {
    try {
      const sucess = signOut();
      if (sucess ) {
        isDriverLogged ? logOutHandler() : requestAlertHandler(logOutHandler)
      }
    } catch (error) {
      console.error(error);
    }
  };
  return { logOut }
}