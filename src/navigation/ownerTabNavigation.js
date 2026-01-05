import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MoreNavigator from './moreNavigation';
import { COLORS, ROUTES_NAMES, TAB_BAR_ICONS } from '../constants';
import { Icon } from '../components/common';
import { setBugsnagUserInfo } from '../util';
import MyTabBar from './TabBar';
import { useTranslation } from 'react-i18next';
import MessageInfo from '../components/common/MessageInfo';


const Tab = createBottomTabNavigator();

setBugsnagUserInfo()


export default function OwnerTabNavigator() {

    const { t } = useTranslation()

    return (
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
            <Tab.Screen name={ROUTES_NAMES.messageInfo} options={{ title: t('Home') }} component={MessageInfo} />
            <Tab.Screen name={ROUTES_NAMES.moreDetails} options={{ title: t('more') }} component={MoreNavigator} />
        </Tab.Navigator>
    );
}
