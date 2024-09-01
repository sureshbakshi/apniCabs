import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Icon } from '../Icon';
import { COLORS } from '../../../constants';
import { Text } from '../Text';

const getCustomStyles = (height) => {
  return { marginBottom: height, height: height + 5 }
}

const TimelineItem = ({ value, isLast, size, customStyles, numberOfLines, itemStyle, textStyles, isScrollable }) => {
  const sepatorStyles = { borderBottomColor: COLORS.sepator_line_dark, borderBottomWidth: 0.5, paddingBottom: 8 }
  const label = <Text numberOfLines={numberOfLines} ellipsizeMode='tail' style={{ ...textStyles }}>{value}</Text>
  return (
    <View style={[styles.timelineItem, isLast && styles.lastItem, { marginBottom: customStyles.marginBottom }]}>
      <View>
        {isLast && <View style={[styles.timelineConnector, { height: '50%', top: '-50%' }]} />}
        <Icon name={'google-maps'} size={size} color={isLast ? COLORS.brand_green : COLORS.primary} />
        {!isLast && <View style={[styles.timelineConnector, { height: '50%', top: 10 }]} />}
      </View>
      <View style={[styles.timelineContent, { ...itemStyle, ...!isLast ? sepatorStyles : {} }]}>
        {isScrollable ? <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {label}
        </ScrollView> :  label}

      </View>
    </View>
  );
};

const Timeline = ({ data = [], size = 'medium', height = 10, numberOfLines = 1, itemStyle = {}, textStyles = {}, isScrollable = false }) => {
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
          itemStyle={itemStyle}
          numberOfLines={numberOfLines}
          textStyles={textStyles}
          isScrollable={isScrollable}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: COLORS.gray,
    height: 15,
    position: 'absolute',
    top: 15,
    left: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
});

export default Timeline;