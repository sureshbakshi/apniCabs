import React, { useEffect } from "react";
import {
    useEditFareMutation,
} from "../slices/apiSlice";
import { Pressable, ScrollView } from 'react-native';
import { useSelector } from "react-redux";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import LoginStyles from "../styles/LoginPageStyles";
import { BASE_FARE_FORM, COLORS } from "../constants";
import SearchLoader from "../components/common/SearchLoader";
import { fareSchema } from "../schema";
import useGetDriverDetails from "../hooks/useGetDriverDetails";
import ScreenContainer from "../components/ScreenContainer";
import FindRideStyles from "../styles/FindRidePageStyles";
import { showSuccessMessage } from "../util";
import { goBack } from "../util/navigationService";

const defaultProps = {
    margin: "2",
    fullWidth: true,
};
export default function FareSettings() {
    const { userInfo, driverInfo } = useSelector((state) => state.auth);
    useGetDriverDetails(userInfo?.id, { skip: !driverInfo?.id || !userInfo?.id, refetchOnMountOrArgChange: true })
    const [editVehicleFair] = useEditFareMutation();

    const {
        watch,
        control,
        handleSubmit,
        formState: { errors, isDirty },
        ...methods
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            base_fare: driverInfo?.vehicle?.vehicle_fare.base_fare || '',
            fare_0_10_km: driverInfo?.vehicle?.vehicle_fare.fare_0_10_km || '',
            fare_10_20_km: driverInfo?.vehicle?.vehicle_fare.fare_10_20_km || '',
            fare_20_50_km: driverInfo?.vehicle?.vehicle_fare.fare_20_50_km || '',
            fare_above_50_km: driverInfo?.vehicle?.vehicle_fare.fare_above_50_km || '',
        },
        resolver: yupResolver(fareSchema),
    });

    const onSubmit = (data) => {
        const {
            base_fare,
            fare_0_10_km,
            fare_10_20_km,
            fare_20_50_km,
            fare_above_50_km,
        } = data;
        if (isDirty) {
            if (driverInfo?.vehicle?.id) {
                editVehicleFair({
                    base_fare,
                    fare_0_10_km,
                    fare_10_20_km,
                    fare_20_50_km,
                    fare_above_50_km,
                    id: driverInfo.vehicle.id,
                }).unwrap()
                .then(data => {
                  showSuccessMessage('Updated successfully')
                  goBack()
                })
                .catch(error => console.log(error));
            }
        }
    };

    if (isEmpty(driverInfo?.vehicle)) {
        return (
            <SearchLoader msg='No Vehicles assigned' isLoader={false} />
        );
    }

    const isDisabled = !isDirty || !isEmpty(errors)
    return (
        <ScrollView>
            <ScreenContainer>
                <FormProvider {...methods}>
                    <View style={{ margin: 10 }}>
                        {BASE_FARE_FORM.map((field, index) => {
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
                                                        // type={"number"}
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
