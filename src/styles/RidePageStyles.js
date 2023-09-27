import {StyleSheet} from 'react-native';

const RideStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding:20
  },
  headerText:{
    color:'#fff',
    fontSize:20,
    fontWeight:500,
    marginBottom:50
  },
  section:{
    flex:1,
    justifyContent:'space-between'
  },
  textInputPickup:{
    backgroundColor: '#fff',
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    borderBottomColor:'#ccc',
    borderBottomWidth:0.5
  },
  textInputDrop:{
    backgroundColor: '#fff',
    borderBottomLeftRadius:4,
    borderBottomRightRadius:4,
    marginBottom:20
  }
});
export default RideStyles;