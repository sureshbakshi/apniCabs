import React from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { useTranslation } from 'react-i18next';

import CustomDialog from './CustomDialog';
import CustomButton from './CustomButton';
import DialogButtons from './DialogButtons';
import { COLORS } from '../../constants';
import { setDialogStatus, setDriverCallOptionsDialogStatus } from '../../slices/authSlice'; // adjust if you use separate action for call driver dialog
import { isDriver } from '../../util';

const driverJson = {
    title: 'contact_user',
    contact_label: 'contact_user',
    toll_free_number: '3338132188',
    toll_free_label: 'toll_free'
}
const userJson = {
    title: 'contact_driver',
    contact_label: 'contact_driver',
    toll_free_number: '3338132188',
    toll_free_label: 'toll_free'
}

const CallOptionsDialog = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isDriverLogged = isDriver();
    const { isCallDriverDialogOpen } = useSelector((state) => state.auth);
    const { activeRequestInfo } = useSelector((state) => isDriverLogged ? state.driver : state.user);
    const key = isDriverLogged ? 'user_details' : 'driver_details';

    const driverPhoneNumber = activeRequestInfo?.[key]?.phone;

    const closeModal = () => dispatch(setDriverCallOptionsDialogStatus(false));

    const callNumber = (number) => {
        if (number) {
            RNImmediatePhoneCall.immediatePhoneCall(`+91${number}`);
        }
    };
    const defaultStyles = {
        iconStyles: { paddingBottom: 10 },
        contentContainerStyles: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }
    }
    const contactInfo = isDriverLogged ? driverJson : userJson;

    return (
        <CustomDialog
            openDialog={isCallDriverDialogOpen}
            title={t(contactInfo.title)}
            actions={<DialogButtons canShowSubmit={false} closeModal={closeModal} />}
            containerStyles={{
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                padding: 0,
            }}
            modalContainerStyles={{
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                paddingHorizontal: 16,
                paddingTop: 24,
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                <View style={{ flex: 1 }}>
                    <CustomButton
                        label={t(contactInfo.toll_free_label)}
                        onClick={() => callNumber(contactInfo.toll_free_number)}
                        styles={{ backgroundColor: COLORS.button_blue_bg }}
                        iconLeft={{ name: 'cellphone', size: 'extraLarge' }}
                        {...defaultStyles}
                        isLowerCase
                    />
                </View>
                {driverPhoneNumber && <View style={{ flex: 1 }}>
                    <CustomButton
                        label={t(contactInfo.contact_label)}
                        onClick={() => callNumber(driverPhoneNumber)}
                        styles={{ backgroundColor: COLORS.button_blue_bg }}
                        iconLeft={{ name: 'phone', size: 'extraLarge' }}

                        {...defaultStyles}
                        isLowerCase
                    />
                </View>}
            </View>
        </CustomDialog>
    );
};

export default CallOptionsDialog;
