import { useEffect } from "react";
import { useGetAppInfoQuery } from "../slices/apiSlice";


export const useAppInfo = () => {
    const { data: appInfo, error: appInfoError } = useGetAppInfoQuery(undefined, {
        refetchOnMountOrArgChange: true, // 👈 Fresh data on mount
        keepUnusedDataFor: 300, // 1 second cache
    });

    useEffect(() => {
        if (appInfoError) {
            console.log('appInfoError', appInfoError);
        } else if (appInfo?.length) {
            console.log('appInfo', appInfo);
        }
    }, [appInfo, appInfoError]);

    return { appInfo, appInfoError };
};

