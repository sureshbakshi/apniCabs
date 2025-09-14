import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { getScreen, getVehicleImage, isDriver } from '../util';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import { ImageView } from '../components/common';
import images from '../util/images';
import { delay, get } from 'lodash';
import { RideStatus } from '../constants';
import useUpdateDriverLocation from '../hooks/useUpdateDriverLocation';
import useLocationWatcher from '../hooks/useLocationWatcher';
import { debounce } from 'lodash';
import useGetDriverLocation from '../hooks/useGetDriverLocation';
// Use the named export Marker
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

const ActiveMapPage = ({ activeRequestInfo }) => {
  const isDriverLogged = isDriver();
  const location = useGetDriverLocation(isDriverLogged)

  const { driverLocation } = useSelector(state => state.user);
  // console.log({ watchedLocation, driverLocation })
  const mapRef = useRef(null);
  const activeLocation = {
    latitude: isDriverLogged ? Number(location?.latitude) : Number(driverLocation?.latitude),
    longitude: isDriverLogged ? Number(location?.longitude) : Number(driverLocation?.longitude)
  }

  const to_location = {
    latitude: activeRequestInfo?.status === RideStatus.ONRIDE ? Number(activeRequestInfo?.to_latitude) : activeLocation?.latitude,
    longitude: activeRequestInfo?.status === RideStatus.ONRIDE ? Number(activeRequestInfo?.to_longitude) : activeLocation?.longitude
  }

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

  const vehicleImage = get(activeRequestInfo, 'driver.vehicle.type_vehicle_type.code', null);
  const isOnRide = activeRequestInfo.status === RideStatus.ONRIDE
  const regionLatnLng = {
    latitude: isOnRide ? activeLocation?.latitude : Number(activeRequestInfo?.from_latitude),
    longitude: isOnRide ? activeLocation?.longitude : Number(activeRequestInfo?.from_longitude),
  }
  useEffect(() => {
    if (to_location?.latitude) {
      debouncedFocusMap();
    }
  }, [to_location?.latitude, to_location?.longitude, regionLatnLng?.longitude, regionLatnLng?.latitude]);

  const isNotNaN = !isNaN(regionLatnLng?.latitude);

  // console.log({activeRequestInfo, activeLocation})
  // const routeCoordinates = [
  //   {
  //     latitude: regionLatnLng?.latitude + SPACE,
  //     longitude: regionLatnLng?.longitude + SPACE,
  //   },
  //   {
  //     latitude: Number(to_location?.latitude) - SPACE,
  //     longitude: Number(to_location?.longitude) - SPACE,
  //   }
  // ]
  return (
    <View style={styles.container}>
      {/* <View style={{ backgroundColor: 'yellow', padding: 10, position: 'absolute', zIndex: 1000, top: 0 }}>
        <Text>current location: {JSON.stringify(watchedLocation)}</Text>
        <Text>Socket ID: {isSocketConnected}</Text>
      </View> */}
      {(activeRequestInfo?.from_latitude && isNotNaN) ? (
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: isNotNaN ? regionLatnLng?.latitude : activeRequestInfo?.from_latitude,
            longitude: isNotNaN ? regionLatnLng?.longitude : activeRequestInfo?.from_longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onMapReady={() => focusMap(markerIDs)}
          customMapStyle={mapStyle}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        >
          {isNotNaN && <Marker
            identifier="Marker1"
            title={isDriverLogged ? 'Your User' : "Your are here"}
            coordinate={{
              latitude: regionLatnLng?.latitude + SPACE,
              longitude: regionLatnLng?.longitude + SPACE,
            }}>
            <ImageView
              source={(isOnRide) ? getVehicleImage(vehicleImage) : images.pin}
              style={{ minHeight: 5, minWidth: 5, height: 40, width: 40 }}
            />
          </Marker>}
          {to_location?.latitude ? <Marker
            identifier="Marker2"
            title={isDriverLogged ? "Your are here" : "Your Driver"}
            description={isDriverLogged ? `User Waiting at ${activeRequestInfo?.from}` : `On the way to ${activeRequestInfo?.from}`}
            coordinate={{
              latitude: Number(to_location?.latitude) - SPACE,
              longitude: Number(to_location?.longitude) - SPACE,
            }}
          >
            {/* <Polyline coordinates={routeCoordinates} strokeWidth={6} strokeColor="#ff0000" /> */}

            <ImageView source={(isOnRide) ? images.pin : getVehicleImage(vehicleImage)}
              style={{ minHeight: 5, minWidth: 5, height: 30, width: 30 }} />
          </Marker> : null}
        </MapView>
      ) : null}
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
