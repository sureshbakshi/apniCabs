import { AppState } from "react-native";
import { useEffect, useRef } from "react";

export default (onAppStateChange) => {
  const onAppStateChangeRef = useRef(onAppStateChange);

  useEffect(() => {
    onAppStateChangeRef.current = onAppStateChange;
  }, [onAppStateChange]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('Next AppState is: ', nextAppState);
        if (onAppStateChangeRef.current) {
            onAppStateChangeRef.current(nextAppState);
        }
      },
    );
    
    return () => {
      subscription.remove();
    };
  }, []);
}