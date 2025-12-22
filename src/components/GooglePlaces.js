import React, { useEffect, useState } from 'react';
import { Pressable, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import useGetCurrentLocation from '../hooks/useGetCurrentLocation';
import { Icon } from '../components/common';
import { COLORS } from '../constants';
import isEmpty from "lodash/isEmpty";
import config from '../util/config';
import { cleanFormattedAddress } from '../util';
import { getPlaceDetailsFromCoordinates } from '../util/location';


const GooglePlaces = ({ placeholder, onInputFocus, containerStyles, locationDetails, textContainerStyles, locationKey, onSelection, currentLocation }) => {
    const ref = React.useRef();
    const [listViewDisplayed, setListViewDisplayed] = useState('auto');
    const [isLoading, setIsLoading] = useState(false);
    const [textSelection, setTextSelection] = useState({ start: 0 });
    const { getCoordinates } = useGetCurrentLocation();

    const getLocation = async () => {
        setIsLoading(true);
        const coords = await getCoordinates();
        if (coords) {
            const { latitude, longitude } = coords;
            const details = await getPlaceDetailsFromCoordinates(latitude, longitude);
            if (details) {
                const address = cleanFormattedAddress(details.formatted_address);
                ref.current?.setAddressText(address);
                ref.current?.blur();
                Keyboard.dismiss();
                onSelection(locationKey, details);
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        ref.current?.setAddressText(cleanFormattedAddress(locationDetails?.formatted_address || ''));
        setTextSelection({ start: 0 });
    }, [locationDetails]);

    // useEffect(() => {
    //     if (currentLocation && isEmpty(locationDetails)) {
    //         getLocation();
    //     }
    // }, []);

    return (
        <>
            <GooglePlacesAutocomplete
                ref={ref}
                placeholder={placeholder}
                debounce={250}
                keepResultsAfterBlur={false}
                onPress={(data, details = null) => {
                    console.log('GooglePlaces onPress details', locationKey, details);
                    setListViewDisplayed(false);
                    ref.current?.blur();
                    Keyboard.dismiss();
                    return onSelection(locationKey, details)
                }
                }
                enableHighAccuracyLocation={true}
                query={{ key: config.GOOGLE_PLACES_KEY, components: 'country:in' }}
                fetchDetails={true}
                onFail={error => console.log(error)}
                onNotFound={() => console.log('no results')}
                currentLocation={false}
                currentLocationLabel={'Get Current Location'} // add a simple label
                nearbyPlacesAPI='GoogleReverseGeocoding'
                minLength={3}
                disableScroll={false}
                textInputProps={{
                    InputComp: TextInput,
                    selection: textSelection,
                    onSelectionChange: (event) => setTextSelection(event.nativeEvent.selection),
                    onFocus: () => {
                        setListViewDisplayed('auto');
                        onInputFocus(locationKey);
                    },
                    onChange: (event) => {
                        const { value } = event.nativeEvent;
                        if (isEmpty(value)) {
                            return onSelection(locationKey, null)
                        }
                    },
                    selectTextOnFocus: true
                }}
                listViewDisplayed={listViewDisplayed}
                keyboardShouldPersistTaps="handled"
                autoSelectFirstResult={true}
                enablePoweredByContainer={false}
                styles={{
                    container: {
                        flex: 0,
                        marginTop: -5,
                        backgroundColor: COLORS.bg_blue_lite,
                        paddingHorizontal: 20,
                        ...containerStyles,
                    },
                    textInputContainer: {
                        height: 'auto',
                        borderBottomColor: COLORS.gray,
                        ...textContainerStyles
                    },
                    description: {
                        color: '#000',
                        fontSize: 16,
                        flexWrap: 'wrap',
                    },
                    predefinedPlacesDescription: {
                        color: '#3caf50',
                    },
                    poweredContainer: {
                        display: 'none'
                    },
                    listView: {
                        position: 'absolute',
                        top: 43,
                        zIndex: 4,
                        maxHeight: 300,
                        right: 0,
                        left: 0,
                        borderWidth: 1,
                        borderColor: COLORS.bg_gray_primary
                    },
                    row: {
                        flexDirection: 'row',
                        paddingLeft: 20,
                        backgroundColor: COLORS.white,
                        borderBottomColor: COLORS.bg_gray_primary,
                        borderBottomWidth: .5,
                        flexShrink: 1
                    },
                    textInput: {
                        height: 45,
                        paddingRight: currentLocation ? 45 : 0,
                        backgroundColor: COLORS.bg_blue_lite,
                    },
                }}
            />
            {currentLocation ? <Pressable onPress={getLocation} style={{ margin: 10, padding: 5, position: 'absolute', zIndex: 3, right: 0, top: -10 }}>
                {isLoading ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Icon name="crosshairs-gps" size="large" color={COLORS.primary} />}
            </Pressable> : null}
        </>
    );
};
export default GooglePlaces;
