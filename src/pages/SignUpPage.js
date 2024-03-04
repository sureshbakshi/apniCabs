import React, { useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import LoginStyles from '../styles/LoginPageStyles';
import CommonStyles from '../styles/commonStyles';
import ScreenContainer from '../components/ScreenContainer';
import { navigate } from '../util/navigationService';
import { Text } from '../components/common';
import { useSelector, useDispatch } from 'react-redux';
import { useSingUpMutation } from '../slices/apiSlice';
import { updateUserInfo, updateUserCheck } from '../slices/authSlice';
import { COLORS, ROUTES_NAMES, SIGN_UP_FORM, USER_ROLES } from '../constants';
import images from '../util/images';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../schema';
import { isEmpty } from 'lodash';
import { isUndefined } from '../util';

const SignUpPage = () => {
  const dispatch = useDispatch();
  const [singUp, { data: signUpdata, error: singUpError, isLoading }] =
    useSingUpMutation();
  const googleInfo = useSelector(state => state.auth.googleInfo?.user);

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    ...methods
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: googleInfo?.name || '',
      email: googleInfo?.email || '',
      phone: '',
      // referred_by:''
    },
    resolver: yupResolver(signupSchema),
  });

  const handleSignUp = (data) => {
    const payload = { ...data }
    if (googleInfo?.photo) {
      payload.avatar = googleInfo?.photo || ''
    }
    payload.provider = Platform.OS || 'mobile'
    payload.name = payload.name ?? googleInfo.name
    payload.email = payload.email ?? googleInfo.email
    payload.user_type = USER_ROLES.OWNER
    singUp(payload);
  };

  useEffect(() => {
    if (singUpError) {
      console.log(singUpError?.data?.error);
    } else if (signUpdata) {
      dispatch(updateUserCheck(signUpdata));
      dispatch(updateUserInfo(signUpdata));
      navigate(ROUTES_NAMES.signIn)
    }
  }, [signUpdata, singUpError]);

  const isDisabled = !isDirty || !isEmpty(errors)

  return (
    <ScrollView>
      <View style={LoginStyles.container}>
        <ImageBackground
          source={images.backgroundImage}
          resizeMode="cover"
          style={LoginStyles.image}>
          <View style={LoginStyles.logoSection}>
            <Text style={LoginStyles.logoTxt}>{'Apni Cabi'.toUpperCase()}</Text>
          </View>
        </ImageBackground>
        <ScreenContainer>
          <View style={[LoginStyles.section]}>
            <View>
              {SIGN_UP_FORM.map((field, index) => {
                return (
                  <View key={field.name}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => {
                        return (
                          <>
                            <TextInput
                              name={field.name}
                              onBlur={onBlur}
                              onChangeText={(value) => {
                                onChange(value);
                              }}
                              value={value?.toString()}
                              placeholderTextColor={COLORS.gray}
                              style={[LoginStyles.textInputPickup]}
                              {...field.props}
                            />
                          </>
                        )
                      }}
                      name={field.name}
                      rules={{ required: `${field.label} is required` }}
                    />
                    {errors[field.name] && <Text style={[CommonStyles.errorTxt]}>{errors[field.name]?.message}</Text>}
                  </View>
                );
              })}
            </View>
            <View>
              <View style={CommonStyles.mb10}>
                <Pressable
                  style={[LoginStyles.button, { opacity: isDisabled ? 0.7 : 1 }]}
                  android_ripple={{ color: '#fff' }}
                  onPress={handleSubmit(handleSignUp)}
                  disabled={isDisabled}
                >
                  <Text style={LoginStyles.text}>
                    {'Sign Up Now'.toUpperCase()}
                  </Text>
                </Pressable>
              </View>
              <View style={LoginStyles.signUpSection}>
                <Text style={LoginStyles.headerText}>Already Registered?</Text>
                <Pressable
                  android_ripple={{ color: '#fff' }}
                  onPress={() => navigate('SignIn')}>
                  <Text style={LoginStyles.greenTxt}>Sign in</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScreenContainer>
      </View>
    </ScrollView>
  );
};
export default SignUpPage;
