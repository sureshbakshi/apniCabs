import * as React from 'react';
import {Text, View, Button, Pressable, ScrollView} from 'react-native';
import FindRideStyles from '../styles/FindRidePageStyles';
import styles from '../styles/MyRidePageStyles';

const FindRidePage = ({navigation}) => {
  return (
    <View style={FindRideStyles.container}>
      <View style={FindRideStyles.section}>
        <ScrollView>
          {[1, 2, 3, 4].map((item,i) => {
            return (
              <View style={FindRideStyles.card} key={i}>
                <View style={FindRideStyles.cardtop}>
                  <View style={FindRideStyles.left}>
                    <View style={FindRideStyles.profileIcon}></View>
                  </View>
                  <View style={FindRideStyles.middle}>
                    <Text style={FindRideStyles.name}>David Johson</Text>
                    <Text style={FindRideStyles.review}>({item} Reviews)</Text>
                    <Text style={FindRideStyles.address}>Bheeramguda</Text>
                    <Text style={FindRideStyles.address}>
                      Hitech knowledge Park
                    </Text>
                  </View>
                  <View style={FindRideStyles.right}>
                    <Text style={FindRideStyles.name}>{'\u20B9'}15</Text>
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
export default FindRidePage;
