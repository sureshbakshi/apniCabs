import * as React from 'react';
import { View, ScrollView } from 'react-native';
import MyProfileStyles from '../styles/MyProfilePageStyles';
import LanguageSelection from '../components/LanguageSettings';

const LanguagePage = () => {

    return (
        <View style={MyProfileStyles.container}>
            <View style={MyProfileStyles.section}>
                <ScrollView>
                    <LanguageSelection />
                </ScrollView>
            </View>
        </View>
    );
};
export default LanguagePage;
