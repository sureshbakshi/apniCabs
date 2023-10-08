import * as React from 'react';
import { TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getScreen } from '../util';
navigator.geolocation = require('react-native-geolocation-service');

const GooglePlaces = ({ placeholder, containerStyles }) => {
    return (

        <GooglePlacesAutocomplete
            placeholder={placeholder}
            debounce={250}
            onPress={(data, details = null) => console.log(data, details)}
            enableHighAccuracyLocation={true}
            query={{ key: 'AIzaSyBWkIzIXkqSvqxMpb4bCtwwX68sDj9OG6g', components: 'country:in', language: 'it' }}
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
                },
                row: {
                    flexDirection: 'row',
                },
                textInput: {
                    height: 45,
                    borderRadius: 0
                },
            }}
        />
    );
};
export default GooglePlaces;
