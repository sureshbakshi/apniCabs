import * as React from 'react';
import {Text, View, TextInput, Button, ScrollView} from 'react-native';
import RideStyles from '../styles/RidePageStyles';
const FindRide = () => {
  return (
    <View style={RideStyles.container}>
      <Text style={RideStyles.headerText}>Find A Ride</Text>
      <View style={RideStyles.section}>
        <View>
          <TextInput
            placeholder="Pickup Location"
            style={RideStyles.textInputPickup}
          />
          <TextInput
            placeholder="Drop Location"
            style={RideStyles.textInputDrop}
          />
        </View>
        <View>
          <Button title="Search Rides" color={'green'}/>
        </View>
      </View>
    </View>
  );
};
export default FindRide;
