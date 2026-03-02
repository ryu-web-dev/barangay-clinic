import { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Medicine',
    quantity: '',
    unit: 'pieces',
    expirationDate: ''
  });

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inventory');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/inventory', formData);
      setFormData({ itemName: '', category: 'Medicine', quantity: '', unit: 'pieces', expirationDate: '' });
      fetchInventory();
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item');
    }
  };

  // Quick button function to add or subtract stock
  const updateQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 0) return; // Don't allow negative stock
    
    try {
      await axios.put(`http://localhost:5000/api/inventory/${id}`, { quantity: newQty });
      fetchInventory();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Inventory Management</h2>

      {/* Add New Item Form */}
      <div className="card">
        <h3>Add New Stock</h3>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label>Item Name</label>
            <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Medicine">Medicine</option>
              <option value="Supply">Supply</option>
            </select>
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label>Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label>Unit</label>
            <input type="text" name="unit" placeholder="e.g., boxes, mg" value={formData.unit} onChange={handleChange} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label>Expiration Date</label>
            <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} />
          </div>
          <div style={{ flex: '1 1 100%', textAlign: 'right' }}>
            <button type="submit" className="success">Add to Inventory</button>
          </div>
        </form>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <h3>Current Stock Levels</h3>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Manage Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map(item => (
              // Highlight row in light red if stock is below 20
              <tr key={item._id} style={{ backgroundColor: item.quantity < 20 ? '#ffeaea' : 'transparent' }}>
                <td><strong>{item.itemName}</strong></td>
                <td>{item.category}</td>
                <td style={{ color: item.quantity < 20 ? 'red' : 'black', fontWeight: 'bold' }}>
                  {item.quantity} {item.unit}
                </td>
                <td>{item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button onClick={() => updateQuantity(item._id, item.quantity, -1)} style={{ padding: '2px 8px', marginRight: '5px' }}>-</button>
                  <button onClick={() => updateQuantity(item._id, item.quantity, 1)} style={{ padding: '2px 8px' }}>+</button>
                </td>
                <td>
                  <button className="danger" onClick={() => handleDelete(item._id)} style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No items in inventory.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;