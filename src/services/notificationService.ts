import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification  from 'react-native-push-notification';

export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted:', authStatus);

      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
  }
};

export const configureLocalNotifications = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
        {
          channelId: 'default-channel-id',
          channelName: 'Default Channel',
          channelDescription: 'A default channel for app notifications',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => {
          if (created) {
            console.log('Notification Channel Created Successfully');
          } else {
            console.log('Notification Channel Already Exists');
          }
        }
      );
  }
};

export const showLocalNotification = (title: string, message: string) => {
    console.log('called : ');
    
  PushNotification.localNotification({
    title,
    message,
    channelId: 'default-channel-id',
    playSound: true,
    soundName: 'default',
  })
};
