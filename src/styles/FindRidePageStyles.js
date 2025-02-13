import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';
import commonStyles  from '../styles/commonStyles';

const FindRideStyles = StyleSheet.create({
  pageContainer: {
    padding: 15
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    marginTop: 15
  },
  card: {
    backgroundColor: COLORS.card_bg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 15,
    borderRadius: 12
  },
  pickCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    marginBottom: 15,
    padding: 15,
    marginHorizontal:1,
    ...commonStyles.shadow
  },
  cardtop:{
    flexDirection: 'row',
  },
  cardBottom:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    gap: 15
  },
  center:{
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'center'
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
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 3,
  },
  vehicle: {
    color: COLORS.black,
    fontSize: 12,
    lineHeight: 18,
  },
  Paragraph: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 21,
  },
  review: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 20,
  },
  otpText: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 27,
    color: COLORS.blue
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
    paddingVertical:12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.brand_yellow,
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    // letterSpacing: 0.25,
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
    justifyContent:'space-between',
    borderRadius: 12,
    marginBottom: 8,
  },
  textInputPickup:{
    backgroundColor: '#f2f4f6',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomColor: COLORS.bg_gray_secondary,
    // borderTopWidth: 0.2,
    borderBottomWidth: 0.5,
    padding: 10,
    paddingHorizontal: 15
  }
});
export default FindRideStyles;
