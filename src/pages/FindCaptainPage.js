import * as React from 'react';
import {View, Button, Pressable, ScrollView} from 'react-native';
import {ImageView, Text} from '../components/common';
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
import cabiData from '../cabi.json';
import _ from 'lodash';
import {COLORS} from '../constants';

const Card = item => {
  return (
    <View style={FindRideStyles.card} key={item.id}>
      <Timeline />
      <View style={FindRideStyles.cardtop}>
        <View style={FindRideStyles.left}>
          <ImageView
            source={images[`captain${item.id}`]}
            style={[styles.avatar]}
          />
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={FindRideStyles.name}>David Johson</Text>
          <Text style={FindRideStyles.review}>({item.size} Reviews)</Text>
          <Timeline data={['Bheeramguda', 'Hitech knowledge Park']} />
        </View>
        <View style={FindRideStyles.right}>
          <Text style={[FindRideStyles.name, {alignSelf: 'center'}]}>
            {'\u20B9'}15
          </Text>
          <Text style={FindRideStyles.address}>3 Seats left</Text>
        </View>
      </View>
      <View style={FindRideStyles.cardBottom}>
        <View style={FindRideStyles.left}>
          <Text style={[styles.text, styles.bold]}>10:00 am</Text>
        </View>
        <View style={FindRideStyles.middle}>
          <Text style={[styles.text, styles.bold]}>Honda Civic | White</Text>
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

  const data = _.groupBy(cabiData, 'category');

  const autoData = data['Auto'].map(item => {
    return <Card {...item} key={`Auto ${item.id}`} />;
  });
  const bikeData = data['Bike'].map(item => {
    return <Card {...item} key={`Bike ${item.id}`} />;
  });
  const primeData = data['Prime Plus'].map(item => {
    return <Card {...item} key={`Prime ${item.id}`} />;
  });

  return (
    <View style={FindRideStyles.container}>
      <TabsProvider defaultIndex={index} onChangeIndex={handleChangeIndex}>
        <Tabs
          mode="scrollable"
          style={FindRideStyles.tabs}
          tabBarUnderlineStyle={{ backgroundColor: 'dodgerblue' }}
          theme={{
            colors: {onSurface: COLORS.primary, onSurfaceVariant: COLORS.black},
          }}>
          <TabScreen label="Auto" icon="jeepney" >
            <View style={FindRideStyles.section}>
              <ScrollView>{autoData}</ScrollView>
            </View>
          </TabScreen>
          <TabScreen label="Bike" icon="motorbike">
            <View style={FindRideStyles.section}>
              <ScrollView>{bikeData}</ScrollView>
            </View>
          </TabScreen>
          <TabScreen label="Prime Plus" icon="car">
            <View style={FindRideStyles.section}>
              <ScrollView>{primeData}</ScrollView>
            </View>
          </TabScreen>
        </Tabs>
      </TabsProvider>
    </View>
  );
};
export default FindCaptainPage;
