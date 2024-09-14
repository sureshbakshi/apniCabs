import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { getScreen } from '../util';

const GettingStartedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        height: getScreen().screenHeight
    },

    section: {
        backgroundColor: '#fff',
    },
    image1: {
        height: getScreen().screenHeight - 350,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image2: {
        width: getScreen().screenWidth - 10,
    },
    subContainer:{
        padding:20
    },
    textContainer:{
        paddingVertical:20
    },
    heardertext:{
        fontSize: 32,
        color: COLORS.text_dark1,
        fontWeight: '700',
        paddingBottom:10,
        fontFamily: 'Poppins',
    },
    subtext:{
        fontSize: 12,
        color: COLORS.text_light_gray,
        fontWeight: '500',
        fontFamily: 'Poppins',
    },

});
export default GettingStartedStyles;
