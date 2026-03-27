import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NetworkOverlay = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // state.isConnected can be null if it's still determining the state
      // We only want to show the offline message if we are explicitly disconnected
      setIsConnected(state.isConnected !== false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top ? insets.top + 5 : 40, paddingBottom: 10}]}> 
      <View style={styles.row}>
        <MaterialIcons name="wifi-off" style={styles.icon} size={22} color="#fff" />
        <Text style={styles.text}>{t('network_error_msg')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary || '#ED3D01',
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,  // For Android
    minHeight: 48,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 0,
    flexShrink: 1,
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
    color: '#fff',
    overflow: 'hidden',
    minWidth: 22,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  },
});

export default NetworkOverlay;
