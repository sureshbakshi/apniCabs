import { useEffect, useState } from "react";
import ActiveRidePageStyles from "../../styles/ActiveRidePageStyles";
import { Modal, Pressable, View } from 'react-native'
import { Text } from "react-native-paper";
import { COLORS } from "../../constants";
import FindRideStyles from "../../styles/FindRidePageStyles";

export default ({ openDialog, actions, title, closeCb, children }) => {
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
            <View style={ActiveRidePageStyles.centeredView}>
                <View style={ActiveRidePageStyles.modalView}>
                    <View>
                        <Text style={[ActiveRidePageStyles.modalText, { borderBottomColor: COLORS.bg_secondary, borderBottomWidth: 1 }]}>
                            {title}
                        </Text>
                        <View style={ActiveRidePageStyles.content}>
                            {children}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {actions ? actions : <>
                            <Pressable
                                android_ripple={{ color: '#fff' }}
                                style={[FindRideStyles.button, { backgroundColor: COLORS.primary }]}
                                onPress={closeDialog}>
                                <Text
                                    style={[
                                        FindRideStyles.text,
                                        { fontWeight: 'bold', color: COLORS.white },
                                    ]}>
                                    Ok
                                </Text>
                            </Pressable></>}
                    </View>
                </View>
            </View>
        </Modal>
    )
}