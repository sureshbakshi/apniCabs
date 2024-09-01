import {StyleSheet} from 'react-native';
import { shadow } from 'react-native-paper';
import { COLORS } from '../constants';

const CommonStyles = StyleSheet.create({
  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mtb10: {
    marginVertical:10
  },
  mlr10: {
    marginHorizontal:10
  },
  errorTxt:{
    color:'red'
  },
  shadow:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 4,
  },
  font10: {
    fontSize: 10,
    lineHeight: 14,
    color: COLORS.black
  },
  font12: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.black
  },
  font14: {
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.black
  },
  font16: {
    fontSize: 16,
    lineHeight: 21,
    color: COLORS.black
  },
  font20: {
    fontSize: 20,
    lineHeight: 27,
    color: COLORS.black
  }
});
export default CommonStyles;
