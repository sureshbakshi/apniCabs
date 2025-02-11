import React, { useCallback } from 'react';
import { View, Pressable, Linking } from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import { Icon, Text } from './common';
import { COLORS, ROLE_IDS, SUPPORT, USER_ROLES } from '../constants';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { openUrl, webLinks } from '../util/config';
import { useLazyGetAppLinksQuery } from '../slices/apiSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { isDriver } from '../util';

export default () => {
    const [refetch, { data: appLinks }] = useLazyGetAppLinksQuery({ isActive: 0 }, { refetchOnMountOrArgChange: true })
    const auth = useSelector(state => state.auth)
    const roleId = isDriver() ? ROLE_IDS[USER_ROLES.DRIVER] : ROLE_IDS[USER_ROLES.USER]

    useFocusEffect(
        useCallback(() => {
            refetch({
                isActive: 0
            })
        }, [])
    );
    // const activeLinks = appLinks;
    const activeLinks = appLinks?.filter((link) => link?.role_id?.includes(roleId))
    return (
        <>
            <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => RNImmediatePhoneCall?.immediatePhoneCall(SUPPORT.mobile.value)}>
                <View style={MoreStyles.listIcon}>
                    <Icon name="phone" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>{SUPPORT.mobile.label}</Text>
            </Pressable>
            <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => Linking.openURL(`mailto:${SUPPORT.email.value}`)}>
                <View style={MoreStyles.listIcon}>
                    <Icon name="email" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>{SUPPORT.email.label}</Text>
            </Pressable>
            {activeLinks?.map((linkItem) => {
                return (
                    <Pressable
                        key={linkItem.id}
                        style={MoreStyles.list}
                        android_ripple={{ color: '#ccc' }}
                        onPress={() => openUrl(linkItem.link)}>
                        <View style={MoreStyles.listIcon}>
                            <Icon name="web" size="large" color={COLORS.primary} />
                        </View>
                        <Text style={MoreStyles.name}>{linkItem.label}</Text>
                    </Pressable>
                )
            })}
        </>
    )
}