import { Dimensions, Linking } from 'react-native';
import axios from 'axios';
import Config from "../util/config";
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { DriverAvailableStatus, RIDE_STATUS_LABELS, ROUTES_NAMES, USER_ROLES, VEHICLE_IMAGES, VEHICLE_TYPES, VerificationStatus, colorsNBg } from '../constants';
import { store } from '../store';
import images from './images';
import { Notifications } from 'react-native-notifications';
import { navigate } from './navigationService';
import Bugsnag from '@bugsnag/react-native'
import config from '../util/config';
import { set, get, isEmpty, debounce } from 'lodash';


export const getRandomNumber = (min = 0, max = 4) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRoles = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo?.roles || []
}

export const isDriver = () => Boolean(getRoles()?.includes(USER_ROLES.DRIVER));
export const isOwner = () => Boolean(getRoles()?.includes(USER_ROLES.OWNER));
export const isUser = () => Boolean(getRoles()?.includes(USER_ROLES.USER));

export const getScreen = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
  return { screenWidth, screenHeight }
}

export const getConfig = () => {
  return Config
}

export const showErrorMessage = (obj) => {
  const msg = typeof obj === 'string' ? obj : obj?.data?.message
  const error = {
    type: 'error',
    text1: msg || 'Something went wrong. Please retry again.',
  }
  bugLogger(error)

  Toast.show({
    ...error,
    position: 'bottom',
    visibilityTime: 2000,
    autoHide: true,
  });
}

export const showSuccessMessage = (msg, position = 'bottom') => {
  const success = {
    type: 'success',
    text1: msg || 'Success!',
  }
  Toast.show({
    ...success,
    position: position,
  })
}

export const calculateDistance = async (orgLat, orgLon, destLat, destLong) => {
  const apiKey = config.GOOGLE_PLACES_KEY;
  try {
    const mode = 'driving'; // Set mode to 'bicycling' for bike transport
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${orgLat},${orgLon}&destinations=${destLat},${destLong}&mode=${mode}&key=${apiKey}`;

    const response = await axios.get(url);
    const { rows, status } = response.data;

    if (rows && rows.length > 0 && rows[0].elements.length && status === "OK") {
      const firstRoute = rows[0].elements[0]
      return { distance: firstRoute.distance, duration: firstRoute.duration };
    } else {
      bugLogger({ response, msg: 'Distance calculation error', gk: apiKey })
      return new Error('Distance calculation error');
    }
  } catch (error) {
    console.error('Error calculating distance:', error);
    bugLogger({ error, msg: 'Error calculating distance', gk: apiKey })
    return new Error('Error calculating distance');
  }
};

export const Capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const _isDriverOnline = () => {
  const onlineStatus = store.getState().driver.onlineStatus;
  return Boolean(onlineStatus === DriverAvailableStatus.ONLINE)
}

export const _isDriverOffline = () => {
  const onlineStatus = store.getState().driver.onlineStatus;
  return Boolean(onlineStatus === DriverAvailableStatus.OFFLINE)
}

export const isDriverBusy = () => {
  const activeRequestInfo = store.getState().driver?.activeRequestInfo;
  return Boolean(activeRequestInfo?.id);
}

export const _isLoggedIn = () => {
  const { userInfo } = store.getState().auth

  return Boolean(userInfo?.id)
}
export const getUserId = () => {
  const { userInfo } = store.getState().auth
  return userInfo?.id
}

export const setBugsnagUserInfo = (provider) => {
  const { userInfo } = store.getState().auth
  const info = { id: userInfo?.id, email: userInfo?.email, name: userInfo?.name }
  const Provider = provider || Bugsnag
  // Provider?.setUser(info.id, info.email, info.name)
}

export const bugLogger = (info) => {
  if (__DEV__) {
    console.log(info)
  } else {
    const loggingInfo = typeof info === 'object' ? JSON.stringify(info) : info
    Bugsnag.notify(loggingInfo)
  }
}

export const fakeLogin = () => {
  axios
    .post(
      'https://www.apnicabi.com/api/login',
      {
        phone: '9885098850',
        password: '9885098850',
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      console.log('fakeLogin data:', response);
    }).catch((err) => {
      console.log('fakeLogin error:', err);
    });
}

export const formattedDate = (dateString, isDateOnly = false) => {
  const originalDate = new Date(dateString)
  const format = isDateOnly ? {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  } : {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }
  return originalDate.toLocaleDateString('en-US', format).replace(/\//g, '-');
};


export const isUndefined = (arrayValues, arrayKeys, key) => {
  const index = arrayKeys?.findIndex((item) => item === key)
  return Boolean(arrayValues[index]);
}

export const getVehicleImage = (type) => {
  return type ? (VEHICLE_IMAGES[type] || images.car) : images.car
}


export const formatRideRequest = (newRequest, oldRequests) => {
  const index = oldRequests?.findIndex((item) => item.request_id === newRequest.request_id)
  if (index > -1) {
    oldRequests[index] = newRequest
  } else if (newRequest?.request_id) {
    oldRequests = [newRequest, ...(oldRequests || [])];
  }
  return oldRequests;
}

export const isDriverVerified = (driverInfo) => {
  return driverInfo?.DriverDetail?.verification_status === VerificationStatus.VERIFIED;
}


export const scheduleLocalNotification = (notfication) => {
  if (notfication) {
    Notifications?.postLocalNotification(notfication);
  }
};

export const handleDeepLink = ({ url }) => {
  if (url) {
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];
    if (routeName === 'payment') {
      navigate(ROUTES_NAMES.wallet)
    }
  }
};

// ignore event

export function isValidEvent(eventName, ignoreEvents) {
  return (
    this._callbacks !== undefined &&
    typeof this._callbacks[`$${eventName}`] !== 'undefined' &&
    ignoreEvents.indexOf(eventName) === -1
  );
}


// unflattern forground notfication to get notficationobj
export const unflattenObj = (obj, key) => {
  const result = {};
  for (const key in obj) {
    set(result, key, obj[key]);
  }
  if (key) {
    return get(result, key, null)
  }
  return result || null;
}


export const formatTransactions = (transactionHistory) => {
  if (transactionHistory?.length) {
    const groupedTransactions = transactionHistory.reduce((acc, transaction) => {
      const requestId = transaction.request_id || ''; // If requestId is empty, set it to ''
      if (!acc[requestId]) {
        acc[requestId] = { request_id: requestId, transactions: [] };
      }
      acc[requestId].transactions.push(transaction);
      return acc;
    }, {});

    // Convert grouped transactions object to array
    return Object.values(groupedTransactions);
  }
  return []
}

export const formatStatusText = (status) => {
  return RIDE_STATUS_LABELS[status]
}

export const extractKeys = (fullDetails, keysToExtract) => {
  return keysToExtract.reduce((newObj, key) => {
    if (fullDetails?.hasOwnProperty(key) && !isEmpty(fullDetails[key])) {
      newObj[key] = fullDetails[key];
    }
    return newObj;
  }, {});
}

export const cleanFormattedAddress = (formattedAddress) => {
  // Regular expression to match Plus Codes (e.g., 7Q3J+3M or X123+456 Area, City)
  const plusCodeRegex = /^[A-Z0-9]{4,}\+?[A-Z0-9]*,\s*/;

  // Remove the Plus Code from the address
  return formattedAddress.replace(plusCodeRegex, "").trim();
}

export const mergeObjectsWithoutDuplicates = (array1, array2, key) => {
  const mergedArray = [
    ...array1,
    ...array2
  ].reduce((map, obj) => map.set(obj[key], obj), new Map());
  return [...mergedArray.values()];
}


/**
 * Utility function to debounce submit handlers.
 * @param {Function} handler - The original submit handler.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} - A debounced version of the handler.
 */
export const debounceHandler = (handler, delay = 10000) => {
  return debounce((...args) => {
    handler(...args);
  }, delay);
};

// "1.2.5" vs "1.3.0" -> -1 (left is smaller)
// returns -1, 0, 1
export const compareVersion = (a, b) => {
  const pa = a.split('.').map(n => parseInt(n, 10));
  const pb = b.split('.').map(n => parseInt(n, 10));
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i++) {
    const na = pa[i] != null ? pa[i] : 0;
    const nb = pb[i] != null ? pb[i] : 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
};


