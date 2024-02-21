import React from 'react';
import { View } from 'react-native';
import { ExpiryStatus } from '../../constants';
import FindRideStyles from '../../styles/FindRidePageStyles';
import { Text } from './Text';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import CustomButton from './CustomButton';
import { formattedDate } from '../../util';
import { openOwnerPortal } from '../../util/config';

const Notifications = () => {
    const { driverInfo } = useSelector(state => state.auth);

    return (
        !isEmpty(driverInfo?.expiredFields) ?  <View style={[FindRideStyles.container, { padding: 10, }]}>
            <View style={[FindRideStyles.card, { width: '100%', padding: 10, }]} >
                {<View style={[FindRideStyles.subHeader, { margin: 10 }]}>
                    <Text style={[FindRideStyles.name, { fontSize: 14, fontWeight: 'bold' }]}>Below are the documents that will expire within a week:</Text>
                    {driverInfo?.expiredFields.map((item, i) => {
                        return <View key={i} style={[FindRideStyles.center,{justifyContent:'flex-start',alignItems:'flex-start'}]}>
                            <Text style={[FindRideStyles.name, { fontSize: 14 }]}>{i + 1}. </Text>
                            <Text style={[FindRideStyles.name, { fontSize: 14 }]}>{ExpiryStatus[item]} will expire on {formattedDate(driverInfo?.vehicle[item], true)}</Text>
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
        </View>: <Text style={{fontWeight: 'bold', alignSelf: 'center', margin: 30}}>No Notifications found.</Text>
    );
};
export default Notifications;
