import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const WalletStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f6',
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    height: 170,
    padding: 10,
    width: '100%',
    alignContent: 'center',
    flexDirection: 'column',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    marginBottom: 10,
  },
  cardtop: {
    flexDirection: 'row',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'space-between',
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
  smallTxt: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
  },
  whitetxt: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: '#fff',
    marginTop:30
  },
  balTxt:{
    fontSize: 40,
    color: '#fff',
    fontWeight: '800',
  },
  address: {
    color: '#a1a1a1',
    fontSize: 13,
  },
  review: {
    color: COLORS.gray,
    fontSize: 13,
  },
  greenTxt: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: COLORS.brand_yellow,
  },
  buttonTxt: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: '500',
    color: COLORS.black,
  },
});
export default WalletStyles;
