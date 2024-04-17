import * as React from 'react';
import {Button, View, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { navigate } from '../util/navigationService';
import { Text } from './common';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};


export const requestExactAlarmPermission = async() =>{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SCHEDULE_EXACT_ALARM,
      {
        title: 'Permission Request',
        message: 'This app requires access to schedule exact alarms.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Exact alarm permission granted');
    } else {
      console.log('Exact alarm permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}


const GeoLocationScreen = () => {
  const [location, setLocation] = React.useState(false);

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };

  React.useEffect(() => {
    getLocation();
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#eeceff',
        padding: 5,
      }}>
      <Button
        title="Go to Home"
        onPress={() => navigate('Home')}
      />
      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>
    </View>
  );
};
export default GeoLocationScreen;
