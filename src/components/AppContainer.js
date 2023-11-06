import React, { Component, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { getConfig, showErrorMessage } from "../util";
import axios from "axios";
import filter from 'lodash/filter'
let watchId = undefined;

function AppContainer(WrappedComponent) {
    return (props) => {

        const [location, setLocation] = useState({
            latitude: null,
            longitude: null,
            city: null,
            formatted_address: null
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

        const getLocation = async(coords) =>{
            try {
                const apiKey = getConfig().GOOGLE_PLACES_KEY;
                const {latitude, longitude} = coords
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        
                const {data: {status, results}} = await axios.get(url);
                if(status == 'OK') {
                    const {address_components, formatted_address } = results[0] || {}
                    const address = filter(address_components, {
                        types: ['locality'],
                      });
                      if(address.length) {
                          const city = address[0].long_name
                          const location = {
                            latitude: latitude,
                            longitude: longitude,
                            formatted_address,
                            city
                        }
                          setLocation(location);
                      }
                
                } else {
                    return new Error('Distance calculation error');
                }
            } catch (error) {
                console.error('Error calculating distance:', error);
                return new Error('Error calculating distance');
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
                            getLocation(position.coords)
                        },
                        error => console.log(error),
                        { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000, forceRequestLocation: true, interval: 2000 * 1, useSignificantChanges: true	 }
                    );
                }else{
                    showErrorMessage('Please enable location service')
                }
            }
            watchPosition()
            return () => Geolocation?.clearWatch(watchId);
        }, [])


        return (
            <WrappedComponent currentLocation={location}/>
        );
    };
}

export default AppContainer;
