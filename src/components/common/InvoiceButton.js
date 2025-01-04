import React from 'react'
import {
    Pressable,
    Text,
} from 'react-native';
import CommonStyles from '../../styles/commonStyles';
import generateInvoice from '../../util/generateInvoice';
import { Icon } from './Icon';

export default function InvoiceButton() {
    return (
        <Pressable style={({ pressed }) => [
            CommonStyles.capsuleButton,
            pressed && CommonStyles.capsuleButtonPressed
        ]} onPress={generateInvoice}>
            <Text style={CommonStyles.capsuleButtonText}> <Icon name='download' size='medium' /> Invoice </Text>
        </Pressable>
    )
}
