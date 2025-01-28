import { Pressable, View } from "react-native"
import LoginStyles from "../../styles/LoginPageStyles"
import { upperCase } from 'lodash';
import { COLORS } from "../../constants";
import { Text, Icon } from ".";
import ActivityIndicator from "./ActivityIndicator";

export default ({ isLoading, onClick, styles = {}, textStyles, label, isLowerCase = false, contentContainerStyles, iconLeft, iconRight, iconStyles, containerStyles = {}, ...rest }) => {
    const formattedLabel = isLowerCase ? label : upperCase(label)

    const clickHandler = () => {
        onClick?.()
    }
    return (
        <View style={{ borderRadius: styles?.borderRadius || 8, overflow: "hidden" }}>
            <Pressable
                onPress={clickHandler}
                android_ripple={{ color: styles?.backgroundColor || COLORS.white }}
                {...rest}
            >
                <View style={[
                    LoginStyles.button,
                    { ...(styles || {}), opacity: rest?.disabled ? 0.6 : 1 }
                ]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', ...contentContainerStyles }}>
                        {isLoading && <ActivityIndicator />}
                        {(iconLeft && !isLoading) &&
                            <View style={{ paddingRight: 8, ...iconStyles }}>
                                <Icon name={iconLeft?.name} size={iconLeft?.size || 'large'} color={iconLeft?.color || COLORS.white} />
                            </View>}

                        {formattedLabel && <Text style={[LoginStyles.text, { ...(textStyles || {}) }]}>
                            {formattedLabel}
                        </Text>}
                        {(iconRight && !isLoading) && <View style={{ paddingLeft: 8, ...iconStyles }}>
                            <Icon name={iconRight?.name} size={iconRight?.size || 'large'} color={iconRight?.color || COLORS.white} />
                        </View>}
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

