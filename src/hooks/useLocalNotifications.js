// useLocalNotifications.js
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';

const useLocalNotifications = () => {
  useEffect(() => {
    // Configure local notifications
    console.log({ Notifications })
    // Notifications.registerLocalNotifications();

    // Set up notification listeners
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


    return () => {
      // Clean up notification listeners on component unmount
      Notifications.events().registerNotificationReceivedForeground(() => { });
      Notifications.events().registerNotificationOpened(() => { });


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

export const scheduleLocalNotification = (title, message, data = {}) => {
  const options = {
    title,
    body: message,
    data,
  };
  console.log('scheduleLocalNotification', Notifications)

  Notifications?.postLocalNotification(options);
};

export default useLocalNotifications;
