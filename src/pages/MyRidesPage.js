import * as React from 'react';
import { View, Button, Pressable, ScrollView } from 'react-native';
import styles from '../styles/MyRidePageStyles';
import { COLORS, RideStatus } from '../constants';
import { ImageView, Text } from '../components/common';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import { formattedDate, getRandomNumber } from '../util';
import { get } from 'lodash'

const colorsNBg = {
  [RideStatus.USER_CANCELLED]: { color: COLORS.black, bg: COLORS.bg_secondary, label: 'Cancelled' },
  [RideStatus.DRIVER_CANCELLED]: { color: COLORS.black, bg: COLORS.bg_secondary, label: 'Cancelled' },
  [RideStatus.COMPLETED]: { color: COLORS.white, bg: COLORS.green, label: 'Completed' },
}

const getColorNBg = (status) => {
  return colorsNBg[status] || { color: COLORS.black, bg: COLORS.bg_secondary, label: status }
}

const getValue = (data, key) => {
  return get(data, key, null)
}

const Card = ({ item, keys }) => {
  const status = getValue(item, keys.status)
  const fare = getValue(item, keys.fare)
  const time = getValue(item, keys.rideTime)
  const { color, bg, label } = getColorNBg(status)

  return <View style={styles.card} key={item.id}>
    <Pressable style={[styles.status, { backgroundColor: bg }]}>
      <Text style={[styles.text, styles.whiteColor, { color: color }]}>{label}</Text>
    </Pressable>
    <View style={styles.cardtop}>
      <View style={styles.left}>
        {/* <View style={styles.profileIcon}></View> */}
        <ImageView source={images[`captain${getRandomNumber()}`]} style={[styles.avatar]} />
      </View>
      <View style={styles.middle}>
        {/* <Text style={styles.name}>{item.name}</Text> */}
        {/* <Text style={styles.review}></Text> */}
        <Timeline data={[getValue(item, keys.from), getValue(item, keys.to)]} />
      </View>
      {fare && <View style={styles.right}>
        <Text style={[styles.greenColor, styles.bold]}>{'\u20B9'}{fare}</Text>
        {/* <Text style={styles.address}>3 Seats left</Text> */}
      </View>}
    </View>
    <View style={styles.cardBottom}>
      {time && <View style={[styles.right, { right: -10, position: 'absolute' }]}>
        {<Text style={styles.text}>{formattedDate(time)}</Text>}
      </View>}
      {/* <View style={styles.middle}>
          <Text style={styles.text}>10:00 am</Text>
          <Text style={styles.text}>Honda Civic | White</Text>
        </View> */}
      {/* <View style={styles.right}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{'More Info'}</Text>
          </Pressable>
        </View> */}
    </View>
  </View>
}
const MyRidePage = ({ data, keys }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{'My Rides'.toUpperCase()}</Text>
      </View>
      <View style={styles.section}>
        <ScrollView>{data?.map((item, i) => <Card item={item} key={i} keys={keys} />)}</ScrollView>
      </View>
    </View>
  );
};
export default MyRidePage;
