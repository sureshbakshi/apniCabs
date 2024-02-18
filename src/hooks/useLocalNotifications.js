// useLocalNotifications.js
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
let isInitialized = false;

const useLocalNotifications = () => {
  useEffect(() => {
    // Configure local notifications
    console.log({ Notifications })
    // Notifications.registerLocalNotifications();
    if (!isInitialized) {
      Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
        console.log('Local Notification received in foreground:', notification);
        // Handle foreground notifications
        completion({ alert: true, sound: true, badge: false });
      });

      Notifications.events().registerNotificationOpened((notification, completion) => {
        console.log('Local Notification opened:', notification);
        // Handle notification click or deep link here
        completion();
      });

      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        console.log("registerRemoteNotificationsRegistered Device token:", event.deviceToken);
      });
      Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
        console.error({ registerRemoteNotificationsRegistrationFailed: event });
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

  const registerRemoteNotifications = async () => {
    const isAndroid = Platform.OS === 'android'
    if (isAndroid) {
      const hasPermissions = await Notifications.isRegisteredForRemoteNotifications();
      console.log({ hasPermissions })
      if (!hasPermissions) {
        Notifications.registerRemoteNotifications();
      }
    } else {
      const hasPermissions = Notifications.ios.checkPermissions();
      if (!hasPermissions) {
        Notifications.ios.registerRemoteNotifications({
          providesAppNotificationSettings: true,
          provisional: true,
          carPlay: true,
          criticalAlert: true,
        });
      }

    }
  }

  return { registerRemoteNotifications };
};


export default useLocalNotifications;
