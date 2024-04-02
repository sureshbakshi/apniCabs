import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
import { checkAndroidPermissions, defaultOptions, getLocation } from "../util/location";
let watchId = undefined;

export default () => {
    const [location, setLocation] = useState({
        latitude: '',
        longitude: '',
        city: '',
        address: '',
    })

    const watchPosition = async () => {
        let granted = false;
        if (Platform.OS === 'ios') {
            await Geolocation.setRNConfiguration({
                authorizationLevel: 'always' //always,whenInUse
            })
            await Geolocation.requestAuthorization('always')
            granted = true;
        } else {
            granted = await checkAndroidPermissions();
        }
        if (granted) {
            if (!watchId) {
                watchId = Geolocation.watchPosition(
                    async(position) => {
                        // console.log('watchPosition', position)
                       await getLocation(position.coords, setLocation);
                    },
                    error => console.log(error),
                    defaultOptions,
                );
            }
        } else {
            showErrorMessage('Please enable location service');
        }
    };

    useEffect(() => {
        //Get current location and set initial region to this
        return () => {
            if (watchId) {
                Geolocation?.clearWatch(watchId)
            }
        };
    }, []);

    return { location, watchPosition }
}