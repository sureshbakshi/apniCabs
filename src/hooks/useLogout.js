import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../context/Auth.context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { clearAuthData } from "../slices/authSlice";
import { useRequestAlertHandler } from './useActiveRequestBackHandler';

export default useLogout = () => {
  const { signOut } = useAuthContext();
  const dispatch = useDispatch();
  const { requestAlertHandler } = useRequestAlertHandler();

  const logOutHandler = async () => {
    await GoogleSignin.signOut();
    dispatch(clearAuthData());
  }

  const logOut = () => {
    try {
      const sucess = signOut();
      if (sucess) {
        requestAlertHandler(logOutHandler)
      }
    } catch (error) {
      console.error(error);
    }
  };
  return { logOut }
}