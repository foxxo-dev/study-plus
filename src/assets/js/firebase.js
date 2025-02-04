import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAF-Fk00jDHYI7ZnwF9V3pGnh0-Pvvykyo',
  authDomain: 'study-plus-app-foxxo-dev.firebaseapp.com',
  projectId: 'study-plus-app-foxxo-dev',
  storageBucket: 'study-plus-app-foxxo-dev.firebasestorage.app',
  messagingSenderId: '349012067909',
  appId: '1:349012067909:web:97cdfd6f4a749e0983852c',
  measurementId: 'G-N243YMT0MH',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

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
    successState(userCredential.user);
  } catch (error) {
    console.error('Sign-in error:', error.code, error.message);

    if (error.code !== 'auth/wrong-password') {
      try {
        const newUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        successState(newUser.user);
      } catch (createError) {
        errorState(createError.message);
      }
    } else if (error.code === 'auth/wrong-password') {
      errorState('Invalid password');
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

export async function getUsersBackground(uid) {
  const userDocRef = doc(db, 'userSettings', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, { background: '/src/assets/img/book-bg.png' });
    return '/src/assets/img/book-bg.png';
  }

  return userDoc.data().background;
}

export async function getFileURI(file, maxSize = 10000) {
  if (!file) {
    throw new Error('No file provided');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      let base64URL = reader.result;

      // Convert and compress if needed
      base64URL = await compressImage(base64URL, maxSize);
      resolve(base64URL);
    };

    reader.onerror = (error) => reject(error);
  });
}

async function compressImage(base64URL, maxSize) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64URL;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize the image (adjust size as needed)
      const maxWidth = 1280; // Reduce image width
      const maxHeight = 720;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        } else {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels to keep it under maxSize
      let quality = 0.7; // Adjust this for better balance
      let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

      while (
        atob(compressedBase64.split(',')[1]).length > maxSize &&
        quality > 0.3
      ) {
        quality -= 0.1;
        compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(compressedBase64);
    };

    img.onerror = (error) => reject(error);
  });
}

export async function changeUserBackground(uid, backgroundImage) {
  const userDocRef = doc(db, 'userSettings', uid);
  const uri = await getFileURI(backgroundImage); // Compress image

  await setDoc(userDocRef, { background: uri }, { merge: true });

  // console.log(uri);

  return uri; // ✅ Return the image URI for immediate use in Vue
}

export async function changeUserBackgroundPath(uid, path) {
  const userDocRef = doc(db, 'userSettings', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return '/src/assets/img/book-bg.png';
  }

  await setDoc(userDocRef, { background: path }, { merge: true });

  return userDoc.data().background;
}

export async function updateUserProfileName(displayName) {
  const auth = getAuth();
  await updateProfile(auth.currentUser, {
    displayName: displayName,
  });
}

export async function changeUserPfP(uid, file) {
  if (!file) console.error('Please include a file!');
  if (!file) return null;

  try {
    // Convert image to Base64 (compressed)
    const base64URI = await getFileURI(file, 10000);

    // Save Base64 string to Firestore
    const userDocRef = doc(db, 'userSettings', uid);
    await setDoc(userDocRef, { photoURL: base64URI }, { merge: true });

    return base64URI; // Return the image for immediate UI update
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}

export async function getUserPfp(uid) {
  const userDocRef = doc(db, 'userSettings', uid);
  const userDoc = await getDoc(userDocRef);

  return userDoc.exists() ? userDoc.data().photoURL : null;
}
