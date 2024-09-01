import { Pressable, View } from "react-native";
import { COLORS } from "../../constants"
import FindRideStyles from "../../styles/FindRidePageStyles"
import openMap from 'react-native-open-maps';
import { Text } from "react-native-paper";
import { Icon } from "./Icon";
import CustomButton from "./CustomButton";

export default ({ route, title = 'Get Route Map' }) => {
    const openMapApp = () => {
        openMap(route);
    }
    return (
        <CustomButton
            onPress={openMapApp}
            iconLeft={{ name: 'directions', size: 'medium' }}
            label={title}
            isLowerCase
            textStyles={{ ...FindRideStyles.text }}
            styles={
                { ...FindRideStyles.button, backgroundColor: COLORS.primary, minWidth: 160, height: 40 }
            }
        />
    )
}