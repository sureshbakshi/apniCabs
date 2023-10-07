import { StyleSheet,Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const styles = StyleSheet.create({
  loader:{
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.1)'
  },
  loaderSection: {
    textAlign: 'center',
    height: screenWidth /(16/9) + 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loaderText:{
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder:{
    minWidth: 60,
    minHeight: 60,
  }
});

export default styles;
