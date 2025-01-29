import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const BottomModalStyles = StyleSheet.create({
    flexView: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        minHeight: 400,
        paddingBottom: 20,
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    barIcon: {
        width: 60,
        height: 5,
        backgroundColor: COLORS.sepator_line_dark,
        borderRadius: 3,
    },
    text: {
        color: COLORS.text_dark,
        fontSize: 24,
        marginTop: 100,
    },
    btnContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 500,
    },
});
export default BottomModalStyles;