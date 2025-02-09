import { useCallback, useEffect, useState } from "react";
import { useDriverRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import { useFocusEffect } from '@react-navigation/native';

const PageSize = 4;

export default () => {
    const [page, setPage] = useState(1);
    const [rides, setRides] = useState([]);
    const { data: rideHistory, error: rideHistoryError, isFetching } = useDriverRideHistoryQuery({ page, pageSize: PageSize });

    useFocusEffect(
        useCallback(() => {
            setPage(1);
            setRides([]);
        }, [])
    );

    useEffect(() => {
        if (rideHistory?.rows?.length) {
            setRides((prevRideHistory) => ([...prevRideHistory, ...rideHistory?.rows]));
        }
    }, [rideHistory]);


    const loadMore = useCallback(() => {
        if (!isFetching && rideHistory?.count >= (page * PageSize)) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [isFetching, rideHistory]);

    const rideHistoryKeys = {
        name: '',
        status: 'status',
        from: 'from_location',
        to: 'to_location',
        model: '',
        rideTime: 'RequestRides.start_time',
        avatar: '',
        fare: 'RequestRides.fare'
    }
    return (
        <MyRidePage data={rides || []} keys={rideHistoryKeys} loadMore={loadMore} isFetching={isFetching} />
    )
}