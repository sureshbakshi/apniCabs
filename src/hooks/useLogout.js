import React from 'react';
import { useDispatch } from "react-redux";
import { useAuthContext } from "../context/Auth.context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { clearAuthData } from "../slices/authSlice";

export default useLogout = () => {
    const { signOut } = useAuthContext();
    const dispatch = useDispatch();

    const logOut = async () => {
        try {
          const sucess = signOut();
          if (sucess) {
            await GoogleSignin.signOut();
            dispatch(clearAuthData());
          }
        } catch (error) {
          console.error(error);
        }
      };
    return {logOut}
}