import { StyleSheet } from 'react-native';
import { shadow } from 'react-native-paper';
import { COLORS } from '../constants';

const CommonStyles = StyleSheet.create({
  p10:{
    padding:10
  },
  p15:{
    padding:15
  },
  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mtb10: {
    marginVertical: 10
  },
  mlr10: {
    marginHorizontal: 10
  },
  errorTxt: {
    color: 'red'
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 4,
  },
  shadow2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  font10: {
    fontSize: 10,
    lineHeight: 14,

  },
  font12: {
    fontSize: 12,
    lineHeight: 16,

  },
  font14: {
    fontSize: 14,
    lineHeight: 18,

  },
  font16: {
    fontSize: 16,
    lineHeight: 21,

  },
  font20: {
    fontSize: 20,
    lineHeight: 27,

  },

  font24: {
    fontSize: 22,
    lineHeight: 28,

  },
  font24: {
    fontSize: 24,
    lineHeight: 32,

  },
  bold: {
    fontWeight: 'bold'
  },
  headerFont: {
    fontSize: 16,
    lineHeight: 24
    // fontWeight: 'bold',
  }
});
export default CommonStyles;
