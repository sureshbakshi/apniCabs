import React, {createContext, useContext, useState} from 'react';
export const AuthContext = createContext(null);
import * as Keychain from 'react-native-keychain';
import {useDispatch} from 'react-redux';
import {updateLoginToken} from '../slices/authSlice';
const initialState = {
  isLoggedIn: '',
};

export const AuthProvider = props => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);

  const signIn = async (username, token) => {
    await Keychain.setGenericPassword(username, token);
    getToken();
  };
  const getToken = async () => {
    try {
      const {password} = await Keychain.getGenericPassword();
      if (password) {
        setIsLoggedIn(true);
        dispatch(updateLoginToken({token: password}));
        console.log('Credentials successfully loaded for user ' + password);
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };
  const signOut = async () => {
    await Keychain.resetGenericPassword();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, signIn, signOut, getToken}}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
