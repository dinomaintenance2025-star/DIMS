import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import useAutoLogout from './hooks/useAutoLogout';
import InactivityWarning from './components/InactivityWarning';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (email) => {
    setIsAuthenticated(true);
    setUser({ email });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser({ email: user.email });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto logout after 5 minutes of inactivity with 2-minute warning
  const { showWarning, timeLeft, extendSession } = useAutoLogout(handleLogout, {
    inactivityTimeout: 5 * 60 * 1000, // 5 minutes
    warningTime: 2 * 60 * 1000, // Show warning 2 minutes before
  });

  // If we're on the login page and already authenticated, redirect to dashboard
  if (location.pathname === '/login' && isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="app">
      {isAuthenticated && (
        <nav className="navbar">
          <h1>DIMS</h1>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout ({user?.email || 'User'})
              </button>
            </li>
          </ul>
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/login" element={
            <Login onLogin={handleLogin} />
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/inventory" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Inventory />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          } />
        </Routes>
      </main>
      
      {/* Inactivity Warning Modal */}
      {isAuthenticated && showWarning && (
        <InactivityWarning 
          timeLeft={timeLeft} 
          onExtendSession={extendSession} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
