import * as React from 'react';
import { View, Pressable, ScrollView, ImageBackground } from 'react-native';
import TermsAndConditionsStyles from '../styles/TermsAndConditionsPageStyles';
import { Text } from '../components/common';
import images from '../util/images';
import FindRideStyles from '../styles/FindRidePageStyles';
import { COLORS } from '../constants';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';

const Refer = () => {
    const { userInfo: profile } = useSelector(state => state.auth);

    const shareReferralCode = () => {
        const options = {
            message:`Referral Code: ${profile?.referral_code}`
        }
        Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }
    return (
        <View style={TermsAndConditionsStyles.container}>
            <ImageBackground
                source={images.backgroundImage}
                resizeMode="cover"
                style={TermsAndConditionsStyles.image}>
            </ImageBackground>
            <ScrollView>

                <View style={[TermsAndConditionsStyles.list, { flexDirection: 'column', justifyContent: 'space-between' }]}>
                    <View style={[TermsAndConditionsStyles.listSection]}>
                        <View style={TermsAndConditionsStyles.list}>
                            <Text style={[TermsAndConditionsStyles.greenTxt, { fontWeight: 'bold', textAlign: 'center', fontSize: 16 }]}>Refer now & and Earn upto Rs.500</Text>
                        </View>
                        <View style={TermsAndConditionsStyles.list}>
                            <Text style={[TermsAndConditionsStyles.address, { textAlign: 'center' }]}>
                                Send a Refferal link to your friends via SMS/Watsup/Email
                            </Text>
                        </View>
                        <View style={TermsAndConditionsStyles.list}>
                            <Text style={[TermsAndConditionsStyles.name, [{ textAlign: 'center' }]]}>
                                How does it work?
                            </Text>
                        </View>
                        <View style={[TermsAndConditionsStyles.list, { marginVertical: 5 }]}>
                            <Text style={[TermsAndConditionsStyles.name, [{ textAlign: 'center', marginBottom: 10 }]]}>
                                Refferal Code
                            </Text>
                            <Pressable
                                android_ripple={{ color: '#fff' }}
                                style={[FindRideStyles.button, { width: 120, alignSelf: 'center', borderColor: COLORS.bg_dark, borderWidth: 1, backgroundColor: COLORS.bg_light }]}
                            >
                                <Text style={[FindRideStyles.text, { fontWeight: 'bold', color: '#000', fontSize: 16 }]}>
                                    {profile?.referral_code}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <Pressable
                        android_ripple={{ color: '#fff' }}
                        onPress={shareReferralCode}
                        style={[FindRideStyles.button, { alignSelf: 'center', width: '50%', backgroundColor: COLORS.primary, bottom: 0 }]}
                    >
                        <Text style={[FindRideStyles.text, { fontWeight: 'bold' }]}>
                            {'Refer Now'}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};
export default Refer;
