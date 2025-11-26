import { loginWithEmailAndPassword, auth } from '../firebase';

export const login = async (email, password) => {
  try {
    const user = await loginWithEmailAndPassword(email, password);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    // Handle specific Firebase Auth errors
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};

export const isAuthenticated = () => {
  // Check if user is logged in through Firebase Auth
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

export const logout = async () => {
  try {
    await auth.signOut();
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
