import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getScreen } from '../util';
import { debounce } from 'lodash';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useSelector } from 'react-redux'; // Fetch real-time driver location from store
import config from '../util/config';

const mapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] }, // Lighter background for map
    { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] }, // Lighter label text
    { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] }, // Lighter label stroke

    // Locality labels
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#2e2e2e' }], // Darker color for locality text
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#2e2e2e' }], // Darker color for POI text
    },

    // Parks
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#a8d08d' }], // Light green for parks
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4c9a2a' }], // Dark green text for parks
    },

    // Roads (lighter colors)
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#d9d9d9' }], // Light grey for roads
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#c0c0c0' }], // Lighter road borders
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#666666' }], // Lighter grey text for road labels
    },

    // Highway (lighter colors)
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#f4e1a1' }], // Very light yellow for highways
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#d1d1a3' }], // Lighter highway stroke
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4d4d4d' }], // Darker text for highway labels
    },

    // Transit
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#d0d0d0' }], // Light grey for transit
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3c3c3c' }], // Dark grey text for transit stations
    },

    // Water
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#b0c4de' }], // Light blue for water
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3f4e5c' }], // Darker text for water labels
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#ffffff' }], // Light stroke for water labels
    },
];

const { screenWidth, screenHeight } = getScreen();
const ASPECT_RATIO = screenWidth / (screenHeight - 530);
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const markerIDs = ['Marker1', 'Marker2'];

const RideMap = ({ from_details, to_details }) => {
    const mapRef = useRef(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    // Animated values
    const vehicleLat = useSharedValue(from_details.latitude);
    const vehicleLng = useSharedValue(from_details.longitude);
    const vehicleRotation = useSharedValue(0);
    const previousLocation = useSharedValue(from_details);

    // **Fetch Route from Google Directions API**
    const fetchRoute = async () => {
        try {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from_details.latitude},${from_details.longitude}&destination=${to_details.latitude},${to_details.longitude}&key=${config.GOOGLE_PLACES_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
console.log('===============directions data', data)
            if (data.routes.length > 0) {
                const points = data.routes[0].overview_polyline.points;
                setRouteCoordinates(decodePolyline(points));
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    // **Decode Google Polyline**
    const decodePolyline = (encoded) => {
        let points = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let shift = 0, result = 0;
            let byte;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            lat += (result & 1) ? ~(result >> 1) : (result >> 1);

            shift = 0, result = 0;
            do {
                byte = encoded.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
            lng += (result & 1) ? ~(result >> 1) : (result >> 1);

            points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return points;
    };

    useEffect(() => {
        fetchRoute();
    }, [from_details]);

    // **Smooth Vehicle Animation on Real-Time Updates**
    useEffect(() => {
        if (from_details) {
            vehicleLat.value = withTiming(from_details.latitude, { duration: 1000 });
            vehicleLng.value = withTiming(from_details.longitude, { duration: 1000 });

            vehicleRotation.value = withTiming(getBearing(previousLocation.value, from_details), { duration: 500 });
            previousLocation.value = from_details;
        }
    }, [from_details]);

    // **Calculate Vehicle Rotation Angle**
    const getBearing = (start, end) => {
        if (!start || !end) return 0;
        const dLon = end.longitude - start.longitude;
        const y = Math.sin(dLon) * Math.cos(end.latitude);
        const x = Math.cos(start.latitude) * Math.sin(end.latitude) -
                  Math.sin(start.latitude) * Math.cos(end.latitude) * Math.cos(dLon);
        return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${vehicleRotation.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                ref={mapRef}
                initialRegion={{
                    latitude: from_details.latitude,
                    longitude: from_details.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
                customMapStyle={mapStyle}
                provider={PROVIDER_GOOGLE}
            >
                {/* Route Polyline */}
                {routeCoordinates.length > 0 && (
                    <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
                )}

                {/* Pickup Location Marker */}
                <Marker
                    identifier={markerIDs[0]}
                    title={from_details.title}
                    description={from_details.description}
                    coordinate={{ latitude: from_details.latitude, longitude: from_details.longitude }}
                >
                    <Image source={from_details.Image} style={styles.markerIcon} />
                </Marker>

                {/* Destination Marker */}
                <Marker
                    identifier={markerIDs[1]}
                    title={to_details.title}
                    description={to_details.description}
                    coordinate={{ latitude: to_details.latitude, longitude: to_details.longitude }}
                >
                    <Image source={to_details.Image} style={styles.markerIcon} />
                </Marker>

                {/* Animated Vehicle Marker */}
                <Marker coordinate={{ latitude: vehicleLat.value, longitude: vehicleLng.value }}>
                    <Animated.View style={animatedStyle}>
                        <Image source={from_details.Image} style={styles.carIcon} />
                    </Animated.View>
                </Marker>
            </MapView>
        </View>
    );
};

export default RideMap;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerIcon: {
        width: 40,
        height: 40,
    },
    carIcon: {
        width: 50,
        height: 50,
    },
});
