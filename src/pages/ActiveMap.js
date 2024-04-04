import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { getScreen, getVehicleImage, isDriver } from '../util';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import { ImageView } from '../components/common';
import images from '../util/images';
import { delay, get } from 'lodash';
import { RideStatus } from '../constants';
import useUpdateDriverLocation from '../hooks/useUpdateDriverLocation';
import useLocationWatcher from '../hooks/useLocationWatcher';

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
const SPACE = 0.00;

const markerIDs = ['Marker1', 'Marker2'];

const ActiveMapPage = ({ activeRequest, activeRideId }) => {
  const isDriverLogged = isDriver();
  const { getCurrentLocation, currentLocation } = useGetCurrentLocation();
  const { watchPosition, location: watchedLocation } = useLocationWatcher();
  const location = (isDriverLogged && watchedLocation?.latitude) ? watchedLocation : currentLocation;
  const updateDriverLocationToServer = useUpdateDriverLocation()

  const { driverLocation } = useSelector(state => state.user);
  const mapRef = useRef(null);
  const activeLocation = {
    latitude: isDriverLogged ? Number(location?.latitude) : Number(driverLocation?.latitude),
    longitude: isDriverLogged ? Number(location?.longitude) : Number(driverLocation?.longitude)
  }

  const to_location = {
    latitude: activeRideId ? Number(activeRequest?.to_latitude) : activeLocation?.latitude,
    longitude: activeRideId ? Number(activeRequest?.to_longitude) : activeLocation?.longitude
  }

  useEffect(() => {
    if (!watchedLocation.latitude || !currentLocation.latitude) {
      isDriverLogged ? watchPosition() : getCurrentLocation();
    }
  }, [watchedLocation, currentLocation]);

  useEffect(() => {
    if(isDriverLogged) {
      updateDriverLocationToServer(location)
    }
  }, [location, isDriverLogged])

  const focusMap = (markers) => {
    mapRef.current?.fitToSuppliedMarkers(markers, {
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
    focusMap(markerIDs);
  };

  useEffect(() => {
    if (to_location?.latitude) {
      delay(() => {
        focus();
      }, 512)
    }
  }, [to_location, location, mapRef]);

  const vehicleImage = get(activeRequest, 'driver.vehicle.type_vehicle_type.code', null);
  const isOnRide = activeRequest.status === RideStatus.ONRIDE
  const regionLatnLng = {
    latitude: isOnRide ? activeLocation?.latitude : Number(activeRequest?.from_latitude),
    longitude: isOnRide ? activeLocation?.longitude : Number(activeRequest?.from_longitude),
  }

  return (
    <View style={styles.container}>
      {/* <View style={{ backgroundColor: 'yellow', padding: 10, position: 'absolute', zIndex: 1000, top: 0 }}>
        <Text>current location: {JSON.stringify(watchedLocation)}</Text>
        <Text>Socket ID: {isSocketConnected}</Text>
      </View> */}
      {activeRequest?.from_latitude ? (
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: regionLatnLng.latitude,
            longitude: regionLatnLng.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onMapReady={() => focusMap(markerIDs)}
          // customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            identifier="Marker1"
            title={isDriverLogged ? 'Your User' : "Your are here"}
            coordinate={{
              latitude: regionLatnLng.latitude + SPACE,
              longitude: regionLatnLng.longitude + SPACE,
            }}>
            <ImageView
              source={(isOnRide) ? getVehicleImage(vehicleImage) : images.pin}
              style={{ minHeight: 5, minWidth: 5, height: 40, width: 40 }}
            />
          </Marker>
          {to_location?.latitude ? <Marker
            identifier="Marker2"
            title={isDriverLogged ? "Your are here" : "Your Driver"}
            description={isDriverLogged ? `User Waiting at ${activeRequest?.from_location}` : `On the way to ${activeRequest?.from_location}`}
            coordinate={{
              latitude: Number(to_location?.latitude) - SPACE,
              longitude: Number(to_location?.longitude) - SPACE,
            }}
          >
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
