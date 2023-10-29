import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import {Tabs, TabScreen, TabsProvider} from 'react-native-paper-tabs';
import _ from 'lodash';
import {COLORS, VEHICLE_TYPES} from '../../../constants';
import {Capitalize} from '../../../util';
import CaptainsCard from './CaptainsCard';
import {useSelector} from 'react-redux';

const CustomTabs = ({extraProps, data}) => {
  const [driverList, setDriverList] = useState();
  const list = useSelector(state => state.user.drivers);

  useEffect(() => {
    if (list) {
      const data = _.groupBy(list, 'type');
      setDriverList(data);
    }
  }, [list]);
  return (
    <View style={FindRideStyles.container}>
      <TabsProvider defaultIndex={0}>
        <Tabs
          mode="scrollable"
          style={FindRideStyles.tabs}
          tabBarUnderlineStyle={{backgroundColor: COLORS.primary}}
          theme={{
            colors: {onSurface: COLORS.primary, onSurfaceVariant: COLORS.black},
          }}>
          {driverList &&
            Object.keys(driverList).map((key, i) => {
              return (
                <TabScreen
                  label={Capitalize(key)}
                  icon={VEHICLE_TYPES[key]}
                  key={`${i}`}>
                  <View style={FindRideStyles.section}>
                    <ScrollView>
                      {
                        <CaptainsCard
                          list={driverList[key]}
                          keyProp={key}
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
