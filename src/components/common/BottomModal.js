import React from "react";
import { View } from "react-native";
import Modal from "react-native-modal";
import BottomModalStyles from "../../styles/BottomModalStyles";
import UserList from "./BookForOtherList";


function BottomModal({ visible, onCloseModal }) {

    return (
        <View style={BottomModalStyles.flexView}>

            <Modal
                onBackdropPress={onCloseModal}
                onBackButtonPress={onCloseModal}
                isVisible={visible}
                swipeDirection="down"
                onSwipeComplete={onCloseModal}
                animationIn="bounceInUp"
                animationOut="bounceOutDown"
                animationInTiming={900}
                animationOutTiming={500}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={500}
                style={BottomModalStyles.modal}
            >
                <View style={BottomModalStyles.modalContent}>
                    {/* <View style={[CommonStyles.shadow, { position: 'absolute', top: -50, left: 20 }]}>
                        <HeaderBackButton onClick={(e) => { e.stopPropagation(); onCloseModal() }} />
                    </View> */}
                    <View style={BottomModalStyles.center}>
                        <View style={BottomModalStyles.barIcon} />
                    </View>
                    <UserList onCloseModal={onCloseModal}/>
                </View>
            </Modal>
        </View>
    );
}

export default BottomModal;

