import React from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

export default function useSlidingPanels(initialWidth) {
    const screenWidth = Dimensions.get('window').width;
    const containerWidth = initialWidth || screenWidth;

    const formTranslate = React.useRef(new Animated.Value(0)).current;
    const otpTranslate = React.useRef(new Animated.Value(containerWidth)).current;

    const animateTo = React.useCallback((showOTP, width = containerWidth) => {
        const duration = 300;
        if (showOTP) {
            Animated.parallel([
                Animated.timing(formTranslate, {
                    toValue: -width,
                    duration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(otpTranslate, {
                    toValue: 0,
                    duration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(formTranslate, {
                    toValue: 0,
                    duration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(otpTranslate, {
                    toValue: width,
                    duration,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [formTranslate, otpTranslate, containerWidth]);

    const setPositions = React.useCallback((showOTP, width = containerWidth) => {
        if (showOTP) {
            formTranslate.setValue(-width);
            otpTranslate.setValue(0);
        } else {
            formTranslate.setValue(0);
            otpTranslate.setValue(width);
        }
    }, [formTranslate, otpTranslate, containerWidth]);

    return {
        formTranslate,
        otpTranslate,
        animateTo,
        setPositions,
        containerWidth,
    };
}
