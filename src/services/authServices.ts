import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

function isGoogleSignInError(error: unknown): error is {code: string} {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export async function signInWithGoogle(): Promise<UserInfo> {
  try {
    const userInfo = await GoogleSignin.signIn();

    if (!userInfo.data?.idToken) {
      throw new Error('Google Sign-In failed. No ID token found.');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.data?.idToken,
    );
    const userCredential: FirebaseAuthTypes.UserCredential =
      await auth().signInWithCredential(googleCredential);

    const {uid, email, displayName, photoURL} = userCredential.user;

    return {uid, email, displayName, photoURL};
  } catch (error) {
    if (isGoogleSignInError(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.error('User cancelled the sign-in process.');
          break;
        case statusCodes.IN_PROGRESS:
          console.error('Google Sign-In is already in progress.');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error('Google Play Services are not available or outdated.');
          break;
        default:
          console.error('Unknown Google Sign-In error:', error);
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
    console.log('User signed out!');
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}
