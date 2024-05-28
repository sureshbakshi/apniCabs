import React, {createContext, useContext, useState} from 'react';
export const AuthContext = createContext(null);
import * as Keychain from 'react-native-keychain';
import {useDispatch} from 'react-redux';
const initialState = {
  isLoggedIn: false,
};

export const AuthProvider = props => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);

  const signIn = async (id, token) => {
    await Keychain.setGenericPassword(id, token);
    getToken();
  };
  const getToken = async () => {
    try {
      const {password} = await Keychain.getGenericPassword();
      if (password) {
        setIsLoggedIn(true);
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
