import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const FindRideStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f6',
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
    alignItems:'center'
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
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'white',
  },
});
export default FindRideStyles;
