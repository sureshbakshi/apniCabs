import React from 'react'
import { View } from 'react-native'
import { getScreen } from '../../util'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from '../../constants';

export default function ({ style, children }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom + 5,
            ...style
        }}>{children}</View>
    )
}
