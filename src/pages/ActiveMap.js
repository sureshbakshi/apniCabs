import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { getScreen, isDriver } from '../util';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import { ImageView } from '../components/common';
import images from '../util/images';

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const { screenWidth, screenHeight } = getScreen();
const ASPECT_RATIO = screenWidth / (screenHeight - 530);
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const markerIDs = ['Marker1', 'Marker2'];
const timeout = 4000;
let animationTimeout;

const ActiveMapPage = ({ activeRequest }) => {
  const isDriverLogged = isDriver();
  const { getCurrentLocation, location } = useGetCurrentLocation(isDriverLogged);
  const { driverLocation } = useSelector(state => state.user);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!location.latitude) {
      getCurrentLocation();
    }
  }, [location]);

  const focusMap = (markers) => {
    console.log('focusMap')
    mapRef.current.fitToSuppliedMarkers(markers,{
      animated: true,
      edgePadding:
      {
        top: 150,
        right: 100,
        bottom: 150,
        left: 100
      }
    });
  };

  const focus = () => {
    // animationTimeout = setTimeout(() => {
    focusMap(markerIDs);
    // }, timeout);
  };

  useEffect(() => {
    if (driverLocation?.latitude) {
      // animationTimeout = setTimeout(() => {
      focus();
      // }, timeout);
    }
    // return () => {
    //   if (animationTimeout) {
    //     clearTimeout(animationTimeout);
    //   }
    // };
  }, [driverLocation,location,mapRef]);

  console.log({ location, driverLocation });

  return (
    <View style={styles.container}>
      {driverLocation?.latitude && (
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: Number(driverLocation?.latitude),
            longitude: Number(driverLocation?.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onMapReady={()=>focusMap(markerIDs)}
          customMapStyle={mapStyle}>
          <Marker
            identifier="Marker1"
            title={"Driver"}
            description={"Your driver is here!"}
            coordinate={{
              latitude: driverLocation?.latitude + SPACE,
              longitude: driverLocation?.longitude + SPACE,
            }}>
            <ImageView
              source={images.carYellow}
              style={{ minHeight: 5, minWidth: 5, height: 40, width: 40 }}
            />
          </Marker>
          <Marker
            identifier="Marker2"
            title={"User"}
            description={"Your are here!"}
            coordinate={{
              latitude: location?.latitude - SPACE,
              longitude: location?.longitude - SPACE,
            }}
          >
            <ImageView source={images.pin} style={{ minHeight: 5, minWidth: 5, height: 30, width: 30 }} />
          </Marker>
        </MapView>
      )}
    </View>
  );
};
export default ActiveMapPage;

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
