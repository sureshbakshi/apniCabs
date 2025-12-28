import { useDispatch } from "react-redux";
import { clearAuthData } from "../slices/authSlice";
import { disconnectSocket } from '../sockets/socketConfig'
import { stopForegroundLocation } from "../util/foregroundLocationService";
// import { isDriver } from '../util';
export default useLogout = () => {
  // const isDriverLogged = isDriver()
  const dispatch = useDispatch();
  // const { requestAlertHandler } = useRequestAlertHandler();

  const logOutHandler = async () => {
    disconnectSocket();
    stopForegroundLocation();
    dispatch(clearAuthData());
  }

  const logOut = () => {
    try {
      logOutHandler()
      // isDriverLogged ? logOutHandler() : requestAlertHandler(logOutHandler)
    } catch (error) {
      console.error(error);
    }
  };
  return { logOut }
}