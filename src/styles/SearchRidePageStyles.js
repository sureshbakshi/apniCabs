import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const SearchRideStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'rgba(0,0,0,0.65)',
    padding:20,
  },
  headerText:{
    color:'#000',
    fontSize:20,
    fontWeight:'500',
    marginBottom:50
  },
  image: {
    flex:1,
  },
  section:{
    flex:1,
    justifyContent:'space-between',
  },
  textInputPickup:{
    backgroundColor: '#fff',
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    borderBottomColor:'#ccc',
    borderBottomWidth:0.5,
    padding:15
  },
  textInputDrop:{
    backgroundColor: '#fff',
    borderBottomLeftRadius:4,
    borderBottomRightRadius:4,
    marginBottom:20,
    padding:15
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
export default SearchRideStyles;