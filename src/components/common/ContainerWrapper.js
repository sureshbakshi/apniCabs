import React from 'react'
import { View } from 'react-native'
import { getScreen } from '../../util'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ({ style, children }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ height: getScreen().screenHeight - (insets.bottom + 70), ...style }}>{children}</View>
    )
}
