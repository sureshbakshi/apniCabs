import React, { useEffect, useState } from 'react';
import { getVehicleImage } from '../util';
import images from '../util/images';
import get  from 'lodash/get';
import { RideStatus } from '../constants';
import RideMap from './RideMap';
import { useSelector } from 'react-redux';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';

const UserMap = ({ activeRequestInfo }) => {
    const { driverLocation, userLocation } = useSelector((state) => state.user)
    const { getUserCoordinates } = useGetCurrentLocation()
    const isAccepted = activeRequestInfo.status === RideStatus.ACCEPTED
    const vehicleCode = get(activeRequestInfo, 'driver_details.vehicle.code', null);

    useEffect(() => {
        if (!driverLocation?.latitude && !userLocation) {
            getUserCoordinates()
        }
    }, [driverLocation?.latitude, userLocation])

    const locationToUse = driverLocation?.latitude ? driverLocation : userLocation;
    const from_lat = locationToUse?.latitude
    const from_long = locationToUse?.longitude
    const from_details = {
        latitude: from_lat ? Number(from_lat) : null,
        longitude: from_long ? Number(from_long) : null,
        title: 'Your Driver is here',
        description: isAccepted ? '' : activeRequestInfo?.from,
        image: getVehicleImage(vehicleCode) || images.pin
    }

    const to_details = {
        latitude: isAccepted ? Number(activeRequestInfo?.from_latitude) : Number(activeRequestInfo?.to_latitude),
        longitude: isAccepted ? Number(activeRequestInfo?.from_longitude) : Number(activeRequestInfo?.to_longitude),
        title: isAccepted ? "You are here" : "Your destination",
        description: isAccepted ? activeRequestInfo?.from : activeRequestInfo?.to,
        image: images.pin
    }
    return (
        from_details.latitude && <RideMap from_details={from_details} to_details={to_details} />
    );
};
export default UserMap;

