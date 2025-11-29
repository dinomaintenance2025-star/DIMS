import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddItem.css';

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    sku: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.category || !formData.quantity || !formData.price || !formData.sku) {
      setError('All fields except description are required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll just log the data and redirect
      console.log('Adding new item:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to inventory page after successful submission
      navigate('/inventory');
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-item-container">
      <div className="add-item-card">
        <h2>Add New Inventory Item</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                placeholder="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <div className="price-input">
                <span>$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="sku">SKU *</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description (optional)"
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn secondary"
              onClick={() => navigate('/inventory')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
