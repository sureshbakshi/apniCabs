import { View } from "react-native"
import { Text } from "react-native-paper"
import images from "../../util/images"
import LottieAnimation from 'lottie-react-native';
import ImageView from "./imageView/ImageView";

export default ({msg, source = images.homeBanner, containerStyles = {}, textStyles = {}, animationProps, isLoader= true}) => {
    const message = msg || 'Loading...'
    return (
        <><View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, ...containerStyles }}>
            <Text style={{ fontWeight: 'bold', ...textStyles }}>{message}</Text>
            {/* {isLoader && <LottieAnimation
                source={source}
                speed={1}
                autoPlay={true}
                loop
                resizeMode={'cover'}
                style={{ width: '50%', height: '50%' }}
                {...animationProps}
            >
            </LottieAnimation>} */}
            <ImageView source={source} />
        </View></>
    )
}