import { StyleSheet, Text, View, PermissionsAndroid, Button, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
const ForegroundLocationTrack = () => {
    useEffect(() => {
        requestLocationPermission();
        updateForeground();
        Notification();
        startTracking();
        // Clear watch position when the component unmounts
        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);
    let watchId = null;
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'App needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location permission granted');
            } else {
                console.log('Location permission denied');
            }
            const backgroundGranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                {
                    title: 'Background Location Permission',
                    message: 'We need access to your location for background tracking.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Background location permission granted');
            } else {
                console.log('Background location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const updateForeground = () => {
        ReactNativeForegroundService.add_task(() => startTracking(), {
            delay: 100,
            onLoop: true,
            taskId: "taskid",
            onError: (e) => console.log(`Error logging:`, e),
        });
    };
    const Notification = () => {
        ReactNativeForegroundService.start({
            id: 1244,
            title: 'Location Tracking',
            message: 'Location Tracking',
            icon: 'ic_launcher',
            button: false,
            button2: false,
            setOnlyAlertOnce: true,
            color: '#000000',
        });
    };
    const startTracking = async () => {
        watchId = Geolocation.watchPosition(
            position => {
                let x = [position.coords.longitude, position.coords.latitude];
                console.warn("xxxjjj", Platform.OS, x);
            },
            error => {
                console.log('maperror in getting location', error.code, error.message);
            },
            { enableHighAccuracy: true, distanceFilter: 0 },
        );
    };
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text style={{ color: 'red', fontWeight: '600', fontSize: 20, margin: 30 }}>Location Tracking</Text>
            <Button onPress={Notification} title='Start Tracking' />
        </View>
    );
};
export default ForegroundLocationTrack;
const styles = StyleSheet.create({});