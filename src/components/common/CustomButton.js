import { Pressable, View } from "react-native"
import LoginStyles from "../../styles/LoginPageStyles"
import { upperCase } from 'lodash';
import { COLORS } from "../../constants";
import { Text, Icon } from ".";

export default ({ onClick, styles, textStyles, label, isLowerCase = false, contentContainerStyles, icon, ...rest }) => {
    const formattedLabel = isLowerCase ? label : upperCase(label)

    const clickHandler = () => {
        onClick?.()
    }
    return (
        <View style={[
            LoginStyles.button,
            { ...(styles || {}), opacity: rest?.disabled ? 0.6 : 1 }
        ]}>
            <Pressable
                onPress={clickHandler}
                android_ripple={{ color: styles?.backgroundColor, radius: 100}}
                {...rest}
            >
                <View style={{ justifyContent: 'center', ...contentContainerStyles, alignItems:'center',flexDirection:'row'}}>
                    <Text style={[LoginStyles.text, { ...(textStyles || {}) }]}>
                        {formattedLabel}
                    </Text>
                    <View style={{paddingLeft:10}}>
                      {icon && <Icon name={icon?.name} size={icon?.size || 'large'} color={COLORS.white} />}
                    </View>
                </View>
            </Pressable>
        </View>
    )
}