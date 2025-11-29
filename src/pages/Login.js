import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 6; // Firebase requires at least 6 characters
  };
  
  const validateForm = () => {
    if (!credentials.email) {
      setError('Email is required');
      return false;
    }
    if (!validateEmail(credentials.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!credentials.password) {
      setError('Password is required');
      return false;
    }
    if (!validatePassword(credentials.password)) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };
  
  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      // Get the user's ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Store the token and user data
      localStorage.setItem('authToken', idToken);
      localStorage.setItem('user', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      }));
      
      // Call the onLogin callback with just the email
      onLogin(userCredential.user.email);
      
      // Redirect to dashboard on success
      navigate('/dashboard');
      
    } catch (err) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      // Handle specific Firebase Auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use. Please use a different email or sign in.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = err.message || 'An error occurred. Please try again.';
      }
      
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>DinoWorld Inventory Management System (DIMS)</h2>
        <p>Please log in to continue</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              onBlur={() => handleBlur('email')}
              className={touched.email && !credentials.email ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              onBlur={() => handleBlur('password')}
              className={touched.password && !credentials.password ? 'error' : ''}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
