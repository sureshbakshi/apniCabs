import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import FindRideStyles from '../../../styles/FindRidePageStyles';
import { COLORS } from '../../../constants';
import { Capitalize, debounceHandler } from '../../../util';
import CaptainsCard from './CaptainsCard';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequestDrivers } from '../../../slices/userSlice';
import { useLazyGetRequestsByCategoryQuery } from '../../../slices/apiSlice';
import images from '../../../util/images';
import { Text } from '../Text';

const initialLayout = { width: Dimensions.get('window').width };

const CustomTabs = ({ extraProps, data }) => {
  const [index, setIndex] = useState(0);
  const { activeVehicleTypes: vehicleList } = useSelector(state => state.user);
  // const vehicleList = vehicleTypes?.filter(v => v?.is_active === 1) || [];
  const dispatch = useDispatch();
  const { activeRequestDrivers: driverListByCategory, activeRequestId: request_id } = useSelector(state => state.user);
  const [refetch, { data: categoryResponse, error: rideHistoryError, isFetching, isLoading }] = useLazyGetRequestsByCategoryQuery();

  const fetchData = useCallback(async (catId) => {
    if (request_id && catId) {
      try {
        const res = await refetch({ request_id, category: catId }).unwrap();
        dispatch(setActiveRequestDrivers(res));
      } catch (e) {
        console.log(e);
      }
    }
  }, [request_id, refetch, dispatch]);

  // Initial load effect (runs once when both ready)
  useEffect(() => {
    if (request_id && vehicleList?.length > 0) {
      // Trigger initial tab load
      handleIndexChange(0);
    }
  }, [request_id, vehicleList?.length]);

  useFocusEffect(
    useCallback(() => {
      if (vehicleList?.[index]?.id) {
        fetchData(vehicleList[index].id);
      }
    }, [index, vehicleList, fetchData])
  );


  const routes = vehicleList?.map((vehicle, i) => ({
    key: vehicle.code,
    title: Capitalize(vehicle.name),
    icon: images[vehicle.code] || null,
    code: vehicle.code,
    id: vehicle.id,
  }));

  const renderScene = ({ route }) => (
    <View style={[FindRideStyles.section, { paddingHorizontal: 10 }]}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {!isLoading && (
          <CaptainsCard
            keyProp={route.key}
            extraProps={{ ...extraProps, request_id, category: route.id }}
            driversList={driverListByCategory?.[route.id] || []}
            isFetching={isFetching}
          />
        )}
      </ScrollView>
    </View>
  );

  const handleIndexChange = useCallback((i) => {
    setIndex(i);
  }, []);

  const renderTabBar = useCallback(props => (
    <View style={styles.tabBar}>
      {props.navigationState?.routes.map((route, i) => {
        const isActive = props.navigationState?.index === i;
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
  ), [vehicleList.length]);

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
