import { View } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { COLORS } from "../../constants"

export default ({color=COLORS.primary, size='large', isAnimating=true, ...props}) => {
    return <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator animating={isAnimating} color={color} size={size} {...props}/>
        </View>
}