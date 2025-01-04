import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Icon } from './common';
import { useTranslation } from 'react-i18next';
import { setSelectedLanguage } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

// Language data
const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
];

const LanguageSelection = () => {
    const { i18n } = useTranslation();
    const { selectedLanguage } = useSelector(state => state.auth);
    const dispatch = useDispatch()
    console.log({ selectedLanguage })
    const handleLanguageSelect = (languageCode) => {
        dispatch(setSelectedLanguage(languageCode));
        i18n.changeLanguage(languageCode);
        // Add logic for language change using i18n or similar library
    };


    const renderLanguageItem = ({ item }) => (
        <Pressable
            style={styles.languageItem}
            onPress={() => handleLanguageSelect(item.code)}
        >
            <Text style={styles.languageName}>{item.name}</Text>
            {selectedLanguage === item.code && (
                <View style={styles.tickContainer}>
                    <Icon name="check-circle" size={'large'} color="#4CAF50" />
                </View>
            )}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Select Language</Text> */}
            <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={renderLanguageItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    listContainer: {
        paddingVertical: 8,
    },
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '500',
    },
    tickContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LanguageSelection;
