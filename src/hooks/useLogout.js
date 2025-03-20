import { useDispatch } from "react-redux";
import { useAuthContext } from "../context/Auth.context";
import { clearAuthData } from "../slices/authSlice";
import {disconnectSocket} from '../sockets/socketConfig'
// import { isDriver } from '../util';
export default useLogout = () => {
  const { signOut } = useAuthContext();
  // const isDriverLogged = isDriver()
  const dispatch = useDispatch();
  // const { requestAlertHandler } = useRequestAlertHandler();

  const logOutHandler = async () => {
    disconnectSocket()
    dispatch(clearAuthData());
  }

  const logOut = () => {
    try {
      const sucess = signOut();
      if (sucess ) {
        logOutHandler()
        // isDriverLogged ? logOutHandler() : requestAlertHandler(logOutHandler)
      }
    } catch (error) {
      console.error(error);
    }
  };
  return { logOut }
}