import * as React from 'react';
import { View, Pressable, ScrollView, ImageBackground } from 'react-native';
import TermsAndConditionsStyles from '../styles/TermsAndConditionsPageStyles';
import { Icon, Text } from '../components/common';
import images from '../util/images';
import { COLORS } from '../constants';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import CommonStyles from '../styles/commonStyles';
import HeaderImage from '../components/common/HeaderImage';
import { useTranslation } from 'react-i18next';
const Refer = () => {
    const { driverInfo } = useSelector(state => state.auth);
    const {t} = useTranslation();
    const message = t('refer_successful_msg', {referral_code: driverInfo?.referral_code})
    const writeToClipboard = () => {
        // Clipboard.setString(message)
        // showSuccessMessage('Copied')
    };
    const shareReferralCode = () => {
        const options = {
            message
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
            <HeaderImage
                bgImg={images.referBg}
                bgStyles={{ height: 280 }}
                fgImg={images.referGiftBox}
                fgStyles={{
                    resizeMode: 'contain',
                    flex: 1,
                    aspectRatio: 1.5,
                }} />
            <ScrollView>

                <View style={[TermsAndConditionsStyles.list, { flexDirection: 'column', justifyContent: 'space-between' }]}>
                    <View style={[TermsAndConditionsStyles.listSection]}>
                        <View style={TermsAndConditionsStyles.list}>
                            <Text style={[CommonStyles.font24, CommonStyles.bold, { textAlign: 'center' }]}>{t('refer_title')}</Text>
                        </View>
                        <View style={[TermsAndConditionsStyles.list, { marginBottom: 30 }]}>
                            <Text style={[CommonStyles.font14, { textAlign: 'center' }]}>
                                {t('refer_des')}
                            </Text>
                            <Text style={[CommonStyles.font14, { textAlign: 'center' }]}>
                                SMS/WhatsApp/Email
                            </Text>
                        </View>
                        {/* <View style={TermsAndConditionsStyles.list}>
                            <Text style={[TermsAndConditionsStyles.name, [{ textAlign: 'center' }]]}>
                                How does it work?
                            </Text>
                        </View> */}
                        <View style={[TermsAndConditionsStyles.list, { marginVertical: 5 }]}>
                            <Text style={[CommonStyles.font16, { color: COLORS.text_dark1 , textAlign: 'center' }]}>
                                {/* Share Your Invite Code */}
                                {t('refer_code_txt')}
                            </Text>
                            <Pressable
                                android_ripple={{ color: '#fff' }}
                                onPress={shareReferralCode}
                                style={[{ flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: COLORS.text_dark1, borderBottomWidth: 1, backgroundColor: 'transparent', paddingVertical: 10, marginTop: 10 }]}
                            >
                                <Text style={[CommonStyles.font20, CommonStyles.bold, { color: COLORS.primary }]}>
                                    {driverInfo?.referral_code}
                                </Text>
                                <Icon name='share-variant' size='large' color={COLORS.primary} />
                            </Pressable>


                            {/* <Text>Copied value: {copiedText ?? 'Nothing is copied yet!'}</Text> */}
                            {/* <Pressable
                                android_ripple={{ color: '#fff' }}
                                onPress={writeToClipboard}
                                style={[FindRideStyles.button, { alignSelf: 'center', borderColor: COLORS.black, borderWidth: 1, backgroundColor: COLORS.bg_light, borderStyle: 'dashed'}]}
                            >
                                <Text style={[FindRideStyles.text, { fontWeight: 'bold', color: '#000', fontSize: 16 }]} selectable={true}>
                                    {profile?.referral_code} 
                                </Text>
                            </Pressable> */}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
export default Refer;
