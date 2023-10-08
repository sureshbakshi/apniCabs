import * as React from 'react';
import { View, Button, Pressable, ScrollView} from 'react-native';
import {ImageView, Text} from '../components/common'
import FindRideStyles from '../styles/FindRidePageStyles';
import styles from '../styles/MyRidePageStyles';
import images from '../util/images';
import Timeline from '../components/common/timeline/Timeline';

const FindCaptainPage = ({navigation}) => {
  return (
    <View style={FindRideStyles.container}>
      <View style={FindRideStyles.section}>
        <ScrollView>
          {[1, 2, 3, 4].map((item,i) => {
            return (
              <View style={FindRideStyles.card} key={i}>
                <Timeline/>
                <View style={FindRideStyles.cardtop}>
                  <View style={FindRideStyles.left}>
                    <ImageView source={images[`captain${i}`]} style={[styles.avatar]}/>
                  </View>
                  <View style={FindRideStyles.middle}>
                    <Text style={FindRideStyles.name}>David Johson</Text>
                    <Text style={FindRideStyles.review}>({item} Reviews)</Text>
                    <Timeline data={['Bheeramguda', 'Hitech knowledge Park']} />
                  </View>
                  <View style={FindRideStyles.right}>
                    <Text style={[FindRideStyles.name, {alignSelf: 'center'}]}>{'\u20B9'}15</Text>
                    <Text style={FindRideStyles.address}>3 Seats left</Text>
                  </View>
                </View>
                <View style={FindRideStyles.cardBottom}>
                  <View style={FindRideStyles.left}>
                    <Text style={[styles.text, styles.bold]}>10:00 am</Text>
                  </View>
                  <View style={FindRideStyles.middle}>
                    <Text style={[styles.text, styles.bold]}>
                      Honda Civic | White
                    </Text>
                  </View>
                  <View style={FindRideStyles.right}>
                    <Pressable style={FindRideStyles.button}>
                      <Text style={FindRideStyles.text}>{'Request'}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};
export default FindCaptainPage;
