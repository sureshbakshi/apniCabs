import { PermissionsAndroid } from 'react-native';
import { selectContactPhone } from 'react-native-select-contact';
import { showErrorMessage } from '.';

// Function to validate Indian mobile number
const isValidIndianMobile = (number) => {
    const regex = /^[6789]\d{9}$/; // Matches a 10-digit number starting with 6,7, 8, or 9
    return regex.test(number);
};

// Function to format Indian mobile number
const formatIndianMobile = (number) => {
    // Remove any non-numeric characters
    let cleanedNumber = number.replace(/\D/g, '');
    // Remove leading 0 or +91 if present
    if (cleanedNumber.startsWith('0')) {
        cleanedNumber = cleanedNumber.slice(1); // Remove the leading 0
    } else if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
        cleanedNumber = cleanedNumber.slice(2); // Remove the leading +91
    }

    // Format the number in the XXXXXXXXXX format
    return `${cleanedNumber}`;
};


export const getPhoneNumber = async () => {
    if (Platform.OS === 'android') {
        const request = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );

        // denied permission
        if (request === PermissionsAndroid.RESULTS.DENIED) throw Error("Permission Denied");

        // user chose 'deny, don't ask again'
        else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) throw Error("Permission Denied");
    }

    return selectContactPhone().then(
        selection => {
            if (!selection) {
                return null;
            }
            let { contact, selectedPhone } = selection;
            if (selectedPhone?.number) {
                let formattedPhoneNumber = formatIndianMobile(selectedPhone?.number);
                if (!isValidIndianMobile(formattedPhoneNumber)) {
                    showErrorMessage('Not a valid number!');
                    // return null;
                }
                let payload = {
                    name: contact.name,
                    number: formattedPhoneNumber
                }
                return payload;
            }
            return null;

        },
        err => {
            showErrorMessage('Something Went Wrong');
        },
    );
};