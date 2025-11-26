import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const useAutoLogout = (onLogout, options = {}) => {
  const {
    inactivityTimeout = 5 * 60 * 1000, // 5 minutes until logout
    warningTime = 2 * 60 * 1000, // Show warning 2 minutes before logout
  } = options;

  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const resetTimer = useCallback(() => {
    // Clear any existing timers
    if (window.logoutTimer) {
      clearTimeout(window.logoutTimer);
      clearInterval(window.countdownTimer);
    }

    // Reset the warning state
    setShowWarning(false);
    setTimeLeft(null);

    // Set up the main logout timer
    window.logoutTimer = setTimeout(() => {
      // When main timer ends, show warning
      setShowWarning(true);
      let remaining = Math.ceil(warningTime / 1000);
      setTimeLeft(remaining);

      // Set up countdown timer
      window.countdownTimer = setInterval(() => {
        remaining -= 1;
        setTimeLeft(remaining);

        if (remaining <= 0) {
          // Time's up, log out
          clearInterval(window.countdownTimer);
          signOut(auth).then(() => {
            onLogout();
            navigate('/login');
          });
        }
      }, 1000);
    }, inactivityTimeout - warningTime);
  }, [inactivityTimeout, warningTime, navigate, onLogout]);

  const handleActivity = useCallback(() => {
    resetTimer();
    // Remove and re-add event listeners to prevent memory leaks
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
      document.removeEventListener(event, handleActivity);
      document.addEventListener(event, handleActivity);
    });
  }, [resetTimer]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Set up the initial timer
    resetTimer();
    
    // Add event listeners for user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Clean up
    return () => {
      clearTimeout(window.logoutTimer);
      clearInterval(window.countdownTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity, resetTimer]);

  return { showWarning, timeLeft, extendSession };
};

export default useAutoLogout;
