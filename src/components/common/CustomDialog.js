import { useEffect, useState } from "react";
import ActiveRidePageStyles from "../../styles/ActiveRidePageStyles";
import { Modal, Pressable, View } from 'react-native'
import { Text } from "react-native-paper";
import { COLORS, default_btn_styles } from "../../constants";
import FindRideStyles from "../../styles/FindRidePageStyles";
import CustomButton from "./CustomButton";

export default ({ openDialog, actions, title, closeCb, children, containerStyles={}, modalContainerStyles={} }) => {
    const [modalVisible, setModalVisible] = useState(openDialog)

    useEffect(() => {
        if (modalVisible !== openDialog) {
            setModalVisible(openDialog)
        }
    }, [openDialog])

    const closeDialog = () => {
        setModalVisible(false);
        closeCb?.()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onPress={closeDialog}>
            <View style={[ActiveRidePageStyles.centeredView, {...containerStyles}]}>
                <View style={[ActiveRidePageStyles.modalView, {...modalContainerStyles}]}>
                    <View>
                        <Text style={[ActiveRidePageStyles.modalText]}>
                            {title}
                        </Text>
                        <View style={ActiveRidePageStyles.content}>
                            {children}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'center' }}>
                        {actions ? actions : <>
                            <CustomButton
                                // style={[FindRideStyles.button, { backgroundColor: COLORS.primary }]}
                                onClick={closeDialog}
                                label={'Okay'}
                                {...default_btn_styles}
                                />
                            </>}
                    </View>
                </View>
            </View>
        </Modal>
    )
}