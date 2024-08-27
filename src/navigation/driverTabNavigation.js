import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon, Text } from '../components/common';
import { AppProvider } from '../context/App.context';
import DriverStackNavigator from './driverStackNavigation';
import useDriverSocketEvents from '../hooks/useDriverSocketEvents';
import useAppStateListner from '../hooks/useAppStateListner';
import RideStackNavigation from './RideStackNavigation';
import WalletStackNavigator from './walletNavigationStack';
import { setBugsnagUserInfo } from '../util';
import CommonStyles from '../styles/commonStyles';

const Tab = createBottomTabNavigator();

setBugsnagUserInfo()

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={[styles.tabBar, CommonStyles.shadow]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        const color = isFocused ? COLORS.white : COLORS.black
        const bg = isFocused ? '#539DF3' : COLORS.white
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <View style={{ flexDirection: 'row' , backgroundColor: bg, paddingVertical: 8, paddingHorizontal: 16,  borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
              {options.tabBarIcon({ isFocused, color })}
              { <Text style={{ color: color , marginLeft: 5, opacity: isFocused ? 1: 0}}>
                {label}
              </Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 15,
    justifyContent: 'center',
    marginHorizontal: 15,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 8,

  }
})

export default function DriverTabNavigator() {
  useDriverSocketEvents()
  useAppStateListner()
  return (
    <AppProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? TAB_BAR_ICONS[route.name][0] : TAB_BAR_ICONS[route.name][1]
            return <Icon name={iconName} size={'large'} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 },
        })}
        tabBar={(props) => <MyTabBar {...props} />}

      >
        <Tab.Screen name={ROUTES_NAMES.pickRide} options={{ title: 'Home' }} component={DriverStackNavigator}
        />
        <Tab.Screen name={ROUTES_NAMES.rideHistoryStack} options={{ title: 'Rides' }} component={RideStackNavigation} />
        <Tab.Screen name={ROUTES_NAMES.wallet} options={{ title: 'Wallet' }} component={WalletStackNavigator} />
        <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: 'More' }} component={MoreNavigator} />
      </Tab.Navigator>
    </AppProvider>
  );
}
