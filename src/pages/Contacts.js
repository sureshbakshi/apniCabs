import React, { useEffect, useState } from "react";
import { Pressable, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import LoginStyles from "../styles/LoginPageStyles";
import { COLORS, CONTACTS_FORM } from "../constants";
import SearchLoader from "../components/common/SearchLoader";
import { contactsSchema } from "../schema";
import ScreenContainer from "../components/ScreenContainer";
import FindRideStyles from "../styles/FindRidePageStyles";
import { useSosAddMutation, useSosListQuery } from "../slices/apiSlice";

export default function Contacts() {
    const { userInfo: profile } = useSelector(state => state.auth);

    const { data: contactList, error: sosError } = useSosListQuery(profile?.id);
    const [sosAdd, { data: sosAddData, error: sosAddError }] = useSosAddMutation();
    const {
        watch,
        control,
        handleSubmit,
        formState: { errors, isDirty },
        setValue,
        ...methods
    } = useForm({
        mode: "onSubmit",
        defaultValues: {},
        resolver: yupResolver(contactsSchema),
    });

    useEffect(() => {
        if (sosError) {
            console.log('sosError', sosError)
        } else if (contactList?.length) {
            contactList.map((obj, i) => {
                setValue(`phone_number${i + 1}`, obj.mobile_number);
            });
        }

    }, [contactList, sosError])

    useEffect(() => {
        if (sosAddError) {
            console.log('sosError', sosAddError)
        } else if (sosAddData) {
            console.log('contactList', sosAddData)
        }
    }, [sosAddData, sosAddError])



    const onSubmit = (data) => {
        const numbersList = Object.entries(data).map(([key, value]) => ({ mobile_number: value }))
        if (isDirty) {
            if (data) {
                const payload = { id: profile?.id, numbersList }
                sosAdd(payload)
            }
        }
    };

    const isDisabled = !isDirty || !isEmpty(errors)
    return (
        <ScrollView>
            <ScreenContainer>
                <FormProvider {...methods}>
                    <View style={{ margin: 10 }}>
                        {CONTACTS_FORM.map((field, index) => {
                            return (
                                <View key={field.name}>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => {
                                            return (
                                                <>
                                                    <Text>{field.label}</Text>
                                                    <TextInput
                                                        name={field.name}
                                                        onBlur={onBlur}
                                                        onChangeText={(value) => {
                                                            onChange(value);
                                                        }}
                                                        value={value?.toString()}
                                                        placeholderTextColor={COLORS.gray}
                                                        type={"number"}
                                                        keyboardType='number-pad'
                                                        inputMode="numeric"
                                                        style={[LoginStyles.textInputDrop, { padding: 5, height: 40, backgroundColor: COLORS.white, marginBottom: 10 }]}
                                                        {...field.props}
                                                    />
                                                </>
                                            )
                                        }}
                                        name={field.name}
                                        rules={{ required: `${field.label} is required` }}
                                    />
                                    {errors[field.name] && <Text style={{ color: COLORS.red, marginBottom: 5 }}>{errors[field.name].message}</Text>}

                                </View>
                            );
                        })}
                    </View>
                    <View >
                        <Pressable
                            style={[FindRideStyles.button, { backgroundColor: isDisabled ? COLORS.gray : COLORS.brand_yellow, minHeight: 40, margin: 10 }]}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isDisabled}
                        >
                            <Text style={[FindRideStyles.text, { color: isDisabled ? COLORS.white : COLORS.black, fontWeight: 'bold', textTransform: 'capitalize', height: 'auto' }]}>
                                Update
                            </Text>
                        </Pressable>
                    </View>
                </FormProvider>
            </ScreenContainer>
        </ScrollView>
    );
}
