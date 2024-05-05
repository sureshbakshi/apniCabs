import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import { Icon, Text } from './common';
import { COLORS, SUPPORT } from '../constants';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { openUrl, webLinks } from '../util/config';

export default () => {
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
            <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => openUrl(webLinks.terms)}>
                <View style={MoreStyles.listIcon}>
                    <Icon name="web" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>Terms & Conditions</Text>
            </Pressable>
            <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => openUrl(webLinks.privacy)}>
                <View style={MoreStyles.listIcon}>
                    <Icon name="web" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>Privacy Policy</Text>
            </Pressable>
        </>
    )
}