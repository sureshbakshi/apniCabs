import React from 'react';
import {
  Text as ReactText,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { COLORS } from '../../constants';

type TextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export const Text = ({style, children, ...props}: TextProps) => {
  return <ReactText style={[styles.font, style]} {...props}>{children}</ReactText>;
};

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Nunito-Regular',
    color: COLORS.black
  },
});