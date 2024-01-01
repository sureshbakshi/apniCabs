import * as yup from 'yup';
const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const noSplCharExp = /^[^*|\":<>[\]{}`\\()';@&$]+$/
const phone = /^[0-9]{10}$/


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

export const signupSchema = yup.object().shape({
    "name": yup
        .string()
        .required("Please enter name")
        .matches(noSplCharExp, {
            message: "Special characters are not allowed",
        }),
    "email": yup
        .string()
        .required("Please enter email")
        .matches(email, {
            message: "Please enter valid email",
        }),
    "phone": yup
        .string()
        .required("Please enter phone")
        .matches(phone, {
            message: "Please enter valid 10 digit phone number",
        }),
    "password": yup
        .string()
        .required("Please enter password")
        .matches(noSplCharExp, {
            message: "Please enter valid password",
        }),
    "referral_phone_number": yup
    .string(),
});