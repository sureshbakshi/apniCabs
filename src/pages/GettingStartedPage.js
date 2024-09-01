import React from 'react';
import {
    Image,
    ImageBackground,
    Text,
    View,
} from 'react-native';
import GettingStartedStyles from '../styles/GettingStartedPageStyles';
import images from '../util/images';
import CustomButton from '../components/common/CustomButton';
import { navigate } from '../util/navigationService';
import { COLORS, ROUTES_NAMES } from '../constants';

export default () => {

    return (
        <View style={[GettingStartedStyles.container]}>
            <View style={GettingStartedStyles.section}>
                    <ImageBackground 
                        resizeMode='contain'
                        source={images.gettingStarted1} 
                        style={GettingStartedStyles.image1}>
                       <Image source={images.gettingStarted2} 
                        style={GettingStartedStyles.image2}/>
                    </ImageBackground>
                 
                </View>
                <View style={GettingStartedStyles.subContainer}>
                    <View style={GettingStartedStyles.textContainer}>
                        <Text style={GettingStartedStyles.heardertext}>Start your journey with Apni Cabi </Text>
                        <Text style={GettingStartedStyles.subtext}>We successfully cope with tasks of varying complexity, provide long-term guarantees and regularly master new technologies.</Text>
                    </View>
                    <CustomButton label={'Get Started'} isLowerCase onClick={()=>navigate(ROUTES_NAMES.signIn)} styles={{backgroundColor: COLORS.primary, padding: 10}} textStyles={{fontWeight: 400}}/>
                </View>
        </View>
    );
};
