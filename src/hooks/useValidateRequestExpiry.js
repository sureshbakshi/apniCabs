import moment from "moment";
import { useRequestAlertHandler } from "./useActiveRequestBackHandler";
import { useSelector } from "react-redux";
import { delay } from 'lodash';

const expiryTime = 5;
export default useValidateRequestExpiry = () => {
    const { rideRequests } = useSelector(state => state.user);
    const { requestAlertHandler } = useRequestAlertHandler('Alert!','Would like to cancel the request due to prolonged inactivity.');

    const _validateRequestExpiry = () => {
        const __startTime = rideRequests?.created_at;
        if (__startTime) {
            const __endTime = moment();
            const __duration = moment.duration(__endTime.diff(__startTime));
            const __minutes = __duration.minutes();
            if (__minutes >= expiryTime) {
                requestAlertHandler();
            }
        }
    }
    const validateRequestExpiry = () => delay(() => _validateRequestExpiry(), 100)
    return { validateRequestExpiry }

}