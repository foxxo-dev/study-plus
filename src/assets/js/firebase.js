// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAF-Fk00jDHYI7ZnwF9V3pGnh0-Pvvykyo',
  authDomain: 'study-plus-app-foxxo-dev.firebaseapp.com',
  projectId: 'study-plus-app-foxxo-dev',
  storageBucket: 'study-plus-app-foxxo-dev.firebasestorage.app',
  messagingSenderId: '349012067909',
  appId: '1:349012067909:web:97cdfd6f4a749e0983852c',
  measurementId: 'G-N243YMT0MH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics as firebaseAnalytics, app as firebaseApp };

export async function signInWithEmail(
  email,
  password,
  successState,
  errorState,
) {
  if (!email || !password) {
    errorState('Email and password are required');
    return;
  }

  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    successState(userCredential.user); // ✅ Pass user to successState
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      try {
        const _auth = getAuth();
        const newUser = await createUserWithEmailAndPassword(
          _auth,
          email,
          password,
        );
        successState(newUser.user); // ✅ Pass user to successState
      } catch (createError) {
        errorState(createError.message);
      }
    } else {
      errorState(error.message);
    }
  }
}

export async function signInWithGoogle(successState, errorState) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const userCredential = await signInWithPopup(auth, provider);
    successState(userCredential.user);
  } catch (error) {
    errorState(error.message);
  }
}
