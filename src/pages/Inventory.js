import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Inventory.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // This would be replaced with actual API calls
  useEffect(() => {
    // Mock data for now
    const mockItems = [
      { id: 1, name: 'Laptop', category: 'Electronics', quantity: 15, price: 999.99, sku: 'LP-001' },
      { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 8, price: 149.99, sku: 'DC-002' },
      { id: 3, name: 'Wireless Mouse', category: 'Electronics', quantity: 3, price: 24.99, sku: 'WM-003' },
      { id: 4, name: 'Notebook', category: 'Office Supplies', quantity: 50, price: 4.99, sku: 'NB-004' },
      { id: 5, name: 'Desk Lamp', category: 'Furniture', quantity: 12, price: 34.99, sku: 'DL-005' },
    ];
    
    setItems(mockItems);
    setLoading(false);
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory">
      <div className="inventory-header">
        <h2>DIMS</h2>
        <Link to="/inventory/new" className="btn primary">
          Add New Item
        </Link>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className={item.quantity <= 5 ? 'low-stock' : ''}>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td className={item.quantity === 0 ? 'out-of-stock' : ''}>
                    {item.quantity}
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="actions">
                    <button className="btn small">Edit</button>
                    <button className="btn small danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No items found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
