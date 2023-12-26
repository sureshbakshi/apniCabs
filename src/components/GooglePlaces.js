import * as React from 'react';
import { Pressable, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('react-native-geolocation-service');
import Config from "../util/config";
import { Icon } from '../components/common';
import { COLORS } from '../constants';


const GooglePlaces = ({ placeholder, containerStyles, locationKey, onSelection, currentLocation }) => {
    const ref = React.useRef();

    const getLocation = () => {
        if (ref){
            ref.current.getCurrentLocation();
            ref.current.focus()
        }
    }
    return (
        <>
            <GooglePlacesAutocomplete
                ref={ref}

                placeholder={placeholder}
                // debounce={25}
                keepResultsAfterBlur={false}
                isRowScrollable={true}
                onPress={(data, details = null) => {
                    return onSelection(locationKey, details)
                }
                }
                enableHighAccuracyLocation={true}
                query={{ key: Config.GOOGLE_PLACES_KEY, components: 'country:in' }}
                fetchDetails={true}
                onFail={error => console.log(error)}
                onNotFound={() => console.log('no results')}
                currentLocation={currentLocation}
                currentLocationLabel={'Get Current Location'} // add a simple label
                nearbyPlacesAPI='GoogleReverseGeocoding'
                minLength={3}
                disableScroll={false}
                textInputProps={{
                    InputComp: TextInput,
                    // selection: {start: 0},
                    selectTextOnFocus: true
                }}
                listViewDisplayed={false}
                autoSelectFirstResult={true}
                enablePoweredByContainer={false}
                styles={{
                    container: {
                        flex: 0,
                        marginTop: -5,
                        ...containerStyles,
                    },
                    textInputContainer: {
                        height: 'auto',
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
                        height: 300,
                    },
                    row: {
                        flexDirection: 'row',
                    },
                    textInput: {
                        height: 45,
                        borderRadius: 0,
                        paddingLeft: 20,
                        paddingRight: currentLocation? 45: 0
                    },
                }}
            />
            {currentLocation ? <Pressable onPress={getLocation} style={{ margin: 10, padding: 5, position: 'absolute', zIndex: 3, right: 0, top: -10 }}><Icon name="crosshairs-gps" size="large" color={COLORS.primary} /></Pressable> : null}
        </>
    );
};
export default GooglePlaces;
