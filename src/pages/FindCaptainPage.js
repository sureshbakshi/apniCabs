import * as React from 'react';
import { View, Button, Pressable, ScrollView } from 'react-native';
import { ImageView, Text } from '../components/common';
import FindRideStyles from '../styles/FindRidePageStyles';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';
import {
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
  TabsProvider,
} from 'react-native-paper-tabs';
import cabiData from '../cabi';
import _ from 'lodash';
import { COLORS, VEHICLE_TYPES } from '../constants';
import { useAppContext } from '../context/App.context'
import { useGetDriverQuery } from '../slices/apiSlice';
import { Capitalize } from '../util';
const max=5
const min=0
const getRandom = () => Math.floor(Math.random() * (max - min + 1)) + min

const Card = item => {
  return (
    <View style={FindRideStyles.card} key={item.id}>
      <Timeline />
      <View style={FindRideStyles.cardtop}>
        <View style={FindRideStyles.left}>
          <ImageView
            source={images[`captain${item.profile_avatar}`]}
            style={[styles.avatar]}
          />
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={FindRideStyles.name}>{item.driver_name}</Text>
          {/* <Text style={FindRideStyles.review}>({item.size} Reviews)</Text> */}
          <Timeline data={[item.from, item.to]} />
        </View>
        <View style={FindRideStyles.right}>
          <Text style={[FindRideStyles.name, { alignSelf: 'center' }]}>
            {'\u20B9'}{item.price}
          </Text>
          <Text style={FindRideStyles.address}>{item.distance?.text}</Text>
          {/* <Text style={FindRideStyles.address}>{item.seats} Seats left</Text> */}
        </View>
      </View>
      <View style={FindRideStyles.cardBottom}>
        <View style={FindRideStyles.left}>
          {item?.distance_away && <Text style={[styles.text, styles.bold]}>{item.distance_away} km away </Text>}
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={[styles.text, styles.bold]}>{item.vehicle_model} | {item.vehicle_color}</Text>
        </View>
        <View style={FindRideStyles.right}>
          <Pressable style={FindRideStyles.button}>
            <Text style={FindRideStyles.text}>{'Request'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const FindCaptainPage = () => {
  const [index, setIndex] = React.useState(0);
  const goTo = useTabNavigation();
  const handleChangeIndex = index => {
    setIndex(index);
  };
  const { data: driversList, error, isLoading } = useGetDriverQuery()
  if (isLoading || error) {
    return null
  }
  const data = _.groupBy(driversList.data, 'type');

  const { route, location: { from, to } } = useAppContext()
  const extraProps = {
    ...route,
    from: from?.formatted_address || '',
    to: to?.formatted_address || '',
    // profile_avatar: images[`captain${getRandom()}`],
  }
  console.log({extraProps, data})

  const renderCard = (list, key) => list.map(item => {
    return <Card {...{
      ...item, ...extraProps
    }} key={`${key}_${item.vehicle_id}`} />;
  })

  return (
    <View style={FindRideStyles.container}>
      <TabsProvider defaultIndex={index} onChangeIndex={handleChangeIndex}>
        <Tabs
          mode="scrollable"
          style={FindRideStyles.tabs}
          tabBarUnderlineStyle={{ backgroundColor: COLORS.primary }}
          theme={{
            colors: { onSurface: COLORS.primary, onSurfaceVariant: COLORS.black },
          }}>
          {Object.keys(data).map((key, i) => {
            return <TabScreen label={Capitalize(key)} icon={VEHICLE_TYPES[key]} key={`${key}`}>
              <View style={FindRideStyles.section}>
                <ScrollView>{renderCard(data[key], key)}</ScrollView>
              </View>
            </TabScreen>
          })}
        </Tabs>
      </TabsProvider>
    </View>
  );
};
export default FindCaptainPage;
