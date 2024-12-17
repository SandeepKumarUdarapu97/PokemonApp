import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithGoogle, UserInfo } from '../services/authServices';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const loggedInUser: UserInfo = await signInWithGoogle();
      dispatch(
        login({
          displayName: loggedInUser.displayName,
          photoURL: loggedInUser.photoURL,
          email: loggedInUser.email,
        })
      );
    } catch (error) {
      console.error('Login Failed:', error);
      setErrorMessage('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.text}>Login with Google</Text>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          <Button title="Sign In with Google" onPress={handleGoogleSignIn} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
  },
});

export default LoginScreen;
