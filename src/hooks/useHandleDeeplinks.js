import { useEffect } from "react";
import { Linking } from "react-native";
import { handleDeepLink } from "../util";


export default useHandleDeeplinks = () =>{
    useEffect(() => {
        // Listen for deep links
    
        // Add event listener for deep linking
        const deeplinkListner = Linking?.addEventListener('url', handleDeepLink);
    
        // Remove event listener on cleanup
        return () => {
          deeplinkListner?.remove();
        };
      }, []);
      
}