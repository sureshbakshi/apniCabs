import { Linking } from "react-native";
import Config from "react-native-config";

export default {
    SOCKET_URL: Config.SOCKET_URL,
    GOOGLE_PLACES_KEY: Config.GOOGLE_PLACES_KEY,
    ANDROID_GOOGLE_SIGN_IN_KEY: Config.ANDROID_GOOGLE_SIGN_IN_KEY,
    IOS_GOOGLE_SIGN_IN_KEY: Config.IOS_GOOGLE_SIGN_IN_KEY,
    GOOGLE_MAPS_KEY:Config.GOOGLE_MAPS_KEY
}

export const openUrl = (uri) => {
    Linking.openURL(uri).catch(err =>
      console.error('An error occurred', err),
    );
  };

  export const webLinks = {
    ownerPortal: 'http://owner.apnicabi.com/',
    terms: 'https://www.apnidukandari.com/terms-and-conditions',
    privacy: 'https://www.apnidukandari.com/privacy-policy'
  }
