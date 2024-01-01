import * as yup from 'yup';

export const fareSchema = yup.object().shape({
    "base_fare": yup
        .string()
        .required("Please enter Base fare amount"),
    "fare_0_10_km": yup
        .string()
        .required("Please enter fare amount for below 10km"),
    "fare_10_20_km": yup
        .string()
        .required("Please enter fare amount for 10 to 20km"),
    "fare_20_50_km": yup
        .string()
        .required("Please enter fare amount for 20 to 50km"),
    "fare_above_50_km": yup
        .string()
        .required("Please enter fare amount above 50km"),
});