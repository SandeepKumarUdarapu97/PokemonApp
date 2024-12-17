import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import { updateNotificationData } from '../redux/slices/authSlice';
import { showLocalNotification } from '../services/notificationService';
const Stack = createStackNavigator();


const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=>{
     messaging()
     .getInitialNotification()
     .then((remoteMessage) => {
       if (remoteMessage?.data) {
         console.log('App opened from terminated state:', remoteMessage);
         dispatch(updateNotificationData({url : remoteMessage.data?.url}))
       }
     });

   messaging().onMessage(async (remoteMessage) => {
     showLocalNotification(
       remoteMessage.notification?.title ?? 'Notification',
       remoteMessage.notification?.body ?? 'You have a new message.'
     );
   });

   messaging().onNotificationOpenedApp((remoteMessage) => {
     console.log('App opened from background:', remoteMessage);
     if (remoteMessage?.data) {
       dispatch(updateNotificationData({url : remoteMessage.data?.url}))
     }
   });
  },[])

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
