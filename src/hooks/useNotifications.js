import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import { Notifications } from 'react-native-notifications';
import { scheduleLocalNotification, unflattenObj } from '../util';
import { useDispatch } from 'react-redux';
import { setDeviceToken } from '../slices/authSlice';
import useRegisterDeviceToken from './useRegisterDeviceToken';
import useHandleDeeplinks from './useHandleDeeplinks';
let isInitialized = false;
const notificationKey = 'gcm.notification'
export default () => {
  const dispatch = useDispatch()
  useRegisterDeviceToken()
  useHandleDeeplinks()

  const requestNotificationPermission = async () => {
    if (Platform.Version >= 33) {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        )
        // Handling the result of the permit request
        if (result === RESULTS.GRANTED) {
          console.log('Permissions granted');
        } else {
          console.log('Permissions not granted');
        }
      } catch (error) {
        // Error handling during permission request
        console.error(error);
      }
    }
  }

  const registerRemoteNotifications = async () => {
    const isAndroid = Platform.OS === 'android'
    if (isAndroid) {
      const hasPermissions = await Notifications.isRegisteredForRemoteNotifications();
      requestNotificationPermission()
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

  const triggerNotfication = (remoteNotification) => {
    if (remoteNotification?.payload) {
      const notification = unflattenObj(remoteNotification.payload, notificationKey)
      if (notification) {
        scheduleLocalNotification(notification)
      }
    }
  }


  useEffect(() => {
    // Configure local notifications
    console.log({ Notifications })
    // Notifications.registerLocalNotifications();
    if (!isInitialized) {
      registerRemoteNotifications()
      getInitialNotification()
      Notifications.events().registerNotificationReceivedForeground((remoteNotification, completion) => {
        console.log('Local Notification received in foreground:', remoteNotification);
        // Handle foreground notifications
        triggerNotfication(remoteNotification)
        completion({ alert: true, sound: true, badge: false });
      });

      Notifications.events().registerNotificationReceivedBackground((remoteNotification, completion) => {
        console.log('registerNotificationReceivedBackground:', remoteNotification);
        // Handle notification click or deep link here
        triggerNotfication(remoteNotification)
        completion();
      });

      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        console.log("registerRemoteNotificationsRegistered Device token:", event.deviceToken);
        const device_token = event.deviceToken
        if (device_token) {
          dispatch(setDeviceToken(device_token))
        }
      });

      Notifications.events().registerNotificationOpened((notification, completion) => {
        console.log('Local Notification opened:', notification);
        // Handle notification click or deep link here
        completion();
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

