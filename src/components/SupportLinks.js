import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import MoreStyles from '../styles/MorePageStyles';
import { Icon, Text } from './common';
import { COLORS } from '../constants';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

export default () => {
    return (
        <>
            <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => RNImmediatePhoneCall?.immediatePhoneCall('18003095959')}>
                <View style={MoreStyles.listIcon}>
                    <Icon name="phone" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>1800 309 5959</Text>
            </Pressable>
            <Pressable
                style={MoreStyles.list}
                android_ripple={{ color: '#ccc' }}
                onPress={() => Linking.openURL('mailto:contact@apnicabi.com?subject=Support')}>
                <View style={MoreStyles.listIcon}>
                    <Icon name="email" size="large" color={COLORS.primary} />
                </View>
                <Text style={MoreStyles.name}>contact@apnicabi.com</Text>
            </Pressable>
        </>
    )
}