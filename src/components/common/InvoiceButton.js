import React from 'react'
import {
    Pressable,
    Text,
} from 'react-native';
import CommonStyles from '../../styles/commonStyles';
import generateInvoice from '../../util/generateInvoice';
import { Icon } from './Icon';
import { useTranslation } from 'react-i18next';

export default function InvoiceButton() {
    const { t } = useTranslation();
    return (
        <Pressable style={({ pressed }) => [
            CommonStyles.capsuleButton,
            pressed && CommonStyles.capsuleButtonPressed
        ]} onPress={generateInvoice}>
            <Text style={CommonStyles.capsuleButtonText}> <Icon name='download' size='medium' /> {t('invoice_btn')} </Text>
        </Pressable>
    )
}
