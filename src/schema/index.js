import * as yup from 'yup';
const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const noSplCharExp = /^[^*|\":<>[\]{}`\\()';@&$]+$/
const phone = /^[0-9]{10}$/


const validateEmail = (emailVal) => {
    return email.test(emailVal)
};

const validatePhone = (number) => {
    return phone.test(number);
};

export const signInSchema = yup.object().shape({
    "mobile": yup
        .string()
        .required("mobile number is required")
        .matches(phone, {
            message: "Please enter valid mobile number",
        }),
    // "email": yup.string()
    //     .required('Email / Phone is required')
    //     .test('email_or_phone', 'Email / Phone is invalid', (value) => {
    //         return validateEmail(value) || validatePhone(parseInt(value ?? '0'));
    //     }),
    // 'password': yup
    //     .string()
    //     .required("Password is required"),

});


export const forgotPasswordSchema = yup.object().shape({
    "mobile": yup
        .string()
        .required("Phone number is required")
        .matches(phone, {
            message: "Please enter valid Phone number",
        }),
    "password": yup
        .string()
        .required("Please enter password")
        .min(6, 'Minimum 6 Characters required'),
    "confirm_password": yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const contactsSchema = yup.object().shape({
    "phone_number1": yup
        .string()
        .required("Please enter phone_number 1")
        .matches(phone, {
            message: "Please enter valid 10 digit phone number",
        }),
    "phone_number2": yup
        .string()
        .required("Please enter  phone_number 2")
        .matches(phone, {
            message: "Please enter valid 10 digit phone number",
        }),
    "phone_number3": yup
        .string()
        .required("Please enter  phone_number 3")
        .matches(phone, {
            message: "Please enter valid 10 digit phone number",
        }),
    "phone_number4": yup
        .string()
        .required("Please enter  phone_number 4")
        .matches(phone, {
            message: "Please enter valid 10 digit phone number",
        })
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
        .test('validate-email', 'Please enter a valid valid email', (value, context) => {
            if (value && value.length > 0) {
                return value.match(email) !== null;
            }
            return true;
        }).nullable(true),
    "phone": yup
        .string()
        .required("Please enter phone number")
        .matches(phone, "Please enter valid 10 digit phone number"),
    // "password": yup
    //     .string()
    //     .required("Please enter password")
    //     .min(6, 'Minimum 6 Characters required'),
    "referred_by": yup
        .string()
        .test('valid-referral-code', 'Please enter a valid referral code', (value, context) => {
            if (value && value.length > 0) {
                return value.match(noSplCharExp) !== null;
            }
            return true;
        })
        .nullable(true),
});