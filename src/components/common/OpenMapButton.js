import { Pressable, View } from "react-native";
import { COLORS } from "../../constants"
import FindRideStyles from "../../styles/FindRidePageStyles"
import openMap from 'react-native-open-maps';
import { Text } from "react-native-paper";
import { Icon } from "./Icon";
import CustomButton from "./CustomButton";
import useGetDriverLocation from "../../hooks/useGetDriverLocation";

export default ({ title = 'Get Route Map', buttonStyles = {}, isDriverLogged = false , activeRequestInfo}) => {
    const driverCurrentLocation = useGetDriverLocation(isDriverLogged)
    const fromLocation = driverCurrentLocation || activeRequestInfo.from;

    const route = { start: fromLocation, end: activeRequestInfo.to, navigate: true }
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
                { ...FindRideStyles.button, backgroundColor: COLORS.primary, minWidth: 160, height: 40, ...buttonStyles }
            }
        />
    )
}