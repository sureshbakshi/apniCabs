import { Pressable, View } from "react-native"
import LoginStyles from "../../styles/LoginPageStyles"
import { upperCase } from 'lodash';
import { Text } from "react-native-paper";

export default ({ onClick, styles, textStyles, label, isLowerCase = false }) => {
    const formattedLabel = isLowerCase ? label : upperCase(label)

    const clickHandler = () => {
        onClick?.()
    }
    return (
        <Pressable
            onPress={clickHandler}
            style={[
                LoginStyles.button,
                { ...(styles || {}) }
            ]}
            android_ripple={{ color: '#ccc' }}>
            <Text style={[LoginStyles.text, { ...(textStyles || {}) }]}>
                {formattedLabel}
            </Text>
        </Pressable>
    )
}