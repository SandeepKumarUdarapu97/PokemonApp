import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import 'react-native-gesture-handler';

const firebaseConfig = {
  apiKey: 'AIzaSyDs8b8erWIxigwmiHtrwvqjOi0eVgXIN-o',
  authDomain: 'pokemonapp-f9f86.firebaseapp.com',
  projectId: 'pokemonapp-f9f86',
  storageBucket: 'pokemonapp-f9f86.appspot.com',
  messagingSenderId: '622892887627',
  appId: '1:622892887627:android:0db5cf8ebd63e2eb2427ce',
  databaseURL: '',
};

const App: React.FC = () => {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    const initializeFirebase = async () => {
      try {
        if (!firebase.apps.length) {
          await firebase.initializeApp(firebaseConfig);
        }
        setIsFirebaseInitialized(true);
      } catch (error) {
        console.error('Firebase initialization error:', error.message);
      }
    };

    initializeFirebase();
    GoogleSignin.configure({
      webClientId: '622892887627-jeto2n45bvgavl0s7ufnoldgfnom9pdk.apps.googleusercontent.com',
    });
  }, []);

  const queryClient = new QueryClient();

  if (!isFirebaseInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Initializing Firebase...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate
          loading={
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Rehydrating State...</Text>
            </View>
          }
          persistor={persistor}
        >
          <AppNavigator />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
