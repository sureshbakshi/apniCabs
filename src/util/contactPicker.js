import { PermissionsAndroid, Platform } from 'react-native';
import { selectContactPhone } from 'react-native-select-contact';
import { showErrorMessage } from '.';

// Function to validate Indian mobile number
const isValidIndianMobile = (number) => {
    const regex = /^[6789]\d{9}$/; // Matches a 10-digit number starting with 6,7, 8, or 9
    return regex.test(number);
};

// Function to format Indian mobile number
const formatIndianMobile = (number) => {
    // Keep digits only
    let n = String(number || '').replace(/\D/g, '');
    // Strip any leading zeros
    n = n.replace(/^0+/, '');
    // Strip one leading country code '91' if present
    n = n.replace(/^91/, '');
    // If still longer than 10, keep the last 10 digits (common when multiple prefixes exist)
    if (n.length > 10) n = n.slice(-10);
    return n;
};
export const getPhoneNumber = async () => {
    try {
        if (Platform.OS === 'android') {
            // Check first to avoid redundant prompts
            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            );
            let status = hasPermission
                ? PermissionsAndroid.RESULTS.GRANTED
                : await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                  );

            if (
                status === PermissionsAndroid.RESULTS.DENIED ||
                status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
            ) {
                showErrorMessage('Contacts permission is required to pick a number.');
                return null;
            }
        }

        const selection = await selectContactPhone();
        if (!selection) return null;

        const { contact, selectedPhone } = selection;
        const raw = selectedPhone?.number || '';
        if (!raw) return null;

        const formattedPhoneNumber = formatIndianMobile(raw);
        if (!isValidIndianMobile(formattedPhoneNumber)) {
            showErrorMessage('Not a valid number!');
            return null;
        }

        return {
            name: contact?.name || '',
            number: formattedPhoneNumber,
        };
    } catch (err) {
        showErrorMessage('Something went wrong while picking contact');
        return null;
    }
};