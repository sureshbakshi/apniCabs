import { useDispatch, useSelector } from "react-redux";
import { useLazyGetDriverWalletQuery } from "../slices/apiSlice";
import { setDriverWallet } from "../slices/driverSlice";
import { _isDriverOffline } from "../util";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default useGetDriverWallet = (options, isCb = false) => {
    const driverInfo = useSelector(state => state.auth.driverInfo);
    const isOffline = _isDriverOffline();
    const dispatch = useDispatch()
    const [refetchWallet, { data: wallet }] = useLazyGetDriverWalletQuery({ id: driverInfo?.id }, { skip: isOffline || driverInfo?.id, refetchOnMountOrArgChange: true, ...options });

    const fetchWallet = () => {
        refetchWallet({ id: driverInfo?.id }, { force: true })
    }
    // useEffect(() => {
    //     fetchWallet()
    // }, [])

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

    useEffect(() => {
        if (wallet) {
            dispatch(setDriverWallet(wallet))
        }
    }, [wallet])


} 