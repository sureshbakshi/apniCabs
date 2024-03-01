// useLocalNotifications.js
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { scheduleLocalNotification } from '../util';
import { useDispatch } from 'react-redux';
import { delay } from 'lodash';
import { setDeviceToken } from '../slices/authSlice';
import { useSendDeviceTokenMutation } from '../slices/apiSlice';
let isInitialized = false;

const useLocalNotifications = () => {
  const dispatch = useDispatch()
  const [sendDeviceToken] =
    useSendDeviceTokenMutation();
  const registerRemoteNotifications = async () => {
    const isAndroid = Platform.OS === 'android'
    if (isAndroid) {
      const hasPermissions = await Notifications.isRegisteredForRemoteNotifications();
      console.log({ hasPermissions })
      // if (!hasPermissions) {
      Notifications.registerRemoteNotifications();
      // }
    } else {
      const hasPermissions = Notifications.ios.checkPermissions();
      if (true) {
        Notifications.ios.registerRemoteNotifications({
          providesAppNotificationSettings: true,
          provisional: true,
          carPlay: true,
          criticalAlert: true,
        });
      }
    }
  }

  const getInitialNotification = async () => {
    const notification = await Notifications.getInitialNotification();
    console.log({ getInitialNotification: notification })
  }
  useEffect(() => {
    // Configure local notifications
    console.log({ Notifications })
    // Notifications.registerLocalNotifications();
    if (!isInitialized) {
      registerRemoteNotifications()
      getInitialNotification()
      Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
        console.log('Local Notification received in foreground:', notification);
        // Handle foreground notifications
        scheduleLocalNotification(notification)
        completion({ alert: true, sound: true, badge: false });
      });

      Notifications.events().registerNotificationOpened((notification, completion) => {
        console.log('Local Notification opened:', notification);
        // Handle notification click or deep link here
        completion();
      });
      Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
        console.log('registerNotificationReceivedBackground:', notification);
        // Handle notification click or deep link here
        scheduleLocalNotification(notification)
        completion();
      });

      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        console.log("registerRemoteNotificationsRegistered Device token:", event.deviceToken);
        const device_token = event.deviceToken
        if (device_token) {
          dispatch(setDeviceToken(device_token))
          sendDeviceToken({device_token, device_type: Platform.OS})
        }
      });
      Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
        console.error({ registerRemoteNotificationsRegistrationFailed: event });
      });
      Notifications.events().registerRemoteNotificationsRegistrationDenied((event) => {
        console.error({ registerRemoteNotificationsRegistrationDenied: event });
      });

    }
    // Set up notification listeners
    isInitialized = true

    return () => {
      // Clean up notification listeners on component unmount
      Notifications.events().registerNotificationReceivedForeground(() => { });
      Notifications.events().registerNotificationOpened(() => { });
      Notifications.events().registerRemoteNotificationsRegistered(() => { })
    };
  }, []);


  return { registerRemoteNotifications };
};


export default useLocalNotifications;
