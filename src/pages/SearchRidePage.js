import * as React from 'react';
import {Text, View, TextInput, Pressable, ImageBackground} from 'react-native';
import SearchRideStyles from '../styles/SearchRidePageStyles';
const SearchRidePage = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../assets/images/bg.jpeg')}
      resizeMode="cover"
      style={SearchRideStyles.image}>
      <View style={SearchRideStyles.container}>
        <View style={SearchRideStyles.section}>
          <View>
            <TextInput
              placeholder="Pickup Location"
              style={SearchRideStyles.textInputPickup}
            />
            <TextInput
              placeholder="Drop Location"
              style={SearchRideStyles.textInputDrop}
            />
          </View>
          <View>
            <Pressable
              style={SearchRideStyles.button}
              android_ripple={{color: '#fff'}}
              onPress={() => navigation.navigate('FindRide')}>
              <Text style={SearchRideStyles.text}>{'Search Rides'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
export default SearchRidePage;
