// useLocalNotifications.js
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { scheduleLocalNotification } from '../util';
import { useDispatch } from 'react-redux';
import { setDeviceToken } from '../slices/authSlice';
import useRegisterDeviceToken from './useRegisterDeviceToken';
import useHandleDeeplinks from './useHandleDeeplinks';
let isInitialized = false;

export default () => {
  const dispatch = useDispatch()
  useRegisterDeviceToken()
  useHandleDeeplinks()

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
        }
      });
      Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
        console.error({ registerRemoteNotificationsRegistrationFailed: event });
      });
      Notifications.events().registerRemoteNotificationsRegistrationDenied((event) => {
        console.error({ registerRemoteNotificationsRegistrationDenied: event });
      });
      isInitialized = true

    }

    return () => {
      // Clean up notification listeners on component unmount
      Notifications.events().registerNotificationReceivedForeground(() => { });
      Notifications.events().registerNotificationOpened(() => { });
      Notifications.events().registerRemoteNotificationsRegistered(() => { })
    };
  }, []);


  return { registerRemoteNotifications };
};

