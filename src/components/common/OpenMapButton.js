import { Pressable, View } from "react-native";
import { COLORS } from "../../constants"
import FindRideStyles from "../../styles/FindRidePageStyles"
import openMap from 'react-native-open-maps';
import { Text } from "react-native-paper";
import { Icon } from "./Icon";

export default ({route, title='Get Route Map'}) => {
    const openMapApp = () => {
        openMap(route);
      }
    return (
        <Pressable
            onPress={openMapApp}
        >
            <View style={[FindRideStyles.button, { backgroundColor: COLORS.primary, flexDirection: 'row', marginBottom: 5 }]} >
                <Icon name="directions" size="large" color={COLORS.white} />
                <Text style={[FindRideStyles.text, { fontWeight: 'bold', marginLeft: 10 }]}>{title}</Text>
            </View>
        </Pressable>
    )
}