import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const FindRideStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f6',
  },
  switchBtn:{
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor:COLORS.primary,
    padding:10,
    minHeight:45
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    height:60,
    padding:10
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 20,
  },
  section: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom:10
  },
  cardtop:{
    flexDirection: 'row',
  },
  cardBottom:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between'
  },
  left: {
    padding: 10,
  },
  middle: {
    flex: 1,
    padding: 10,
  },
  right: {
    padding: 10,
  },
  profileIcon: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: '#ccc',
  },
  name: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
    marginVertical: 3,
  },
  address: {
    color: '#a1a1a1',
    fontSize: 14,
    marginVertical: 3,
  },
  review: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 20,
  },
  greenTxt:{
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: '500',
    alignSelf:'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: COLORS.brand_yellow,
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: COLORS.white,
  },
  tabs:{
    backgroundColor:COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom:5,
    justifyContent:'space-between',
  },
  textInputPickup:{
    backgroundColor: '#f2f4f6',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    padding: 15,
  }
});
export default FindRideStyles;
