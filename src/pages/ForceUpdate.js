import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from 'react-native';

const ForceUpdateModal = ({
    visible,
    currentVersion,
    newVersion,
    storeUrl,
    onForceUpdate,
}) => {
    const handleUpdatePress = async () => {
        if (onForceUpdate) {
            onForceUpdate();
        }
        if (storeUrl) {
            try {
                const supported = await Linking.canOpenURL(storeUrl);
                if (supported) {
                    Linking.openURL(storeUrl);
                }
            } catch (e) {
                console.log('Failed to open store url', e);
            }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    {/* Icon circle */}
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconArrow}>⬇️</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Update Required</Text>

                    {/* Message */}
                    <Text style={styles.message}>
                        A new version of the app is required to continue. Please update to
                        access all features.
                    </Text>

                    {/* Versions info */}
                    <Text style={styles.versionText}>
                        Current version: {currentVersion} → New version: {newVersion}
                    </Text>

                    {/* Update button */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={handleUpdatePress}
                    >
                        <Text style={styles.buttonText}>Update Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '82%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 28,
        alignItems: 'center',
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#E7F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconArrow: {
        fontSize: 40,
        color: '#2563EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 10,
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 16,
    },
    versionText: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 24,
    },
    button: {
        width: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 18,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ForceUpdateModal;
