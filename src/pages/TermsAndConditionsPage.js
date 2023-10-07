import * as React from 'react';
import { View, Pressable, ScrollView, ImageBackground} from 'react-native';
import TermsAndConditionsStyles from '../styles/TermsAndConditionsPageStyles';
import { Text } from '../components/common';

const TermsAndConditionsPage = ({navigation}) => {
  return (
    <View style={TermsAndConditionsStyles.container}>
      <ImageBackground
        source={require('../assets/images/bg.jpeg')}
        resizeMode="cover"
        style={TermsAndConditionsStyles.image}>
      </ImageBackground>
      <View style={TermsAndConditionsStyles.section}>
        <ScrollView>
          <View style={TermsAndConditionsStyles.listSection}>
            <View style={TermsAndConditionsStyles.list}>
              <Text style={TermsAndConditionsStyles.greenTxt}>Terms Info</Text>
            </View>
            <View style={TermsAndConditionsStyles.list}>
              <Text style={TermsAndConditionsStyles.name}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default TermsAndConditionsPage;
