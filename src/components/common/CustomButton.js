import { Pressable, View } from "react-native"
import LoginStyles from "../../styles/LoginPageStyles"
import { upperCase } from 'lodash';
import { COLORS } from "../../constants";
import { Text, Icon } from ".";

export default ({ onClick, styles = {}, textStyles, label, isLowerCase = false, contentContainerStyles, iconLeft, iconRight, iconStyles,containerStyles = {}, ...rest }) => {
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
                android_ripple={{ color: styles?.backgroundColor, radius: 100 }}
                {...rest}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' , ...contentContainerStyles}}>
                    {iconLeft &&
                        <View style={{ paddingRight: 8, ...iconStyles }}>
                            <Icon name={iconLeft?.name} size={iconLeft?.size || 'large'} color={iconLeft?.color || COLORS.white} />
                        </View>}

                    {formattedLabel && <Text style={[LoginStyles.text, { ...(textStyles || {}) }]}>
                        {formattedLabel}
                    </Text>}
                    {iconRight && <View style={{ paddingLeft: 8 , ...iconStyles}}>
                        <Icon name={iconRight?.name} size={iconRight?.size || 'large'} color={iconRight?.color ||  COLORS.white} />
                    </View>}
                </View>
            </Pressable>
        </View>
    )
}

