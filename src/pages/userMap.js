import React, { useEffect, useMemo, useCallback } from 'react';
import { getVehicleImage } from '../util';
import images from '../util/images';
import get from 'lodash/get';
import { RideStatus } from '../constants';
import RideMap from '../components/RideMap';
import { useSelector } from 'react-redux';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';

const UserMap = React.memo(({ activeRequestInfo }) => {
    const { driverLocation, userLocation } = useSelector((state) => state.user);
    const { getUserCoordinates } = useGetCurrentLocation();
    const isAccepted = activeRequestInfo.status === RideStatus.ACCEPTED;
    const vehicleCode = get(activeRequestInfo, 'driver_details.vehicle.code', null);

    // ✅ Only call location update when needed
    useEffect(() => {
        if (!driverLocation?.latitude && !userLocation) {
            getUserCoordinates();
        }
    }, [driverLocation?.latitude, userLocation, getUserCoordinates]);

    const locationToUse = driverLocation?.latitude ? driverLocation : userLocation;

    // ✅ Memoize from_details - depends only on actual location changes
    const from_details = useMemo(() => ({
        latitude: locationToUse?.latitude ? Number(locationToUse.latitude) : null,
        longitude: locationToUse?.longitude ? Number(locationToUse.longitude) : null,
        title: 'Your Driver is here',
        description: isAccepted ? '' : activeRequestInfo?.from,
        image: getVehicleImage(vehicleCode) || images.pin
    }), [
        locationToUse?.latitude,
        locationToUse?.longitude,
        isAccepted,
        activeRequestInfo?.from,
        vehicleCode
    ]);

    // ✅ Memoize to_details - stable unless ride status or destinations change
    const to_details = useMemo(() => ({
        latitude: isAccepted
            ? Number(activeRequestInfo?.from_latitude)
            : Number(activeRequestInfo?.to_latitude),
        longitude: isAccepted
            ? Number(activeRequestInfo?.from_longitude)
            : Number(activeRequestInfo?.to_longitude),
        title: isAccepted ? "You are here" : "Your destination",
        description: isAccepted ? activeRequestInfo?.from : activeRequestInfo?.to,
        image: images.pin
    }), [
        isAccepted,
        activeRequestInfo?.from_latitude,
        activeRequestInfo?.from_longitude,
        activeRequestInfo?.to_latitude,
        activeRequestInfo?.to_longitude,
        activeRequestInfo?.from,
        activeRequestInfo?.to
    ]);

    // ✅ Only render if valid coordinates exist
    if (!from_details.latitude || !to_details.latitude) {
        return null;
    }

    return <RideMap from_details={from_details} to_details={to_details} />;
}, (prev, next) => {
    // ✅ Custom equality - only re-render if ride ID or status changes
    return (prev.activeRequestInfo?.from_latitude === next.activeRequestInfo?.from_latitude &&
        prev.activeRequestInfo?.from_longitude === next.activeRequestInfo?.from_longitude &&
        prev.activeRequestInfo?.to_latitude === next.activeRequestInfo?.to_latitude &&
        prev.activeRequestInfo?.to_longitude === next.activeRequestInfo?.to_longitude &&
        prev.activeRequestInfo?.status === next.activeRequestInfo?.status
    );
});

UserMap.displayName = 'UserMap';

export default UserMap;
