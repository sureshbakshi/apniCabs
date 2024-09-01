import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const WalletStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  header: {
    backgroundColor: COLORS.primary_light,
    margin: 10,
    borderRadius: 15,
    height: 100,
    padding: 20,
    shadowColor: "#ed3d01",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center'
  },
  section: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: COLORS.bg_light,
    paddingBottom:65
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 10,
    paddingBottom:0,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.22,
    // shadowRadius: 2.22,
    // elevation: 3,
    // marginBottom: 10,
    borderBottomWidth:1,
    borderBottomColor:'#BCBCBC'
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
  graytxt: {
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: COLORS.text_gray1,
  },
  balTxt: {
    fontSize: 16,
    color: COLORS.text_dark2,
    fontWeight: '800',
  },
  address: {
    color: COLORS.text_gray1,
    fontSize: 12,
  },
  review: {
    color: COLORS.text_dark2,
    fontSize: 14,
    fontWeight: 500
  },
  greenTxt: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    flexDirection: 'row'
  },
  buttonTxt: {
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.25,
    fontWeight: '700',
    color: COLORS.primary,
  },
  box: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box1: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
export default WalletStyles;
