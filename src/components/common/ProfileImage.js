import { useSelector } from "react-redux";
import images from "../../util/images";
import ImageView from "./imageView/ImageView";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    avatar: {
        minWidth: 10,
        width: 50,
        height: 50,
        minHeight: 10,
        borderRadius: 25
    },
})
export default (props) => {
    const profile = useSelector(state => state.auth?.userInfo);
    const googleInfo = useSelector(state => state.auth?.googleInfo);
    const avatarUri = profile?.avatar || googleInfo?.picture
    return (
        <ImageView
            source={
                avatarUri ? { uri: avatarUri } : images[`captain4`]
            }
            style={[styles.avatar]}
            {...props}
        />
    )
}