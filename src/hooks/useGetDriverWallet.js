import { useDispatch, useSelector } from "react-redux";
import { useGetDriverWalletMutation, useGetDriverWalletQuery, useLazyGetDriverWalletQuery } from "../slices/apiSlice";
import { setDriverWallet } from "../slices/driverSlice";
import { _isDriverOffline } from "../util";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default useGetDriverWallet = (options, isCb = false) => {
    const driverInfo = useSelector(state => state.auth.driverInfo);
    const isOffline = _isDriverOffline();
    const dispatch = useDispatch()
    const[refetchWallet] = useGetDriverWalletMutation({ id: driverInfo?.id , sessionId: Math.random()}, { skip: isOffline || driverInfo?.id, refetchOnMountOrArgChange: true,fetchPolicy: "cache-and-network",nextFetchPolicy: "network-only", ...options });

    const fetchWallet = async() => {
        refetchWallet({ id: driverInfo?.id }, { force: true }).unwrap().then((wallet) =>{
            dispatch(setDriverWallet(wallet))
        })
    }
    useFocusEffect(
        useCallback(() => {
            if (!isOffline && driverInfo?.id) {
                fetchWallet()
            }
        }, [])
    );

    if (isCb) {
        return fetchWallet
    }

} 