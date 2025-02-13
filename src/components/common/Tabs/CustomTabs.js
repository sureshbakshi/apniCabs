import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import { Tabs, TabScreen, TabsProvider, useTabIndex } from 'react-native-paper-tabs';
import _ from 'lodash';
import { COLORS, DEFAULT_VEHICLE_TYPES, VEHICLE_TYPES } from '../../../constants';
import { Capitalize } from '../../../util';
import CaptainsCard from './CaptainsCard';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequestDrivers } from '../../../slices/userSlice';
import {  useLazyGetRequestsByCategoryQuery } from '../../../slices/apiSlice';

const CustomTabs = ({ extraProps, data }) => {
  const {vehicleTypes} = useSelector(state => state.auth);
  const vehicleList = vehicleTypes || DEFAULT_VEHICLE_TYPES;

  const dispatch = useDispatch();
    const {activeRequestDrivers: driverListByCategory, activeRequestId: request_id} = useSelector(state => state.user);
    const defaultCode =  vehicleList[0]?.code;
    const [ refetch, {data: categoryResponse, error: rideHistoryError, isFetching }] = useLazyGetRequestsByCategoryQuery({ request_id, category: defaultCode }, {refetchOnMountOrArgChange: true, skip: !request_id || !defaultCode});
  
    useEffect(() => {
      if (categoryResponse) {
        dispatch(setActiveRequestDrivers(categoryResponse))
      }
    }, [categoryResponse])

    const handleChangeIndex = (index) => {
      refetch({ category: vehicleList[index].code, request_id });
    }
  return (
    <View style={FindRideStyles.container}>
      <TabsProvider defaultIndex={0}         onChangeIndex={handleChangeIndex}      >
        <Tabs
          mode="scrollable"
          style={[FindRideStyles.tabs]}
          // tabBarUnderlineStyle={{backgroundColor: COLORS.blue}}
          theme={{
            colors: { onSurface: COLORS.blue },
          }}
          showLeadingSpace={false}
        >
          {vehicleList && vehicleList.map((vehicle, i) => {
            return (
              <TabScreen
                label={Capitalize(vehicle.name)}
                icon={VEHICLE_TYPES[vehicle.code]}
                key={`${i}`}
                onPressIn={() => {
                  console.log('vehicle.code', vehicle.code)
                    refetch({ category: vehicle.code, request_id });
                  }}>
                <View style={FindRideStyles.section}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                  >
                    {
                      <CaptainsCard
                        keyProp={i}
                        extraProps={{...extraProps, request_id, category: vehicle.code}}
                        driversList={ driverListByCategory?.[vehicle.code] || []}
                        isFetching={isFetching}
                      />
                    }
                  </ScrollView>
                </View>
              </TabScreen>
            );
          })}
        </Tabs>
      </TabsProvider>
    </View>
  );
};
export default CustomTabs;
