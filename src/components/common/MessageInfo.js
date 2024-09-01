import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { COLORS, ExpiryStatus } from '../../constants';
import FindRideStyles from '../../styles/FindRidePageStyles';
import { Text } from './Text';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import useGetDriverDetails, { useUpdateDriverStatus } from '../../hooks/useGetDriverDetails';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from './CustomButton';
import { openOwnerPortal } from '../../util/config';
import { formattedDate, isDriverVerified } from '../../util';
import NotificationsPageStyles from '../../styles/Notifications';
import { Icon } from './Icon';


const MessageInfo = () => {
    const { userInfo, driverInfo } = useSelector(state => state.auth);
    const { refetch } = useGetDriverDetails(userInfo?.id, { refetchOnMountOrArgChange: true })
    const updateDriverStatus = useUpdateDriverStatus();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    useEffect(() => {
        updateDriverStatus(false)
    }, [])

    const isNotVehicleAssigned = isEmpty(driverInfo?.vehicle)
    const message = isNotVehicleAssigned ? 'Vehicle assigned to you' : 'your profile is verified'

    return (
        <View style={[FindRideStyles.container, NotificationsPageStyles.center]}>
            <View style={NotificationsPageStyles.box}>
                <Icon name='flash' size='small' color={COLORS.black} />
            </View>
            <View style={[NotificationsPageStyles.card]} >
                <Text style={[NotificationsPageStyles.info]}>You cannot receive any ride requests until {message}. Please update below info as soon as possible.</Text>
                <View style={[FindRideStyles.subHeader, { margin: 10 }]}>
                    <View style={NotificationsPageStyles.blackQuote}>
                        <Text style={[NotificationsPageStyles.heading]}>Reason: </Text>
                    </View>
                    {!isDriverVerified(driverInfo) && <Text style={[NotificationsPageStyles.name]}>{driverInfo?.driver_detail?.reject_reason}.</Text>}
                    {isNotVehicleAssigned && <Text style={[FindRideStyles.name]}>Vehicle not yet assigned.</Text>}

                </View>
                {!isEmpty(driverInfo?.expiredFields) && <View style={[FindRideStyles.subHeader, { margin: 10 }]}>
                    <View style={NotificationsPageStyles.blackQuote}>
                        <Text style={[NotificationsPageStyles.heading]}>Notice:</Text>
                    </View>
                    <Text style={[NotificationsPageStyles.subHeading]}>Below are the documents that will expire within a week:</Text>
                    {driverInfo?.expiredFields.map((item, i) => {
                        return <View key={i} style={[FindRideStyles.center, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
                            <Text style={[NotificationsPageStyles.name]}>{i + 1}. </Text>
                            <Text style={[NotificationsPageStyles.name]}>{ExpiryStatus[item]} will expire on {formattedDate(driverInfo?.vehicle[item], true)}</Text>
                        </View>
                    })}
                </View>}
                <View style={[NotificationsPageStyles.cardBottom]}>
                    <CustomButton
                        label={'Update'}
                        textStyles={{ lineHeight: 13, fontSize: 12, fontWeight: 400, textTransform: 'capitalize' }}
                        styles={{
                            margin: 5,
                            width: 85, height: 32,
                            borderRadius: 5
                        }} onClick={openOwnerPortal} />
                </View>

            </View>
        </View>
    );
};
export default MessageInfo;
