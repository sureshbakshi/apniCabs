import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';

export default function ({ style, children }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom + 5,
            ...style,
            backgroundColor: COLORS.white
        }}>{children}</View>
    )
}
