import React from 'react';
import { View,  StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { COLORS } from '../../../constants';
import { Text } from '../Text';

const getCustomStyles = (height) => {
  return {marginBottom: height, height: height + 5}
}

const TimelineItem = ({  value,  isLast, size , customStyles}) => {
  return (
    <View style={[styles.timelineItem, isLast && styles.lastItem, {marginBottom: customStyles.marginBottom}]}>
      <Icon name={'google-maps'} size={size} color={isLast ? COLORS.primary : COLORS.brand_blue}/>
      <View style={styles.timelineContent}>
        <Text>{value}</Text>
      </View>
      {!isLast && <View style={[styles.timelineConnector, {height: customStyles.height}]} />}
    </View>
  );
};

const Timeline = ({data=[], size='medium', height=10}) => {
  const customStyles = getCustomStyles(height)
  return (
    <View >
      {data.length > 0 && data.map((item, index) => (
        <TimelineItem
          key={index}
          value={item}
          isLast={index === data.length - 1}
          size={size}
          customStyles={customStyles}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  lastItem: {
    marginBottom: 0,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 10,
  },
  timelineConnector: {
    borderColor: COLORS.green,
    height: 15,
    position: 'absolute',
    top: 15,
    left: 8,
    borderWidth: 1, borderStyle:'dashed', borderRadius: 1
  },
});

export default Timeline;