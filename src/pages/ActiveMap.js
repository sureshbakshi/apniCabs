import * as React from 'react';
import { View, Button, Pressable, SafeAreaView, StyleSheet, } from 'react-native';
import { ImageView, Text } from '../components/common';
import MapView, { Marker, enableLatestRenderer } from 'react-native-maps';
import images from '../util/images';
import { getScreen } from '../util';
enableLatestRenderer()

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
    stylers: [{ color: '#6398d5' }],
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

const { screenWidth, screenHeight } = getScreen()
const ASPECT_RATIO = screenWidth / (screenHeight - 530)
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

const ActiveMapPage = ({ activeRequest, currentLocation }) => {
  console.log({ currentLocation })
  let map = undefined;
  const driverMarker = {
    latitude: Number(activeRequest?.from_latitude),
    longitude: Number(activeRequest?.from_longitude),
  }
  const userMarker = {
    latitude: Number(currentLocation.latitude),
    longitude: Number(currentLocation.longitude),
  }
  const fitPadding = () => {
    map?.fitToCoordinates([driverMarker, userMarker], {
      edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
      animated: true,
    });
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={ref => {
          map = ref;
        }}
        style={styles.mapStyle}
        liteMode
        initialRegion={{
          latitude: Number(activeRequest?.from_latitude) - SPACE,
          longitude: Number(activeRequest?.from_longitude) - SPACE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        customMapStyle={mapStyle}
      >
        <Marker
          draggable={false}
          coordinate={{
            latitude: Number(activeRequest?.from_latitude),
            longitude: Number(activeRequest?.from_longitude),
          }}
          title={'Driver location'}
          description={'Your driver is here!'}
        >
          <ImageView source={images.carYellow} style={{ minHeight: 5, minWidth: 5, height: 40, width: 40 }} />
        </Marker>
        <Marker
          draggable={false}
          coordinate={{
            latitude: Number(currentLocation.latitude),
            longitude: Number(currentLocation.longitude),
          }}
          title={'User location'}
          description={'Your are here!'}
        >
          <ImageView source={images.pin} style={{ minHeight: 5, minWidth: 5, height: 30, width: 30 }} />
        </Marker>
      </MapView>
    </View>
  );
};
export default ActiveMapPage;


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 0
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0
  },
});