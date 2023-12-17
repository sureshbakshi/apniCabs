import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const MyRideStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f6',
  },
  header: {
    backgroundColor: COLORS.primary,
    height:60,
    padding:10,
    justifyContent:'center'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textAlign:'center'
  },
  section: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
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
    paddingVertical: 3
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
    width: 60,
    height: 60,
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
  text:{
    fontSize: 13,
    fontWeight: '500',
    alignSelf:'center',
    color: COLORS.gray
  },
  primaryColor:{
    color: COLORS.primary,
  },
  whiteColor: {
    color: COLORS.white
  },
  greenColor:{
    color: COLORS.green
  },
  bold:{
    fontWeight: 'bold'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  status: {
    ...StyleSheet.button,
    transform: [{rotate: '-90deg'}],
    width: 80,
    height: 22,
    position:'absolute',
    bottom: 42,
    left: -29,
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
    textAlign:'center'
  },
  avatar: {
    minWidth: 10,
    width: 45,
    height: 45,
    minHeight: 10,
  },
  end:{
    alignSelf:'flex-end',
    backgroundColor: COLORS.brand_blue,
    paddingVertical:5,
    paddingHorizontal:15,
    borderRadius:20,
    color:COLORS.white,
    fontWeight:'bold',
    fontSize:14,
    position:'absolute',
    top:-10,
    height:30
  }
});
export default MyRideStyles;
