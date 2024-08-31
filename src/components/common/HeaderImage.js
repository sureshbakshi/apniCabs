import { ImageBackground, Image } from "react-native"
import LoginStyles from "../../styles/LoginPageStyles"
import images from "../../util/images"

export default () => {
    return <ImageBackground
    source={images.backgroundImage}
    resizeMode="cover"
    style={LoginStyles.logoBg}>
    <Image
      source={images.logo}
      style={LoginStyles.logo} />
  </ImageBackground>
}