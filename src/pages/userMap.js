import React, { useEffect } from 'react';
import { getVehicleImage } from '../util';
import images from '../util/images';
import get  from 'lodash/get';
import { RideStatus } from '../constants';
import RideMap from './RideMap';
import { useSelector } from 'react-redux';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';

const UserMap = ({ activeRequestInfo }) => {
    const { driverLocation } = useSelector((state) => state.user)
    const { getCurrentLocation, currentLocation } = useGetCurrentLocation()
    const isAccepted = activeRequestInfo.status === RideStatus.ACCEPTED
    const vehicleCode = get(activeRequestInfo, 'driver_details.vehicle.code', null);

    useEffect(() => {
        if (!driverLocation?.latitude || !currentLocation) {
            getCurrentLocation()
        }
    }, [])

    const from_lat = driverLocation?.latitude || currentLocation?.latitude
    const from_long = driverLocation?.longitude || currentLocation?.longitude
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

