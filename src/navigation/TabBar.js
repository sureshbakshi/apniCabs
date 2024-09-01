import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../components/common';
import CommonStyles from '../styles/commonStyles';
import { COLORS } from '../constants';

export default function TabBar({ state, descriptors, navigation }) {
    return (
      <View style={[styles.tabBar, CommonStyles.shadow]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
  
          const isFocused = state.index === index;
  
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          const color = isFocused ? COLORS.white : COLORS.black
          const bg = isFocused ? COLORS.secondary_blue : COLORS.white
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
              key={index}
            >
              <View style={{ flexDirection: 'row' , backgroundColor: bg, paddingVertical: 8, paddingHorizontal: 16,  borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                {options.tabBarIcon({ isFocused, color })}
                { <Text style={{ color: color , marginLeft: 5, opacity: isFocused ? 1: 0, lineHeight: 20}}>
                  {label}
                </Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  export const styles = StyleSheet.create({
    tabBar: {
      position: 'absolute',
      flexDirection: 'row',
      bottom: 15,
      justifyContent: 'center',
      marginHorizontal: 15,
      backgroundColor: COLORS.white,
      borderRadius: 50,
      padding: 8,
  
    }
  })
