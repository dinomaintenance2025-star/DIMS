import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Link
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddItem from './pages/AddItem';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import './styles/Header.css';

function AppContent() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app">
      {currentUser && (
        <header className="app-header">
          <div className="header-left">
            <img src="/assets/logo.png" alt="Dino Maintenance Logo" className="header-logo" />
            <div className="header-title-container">
              <h1>DinoWorld IMS</h1>
            </div>
          </div>
          <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/inventory">Inventory</Link>
            {currentUser?.email && <span className="user-email">{currentUser.email}</span>}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/inventory/new" 
            element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to login */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
          
          {/* Redirect any unknown paths to login */}
          <Route 
            path="*" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
