import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { COLORS, ExpiryStatus } from '../../constants';
import FindRideStyles from '../../styles/FindRidePageStyles';
import { Text } from './Text';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import useGetDriverDetails, { } from '../../hooks/useGetDriverDetails';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from './CustomButton';
import { openOwnerPortal } from '../../util/config';
import { formattedDate, isDriverVerified } from '../../util';
import NotificationsPageStyles from '../../styles/Notifications';
import { Icon } from './Icon';
import CommonStyles from '../../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import useLogout from '../../hooks/useLogout';


const MessageInfo = () => {
    const { t } = useTranslation();
    const { logOut } = useLogout()
    const { driverInfo, userInfo } = useSelector(state => state.auth);
    const { fetchDetails } = useGetDriverDetails({ refetchOnMountOrArgChange: true }, true)

    useFocusEffect(
        useCallback(() => {
            fetchDetails();
        }, [])
    );


    console.log({ driverInfo })
    const isNotVehicleAssigned = isEmpty(driverInfo?.Vehicle)
    const message = isNotVehicleAssigned ? t('driver_update_msg') : t('user_update_msg')

    return (
        <View style={[FindRideStyles.container, { alignItems: 'center', justifyContent: 'center', padding: 15 }]}>
            <View style={[NotificationsPageStyles.card, CommonStyles.shadow, { flexDirection: 'row', gap: 15, height: 'auto' }]} >
                <View style={NotificationsPageStyles.box}>
                    <Icon name='flash' size='small' color={COLORS.black} />
                </View>
                <View>
                    <Text style={[NotificationsPageStyles.info]}>{t('generic_message_info_1')} {message}. {t('generic_message_info_2')}</Text>
                    <View style={[FindRideStyles.subHeader, { margin: 10 }]}>
                        {!isDriverVerified(driverInfo) && <>
                            <View style={NotificationsPageStyles.blackQuote}>
                                <Text style={[NotificationsPageStyles.heading]}>{t('reason_title')}: </Text>
                            </View>
                            <Text style={[NotificationsPageStyles.name]}>{driverInfo?.DriverDetail?.reject_reason}.</Text>
                        </>}
                        {isNotVehicleAssigned && <Text style={[FindRideStyles.name]}>{t('driver_vehicle_update_msg')}</Text>}
                    </View>
                    {!isEmpty(driverInfo?.expiredFields) && <View style={[FindRideStyles.subHeader, { margin: 10 }]}>
                        <View style={NotificationsPageStyles.blackQuote}>
                            <Text style={[NotificationsPageStyles.heading]}>{t('notice_title')}</Text>
                        </View>
                        <Text style={[NotificationsPageStyles.subHeading]}>{t('driver_expiry_fields_msg')}</Text>
                        {driverInfo?.expiredFields.map((item, i) => {
                            return <View key={i} style={[FindRideStyles.center, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                                <Text style={[NotificationsPageStyles.name]}>{i + 1}. </Text>
                                <Text style={[NotificationsPageStyles.name]}>{ExpiryStatus[item]} {t('expire_on')} {formattedDate(driverInfo?.vehicle[item], true)}</Text>
                            </View>
                        })}
                    </View>}
                    <View style={[NotificationsPageStyles.cardBottom]}>
                        <CustomButton
                            label={t('update_btn')}
                            textStyles={{ lineHeight: 13, fontSize: 12, fontWeight: 400, textTransform: 'capitalize' }}
                            styles={{
                                margin: 5,
                                width: 85, height: 32,
                                borderRadius: 5
                            }} onClick={openOwnerPortal} />
                        <CustomButton
                            label={t('logout')}
                            styles={{
                                backgroundColor: COLORS.card_bg, margin: 5,
                                width: 85, height: 32,
                                borderRadius: 5
                            }}
                            textStyles={{ lineHeight: 13, fontSize: 12, fontWeight: 400, textTransform: 'capitalize', color: COLORS.black }}
                            onClick={logOut} />
                    </View>
                </View>
            </View>
        </View>
    );
};
export default MessageInfo;
