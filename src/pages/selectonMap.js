import React, { useCallback, useEffect, useRef, useState } from 'react';
import FindRideStyles from '../styles/FindRidePageStyles';
import ContainerWrapper from '../components/common/ContainerWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import HeaderBackButton from '../components/common/HeaderBackButton';
import { Platform, Text, View } from 'react-native';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import CommonStyles from '../styles/commonStyles';
import CustomButton from '../components/common/CustomButton';
import { ImageView } from '../components/common';
import images from '../util/images';
import { COLORS, MAPS_LABELS, ROUTES_NAMES } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import config from '../util/config';
import { useAppContext } from '../context/App.context';
import { useTranslation } from 'react-i18next';
import { getScreen } from '../util';

const initial_region = {
    latitude: 17.5184667,
    longitude: 78.3038433,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
}
const SelectOnPage = () => {
    // Use the named export Marker to avoid deprecated MapView.Marker
    const { t } = useTranslation();
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
        } else {
            const { latitude, longitude } = currentLocation || {};
            if (latitude) {
                setRegionChange({ ...initial_region, latitude, longitude });
                getAddress(currentLocation);
            }
        }
    }, [location, currentLocation])

    useEffect(() => {
        getCurrentLocation();
    }, [])

    const areRegionsEqual = (region1, region2, tolerance = 0.00001) => {
        return (
            Math.abs(region1.latitude - region2.latitude) < tolerance &&
            Math.abs(region1.longitude - region2.longitude) < tolerance &&
            Math.abs(region1.latitudeDelta - region2.latitudeDelta) < tolerance &&
            Math.abs(region1.longitudeDelta - region2.longitudeDelta) < tolerance
        );
    };

    useEffect(() => {
        if (mapRef.current && region) {
            const currentRegion = mapRef.current.__lastRegion;

            if (!currentRegion || !areRegionsEqual(currentRegion, region)) {
                mapRef.current.animateToRegion(region);
                mapRef.current.__lastRegion = region;
            }
        }
    }, [region]);

    const getAddress = async (targetRegion = region) => {
        const apiKey = config.GOOGLE_PLACES_KEY;
        const { latitude, longitude } = targetRegion || {};
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
        const normalized = {
            latitude: newRegion?.latitude ?? region.latitude,
            longitude: newRegion?.longitude ?? region.longitude,
            latitudeDelta: newRegion?.latitudeDelta ?? region.latitudeDelta ?? initial_region.latitudeDelta,
            longitudeDelta: newRegion?.longitudeDelta ?? region.longitudeDelta ?? initial_region.longitudeDelta,
        };
        setRegionChange(normalized);
        getAddress(normalized);
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
                    style={{ height: getScreen().screenHeight - 350 }}
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                    initialRegion={region}
                    onRegionChangeComplete={onRegionChange}>
                    {/* Marker-free selection: use a centered pin overlay and map center as selection */}
                </MapView>

                {/* Centered pin overlay */}
                <View pointerEvents="none" style={{ position: 'absolute', top: (getScreen().screenHeight - 350) / 2 - 20, alignSelf: 'center', zIndex: 10 }}>
                    <ImageView source={images.pin} style={{ width: 40, height: 40 }} />
                </View>

                <View style={[{ borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 250 }]}>
                    <View style={[CommonStyles.p15]}>
                        <View style={[CommonStyles.shadow, { position: 'absolute', top: -50, left: 20 }]}>
                            <HeaderBackButton />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.text_dark, fontSize: 17, fontWeight: 600 }}>{`Select ${MAPS_LABELS[focusKey]} location`}</Text>
                            <CustomButton
                                onClick={() => navigation.navigate(ROUTES_NAMES.searchRide, { address, focusKey })}
                                label={t('change_btn')}
                                styles={{ borderWidth: 1, borderRadius: 20, borderColor: COLORS.bg_secondary, backgroundColor: COLORS.white, height: 40 }}
                                textStyles={{ color: COLORS.text_dark, fontWeight: 600, fontSize: 14, lineHeight: 18 }}
                                isLowerCase
                            />
                        </View>
                        <CustomButton
                            iconLeft={{ name: 'map-marker-circle', size: 'large', color: 'green' }}
                            isLoading={isEmpty(address)}
                            styles={{ maxHeight: 70, backgroundColor: COLORS.sepator_line, borderRadius: 20, marginBottom: 30, marginTop: 20, borderWidth: 1, borderColor: COLORS.bg_secondary, paddingHorizontal: 10, marginVertical: 10 }}
                            textStyles={{ fontSize: 12, fontWeight: "400", lineHeight: 16, color: COLORS.black, textTransform: 'capitalize' }}
                            label={address?.formatted_address}
                        />
                        <CustomButton
                            onClick={onConfirmSelection}
                            styles={{ backgroundColor: COLORS.brand_yellow, borderRadius: 20, height: 50 }}
                            textStyles={{ fontSize: 16, fontWeight: 'bold', lineHeight: 16, color: COLORS.black, textTransform: 'capitalize' }}
                            label={t('select_pickup_btn')}
                        />
                    </View>
                </View>
            </ContainerWrapper>
        </SafeAreaView>
    );
};
export default SelectOnPage;
