import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCancelAcceptedRequestMutation } from "../../slices/apiSlice";
import { updateRideStatus } from "../../slices/driverSlice";
import { setActiveRequest } from "../../slices/userSlice";
import { Pressable } from "react-native";
import { Text } from "react-native-paper";
import CustomDialog from "./CustomDialog";
import ActiveRidePageStyles from "../../styles/ActiveRidePageStyles";
import { COLORS } from "../../constants";
import { Icon } from "./Icon";
import delay from 'lodash/delay';
import { setDialogStatus } from "../../slices/authSlice";
import { isDriver, showErrorMessage } from "../../util";
import { useTranslation } from "react-i18next";
import DialogButtons from "./DialogButtons";

const driverReasons = [
  { message: 'Vehicle breakdown or mechanical issue', id: 1 },
  { message: 'Weather or road conditions unsafe for travel', id: 2 },
  { message: 'Inappropriate or unsafe behaviour from the passenger', id: 3 },
  { message: 'The passenger is not at the pickup location', id: 4 },
  { message: 'Attempts to contact passenger is unsuccessful.', id: 5 },
  { message: 'Incorrect pickup location', id: 6 },
]

const passengerResons = [
  { message: 'Plans changed. No longer need the ride', id: 1 },
  { message: 'Estimated arrival time too long', id: 2 },
  { message: 'Wrong destination address entered', id: 3 },
  { message: 'The driver taking too long to arrive.', id: 4 },
  { message: 'Inappropriate or unsafe behaviour from the driver', id: 5 },
  { message: 'Technical issue with app', id: 6 },
  { message: 'personal emergency. Unable to take ride.', id: 7 },

]
export const CancelReasonDialog = () => {
  const { t } = useTranslation();
  const isDriverLogged = isDriver();
  const dispatch = useDispatch();
  const intialState = isDriverLogged ? driverReasons : passengerResons
  const [message, setMessage] = useState(intialState);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [errorMsg, setErrorMessage] = useState(null);
  const { isDialogOpen, driverInfo } = useSelector(state => state.auth);
  const { activeRequestInfo, rideRequests } = useSelector((state) => isDriverLogged ? state.driver : state.user);

  const [cancelAcceptedRequest, { data: cancelAcceptedRequestData, error: cancelAcceptedRequestError, cancelAcceptedRequestDataLoading }] =
    useCancelAcceptedRequestMutation();


  const handleCancelReason = message => {
    setSelectedMessage(message);
    setErrorMessage(false);
  };

  const closeModal = () => dispatch(setDialogStatus(false));

  const closeAndClearRequest = () => {
    closeModal();
    delay(() => {
      dispatch(isDriverLogged ? updateRideStatus(cancelAcceptedRequestData) : setActiveRequest())
    }, 10)
  }

  useEffect(() => {
    if (cancelAcceptedRequestError) {
      showErrorMessage()
    } else if (cancelAcceptedRequestData) {
      closeAndClearRequest()
    }
    // else if (cancelAcceptedRequestError) {
    //   console.log({ cancelAcceptedRequestError })
    //   if (cancelAcceptedRequestError?.status === 400) {
    //     closeAndClearRequest()
    //   } else {
    //     closeModal();
    //   }
    //   closeAndClearRequest()
    //   // console.log('cancelAcceptedRequestError', cancelAcceptedRequestError)
    // }

  }, [cancelAcceptedRequestData, cancelAcceptedRequestError])
  const handleSubmit = () => {
    if (selectedMessage.id && activeRequestInfo?.id) {
      let payload = {
        "request_id": activeRequestInfo.id,
        "driver_id": isDriverLogged ? driverInfo?.id : activeRequestInfo?.driver_details?.id || activeRequestInfo?.driver_requests.driver_id,
        // "status": isDriverLogged ? RideStatus.DRIVER_CANCELLED : RideStatus.USER_CANCELLED,
        "reason": selectedMessage.message,
      }
      cancelAcceptedRequest(payload)
    } else {
      setErrorMessage(true);
      // closeAndClearRequest()
    }
  };

  return (
    <CustomDialog
      openDialog={isDialogOpen}
      actions={<DialogButtons handleSubmit={handleSubmit} closeModal={closeModal} />}
      title={t('reason_to_cancel')}
      containerStyles={{
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: 0
      }}
      modalContainerStyles={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
    >
      {message.map(item => {
        return (
          <Pressable
            key={item.id}
            style={ActiveRidePageStyles.list}
            onPress={() => handleCancelReason(item)}>
            <Icon
              name={
                selectedMessage.id === item.id
                  ? 'radiobox-marked'
                  : 'radiobox-blank'
              }
              size={'medium'}
              color={COLORS.black}
            />
            <Text style={[ActiveRidePageStyles.listTxt]}>
              {item.message}
            </Text>
          </Pressable>
        );
      })}
      {errorMsg && (
        <Text style={{ color: COLORS.primary }}>
          {t('please_select_a_reason')}
        </Text>
      )}

    </CustomDialog>
  );
};