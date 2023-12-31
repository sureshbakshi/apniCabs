import * as yup from 'yup';

export const fareSchema = yup.object().shape({
    "base_fare": yup
        .number()
        .required("Base Fare is required"),
    "fare_0_10_km": yup
        .number()
        .required("Fare is required"),
    "fare_10_20_km": yup
        .number()
        .required("Fare is required"),
    "fare_20_50_km": yup
        .number()
        .required("Fare is required"),
    "fare_above_50_km": yup
        .number()
        .required("Fare is required"),
});