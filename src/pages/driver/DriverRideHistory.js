import { useCallback, useEffect, useState } from "react";
import { useDriverRideHistoryQuery, useLazyDriverRideHistoryQuery } from "../../slices/apiSlice";
import MyRidePage from "../MyRidesPage"
import { useFocusEffect } from '@react-navigation/native';
import { mergeObjectsWithoutDuplicates } from "../../util";

const PageSize = 20;


export default () => {
    const [page, setPage] = useState(1);
    const [rides, setRides] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [refetch, { data: rideHistory, error: rideHistoryError, isFetching }] =
        useLazyDriverRideHistoryQuery();

    // ✅ Single source of truth: refetch with page param
    const refetchHistory = useCallback(async (targetPage = 1) => {
        const result = await refetch({ page: targetPage, pageSize: PageSize }).unwrap();
        return result;
    }, [refetch]);

    // ✅ Reset on screen focus - proper sequence
    useFocusEffect(
        useCallback(() => {
            // ✅ Fire async function IMMEDIATELY inside sync callback
            const resetAndFetch = async () => {
                setPage(1);
                setRides([]);
                setHasMore(true);
                await refetchHistory(1);
            };

            resetAndFetch(); // ✅ Call async inside sync wrapper

            // ✅ Return cleanup function
            return () => {
                setPage(1);
                setRides([]);
                setHasMore(true);
            };
        }, [refetchHistory])
    );

    // ✅ Merge ONLY on successful data change (not isFetching)
    useEffect(() => {
        if (rideHistory?.rows) {
            setRides((prevRides) => {
                const newRides = mergeObjectsWithoutDuplicates(prevRides, rideHistory.rows, 'id');
                // ✅ Update hasMore based on current response
                setHasMore(rideHistory.count > newRides.length);
                return newRides;
            });
        }
    }, [rideHistory]); // ✅ Only rideHistory, not isFetching

    // ✅ Fixed loadMore - wait for current page to complete
    const loadMore = useCallback(async () => {
        if (!isFetching && hasMore && rides.length > 0) {
            const nextPage = page + 1;
            setPage(nextPage);
            await refetchHistory(nextPage);
        }
    }, [isFetching, hasMore, rides.length, page, refetchHistory]);
    const rideHistoryKeys = {
        name: '',           // ✅ Show driver name
        status: 'status',              // ✅ Ride status  
        from: 'from_location',    // ✅ Nested location name
        to: 'to_location',        // ✅ Nested location name
        model: '',        // ✅ Vehicle model
        rideTime: 'RequestRides.start_time',
        createdAt: 'created_at',
        avatar: '',       // ✅ Driver photo URL
        fare: 'RequestRides.fare'      // ✅ Total fare
    }
    return (
        <MyRidePage
            data={rides}
            keys={rideHistoryKeys}
            loadMore={loadMore}
            isFetching={isFetching}
            hasMore={hasMore}
        />
    );
};
