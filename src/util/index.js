import { Dimensions } from 'react-native';
import axios from 'axios';
import Config from "../util/config";
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { USER_ROLES } from '../constants';


const getRoles = () => {
  const { userInfo } = useSelector((state) => state.auth);
return userInfo?.roles || []
}

export const isDriver = () => Boolean(getRoles()?.includes(USER_ROLES.DRIVER));
export const isOwner = () =>  Boolean(getRoles()?.includes(USER_ROLES.OWNER));
export const isUser = () => Boolean(getRoles()?.includes(USER_ROLES.USER));

export const getScreen = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
    return { screenWidth, screenHeight }
}

export const getConfig = () => {
    return Config
}

export const showErrorMessage = (msg) => {
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
        const { rows , status} = response.data;

        if (rows && rows.length > 0 && rows[0].elements.length && status === "OK") {
            const firstRoute = rows[0].elements[0]
            return {distance: firstRoute.distance, duration: firstRoute.duration};
        } else {
            return new Error('Distance calculation error');
        }
    } catch (error) {
        console.error('Error calculating distance:', error);
        return new Error('Error calculating distance');
    }
};

export const Capitalize = (str) =>{
  return str.charAt(0).toUpperCase() + str.slice(1);
  }
export const fakeLogin = ()=> {
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
    }).catch((err)=>{
      console.log('fakeLogin error:', err);
    });
}