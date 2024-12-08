import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const SmallCircle = ({style}) => {
  return <View style={[styles.circle,{...style}]} />;
};

const styles = StyleSheet.create({
  circle: {
    width: 10, // Adjust size as needed
    height: 10, // Adjust size as needed
    borderRadius: 5, // Half of the width/height to make it a perfect circle
    backgroundColor: COLORS.primary, // Choose any color
  },
});

export default SmallCircle;
