import React, { Component, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { showErrorMessage } from "../util";
let watchId = undefined;

function AppContainer(WrappedComponent) {
    return (props) => {

        const [location, setLocation] = useState({
            latitude: null,
            longitude: null,
        })

        const checkAndroidPermissions = async() => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Taxi App",
                        message:
                            "Taxi App needs to use your location to show routes and get taxis"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                console.warn(err);
            }
        }


        useEffect(() => {
            //Get current location and set initial region to this
            const watchPosition = async() => {
                let granted = false;
                if (Platform.OS === "ios") {
                    granted = true;
                } else {
                    granted = await checkAndroidPermissions();
                }
                if (granted) {
                    watchId = Geolocation.watchPosition(
                        position => {
                            setLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            });
                        },
                        error => console.log(error),
                        { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000, forceRequestLocation: true, interval: 2000 * 60, useSignificantChanges: true	 }
                    );
                }else{
                    showErrorMessage('Please enable location service')
                }
            }
            watchPosition()
            return () => Geolocation?.clearWatch(watchId);
        }, [])


        return (
            <WrappedComponent
                latitude={location.latitude}
                longitude={location.longitude}
            />
        );
    };
}

export default AppContainer;
