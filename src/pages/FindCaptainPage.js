import React from 'react';
import { View } from 'react-native';
import { CustomScrollbar, CustomTabs } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import CaptainsCard from '../components/common/Tabs/CaptainsCard';
import { COLORS, ROUTES_NAMES, VEHICLE_TYPES } from '../constants';
import { Text } from 'react-native-paper';
import { Icon } from '../components/common';
import { navigate } from '../util/navigationService';
import ContainerWrapper from '../components/common/ContainerWrapper';
import CustomButton from '../components/common/CustomButton';
import { useRequestAlertHandler } from '../hooks/useActiveRequestBackHandler';
import CommonStyles from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const FindCaptainPage = () => {
  const { requestAlertHandler } = useRequestAlertHandler('Cancel!', `Would you like to cancel it? If you click 'Yes', your request will be cancelled.`);
  const { requestInfo } = useSelector(state => state.user);

  const extraProps = {
    from: requestInfo?.from.location || '',
    to: requestInfo?.to.location || '',
  };

  // if (isEmpty(driverListByCategory)) {
  //   // navigate(ROUTES_NAMES.searchRide)
  //   return <Text style={{ padding: 15, textAlign: 'center', fontWeight: 'bold' }}>Drivers not found at the moment. Please try later!</Text>
  // }
  return (
    <SafeAreaView style={[FindRideStyles.container, FindRideStyles.pageContainer]}>
      <ContainerWrapper>
        {/* <View style={{ backgroundColor: COLORS.card_bg, padding: 15, paddingVertical: 5, borderRadius: 12, marginBottom: 10 }}>
          <Timeline data={[extraProps.from, extraProps.to]} />
        </View> */}
        <CustomTabs extraProps={extraProps} /> 
        {/* {
          list?.length > 1 ? <CustomTabs extraProps={extraProps} /> :
            <>
              <View style={{ backgroundColor: COLORS.bg_gray_primary, marginBottom: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderColor: COLORS.primary, borderBottomWidth: 2, maxWidth: 120, alignItems: 'center' }}>
                  <Icon name={VEHICLE_TYPES[list[0].name]} size="extraLarge" color={COLORS.primary} />
                  <Text style={{ marginLeft: 8 }} >{list[0].name}</Text>
                </View>
              </View>
              <CustomScrollbar >
                <CaptainsCard
                  list={list[0]?.drivers}
                  keyProp={0}
                  extraProps={extraProps}
                />
              </CustomScrollbar>
            </>
        } */}
        <CustomButton
          onClick={requestAlertHandler}
          textStyles={{ color: COLORS.primary, fontSize: 18 }}
          label={`Cancel All`}
          isLowerCase={true}
          styles={{ backgroundColor: COLORS.white, paddingRight: 0, width: 'auto', ...CommonStyles.shadow }}
        />
      </ContainerWrapper>
    </SafeAreaView>
  );
};
export default FindCaptainPage;
