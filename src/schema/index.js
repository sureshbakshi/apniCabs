import * as yup from 'yup';
const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


export const signInSchema = yup.object().shape({
    "email": yup
        .string()
        .required("Email is required")
        .matches(email, {
            message: "Please enter valid email",
        }),
    'password': yup
        .string()
        .required("Password is required"),

});

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