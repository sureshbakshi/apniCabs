import React, { useMemo } from 'react';
import { getVehicleImage } from '../util';
import images from '../util/images';
import { RideStatus } from '../constants';
import useGetDriverLocation from '../hooks/useGetDriverLocation';
import RideMap from '../components/RideMap';
import { useSelector } from 'react-redux';

// DriverMap.jsx - Memoize the coordinate objects
const DriverMap = React.memo(({ activeRequestInfo }) => {
    const location = useGetDriverLocation();
    const { driverInfo } = useSelector(state => state.auth);

    const isAccepted = activeRequestInfo.status === RideStatus.ACCEPTED;
    const vehicleCode = driverInfo?.Vehicle?.VehicleType?.code;

    // ✅ Memoize these objects to prevent RideMap re-renders
    const from_details = useMemo(() => ({
        latitude: Number(location?.latitude) || 0,
        longitude: Number(location?.longitude) || 0,
        title: 'You are here',
        description: isAccepted ? '' : activeRequestInfo?.from,
        image: getVehicleImage(vehicleCode) || images.pin
    }), [location?.latitude, location?.longitude, isAccepted, activeRequestInfo?.from, vehicleCode]);

    const to_details = useMemo(() => ({
        latitude: isAccepted ? Number(activeRequestInfo?.from_latitude) : Number(activeRequestInfo?.to_latitude),
        longitude: isAccepted ? Number(activeRequestInfo?.from_longitude) : Number(activeRequestInfo?.to_longitude),
        title: "Your destination",
        description: isAccepted ? activeRequestInfo?.from : activeRequestInfo?.to,
        image: images.pin
    }), [activeRequestInfo?.from_latitude, activeRequestInfo?.from_longitude,
    activeRequestInfo?.to_latitude, activeRequestInfo?.to_longitude,
    activeRequestInfo?.from, activeRequestInfo?.to, isAccepted]);

    return (activeRequestInfo?.from_longitude && activeRequestInfo?.to_longitude)
        ? <RideMap from_details={from_details} to_details={to_details} />
        : null;
}, (prev, next) => {
    // Custom equality - only re-render if coordinates actually changed
    return prev.activeRequestInfo?.id === next.activeRequestInfo?.id &&
        prev.activeRequestInfo?.status === next.activeRequestInfo?.status;
});

export default DriverMap;

