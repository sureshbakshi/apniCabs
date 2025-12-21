import { AppState } from "react-native";
import { useEffect } from "react";
// import useGetCurrentLocation from "./useGetCurrentLocation";
let appStateListener = undefined;

export default (activeCb) => {

  useEffect(() => {
    if(appStateListener === undefined) {
      appStateListener = AppState.addEventListener(
        'change',
        nextAppState => {
          if (nextAppState === 'active') {
            activeCb?.();
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