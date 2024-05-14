import * as React from 'react';
import { View, Pressable, FlatList, SafeAreaView } from 'react-native';
import styles from '../styles/MyRidePageStyles';
import { COLORS, ROUTES_NAMES, colorsNBg } from '../constants';
import { Icon, ImageView, Text } from '../components/common';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import { formattedDate, getRandomNumber } from '../util';
import { get } from 'lodash'
import SearchLoader from '../components/common/SearchLoader';
import { navigate } from '../util/navigationService';

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
  const { color, bg, label, image } = getColorNBg(status)

  return <Pressable style={styles.card} key={item.id}
    android_ripple={{ color: '#ccc' }}
    onPress={() => item?.id ? navigate(ROUTES_NAMES.rideDetails, { id: item?.id }) : null}
    >
    <View style={[styles.status, { backgroundColor: bg }]}>
      <Text style={[styles.text, styles.whiteColor, { color: color }]}>{label}</Text>
    </View>
    <View style={styles.cardtop}>
      <View style={[styles.left, { paddingRight: 0, paddingLeft: 20 }]}>
        <ImageView source={image || images[`captain${getRandomNumber()}`]} style={[styles.avatar]} />
      </View>
      <View style={styles.middle}>
        {/* <Text style={styles.name}>{item.name}</Text> */}
        {/* <Text style={styles.review}></Text> */}
        <Timeline data={[getValue(item, keys.from), getValue(item, keys.to)]} />
      </View>
      {fare && <View style={styles.right}>
        <Text style={[styles.greenColor, styles.bold]}>{'\u20B9'}{fare}</Text>
        {/* <Text style={styles.address}>3 Seats left</Text> */}
        <View style={{ alignItems: 'flex-end', marginVertical: 10 }}>
          <Icon name='chevron-right' size='large' color={COLORS.gray}/>
        </View>
      </View>}
    </View>
    <View style={styles.cardBottom}>
      {time && <View style={[styles.right, { right: -10, position: 'absolute' }]}>
        {<Text style={styles.text}>{formattedDate(time)}</Text>}
      </View>}
    </View>
  </Pressable>
}
const MyRidePage = ({ data, keys }) => {
  return (
    <SafeAreaView style={styles.container}>
      {data?.length ? <View style={styles.section}>
        <FlatList
          data={data}
          renderItem={({ item, i }) => <Card item={item} key={i} keys={keys} />}
          keyExtractor={item => item.id}
        />
      </View> :
        <SearchLoader msg="No Records found." isLoader={false} containerStyles={{ flex: 1, justifyContent: 'center' }}></SearchLoader>}
    </SafeAreaView>
  );
};
export default MyRidePage;
