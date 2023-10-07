import * as React from 'react';
import { View, Button, Pressable, ScrollView} from 'react-native';
import WalletStyles from '../styles/WalletPageStyles';
import styles from '../styles/MyRidePageStyles';
import { ImageView, Text } from '../components/common';
import images from '../util/images';
const WalletPage = ({navigation}) => {
  console.log(navigation);
  return (
    <View style={WalletStyles.container}>
      <View style={WalletStyles.header}>
        <Text style={WalletStyles.headerText}>{'My Wallet'.toUpperCase()}</Text>
        <Text style={WalletStyles.whitetxt}>{'Total Balance'}</Text>
        <Text style={WalletStyles.balTxt}>{'\u20B9'}{'120'}</Text>
        <View style={WalletStyles.right}>
          <Pressable style={WalletStyles.button}>
            <Text style={WalletStyles.buttonTxt}>{'Add Money'.toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>
      <View style={WalletStyles.section}>
        <ScrollView>
          {[1, 2, 3, 4, 5].map((item, i) => {
            return (
              <View style={WalletStyles.card} key={i}>
                <View style={WalletStyles.cardtop}>
                  <View style={WalletStyles.left}>
                    {/* <View style={WalletStyles.profileIcon}></View> */}
                    <ImageView source={images[`captain${i}`]} style={[styles.avatar]}/>
                  </View>
                  <View style={WalletStyles.middle}>
                    <Text style={WalletStyles.name}>Ride Payment</Text>
                    <Text style={WalletStyles.review}>
                      {item}th Feb,05:15 pm
                    </Text>
                    <Text style={WalletStyles.address}>
                      Amount deducted from ride
                    </Text>
                  </View>
                  <View style={WalletStyles.right}>
                    <Text style={WalletStyles.greenTxt}>{'\u20B9'}15</Text>
                    <Text style={[WalletStyles.smallTxt]}>David Johnson</Text>
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
export default WalletPage;
