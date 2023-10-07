import * as React from 'react';
import {View, Button, Pressable, ScrollView} from 'react-native';
import styles from '../styles/MyRidePageStyles';
import { COLORS } from '../constants';
import { ImageView, Text } from '../components/common';
import images from '../util/images';
const dummyObj = [
  {
    id: 1,
    name: 'Rajesh',
    bg: COLORS.brand_blue,
    color: COLORS.white,
    status: 'On Going',
  },
  {
    id: 2,
    name: 'Suresh',
    bg: COLORS.green,
    color: COLORS.white,
    status: 'Completed',
  },
  {
    id: 3,
    name: 'Rajesh',
    bg: COLORS.brand_yellow,
    color: COLORS.black,
    status: 'Cancelled',
  },
];
const list = dummyObj.map((item, i) => {
  return (
    <View style={styles.card} key={item.id}>
      <Pressable style={[styles.status, {backgroundColor: item.bg}]}>
        <Text style={[styles.text,styles.whiteColor, {color: item.color}]}>{item.status}</Text>
      </Pressable>
      <View style={styles.cardtop}>
        <View style={styles.left}>
          {/* <View style={styles.profileIcon}></View> */}
          <ImageView source={images[`captain${i}`]} style={[styles.avatar]}/>
        </View>
        <View style={styles.middle}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.review}>({item.id} Reviews)</Text>
          <Text style={styles.address}>Bheeramguda</Text>
          <Text style={styles.address}>Hitech knowledge Park</Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.greenColor, styles.bold]}>{'\u20B9'}15</Text>
          <Text style={styles.address}>3 Seats left</Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <View style={styles.left}>
          <Text style={styles.text}>22Feb </Text>
          <Text style={styles.text}>10:00 am</Text> 
        </View>
        <View style={styles.middle}>
          <Text style={styles.text}>Honda Civic | White</Text>
        </View>
        <View style={styles.right}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{'More Info'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});
const MyRidePage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{'My Rides'.toUpperCase()}</Text>
      </View>
      <View style={styles.section}>
        <ScrollView>{list}</ScrollView>
      </View>
    </View>
  );
};
export default MyRidePage;
