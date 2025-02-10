import { useCallback, useEffect, useState } from "react";
import { useLazyUserRideHistoryQuery, useUserRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import { useFocusEffect } from '@react-navigation/native';
import { mergeObjectsWithoutDuplicates } from "../../util";

const PageSize = 20;

export default () => {
    const [page, setPage] = useState(1);
    const [rides, setRides] = useState([]);
    const [refetch, { data: rideHistory, error: rideHistoryError, isFetching }] = useLazyUserRideHistoryQuery({ page, pageSize: PageSize });

    useFocusEffect(
        useCallback(() => {
            const fetchInitialData = async () => {
                await refetch({
                    page: 1,
                    pageSize: PageSize
                });
            };
            fetchInitialData();
            return () => {
                setPage(1);
                setRides([]);
            };
        }, [refetch])
    );


    useEffect(() => {
        if (rideHistory?.rows?.length && rides.length <= page * PageSize) {
            setRides((prevRideHistory) => mergeObjectsWithoutDuplicates(prevRideHistory, rideHistory?.rows, 'id'));
        }
    }, [isFetching, rideHistory]);

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