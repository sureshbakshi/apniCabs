import React from 'react';
import { ScrollView, View } from 'react-native';
import { CustomTabs } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import CaptainsCard from '../components/common/Tabs/CaptainsCard';
import { COLORS, ROUTES_NAMES, VEHICLE_TYPES } from '../constants';
import { Text } from 'react-native-paper';
import { Icon } from '../components/common';
import { navigate } from '../util/navigationService';

const FindCaptainPage = () => {
  const list = useSelector(state => state.user?.rideRequests?.vehicles);
  const { requestInfo } = useSelector(state => state.user);

  const extraProps = {
    from: requestInfo?.from.location || '',
    to: requestInfo?.to.location || '',
  };

  if (isEmpty(list)) {
    navigate(ROUTES_NAMES.searchRide)
    return null
  }
  return (
    <View style={FindRideStyles.container}>
      {
        list?.length > 1 ? <CustomTabs extraProps={extraProps} /> :
          <>
            <View style={{ backgroundColor: COLORS.white, marginBottom: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderColor: COLORS.primary, borderBottomWidth: 2, maxWidth: 120 }}>
                <Icon name={VEHICLE_TYPES[list[0].name]} size="extraLarge" color={COLORS.primary} />
                <Text style={{ marginLeft: 8 }} >{list[0].name}</Text>
              </View>
            </View>
            <ScrollView>
              <CaptainsCard
                list={list[0]?.drivers}
                keyProp={0}
                extraProps={extraProps}
              />
            </ScrollView>
          </>
      }

    </View>
  );
};
export default FindCaptainPage;
