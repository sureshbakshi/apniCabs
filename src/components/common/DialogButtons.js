import React from 'react'
import { getScreen } from '../../util'
import CustomButton from './CustomButton'
import { View } from 'react-native'
import { COLORS } from '../../constants'
import { useTranslation } from 'react-i18next'

export default function DialogButtons({ handleSubmit, closeModal, isLowerCase = true }) {
    const {t} = useTranslation()
    return (
        <View style={{ flexDirection: 'row', gap: 15, margin: 15, width: getScreen().screenWidth - 30, justifyContent: 'center' }}>
            <CustomButton
                styles={{ height: 40, minWidth: 120 }}
                textStyles={{ color: COLORS.white, fontSize: 14, fontWeight: 400, lineHeight: 18 }}
                onClick={handleSubmit}
                label={t('submit_btn')}
                isLowerCase={isLowerCase} />
            <CustomButton
                styles={{ backgroundColor: COLORS.card_bg, height: 40, minWidth: 120 }}
                textStyles={{ color: COLORS.black, fontSize: 14, fontWeight: 400, lineHeight: 18 }}
                onClick={closeModal}
                label={t('close_btn')}
                isLowerCase={isLowerCase} />

        </View>
    )
}
