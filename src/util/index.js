import { Dimensions } from 'react-native';
import axios from 'axios';
import Config from "../util/config";
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { DriverAvailableStatus, USER_ROLES, VEHICLE_IMAGES, VerificationStatus } from '../constants';
import { store } from '../store';
import images from './images';
import { Notifications } from 'react-native-notifications';


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
  Toast.show({
    type: 'error',
    text1: msg || 'Something Went Wrong. Please try again!',
    position: 'bottom',
    visibilityTime: 2000,
    autoHide: true,
  });
}

export const showSuccessMessage = (msg) => {
  Toast.show({
    type: 'success',
    text1: msg || 'Success!',
    position: 'bottom',
  })
}

export const calculateDistance = async (orgLat, orgLon, destLat, destLong) => {
  try {
    const apiKey = getConfig().GOOGLE_PLACES_KEY;
    const mode = 'driving'; // Set mode to 'bicycling' for bike transport
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${orgLat},${orgLon}&destinations=${destLat},${destLong}&mode=${mode}&key=${apiKey}`;

    const response = await axios.get(url);
    const { rows, status } = response.data;

    if (rows && rows.length > 0 && rows[0].elements.length && status === "OK") {
      const firstRoute = rows[0].elements[0]
      return { distance: firstRoute.distance, duration: firstRoute.duration };
    } else {
      return new Error('Distance calculation error');
    }
  } catch (error) {
    console.error('Error calculating distance:', error);
    return new Error('Error calculating distance');
  }
};

export const Capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const _isDriverOnline = () => {
  const { isOnline } = store.getState().driver
  return Boolean(isOnline !== DriverAvailableStatus.OFFLINE)
}

export const _isLoggedIn = () => {
  const { userInfo } = store.getState().auth

  return Boolean(userInfo?.id)
}
export const getUserId = () => {
  const { userInfo } = store.getState().auth
  return userInfo?.id
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

export const formattedDate = (dateString, isDateOnly=false) => {
  const originalDate = new Date(dateString)
  const format = isDateOnly ? {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }: {
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
  const index = oldRequests?.findIndex((item) => item.id === newRequest.id)
  if (index > -1) {
    oldRequests[index] = newRequest
  } else {
    oldRequests = [newRequest,...oldRequests ];
  }
  return oldRequests;
}

export const isDriverVerified =(driverInfo)=>{
  return driverInfo?.driver_detail?.verification_status === VerificationStatus.VERIFIED;
}

export const scheduleLocalNotification = (title, message, data = {}) => {
  const options = {
    title,
    body: message,
    data,
  };
  console.log('scheduleLocalNotification', Notifications)

  Notifications?.postLocalNotification(options);
};
