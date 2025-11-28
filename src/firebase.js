// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApwF8p_ZcI011Vu3kzd7ElobPUL0kZxhs",
  authDomain: "dims-86708.firebaseapp.com",
  projectId: "dims-86708",
  storageBucket: "dims-86708.firebasestorage.app",
  messagingSenderId: "625308561574",
  appId: "1:625308561574:web:fcd860f116068869bc8467",
  measurementId: "G-GXL8NJQJ2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    // Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('No user data found');
    }
    
    return {
      uid: user.uid,
      email: user.email,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export { auth, db };
