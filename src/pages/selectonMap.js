import React, { useEffect, useRef, useState } from 'react';
import FindRideStyles from '../styles/FindRidePageStyles';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import HeaderBackButton from '../components/common/HeaderBackButton';
import { Text, View } from 'react-native';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import CommonStyles from '../styles/commonStyles';
import CustomButton from '../components/common/CustomButton';
import { COLORS, MAPS_LABELS, ROUTES_NAMES } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import config from '../util/config';
import { useAppContext } from '../context/App.context';

const initial_region = {
    latitude: 17.5184667,
    longitude: 78.3038433,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
}
const SelectOnPage = () => {
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const [region, setRegionChange] = useState(initial_region);
    const [address, setAddress] = useState(null)
    const { currentLocation, getCurrentLocation } = useGetCurrentLocation();
    const { focusKey } = route?.params;
    const { location, updateLocation } = useAppContext();

    useEffect(() => {
        if (!isEmpty(location[focusKey]?.geometry)) {
            const { lat, lng } = location[focusKey]?.geometry?.location;
            setRegionChange({ ...initial_region, latitude: lat, longitude: lng });
            setAddress(location[focusKey]);
            mapRef.current?.animateToRegion(region);
        } else {
            const { latitude, longitude } = currentLocation;
            if (latitude) {
                setRegionChange({ ...initial_region, latitude, longitude });
                getAddress(currentLocation);
            }
        }
    }, [location, currentLocation])

    useEffect(() => {
        getCurrentLocation();
    }, [])



    const getAddress = async (region = region) => {
        const apiKey = config.GOOGLE_PLACES_KEY;
        const { latitude, longitude } = region;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${apiKey}`;
        await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.results.length > 0) {
                    const address = responseJson.results[0];
                    setAddress(address);
                    return responseJson.results[0];
                }
                return responseJson;
            }).catch((error) => {
                console.log('error=> ' + error);
            });

    }
    const onRegionChange = (newRegion) => {
        setRegionChange(newRegion);
        getAddress(newRegion);
    }
    const onConfirmSelection = () => {
        updateLocation(focusKey, address)
        navigation.navigate(ROUTES_NAMES.searchRide, { address, focusKey })
    }
    return (
        <SafeAreaView style={[FindRideStyles.container]}>
            <ContainerWrapper>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={{ height: 550 }}
                    initialRegion={region}
                    onRegionChangeComplete={onRegionChange}>
                    <Marker
                        coordinate={region}
                        onDragEnd={(e) => onRegionChange(e.nativeEvent.coordinate)}
                        draggable />
                </MapView>

                <View style={[{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
                    <View style={[CommonStyles.p15]}>
                        <View style={[CommonStyles.shadow, { position: 'absolute', top: -50, left: 20 }]}>
                            <HeaderBackButton />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.text_dark, fontSize: 17, fontWeight: 600 }}>{`Select ${MAPS_LABELS[focusKey]} location`}</Text>
                            <CustomButton
                                onClick={() => navigation.navigate(ROUTES_NAMES.searchRide, { address, focusKey })}
                                label={`Change`}
                                styles={{ borderWidth: 1, borderRadius: 20, borderColor: COLORS.bg_secondary, backgroundColor: COLORS.white, height: 40 }}
                                textStyles={{ color: COLORS.text_dark, fontWeight: 600, fontSize: 14, lineHeight: 18 }}
                                isLowerCase
                            />
                        </View>
                        <CustomButton
                            iconLeft={{ name: 'map-marker-circle', size: 'large', color: 'green' }}
                            isLoading={isEmpty(address)}
                            styles={{ backgroundColor: COLORS.sepator_line, borderRadius: 20, marginBottom: 30, marginTop: 20, borderWidth: 1, borderColor: COLORS.bg_secondary, paddingHorizontal: 10, marginVertical: 10 }}
                            textStyles={{ fontSize: 12, fontWeight: 400, lineHeight: 16, color: COLORS.black, textTransform: 'capitalize' }}
                            label={address?.formatted_address}
                        />
                        <CustomButton
                            onClick={onConfirmSelection}
                            styles={{ backgroundColor: COLORS.brand_yellow, borderRadius: 20, height: 50 }}
                            textStyles={{ fontSize: 16, fontWeight: 'bold', lineHeight: 16, color: COLORS.black, textTransform: 'capitalize' }}
                            label={'Select Pickup'}
                        />
                    </View>
                </View>
            </ContainerWrapper>
        </SafeAreaView>
    );
};
export default SelectOnPage;
