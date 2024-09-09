import React from 'react'
import CustomButton from './CustomButton'
import { COLORS } from '../../constants'
import CommonStyles from '../../styles/commonStyles'
import { goBack } from '../../util/navigationService'

export default function HeaderBackButton() {
    return (
        <CustomButton
            label={''}
            styles={{ width: 40, height: 40, borderRadius: 100, backgroundColor: COLORS.white, ...CommonStyles.shadow2, paddingHorizontal: 0, alignItems: 'center' }}
            isLowerCase
            iconLeft={{ name: 'arrow-left', size: 'large', color: COLORS.black }}
            iconStyles={{ paddingRight: 0 }}
            onClick={goBack}
        />
    )
}
