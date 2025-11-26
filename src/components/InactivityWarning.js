import React from 'react';
import '../styles/InactivityWarning.css';

const InactivityWarning = ({ timeLeft, onExtendSession }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="inactivity-warning-overlay">
      <div className="inactivity-warning-modal">
        <h3>Session Timeout Warning</h3>
        <p>You will be logged out in {minutes}:{seconds < 10 ? '0' : ''}{seconds} due to inactivity.</p>
        <div className="warning-actions">
          <button onClick={onExtendSession} className="extend-session-btn">
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityWarning;
