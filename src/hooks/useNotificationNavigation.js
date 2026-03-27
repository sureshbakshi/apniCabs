import { useNavigation } from '@react-navigation/native';
import delay from 'lodash/delay'

export const useNotificationNavigation = () => {
    const navigation = useNavigation();

    const handleNotificationOpen = (notification, completion = () => { }, delayInMillSeconds = 250) => {
        const { route } = notification?.payload || {};

        if (route) {
            delay(() => navigation?.navigate(route), delayInMillSeconds);
        }
        completion?.();
    };

    return handleNotificationOpen;
};