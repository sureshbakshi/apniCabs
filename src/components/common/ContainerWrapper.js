import React from 'react'
import { View } from 'react-native'
import { getScreen } from '../../util'

export default function ({ style, children }) {
    return (
        <View style={{ height: getScreen().screenHeight - 170, ...style }}>{children}</View>
    )
}
