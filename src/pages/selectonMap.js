import React, { useEffect, useState } from 'react';
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

const intial_region = {
    latitude: 17.5184667,
    longitude: 78.3038433,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
}

const SelectOnPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [region, setRegionChnage] = useState(intial_region);
    const [address, setAdress] = useState(null)
    const { currentLocation, getCurrentLocation } = useGetCurrentLocation();


    useEffect(() => {
        const { latitude, longitude } = currentLocation;
        if (latitude) {
            setRegionChnage({ ...intial_region, latitude, longitude });
            getAddress(currentLocation);
        }
    }, [currentLocation])

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
                    provider={PROVIDER_GOOGLE}
                    style={{ height: 500 }}
                    initialRegion={intial_region}
                    showsUserLocation
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
                    <Text>Select your location</Text>
                    <CustomButton
                        onClick={() => navigation.navigate(ROUTES_NAMES.searchRide, { address, focusKey: route?.params?.focusKey })}
                        styles={{ backgroundColor: COLORS.white, borderWidth: 1, paddingHorizontal: 10, marginVertical: 10 }}
                        textStyles={{ fontSize: 12, fontWeight: 400, lineHeight: 16, color: COLORS.black, textTransform: 'capitalize' }}
                        label={address?.formatted_address} />
                </View>
            </ContainerWrapper>
        </SafeAreaView>
    );
};
export default SelectOnPage;
