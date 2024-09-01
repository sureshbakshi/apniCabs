import {StyleSheet} from 'react-native';
import {COLORS} from '../constants';

const ActiveRidePageStyles = StyleSheet.create({
  cardBottom: {
    flex:1,
    position: 'absolute',
    bottom: 0,
    width:'100%',
    padding:20
  },
  centeredView:{
    backgroundColor: `rgba(52, 52, 52, 0.6)`,
    position:'absolute',
    bottom:0,
    width:'100%',
    height:'100%',
    flex:1,
    padding:10,
    alignItems:'center',
    justifyContent:'center'
  },
  modalView:{
    backgroundColor:COLORS.white,
    borderRadius:4,
    width:'100%',
    padding: 15,
  },
  content:{
    // padding:10,
    fontSize: 14,
    lineHeight: 18, 
    marginBottom: 10
  },
  modalText:{
    textAlign:'center',
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.black,
    lineHeight: 30,
    marginBottom: 15
  },
  list:{
    alignItems:'center',
    flexDirection:'row',
    padding:10,
    paddingVertical: 5
  },
  listTxt:{
    textAlign:'center',
    fontSize:13,
    fontWeight:'bold',
    marginLeft:10
  }
});
export default ActiveRidePageStyles;
