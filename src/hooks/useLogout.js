import { useDispatch } from "react-redux";
import { clearAuthData } from "../slices/authSlice";
import { disconnectSocket } from '../sockets/socketConfig'
import { stopForegroundLocation } from "../util/foregroundLocationService";
export default useLogout = () => {
  const dispatch = useDispatch();

  const logOutHandler = async () => {
    disconnectSocket();
    stopForegroundLocation();
    dispatch(clearAuthData());
  }

  const logOut = () => {
    try {
      logOutHandler()
    } catch (error) {
      console.error(error);
    }
  };
  return { logOut }
}