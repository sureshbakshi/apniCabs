import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import { COLORS, DEFAULT_VEHICLE_TYPES, VEHICLE_TYPES } from '../../../constants';
import { Capitalize, debounceHandler } from '../../../util';
import CaptainsCard from './CaptainsCard';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequestDrivers } from '../../../slices/userSlice';
import { useLazyGetRequestsByCategoryQuery } from '../../../slices/apiSlice';
import images from '../../../util/images';
import { Text } from '../Text';
import { useVehicleTypes } from '../../../hooks/useVehicleTypes';

const initialLayout = { width: Dimensions.get('window').width };

const CustomTabs = ({ extraProps, data }) => {
  useVehicleTypes();

  const { vehicleTypes } = useSelector(state => state.auth);
  const vehicleList = vehicleTypes?.filter(v => v?.is_active === 1) || [];

  const dispatch = useDispatch();
  const { activeRequestDrivers: driverListByCategory, activeRequestId: request_id } = useSelector(state => state.user);
  const defaultCode = vehicleList[0]?.code;
  const [refetch, { data: categoryResponse, error: rideHistoryError, isFetching, isLoading }] = useLazyGetRequestsByCategoryQuery({ request_id, category: defaultCode }, { refetchOnMountOrArgChange: true, skip: !request_id || !defaultCode });

  useEffect(() => {
    if (categoryResponse) {
      dispatch(setActiveRequestDrivers(categoryResponse))
    }
  }, [categoryResponse])

  const [index, setIndex] = useState(0);

  const routes = vehicleList.map((vehicle, i) => ({
    key: vehicle.code,
    title: Capitalize(vehicle.name),
    icon: images[vehicle.code] || null,
    code: vehicle.code,
  }));

  const renderScene = ({ route }) => (
    <View style={FindRideStyles.section}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {!isLoading && (
          <CaptainsCard
            keyProp={route.key}
            extraProps={{ ...extraProps, request_id, category: route.code }}
            driversList={driverListByCategory?.[route.code] || []}
            isFetching={isFetching}
          />
        )}
      </ScrollView>
    </View>
  );

  const handleIndexChange = (i) => {
    setIndex(i);
    refetch({ category: vehicleList[i].code, request_id });
  };

  const renderTabBar = props => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const isActive = index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, isActive && styles.activeTab, vehicleList.length > 1 && { flex: 1 }]}
            onPress={() => handleIndexChange(i)}
          >
            {route.icon ? (
              <Image
                source={route.icon}
                style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 8 }}
              />
            ) : (
              // fallback to text icon or any other representation
              <View style={styles.iconFallback}>
                {/* You can use VEHICLE_TYPES[route.code] here if it's a string/icon */}
              </View>
            )}
            <View style={{ height: 4 }} />
            <View>
              <Text style={{ color: isActive ? COLORS.blue : COLORS.gray, fontWeight: isActive ? 'bold' : 'normal' }}>
                {route.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={FindRideStyles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center'
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blue,
  },
  iconFallback: {
    width: 24,
    height: 24,
    backgroundColor: '#eee',
    borderRadius: 12,
  },
});

export default CustomTabs;
