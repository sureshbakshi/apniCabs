import React, { useMemo, useCallback } from 'react';
import { COLORS } from "../../constants"
import FindRideStyles from "../../styles/FindRidePageStyles"
import openMap from 'react-native-open-maps';
import CustomButton from "./CustomButton";

const getCoordinates = (data) => {
    if (data?.latitude && data?.longitude) {
        return `${data.latitude},${data.longitude}`
    } else if (data?.Lat && data?.Long) {
        return `${data.Lat},${data.Long}`
    } else {
        return data
    }
}

const OpenMapButton = ({ title = 'Get Route Map', buttonStyles = {}, iconStyles = {}, fromLocation = {}, toLocation = {} }) => {

    const openMapApp = useCallback(() => {
        const route = { start: getCoordinates(fromLocation), end: getCoordinates(toLocation), navigate: true, zoom: 20 }
        openMap(route);
    }, [fromLocation, toLocation])

    const styles = useMemo(() => ({
        ...FindRideStyles.button, backgroundColor: COLORS.primary, minWidth: 160, height: 40, ...buttonStyles
    }), [buttonStyles])

    const textStyles = useMemo(() => ({ ...FindRideStyles.text }), [])
    const iconLeft = useMemo(() => ({ name: 'directions', size: 'large' }), [])

    return (
        <CustomButton
            onPress={openMapApp}
            iconLeft={iconLeft}
            label={title}
            isLowerCase
            textStyles={textStyles}
            styles={styles}
            iconStyles={iconStyles}
        />
    )
}

export default React.memo(OpenMapButton)