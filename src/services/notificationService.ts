import messaging from '@react-native-firebase/messaging';
import { NavigationContainerRef } from '@react-navigation/native';
import { Platform } from 'react-native';
import PushNotification  from 'react-native-push-notification';

interface setupNotificationListenersProps {
  navigationRef: React.RefObject<NavigationContainerRef<any>>;
}
// Request Notification Permission and Retrieve Token
export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted:', authStatus);

      // Get the FCM token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
  }
};

// Initialize Local Notification Channel (Android)
export const configureLocalNotifications = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
        {
          channelId: 'default-channel-id',
          channelName: 'Default Channel',
          channelDescription: 'A default channel for app notifications',
          soundName: 'default', // Use the default sound
          importance: 4, // High importance
          vibrate: true, // Enable vibration
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

// Display Local Notification
const showLocalNotification = (title: string, message: string) => {
    console.log('called : ');
    
  PushNotification.localNotification({
    title,
    message,
    channelId: 'default-channel-id', // Required for Android
    playSound: true,
    soundName: 'default',
  })
};

// Setup Notification Listeners
export const setupNotificationListeners = ({navigationRef}:NavigationContainerRef<any>) => {
  console.log('Setting up notification listeners...');

  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground notification:', remoteMessage);

    showLocalNotification(
      remoteMessage.notification?.title ?? 'Notification',
      remoteMessage.notification?.body ?? 'You have a new message.'
    );
  });

  // App Opened from Background State
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification caused app to open:', remoteMessage);
    navigateToDetailsScreen(remoteMessage,navigationRef);
  });

  // App Opened from Terminated State
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from a terminated state:', remoteMessage);
        navigateToDetailsScreen(remoteMessage);
      }
    });

  // Background Message Handling
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background:', remoteMessage);
  });
};

// Helper Function to Navigate to Details Screen
const navigateToDetailsScreen = (remoteMessage: any,navigationRef:NavigationContainerRef<any> ) => {
  if (remoteMessage?.data?.url && navigationRef) {
    navigationRef.navigate('Details', { url: remoteMessage.data.url });
  }
};
