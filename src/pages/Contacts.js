import React, { useEffect } from "react";
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


export default function Contacts() {

    const {
        watch,
        control,
        handleSubmit,
        formState: { errors, isDirty },
        ...methods
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            phone_number1: '',
            phone_number2: '',
            phone_number3: '',
            phone_number4: '',
        },
        resolver: yupResolver(contactsSchema),
    });

    const onSubmit = (data) => {
        console.log(data)
        if (isDirty) {
            if (data) {
            }
        }
    };

    // if (isEmpty('contacts')) {
    //     return (
    //         <SearchLoader msg='No Vehicles assigned' isLoader={false} />
    //     );
    // }

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
                                                        value={value.toString()}
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
