import React from 'react'
import { View } from 'react-native'
import { getScreen } from '../../util'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from '../../constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function ({ style, children }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom + 5,
            ...style,
            backgroundColor: Colors.white
        }}>{children}</View>
    )
}
