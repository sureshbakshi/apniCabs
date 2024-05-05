import { View } from "react-native"
import { Text } from "react-native-paper"
import styles from '../styles/MyProfilePageStyles';

export default ({ title, children }) => {
    return <View>
        {title && <Text style={[styles.name, styles.blackColor, styles.bold]}>
            {title}
        </Text>}
        {children}
    </View>
}