import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    categories: 0
  });

  // This would be replaced with actual API calls
  useEffect(() => {
    // Mock data for now
    setStats({
      totalItems: 125,
      lowStock: 8,
      outOfStock: 3,
      categories: 12
    });
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p className="stat-number">{stats.totalItems}</p>
        </div>
        
        <div className="stat-card warning">
          <h3>Low Stock</h3>
          <p className="stat-number">{stats.lowStock}</p>
        </div>
        
        <div className="stat-card danger">
          <h3>Out of Stock</h3>
          <p className="stat-number">{stats.outOfStock}</p>
        </div>
        
        <div className="stat-card">
          <h3>Categories</h3>
          <p className="stat-number">{stats.categories}</p>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/inventory/new" className="btn primary">Add New Item</Link>
          <Link to="/inventory" className="btn secondary">View All Items</Link>
          {currentUser?.isAdmin && (
            <Link to="/admin/add-account" className="btn admin">Add Account</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
