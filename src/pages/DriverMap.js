import React from 'react';
import { getVehicleImage } from '../util';
import images from '../util/images';
import { RideStatus } from '../constants';
import useGetDriverLocation from '../hooks/useGetDriverLocation';
import RideMap from './RideMap';
import { useSelector } from 'react-redux';

const DriverMap = ({ activeRequestInfo }) => {
    const location = useGetDriverLocation()
    const { driverInfo } = useSelector(state => state.auth);
    const isAccepted = activeRequestInfo.status === RideStatus.ACCEPTED
    const vehicleCode = driverInfo?.Vehicle?.VehicleType?.code;
    const from_details = {
        latitude: Number(location?.latitude),
        longitude: Number(location?.longitude),
        title: 'You are here',
        description: isAccepted ? '' : activeRequestInfo?.from,
        image: getVehicleImage(vehicleCode) || images.pin
    }

    const to_details = {
        latitude: isAccepted ? Number(activeRequestInfo?.from_latitude) : Number(activeRequestInfo?.to_latitude),
        longitude: isAccepted ? Number(activeRequestInfo?.from_longitude) : Number(activeRequestInfo?.to_longitude),
        title: "Your destination",
        description: isAccepted ? activeRequestInfo?.from : activeRequestInfo?.to,
        image: images.pin
    }
    return (
        <RideMap from_details={from_details} to_details={to_details} />
    );
};
export default DriverMap;

