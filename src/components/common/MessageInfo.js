import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { COLORS, ExpiryStatus } from '../../constants';
import FindRideStyles from '../../styles/FindRidePageStyles';
import { Text } from './Text';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import useGetDriverDetails from '../../hooks/useGetDriverDetails';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from './CustomButton';
import { openOwnerPortal } from '../../util/config';
import { formattedDate } from '../../util';


const MessageInfo = () => {
    const { userInfo, driverInfo } = useSelector(state => state.auth);
    const { refetch } = useGetDriverDetails(userInfo?.id, { refetchOnMountOrArgChange: true })

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    return (
        <View style={[FindRideStyles.container, FindRideStyles.center, { padding: 10, }]}>
            <View style={[FindRideStyles.card, { width: '100%', padding: 10, }]} >
                <View style={[FindRideStyles.subHeader, { margin: 10 }]}>
                    <Text style={[FindRideStyles.name, { fontSize: 18, fontWeight: 'bold' }]}>Reason</Text>
                    <Text style={[FindRideStyles.name]}> {driverInfo?.driver_detail?.reject_reason}.</Text>

                </View>
                {!isEmpty(driverInfo.expiredFields) && <View style={[FindRideStyles.subHeader, { margin: 10 }]}>
                    <Text style={[FindRideStyles.name, { fontSize: 18, fontWeight: 'bold' }]}> Notice:</Text>
                    <Text style={[FindRideStyles.name, { fontSize: 14, fontWeight: 'bold' }]}> List of Documents expiry in a week:</Text>
                    {driverInfo?.expiredFields.map((item, i) => {
                        return <View key={i} style={[FindRideStyles.center,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                            <Text style={[FindRideStyles.name, { fontSize: 14 }]}>{i + 1}. </Text>
                            <Text style={[FindRideStyles.name, { fontSize: 14 }]}>{ExpiryStatus[item]} will expiry at {formattedDate(driverInfo?.vehicle[item])}</Text>
                        </View>
                    })}
                </View>}
                <View style={[FindRideStyles.cardBottom, FindRideStyles.center, { justifyContent: 'flex-end' }]}>
                    <CustomButton label={'Update here'} styles={{
                        margin: 5, paddingVertical: 10,
                        paddingHorizontal: 10,
                    }} onClick={openOwnerPortal} />
                </View>

            </View>
        </View>
    );
};
export default MessageInfo;
