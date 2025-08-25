import { Linking } from "react-native";
import Config from "react-native-config";

export default {
  SOCKET_URL: Config.SOCKET_URL,
  SOCKET_USER_NAME: Config.SOCKET_USER_NAME,
  SOCKET_PASSWORD: Config.SOCKET_PASSWORD,
  GOOGLE_PLACES_KEY: Config.GOOGLE_PLACES_KEY,
  GOOGLE_MAPS_KEY: Config.GOOGLE_MAPS_KEY,
  ROLE: Config.ROLE
}

export const openUrl = (uri) => {
  Linking.openURL(uri).catch(err =>
    console.error('An error occurred', err),
  );
};

export const webLinks = {
  ownerPortal: 'http://owner.pikbike.com/',
  terms: 'https://www.pikbike.com/terms-and-conditions',
  privacy: 'https://www.pikbike.com/privacy-policy',
  payment: 'https://pikbike.com/payment.html',
}

export const openOwnerPortal = () => {
  openUrl(webLinks.ownerPortal)
}


