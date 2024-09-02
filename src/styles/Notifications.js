import {StyleSheet} from 'react-native';
import {COLORS} from '../constants';

const NotificationsPageStyles = StyleSheet.create({
  card:{
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderBottomWidth:1,
    // borderBottomColor:'#BCBCBC',
    margin: 15,
    padding: 15,
  },
  center:{
    flexDirection: 'row',
    justifyContent: 'center',
    padding:20
},
  box: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#DDDEE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info:{
    color: COLORS.primary,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
    fontFamily:'Poppins'
  },
  blackQuote:{
    borderLeftWidth:5,
    borderLeftColor:'#DDDEE1',
    marginBottom:10
  },
  heading:{
    color: '#1A1F36',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    fontFamily:'Poppins',
    paddingLeft:5
  },
  subHeading: {
    color: '#2A2A2A',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
  },
  name: {
    color: '#A5ACB8',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 20,
    marginVertical: 2,
  },
  cardBottom:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'flex-start',
    gap: 15
  },
});
export default NotificationsPageStyles;
