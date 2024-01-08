// useLocalNotifications.js
import { useEffect } from 'react';
import { Notifications } from 'react-native-notifications';

const useLocalNotifications = () => {
  useEffect(() => {
    // Configure local notifications
    console.log({Notifications})
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

    return () => {
      // Clean up notification listeners on component unmount
      Notifications.events().registerNotificationReceivedForeground(() => {});
      Notifications.events().registerNotificationOpened(() => {});
    };
  }, []);

  const scheduleLocalNotification = (title, message, data = {}) => {
    const options = {
      title,
      body: message,
      data,
    };

    Notifications.postLocalNotification(options);
  };

  return { scheduleLocalNotification };
};

export default useLocalNotifications;
