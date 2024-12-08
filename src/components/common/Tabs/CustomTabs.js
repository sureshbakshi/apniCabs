import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import { Tabs, TabScreen, TabsProvider, useTabIndex } from 'react-native-paper-tabs';
import _ from 'lodash';
import { COLORS, VEHICLE_TYPES } from '../../../constants';
import { Capitalize } from '../../../util';
import CaptainsCard from './CaptainsCard';
import { useSelector } from 'react-redux';

const CustomTabs = ({ extraProps, data }) => {
  const list = useSelector(state => state.user?.rideRequests?.vehicles);
  return (
    <View style={FindRideStyles.container}>
      <TabsProvider defaultIndex={0}>
        <Tabs
          mode="scrollable"
          style={[FindRideStyles.tabs]}
          // tabBarUnderlineStyle={{backgroundColor: COLORS.blue}}
          theme={{
            colors: { onSurface: COLORS.blue },
          }}
          showLeadingSpace={false}
        >
          {list && list.map((item, i) => {
            return (
              <TabScreen
                label={Capitalize(item.name)}
                icon={VEHICLE_TYPES[item.name]}
                key={`${i}`}>
                <View style={FindRideStyles.section}>
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                  >
                    {
                      <CaptainsCard
                        list={item.drivers}
                        keyProp={i}
                        extraProps={extraProps}
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
