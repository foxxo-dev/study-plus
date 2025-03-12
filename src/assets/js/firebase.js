import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
  applyActionCode,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
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

export function _getUser() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } else {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
});

export function getUserUID() {
  const user = getUser();
  return user ? user.uid : null;
}

export async function updatePercentage(uid, projectId, percentage) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  console.log(percentage);
  await setDoc(projectDocRef, { percentage }, { merge: true });
}

export async function getPercentage(uid, projectId) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  const projectDoc = await getDoc(projectDocRef);

  return projectDoc.exists() ? projectDoc.data().percentage : 0;
}

export async function verifyEmail(mode, actionCode, lang) {
  if (mode !== 'verifyEmail') {
    throw new Error('Invalid mode');
    return false;
  }

  const auth = getAuth(app);

  applyActionCode(auth, actionCode)
    .then((resp) => {
      console.log('Email verified:', resp);

      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

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
    if (userCredential.user.emailVerified) {
      successState(userCredential.user);
    } else {
      sendEmailVerification(auth.currentUser).then(() => {
        errorState('Email not verified. Verify Via the Verification Email');
      });
    }
  } catch (error) {
    console.error('Sign-in error:', error.code, error.message);

    if (error.code !== 'auth/wrong-password') {
      try {
        const newUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        sendEmailVerification(auth.currentUser).then(() => {
          errorState('Email not verified. Verify Via the Verification Email');
        });
      } catch (createError) {
        errorState(createError.message);
      }
    } else if (error.code === 'auth/wrong-password') {
      errorState('Invalid password');
    } else if (error.code === 'auth/email-already-in-use') {
      errorState('User already exists on different provider');
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

  // Calculate average background color
  const averageBackgroundColor = await getAverageColorFromImage(uri);

  await setDoc(
    userDocRef,
    { background: uri, averageBackgroundColor },
    { merge: true },
  );

  return uri; // ✅ Return the image URI for immediate use in Vue
}

export async function changeUserBackgroundPath(uid, path) {
  const userDocRef = doc(db, 'userSettings', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return '/src/assets/img/book-bg.png';
  }

  // Calculate average background color
  const averageBackgroundColor = await getAverageColorFromImage(path);

  await setDoc(
    userDocRef,
    { background: path, averageBackgroundColor },
    { merge: true },
  );

  return userDoc.data().background;
}

async function getAverageColorFromImage(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));

      resolve(`rgb(${r},${g},${b})`);
    };

    img.onerror = (error) => reject(error);
  });
}

export async function updateUserProfileName(displayName) {
  const auth = getAuth();
  await updateProfile(auth.currentUser, {
    displayName: displayName,
  });
}

export async function getAverageColor(uid) {
  const userDocRef = doc(db, 'userSettings', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return '#3f1487';
  }

  return userDoc.data().averageBackgroundColor;
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

export async function getUserFlashCards(uid, projectId) {
  const userDocRef = doc(db, 'userSettings', uid, 'projects', projectId);
  if (!userDocRef) return [];
  const userDoc = await getDoc(userDocRef);

  // console.log(userDoc.data().flashcards);

  return userDoc.exists() ? userDoc.data().flashcards : [];
}

export async function setUserFlashCards(uid, projectId, flashcards) {
  const userDocRef = doc(db, 'userSettings', uid, 'projects', projectId);
  await setDoc(userDocRef, { flashcards }, { merge: true });
}

export async function getRegenerations(uid) {
  const userDocRef = doc(db, 'userSettings', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.data().regenerations === undefined) {
    await setDoc(userDocRef, { regenerations: 4 }, { merge: true });
    return 4;
  }

  return userDoc.exists() ? userDoc.data().regenerations : 4;
}

export async function setRegenerations(uid, regens) {
  const userDocRef = doc(db, 'userSettings', uid);
  await setDoc(userDocRef, { regenerations: regens }, { merge: true });
  return regens;
}

export async function getProject(uid, projectId) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  const projectDoc = await getDoc(projectDocRef);

  return projectDoc.exists() ? projectDoc.data() : null;
}

export async function getProjectsList(uid) {
  const projectsCollectionRef = collection(db, 'projects', uid, 'userProjects');
  const projectsCollection = await getDocs(projectsCollectionRef); // Use getDocs() instead of `.get()`

  // If no project list exists, return an empty array
  if (projectsCollection.empty) return [];

  return projectsCollection.docs.map((doc) => doc.data());
}

export async function createProject(uid, project) {
  const projectsCollectionRef = collection(db, 'projects', uid, 'userProjects');
  await setDoc(doc(projectsCollectionRef, project.id), project);
}
export async function getProjectRating(uid, projectId) {
  // return a object of rating and improvements
  if (!projectId) {
    throw new Error('Project ID is undefined');
  }
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  const projectDoc = await getDoc(projectDocRef);

  return {
    rating: projectDoc.data().rating,
    improvements: projectDoc.data().improvements,
  };
}

export async function createProjectRating(
  uid,
  projectId,
  rating,
  improvements,
) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  await setDoc(projectDocRef, { rating, improvements }, { merge: true });
}
export async function getPDFURL(uid, projectId) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  const projectDoc = await getDoc(projectDocRef);

  return projectDoc.exists() ? projectDoc.data().pdfURL : null;
}

export async function setPDFURL(uid, projectId, pdfURL) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  await setDoc(projectDocRef, { pdfURL }, { merge: true });
}

export async function setPoints(uid, projectId, points) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  await setDoc(projectDocRef, { points }, { merge: true });
}

export async function getPoints(uid, projectId) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  const projectDoc = await getDoc(projectDocRef);

  return projectDoc.exists() ? projectDoc.data().points : 0;
}

export async function getPlayArea(uid, projectId) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  const projectDoc = await getDoc(projectDocRef);

  return projectDoc.exists() ? projectDoc.data().playArea : [];
}
export async function setPlayArea(uid, projectId, playArea) {
  const projectDocRef = doc(db, 'projects', uid, 'userProjects', projectId);
  await setDoc(projectDocRef, { playArea: playArea }, { merge: true });
}

export async function sendResetPassEmail(email) {
  // we cannot access auth since we assume the user is logged out
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email).catch((error) => {
    console.error('Error sending password reset email:', error);
    return false;
  });
  return true;
}

export async function resetPassword(obbCode, newPassword) {
  const auth = getAuth();
  applyActionCode(auth, obbCode)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
