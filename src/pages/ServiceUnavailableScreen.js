import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or any icon lib
import { COLORS, DriverAvailableStatus } from '../constants';
import { useRoute } from '@react-navigation/native';
import useCityLookup from '../hooks/useCityLookup';

const ServiceUnavailableScreen = () => {
    const route = useRoute();
    const { location, vehicleId } = route.params || {};
    const { onRefresh, updateDriverStatus, isLoading } = useCityLookup();
    const handleRefresh = async () => {
        onRefresh({ location, vehicleId })
    };


    useEffect(() => {
        updateDriverStatus(false);
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <View style={styles.iconCircle}>
                    <Icon name="map-marker-off-outline" size={36} color="#F04438" />
                </View>
            </View>
            <Text style={styles.title}>Service Unavailable</Text>
            <Text style={styles.subtitle}>
                We&apos;re sorry, but our services are not available in your location at this time.
            </Text>
            <Text style={styles.helperText}>
                Please check back later or contact support if you believe this is an error.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleRefresh}>
                <Icon name="refresh" size={20} color={COLORS.white} />
                <Text style={styles.buttonText}>{isLoading ? "Loading..." : "Refresh"}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ServiceUnavailableScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        marginBottom: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FEE4E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#101828',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#667085',
        textAlign: 'center',
        lineHeight: 20,
        marginHorizontal: 12,
    },
    helperText: {
        fontSize: 13,
        color: '#98A2B3',
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 8,
        marginHorizontal: 16,
    },
    button: {
        marginTop: 48,
        backgroundColor: COLORS.primary_blue,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginHorizontal: 24,
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});
