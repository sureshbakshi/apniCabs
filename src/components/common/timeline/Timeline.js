import React from 'react';
import { View,  StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { COLORS } from '../../../constants';
import { Text } from '../Text';

const TimelineItem = ({  value,  isLast }) => {
  return (
    <View style={[styles.timelineItem, isLast && styles.lastItem]}>
      <Icon name={'google-maps'} size='medium' color={isLast ? COLORS.primary : COLORS.brand_blue}/>
      <View style={styles.timelineContent}>
        <Text>{value}</Text>
      </View>
      {!isLast && <View style={styles.timelineConnector} />}
    </View>
  );
};

const Timeline = ({data=[]}) => {
  
  return (
    <View >
      {data.length > 0 && data.map((item, index) => (
        <TimelineItem
          key={index}
          value={item}
          isLast={index === data.length - 1}
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