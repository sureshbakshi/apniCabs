import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const MoreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f6',
  },
  header: {
    backgroundColor: COLORS.primary,
    height: 60,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent:'center'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  section: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listSection:{
    backgroundColor: '#fff',
    marginBottom:10
  },
  list:{
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    padding:20
  },
  listIcon:{
    width:20,
    height:20,
    backgroundColor:'#ccc',
    marginLeft:40,
    marginRight:20
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
    justifyContent:'center'
  },
  profileIcon: {
    width: 100,
    height: 100,
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
    fontWeight: 500,
  },
  whitetxt: {
    fontSize: 12,
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
    color: '#ccc',
    fontSize: 13,
    marginBottom: 20,
  },
  greenTxt: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'center',
    padding:10
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom:10
  },
  buttonTxt: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    fontWeight: '500',
    color: '#fff',
  },
});
export default MoreStyles;
