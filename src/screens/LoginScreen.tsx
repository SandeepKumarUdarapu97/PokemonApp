import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {signInWithGoogle, UserInfo} from '../services/authServices';
import {useDispatch} from 'react-redux';
import {login} from '../redux/slices/authSlice';
import {getHeight, getWidth, normalize} from '../utils';

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
        }),
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
          <TouchableOpacity
            style={styles.signButton}
            onPress={() => handleGoogleSignIn()}>
            <Text style={styles.signText}>SignIn with google</Text>
          </TouchableOpacity>
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
    padding: getHeight(2),
  },
  text: {
    fontSize: normalize(18),
    marginBottom: getHeight(2),
  },
  errorText: {
    color: 'red',
    fontSize: normalize(12),
    marginBottom: getHeight(2),
  },
  signButton: {
    borderRadius: getWidth(1),
    backgroundColor: '#c6a49d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: getHeight(1),
  },
  signText: {fontSize: normalize(14), color: 'white', fontWeight: '400'},
});

export default LoginScreen;
