import {StyleSheet} from 'react-native';
import { shadow } from 'react-native-paper';

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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  }
});
export default CommonStyles;
