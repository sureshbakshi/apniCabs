import { Linking } from "react-native";
import Config from "react-native-config";

export default {
    SOCKET_URL: Config.SOCKET_URL,
    GOOGLE_PLACES_KEY: Config.GOOGLE_PLACES_KEY,
    ANDROID_GOOGLE_SIGN_IN_KEY: Config.ANDROID_GOOGLE_SIGN_IN_KEY,
    IOS_GOOGLE_SIGN_IN_KEY: Config.IOS_GOOGLE_SIGN_IN_KEY,
    GOOGLE_MAPS_KEY:Config.GOOGLE_MAPS_KEY
}

export const openOwnerPortal = () => {
    Linking.openURL('http://owner.apnicabi.com/').catch(err =>
      console.error('An error occurred', err),
    );
  };