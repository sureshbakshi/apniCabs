import { useRequestAlertHandler } from "./useActiveRequestBackHandler";
import { useSelector } from "react-redux";

const expiryTime = 5;
export default useValidateRequestExpiry = () => {
    const { rideRequests } = useSelector(state => state.user);
    const { requestAlertHandler } = useRequestAlertHandler('Alert!', 'Would like to cancel the request due to prolonged inactivity.');

    const _validateRequestExpiry = () => {
        const __startTime = rideRequests?.created_at;
        if (__startTime) {
            const now = new Date().getTime();
            const start = new Date(__startTime).getTime();
            const diffInMs = now - start;
            const minutes = Math.floor(diffInMs / 60000);

            if (minutes >= expiryTime) {
                requestAlertHandler();
            }
        }
    }
    const validateRequestExpiry = () => setTimeout(_validateRequestExpiry, 1000)
    return { validateRequestExpiry }
}