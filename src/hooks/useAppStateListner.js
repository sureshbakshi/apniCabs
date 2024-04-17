import { AppState } from "react-native";
import { checkAndroidPermissions } from "../util/location";
import { useEffect } from "react";
import useGetCurrentLocation from "./useGetCurrentLocation";
let appStateListener = undefined;

export default (activeCb) => {
  const { getCurrentLocation } = useGetCurrentLocation();

  useEffect(() => {
    if(appStateListener === undefined) {
      appStateListener = AppState.addEventListener(
        'change',
        nextAppState => {
          if (nextAppState === 'active') {
            activeCb?.();
            getCurrentLocation()
          }
          console.log('Next AppState is: ', nextAppState);
        },
      );
    }
    
    return () => {
      appStateListener?.remove();
      appStateListener = undefined
    };
  }, []);
}