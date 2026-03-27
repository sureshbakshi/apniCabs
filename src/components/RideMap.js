import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
    View,
    Platform,
    Animated,
    Easing,
} from 'react-native';
import MapView, { Marker, AnimatedRegion, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { getScreen } from '../util';
import { ImageView } from './common';
import { mapStyle } from '../styles/googleMapStyle';
import { styles } from '../styles/RideMapStyles';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, LOCATION_CONFIG } from '../constants';
import OpenMapButton from './common/OpenMapButton';

const { screenWidth, screenHeight } = getScreen();
const ASPECT_RATIO = screenWidth / (screenHeight - 530);
const LATITUDE_DELTA = LOCATION_CONFIG.LATITUDE_DELTA;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = LOCATION_CONFIG.SPACE;
const MARKER_ANCHOR = { x: 0.5, y: 0.5 };
const EDGE_PADDING = { top: 150, right: 50, bottom: 50, left: 50 };

const isCoordinateInRegion = (coordinate, region) => {
    if (!region) return true;
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const minLat = latitude - latitudeDelta / 2;
    const maxLat = latitude + latitudeDelta / 2;
    const minLng = longitude - longitudeDelta / 2;
    const maxLng = longitude + longitudeDelta / 2;

    return (
        coordinate.latitude >= minLat &&
        coordinate.latitude <= maxLat &&
        coordinate.longitude >= minLng &&
        coordinate.longitude <= maxLng
    );
};

const getBearing = (startLat, startLng, destLat, destLng) => {
    const startLatRad = (startLat * Math.PI) / 180;
    const startLngRad = (startLng * Math.PI) / 180;
    const destLatRad = (destLat * Math.PI) / 180;
    const destLngRad = (destLng * Math.PI) / 180;

    const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
    const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
        Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
};

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const RideMap = ({ from_details, to_details, isDriver = false }) => {
    const mapRef = useRef(null);
    const fromMarkerRef = useRef(null);

    const latestFromDetails = useRef(from_details);
    const latestToDetails = useRef(to_details);
    latestFromDetails.current = from_details;
    latestToDetails.current = to_details;

    const isMapReady = useRef(false);
    const prevFromDetails = useRef(from_details);
    const lastHeading = useRef(from_details.heading || 0);
    const rotation = useRef(new Animated.Value(from_details.heading || 0)).current;
    const [tracksViewChanges, setTracksViewChanges] = useState(true);

    const regionRef = useRef({
        latitude: Number(from_details.latitude),
        longitude: Number(from_details.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [from_details.image, to_details.image]);


    const lastUpdateTime = useRef(Date.now());

    // Use AnimatedRegion for smooth animation
    const fromCoordinate = useRef(new AnimatedRegion({
        latitude: Number(from_details.latitude) + SPACE,
        longitude: Number(from_details.longitude) + SPACE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    })).current;

    const toCoordinate = useRef(new AnimatedRegion({
        latitude: Number(to_details.latitude) - SPACE,
        longitude: Number(to_details.longitude) - SPACE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    })).current;

    const fitToMarkers = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.fitToCoordinates([
                { latitude: Number(latestFromDetails.current.latitude) + SPACE, longitude: Number(latestFromDetails.current.longitude) + SPACE },
                { latitude: Number(latestToDetails.current.latitude) - SPACE, longitude: Number(latestToDetails.current.longitude) - SPACE }
            ], {
                edgePadding: EDGE_PADDING,
                animated: true,
            });
        }
    }, []);

    // Animate driver marker
    useEffect(() => {
        const newLat = Number(from_details.latitude) + SPACE;
        const newLng = Number(from_details.longitude) + SPACE;
        const now = Date.now();
        const timeDiff = now - lastUpdateTime.current;

        // Calculate rotation
        let newHeading = from_details.heading;
        if (newHeading === undefined || newHeading === 0) {
            if (prevFromDetails.current.latitude !== from_details.latitude || prevFromDetails.current.longitude !== from_details.longitude) {
                newHeading = getBearing(
                    prevFromDetails.current.latitude,
                    prevFromDetails.current.longitude,
                    from_details.latitude,
                    from_details.longitude
                );
            }
        }

        if (newHeading !== undefined) {
            const dist = getDistance(
                prevFromDetails.current.latitude,
                prevFromDetails.current.longitude,
                from_details.latitude,
                from_details.longitude
            );

            // Calculate shortest rotation path
            let diff = newHeading - lastHeading.current;
            while (diff > 180) diff -= 360;
            while (diff < -180) diff += 360;
            const headingDiff = Math.abs(diff);

            // Update criteria:
            // 1. Significant distance (> 5m)
            // 2. Significant heading change (> 10deg)
            // 3. Time interval (> 2000ms) to ensure eventual consistency
            const isSignificantMove = dist > LOCATION_CONFIG.MIN_DISTANCE_FOR_UPDATE;
            const isSignificantTurn = headingDiff > LOCATION_CONFIG.MIN_HEADING_CHANGE;
            const isTimeThreshold = timeDiff > LOCATION_CONFIG.MIN_TIME_BETWEEN_UPDATES;

            if (!isSignificantMove && !isSignificantTurn && !isTimeThreshold) {
                // Skip update to prevent jitter from small GPS noise
                return;
            }


            const animateTo = lastHeading.current + diff;
            lastHeading.current = animateTo;

            Animated.timing(rotation, {
                toValue: animateTo,
                duration: LOCATION_CONFIG.ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }

        lastUpdateTime.current = now;
        prevFromDetails.current = from_details;

        fromCoordinate.timing({
            latitude: newLat,
            longitude: newLng,
            duration: LOCATION_CONFIG.ANIMATION_DURATION,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        // Check if driver is still visible in the current region
        if (regionRef.current) {
            const isVisible = isCoordinateInRegion({
                latitude: newLat,
                longitude: newLng
            }, regionRef.current);

            if (!isVisible) {
                fitToMarkers();
            }
        }
    }, [from_details.latitude, from_details.longitude, from_details.heading, fitToMarkers]);

    // Animate destination marker
    useEffect(() => {
        const newLat = Number(to_details.latitude) - SPACE;
        const newLng = Number(to_details.longitude) - SPACE;

        toCoordinate.timing({
            latitude: newLat,
            longitude: newLng,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [to_details.latitude, to_details.longitude]);

    const handleMapReady = useCallback(() => {
        isMapReady.current = true;
        setTimeout(fitToMarkers, 500);
    }, [fitToMarkers]);

    // ✅ Refit when tab gains focus
    useFocusEffect(
        useCallback(() => {
            if (isMapReady.current) {
                setTimeout(fitToMarkers, 500);
            }
        }, [fitToMarkers])
    );

    if (!from_details.latitude || !to_details.longitude) {
        return null;
    }

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
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                onMapReady={handleMapReady}
                onRegionChangeComplete={(region) => {
                    regionRef.current = region;
                }}
            >
                <Marker.Animated
                    ref={fromMarkerRef}
                    coordinate={fromCoordinate}
                    title={from_details.title}
                    description={from_details.description}
                    rotation={rotation}
                    flat={true}
                    anchor={MARKER_ANCHOR}
                    tracksViewChanges={tracksViewChanges}
                >
                    <ImageView
                        source={from_details.image}
                        style={styles.markerImageLarge}
                        resizeMode="contain"
                    />
                </Marker.Animated>
                <Marker.Animated
                    coordinate={toCoordinate}
                    title={to_details.title}
                    description={to_details.description}
                    tracksViewChanges={tracksViewChanges}
                >
                    <ImageView
                        source={to_details.image}
                        style={styles.markerImageSmall}
                    />
                </Marker.Animated>
            </MapView>
            {isDriver && <View style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1000 }}>
                <OpenMapButton title=''
                    buttonStyles={{
                        height: 40, width: 40, borderRadius: 20,
                        minWidth: 'auto', backgroundColor: COLORS.secondary_blue,
                        padding: 0,
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                    }}
                    contentContainerStyles={{ padding: 0 }}
                    iconStyles={{ paddingRight: 0 }}
                    fromLocation={from_details}
                    toLocation={to_details} />
            </View>}
        </View>
    );
};

// Custom comparison to prevent re-renders if coordinates haven't changed
const arePropsEqual = (prevProps, nextProps) => {
    return (
        prevProps.from_details.latitude === nextProps.from_details.latitude &&
        prevProps.from_details.longitude === nextProps.from_details.longitude &&
        prevProps.from_details.heading === nextProps.from_details.heading &&
        prevProps.from_details.image === nextProps.from_details.image &&
        prevProps.to_details.latitude === nextProps.to_details.latitude &&
        prevProps.to_details.longitude === nextProps.to_details.longitude &&
        prevProps.to_details.image === nextProps.to_details.image
    );
};

export default React.memo(RideMap, arePropsEqual);
