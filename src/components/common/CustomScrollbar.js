import React, { useRef, useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../constants';

const { height: windowHeight } = Dimensions.get('window');

const CustomScrollbar = ({ children }) => {
  const scrollY = useRef(new Animated.Value(0)).current; // Tracks vertical scroll
  const [contentHeight, setContentHeight] = useState(1); // Total scrollable content height
  const [containerHeight, setContainerHeight] = useState(windowHeight); // Visible container height

  const handleContentSizeChange = (_, height) => {
    setContentHeight(height); // Update the scrollable content height
  };

  const handleLayout = (event) => {
    setContainerHeight(event.nativeEvent.layout.height); // Update the visible container height
  };

  // Calculate the height of the scrollbar dynamically
  const scrollbarHeight = Math.max(
    (containerHeight / contentHeight) * containerHeight,
    20 // Minimum scrollbar height for usability
  );

  // Calculate the scrollbar's translation along the y-axis
  const translateY = scrollY.interpolate({
    inputRange: [0, Math.max(contentHeight - containerHeight, 1)],
    outputRange: [0, containerHeight - scrollbarHeight],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={handleContentSizeChange}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
      {contentHeight > containerHeight && ( // Show scrollbar only if content overflows
        <View style={styles.scrollbarContainer}>
          <Animated.View
            style={[
              styles.scrollbar,
              { height: scrollbarHeight, transform: [{ translateY }] },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  scrollbarContainer: {
    width: 4,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.primary_light,
  },
  scrollbar: {
    width: 4,
    backgroundColor: COLORS.primary, // Customize scrollbar color
    borderRadius: 4,
  },
});

export default CustomScrollbar;
