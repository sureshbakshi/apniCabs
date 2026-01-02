import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
    View,
    Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { getScreen } from '../util';
import { ImageView } from './common';
import { mapStyle } from '../styles/googleMapStyle';
import { styles } from '../styles/RideMapStyles';
import { useFocusEffect } from '@react-navigation/native';

const { screenWidth, screenHeight } = getScreen();
const ASPECT_RATIO = screenWidth / (screenHeight - 530);
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.00;

const RideMap = ({ from_details, to_details }) => {
    const mapRef = useRef(null);
    const isMapReady = useRef(false);


    // Memoize coordinates
    const fromCoordinate = useMemo(() => ({
        latitude: Number(from_details.latitude) + SPACE,
        longitude: Number(from_details.longitude) + SPACE,
    }), [from_details.latitude, from_details.longitude]);

    const toCoordinate = useMemo(() => ({
        latitude: Number(to_details.latitude) - SPACE,
        longitude: Number(to_details.longitude) - SPACE,
    }), [to_details.latitude, to_details.longitude]);

    const fitToMarkers = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.fitToCoordinates([fromCoordinate, toCoordinate], {
                edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                animated: false,  // No animation on tab switch
            });
        }
    }, [fromCoordinate, toCoordinate]);

    const handleMapReady = useCallback(() => {
        isMapReady.current = true;
        setTimeout(fitToMarkers, 100);
    }, [fitToMarkers]);

    // ✅ Refit when tab gains focus
    useFocusEffect(
        useCallback(() => {
            if (isMapReady.current) {
                setTimeout(fitToMarkers, 150);
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
            >
                <Marker
                    coordinate={fromCoordinate}
                    title={from_details.title}
                    description={from_details.description}
                >
                    <ImageView
                        source={from_details.image}
                        style={styles.markerImageLarge}
                    />
                </Marker>
                <Marker
                    coordinate={toCoordinate}
                    title={to_details.title}
                    description={to_details.description}
                >
                    <ImageView
                        source={to_details.image}
                        style={styles.markerImageSmall}
                    />
                </Marker>
            </MapView>
        </View>
    );
};

// Custom comparison to prevent re-renders if coordinates haven't changed
const arePropsEqual = (prevProps, nextProps) => {
    return (
        prevProps.from_details.latitude === nextProps.from_details.latitude &&
        prevProps.from_details.longitude === nextProps.from_details.longitude &&
        prevProps.to_details.latitude === nextProps.to_details.latitude &&
        prevProps.to_details.longitude === nextProps.to_details.longitude
    );
};

export default React.memo(RideMap, arePropsEqual);
