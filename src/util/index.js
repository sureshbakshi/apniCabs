import {  Dimensions } from 'react-native';

export const getScreen = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
    return {screenWidth, screenHeight}
}