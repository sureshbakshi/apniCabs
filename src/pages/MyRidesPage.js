import * as React from 'react';
import {Text, View, Button, Pressable, ScrollView} from 'react-native';
import MyRideStyles from '../styles/MyRidePageStyles';
const dummyObj = [
  {
    id: 1,
    name: 'Rajesh',
    color: '#d73eff',
    status: 'On Going',
  },
  {
    id: 2,
    name: 'Suresh',
    color: '#11c874',
    status: 'Approved',
  },
  {
    id: 3,
    name: 'Rajesh',
    color: '#ffce00',
    status: 'Pending',
  },
];
const list = dummyObj.map((item, i) => {
  return (
    <View style={MyRideStyles.card} key={item.id}>
      <Pressable style={[MyRideStyles.status, {backgroundColor: item.color}]}>
        <Text style={MyRideStyles.text}>{'Pending'}</Text>
      </Pressable>
      <View style={MyRideStyles.cardtop}>
        <View style={MyRideStyles.left}>
          <View style={MyRideStyles.profileIcon}></View>
        </View>
        <View style={MyRideStyles.middle}>
          <Text style={MyRideStyles.name}>{item.name}</Text>
          <Text style={MyRideStyles.review}>({item.id} Reviews)</Text>
          <Text style={MyRideStyles.address}>Bheeramguda</Text>
          <Text style={MyRideStyles.address}>Hitech knowledge Park</Text>
        </View>
        <View style={MyRideStyles.right}>
          <Text style={MyRideStyles.greenTxt}>$15</Text>
          <Text style={MyRideStyles.address}>3 Seats left</Text>
        </View>
      </View>
      <View style={MyRideStyles.cardBottom}>
        <View style={MyRideStyles.left}>
          <Text style={MyRideStyles.greenTxt}>22Feb 10:00 am</Text>
        </View>
        <View style={MyRideStyles.middle}>
          <Text style={MyRideStyles.greenTxt}>Honda Civic | White</Text>
        </View>
        <View style={MyRideStyles.right}>
          <Pressable style={MyRideStyles.button}>
            <Text style={MyRideStyles.text}>{'Message'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});
const MyRidePage = ({navigation}) => {
  return (
    <View style={MyRideStyles.container}>
      <View style={MyRideStyles.header}>
        <Text style={MyRideStyles.headerText}>{'My Rides'.toUpperCase()}</Text>
      </View>
      <View style={MyRideStyles.section}>
        <ScrollView>{list}</ScrollView>
      </View>
    </View>
  );
};
export default MyRidePage;
