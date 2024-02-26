import { useEffect } from "react";
import { Linking } from "react-native";
import { handleDeepLink } from "../util";


export default useHandleDeeplinks = () =>{
    useEffect(() => {
        // Listen for deep links
        console.log('useHandleDeeplinks')

        
    
        // Add event listener for deep linking
        Linking.addEventListener('url', handleDeepLink);
    
        // Remove event listener on cleanup
        return () => {
          Linking.removeEventListener('url', handleDeepLink);
        };
      }, []);
      
}