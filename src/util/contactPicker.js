import { PermissionsAndroid } from 'react-native';
import { selectContactPhone } from 'react-native-select-contact';

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
                // let number = selectedPhone.number.replace(/ /g, ''); //trim spaces
                // if (
                //     (number.startsWith('02') || number.startsWith('+2')) &&
                //     service.is_contact &&
                //     !(service.max_length == 10)
                // )
                //     setRefrenceValue(number.slice(2));
                // else setRefrenceValue(number);

                //format ph number before sending to server
                console.log(selectedPhone, contact)
                return selectedPhone.number;
            },
            err => {
                console.log('GET CONTACT NUMBER ERRRORRR: ', err);
            },
        );
};