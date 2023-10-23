import * as React from 'react';
import { TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
navigator.geolocation = require('react-native-geolocation-service');
import Config from "../util/config";

const GooglePlaces = ({ placeholder, containerStyles , locationKey, onSelection}) => {
    return (

        <GooglePlacesAutocomplete
            placeholder={placeholder}
            // debounce={25}
            onPress={(data, details = null) => onSelection(locationKey, details)}
            enableHighAccuracyLocation={true}
            query={{ key: Config.GOOGLE_PLACES_KEY, components: 'country:in', language: 'it' }}
            fetchDetails={true}
            onFail={error => console.log(error)}
            onNotFound={() => console.log('no results')}
            // currentLocation={true}
            // currentLocationLabel="Current Location" // add a simple label
            nearbyPlacesAPI='GoogleReverseGeocoding'
            minLength={3}
            textInputProps={{
                InputComp: TextInput,
            }}
            listViewDisplayed="auto"

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
                    zIndex: 4
                },
                row: {
                    flexDirection: 'row',
                },
                textInput: {
                    height: 45,
                    borderRadius: 0,
                    paddingLeft: 20
                },
            }}
        />
    );
};
export default GooglePlaces;
