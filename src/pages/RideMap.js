import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { getScreen } from '../util';
import { ImageView } from '../components/common';
import { debounce } from 'lodash';

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
const SPACE = 0.00;
const markerIDs = ['Marker1', 'Marker2'];

const RideMap = ({ from_details, to_details }) => {
    const mapRef = useRef(null);

    const focusMap = (markers) => {
        mapRef.current?.fitToSuppliedMarkers(markers, {
            animated: true,
            edgePadding:
            {
                top: 360,
                right: 100,
                bottom: 150,
                left: 100
            }
        });
    };

    const debouncedFocusMap = debounce(() => {
        focusMap(markerIDs);
    }, 2 * 1000);


    useEffect(() => {
        if (from_details.longitude) {
            debouncedFocusMap();
        }
    }, [from_details.latitude, from_details.longitude, to_details.latitude, to_details.longitude]);
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
                onMapReady={() => focusMap(markerIDs)}
                customMapStyle={mapStyle}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            >
                <Marker
                    identifier={markerIDs[0]}
                    title={from_details.title}
                    description={from_details.description}
                    coordinate={{
                        latitude: from_details.latitude + SPACE,
                        longitude: from_details.longitude + SPACE,
                    }}>
                    <ImageView
                        source={from_details.image}
                        style={{ minHeight: 5, minWidth: 5, height: 40, width: 40 }}
                    />
                </Marker>
                <Marker
                    identifier={markerIDs[1]}
                    title={to_details.title}
                    description={to_details.description}
                    coordinate={{
                        latitude: Number(to_details.latitude) - SPACE,
                        longitude: Number(to_details.longitude) - SPACE,
                    }}
                >
                    <ImageView source={to_details.image}
                        style={{ minHeight: 5, minWidth: 5, height: 30, width: 30 }} />
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
});
