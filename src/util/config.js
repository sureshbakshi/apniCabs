import { Linking } from "react-native";
import Config from "react-native-config";
console.log('Config', Config);

export default {
  SOCKET_URL: Config.SOCKET_URL,
  GOOGLE_PLACES_KEY: Config.GOOGLE_PLACES_KEY,
  GOOGLE_MAPS_KEY: Config.GOOGLE_MAPS_KEY,
  ROLE: Config.ROLE,
  BASE_URL: Config.BASE_URL,
  ANDROID_STORE_URL: Config.ANDROID_STORE_URL,
  IOS_STORE_URL: Config.IOS_STORE_URL,
}

export const openUrl = async (uri) => {
  try {
    if (!uri) return false;
    let url = String(uri).trim();

    // If no scheme is present, default to https
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
      url = `https://${url}`;
    }

    // Encode spaces to ensure valid URL
    url = url.replace(/\s/g, '%20');
    const isHttp = /^https?:\/\//i.test(url);

    // On Android 11+, canOpenURL may return false for http/https without proper <queries>.
    // Prefer opening http/https directly, then fall back to canOpenURL for custom schemes.
    if (isHttp) {
      try {
        await Linking.openURL(url);
        return true;
      } catch (e) {
        // Fall through to canOpenURL path below
      }
    }

    const isSupported = await Linking.canOpenURL(url);
    if (!isSupported) {
      console.warn('Cannot open URL:', url);
      return false;
    }

    await Linking.openURL(url);
    return true;
  } catch (err) {
    console.error('Failed to open URL', err, uri);
    return false;
  }
};

export const webLinks = {
  ownerPortal: 'https://owner.pikbike.com/',
  terms: 'https://www.pikbike.com/terms-and-conditions',
  privacy: 'https://www.pikbike.com/privacy-policy',
  payment: 'https://pikbike.com/payment.html',
}

export const openOwnerPortal = () => {
  openUrl(webLinks.ownerPortal)
}


