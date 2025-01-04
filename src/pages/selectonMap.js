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
import { COLORS, ROUTES_NAMES } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isEmpty } from 'lodash';

const intial_region = {
    latitude: 17.5184667,
    longitude: 78.3038433,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
}
const SelectOnPage = () => {
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const [region, setRegionChnage] = useState(intial_region);
    const [address, setAdress] = useState(null)
    const { currentLocation, getCurrentLocation } = useGetCurrentLocation();
    const { location, focusKey } = route?.params;

    useEffect(() => {
        if (!isEmpty(location[focusKey]?.geometry)) {
            const { lat, lng } = location[focusKey]?.geometry?.location;
            setRegionChnage({ ...intial_region, latitude: lat, longitude: lng });
            setAdress(location[focusKey]);
            mapRef.current?.animateToRegion(region);
        } else {
            const { latitude, longitude } = currentLocation;
            if (latitude) {
                setRegionChnage({ ...intial_region, latitude, longitude });
                getAddress(currentLocation);
            }
        }
    }, [location, currentLocation])

    useEffect(() => {
        getCurrentLocation();
    }, [])



    const getAddress = async (region = region) => {
        await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + region.latitude + ',' + region.longitude + '&key=' + 'AIzaSyBJ2ObLgEbv2HLGLuqG4vZRftGl7DsA6v4')
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.results.length > 0) {
                    const address = responseJson.results[0];
                    setAdress(address);
                    return responseJson.results[0];
                }
                return responseJson;
            }).catch((error) => {
                console.log('error=> ' + error);
            });

    }
    const onRegionChnage = (newRegion) => {
        setRegionChnage(newRegion);
        getAddress(newRegion);
    }
    return (
        <SafeAreaView style={[FindRideStyles.container]}>
            <ContainerWrapper>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={{ height: 500 }}
                    initialRegion={region}
                    onRegionChangeComplete={onRegionChnage}>
                    <Marker
                        coordinate={region}
                        onDragEnd={(e) => onRegionChnage(e.nativeEvent.coordinate)}
                        draggable />
                </MapView>
                <View style={[CommonStyles.shadow2, { position: 'absolute', top: 10, left: 10 }]}>
                    <HeaderBackButton />
                </View>
                <View style={[CommonStyles.p15]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Select your location</Text>
                        <CustomButton
                            onClick={() => navigation.navigate(ROUTES_NAMES.searchRide, { address, focusKey })}
                            label={`Change ${focusKey} location`}
                            styles={{ borderWidth: 1, backgroundColor: COLORS.bg_gray_secondary, height: 40 }}
                            textStyles={{ color: COLORS.black, fontWeight: 400, fontSize: 14, lineHeight: 18 }}
                            isLowerCase
                        />
                    </View>
                    <CustomButton
                        isLoading={isEmpty(address)}
                        styles={{ backgroundColor: COLORS.white, borderWidth: 1, paddingHorizontal: 10, marginVertical: 10 }}
                        textStyles={{ fontSize: 12, fontWeight: 400, lineHeight: 16, color: COLORS.black, textTransform: 'capitalize' }}
                        label={address?.formatted_address} />

                </View>
            </ContainerWrapper>
        </SafeAreaView>
    );
};
export default SelectOnPage;
