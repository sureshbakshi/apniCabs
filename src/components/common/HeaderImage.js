import { ImageBackground, Image } from "react-native"
import LoginStyles from "../../styles/LoginPageStyles"
import images from "../../util/images"

export default ({fgImg, bgImg, bgStyles={}, fgStyles={}}) => {
    return <ImageBackground
    source={bgImg || images.backgroundImage}
    resizeMode="cover"
    style={[LoginStyles.logoBg, {...bgStyles}]}>
    <Image
      source={fgImg || images.logo}
      style={[LoginStyles.logo, {...fgStyles}]} />
  </ImageBackground>
}