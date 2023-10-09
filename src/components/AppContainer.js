import React, { Component } from "react";
import { PermissionsAndroid, Platform } from "react-native";

function AppContainer(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                latitude: null,
                longitude: null,
            };
        }

        componentWillUnmount() {
            navigator.geolocation.clearWatch(this.watchId);
        }

        async checkAndroidPermissions() {
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

        async componentDidMount() {
            //Get current location and set initial region to this
            let granted = false;
            if (Platform.OS === "ios") {
                granted = true;
            } else {
                granted = await this.checkAndroidPermissions();
            }
            if (granted)
                this.watchId = navigator.geolocation.watchPosition(
                    position => {
                        this.setState({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    error => console.log(error),
                    { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
                );
        }


        render() {
            return (
                <WrappedComponent
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                />
            );
        }
    };
}

export default AppContainer;
