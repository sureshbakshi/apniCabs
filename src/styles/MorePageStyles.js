import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const MoreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    padding:20,
    borderBottomWidth:1,
    borderBottomColor:'#BCBCBC'
  },
  listIcon:{
    width:20,
    height:20,
    marginLeft:20,
    marginRight:40
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
    color: '#080909',
    fontWeight: '800',
    fontSize: 14,
    marginVertical: 3,
  },
  menu_name:{
    color: '#070707',
    fontWeight: '700',
    fontSize: 12,
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
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom:10,
    backgroundColor:'#ED3D01',
    marginHorizontal:20,
    borderRadius:12,
    height:56,
    marginTop:20
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
