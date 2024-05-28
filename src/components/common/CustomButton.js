import { Pressable, View } from "react-native"
import LoginStyles from "../../styles/LoginPageStyles"
import { upperCase } from 'lodash';
import { Text } from "react-native-paper";

export default ({ onClick, styles, textStyles, label, isLowerCase = false , ...rest}) => {
    const formattedLabel = isLowerCase ? label : upperCase(label)

    const clickHandler = () => {
        onClick?.()
    }
    return (
        <Pressable
            onPress={clickHandler}
            style={[
                LoginStyles.button,
                { ...(styles || {}), opacity: rest?.disabled ? 0.6 : 1 }
            ]}
            android_ripple={{ color: '#ccc' }}
            {...rest}
            >
            <Text style={[LoginStyles.text, { ...(textStyles || {}) }]}>
                {formattedLabel}
            </Text>
        </Pressable>
    )
}