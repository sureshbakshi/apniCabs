import React from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import CommonStyles from '../styles/commonStyles';
import { COLORS } from '../constants';
import { Icon } from './common';
import { cleanFormattedAddress, getScreen } from '../util';

const Item = ({ item, focusKey, updateLocation }) => (
    <Pressable
        onPress={() => updateLocation(focusKey, item)}
        android_ripple={{ color: COLORS.bg_gray_secondary }}
        style={{
            backgroundColor: COLORS.white,
            padding: 15,
            borderBottomColor: COLORS.sepator_line,
            borderBottomWidth: 1
        }}
    >
        <View style={{ flexDirection: 'row' }}>
            <View style={{ paddingRight: 15 }}>
                <Icon name={'history'} size={'large'} color={COLORS.primary_blue} />
            </View>
            <View>
                <Text style={[CommonStyles.font14, { fontWeight: 'bold' }]}>{item?.city}</Text>
                <Text style={[CommonStyles.font14, { color: COLORS.text_dark1, width: getScreen().screenWidth - 100 }]} numberOfLines={1}>{cleanFormattedAddress(item?.formatted_address)}</Text>
            </View>
        </View>
    </Pressable>
);

const RecentSearchHistory = ({ searchHistory, focusKey, updateLocation }) => (
    <View style={{ marginTop: 5 }}>
        <FlatList
            data={searchHistory[focusKey]}
            renderItem={({ item }) => <Item {...{ item, focusKey, updateLocation }} />}
            keyExtractor={item => item.place_id}
        />
    </View>

);

export default RecentSearchHistory;