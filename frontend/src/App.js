// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [item, setItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbInfo, setDbInfo] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Get the API URL from environment variables
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3006';

  useEffect(() => {
    fetchData();
    fetchDbInfo();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/items`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchDbInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/db-info`);
      setDbInfo(response.data);
    } catch (error) {
      console.error('Error fetching DB info:', error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!item.trim()) return;
    
    try {
      await axios.post(`${API_URL}/api/items`, { name: item });
      setItem('');
      fetchData();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const startEdit = (itemToEdit) => {
    setEditingItem({
      id: itemToEdit._id,
      name: itemToEdit.name
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const updateItem = async (e) => {
    e.preventDefault();
    if (!editingItem.name.trim()) return;
    
    try {
      await axios.put(`${API_URL}/api/items/${editingItem.id}`, { name: editingItem.name });
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const startDelete = (id) => {
    setConfirmDelete(id);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/items/${id}`);
      setConfirmDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full Stack Docker Application</h1>
        
        <div className="db-info">
          <h3>Database Connection Info:</h3>
          <p>API URL: {API_URL}</p>
          {dbInfo ? (
            <>
              <p>Database Name: {dbInfo.databaseName}</p>
              <p>Connection Status: {dbInfo.connected ? 'Connected' : 'Disconnected'}</p>
              <p>Authentication: {dbInfo.authEnabled ? 'Enabled' : 'Disabled'}</p>
              <p>MongoDB Admin Interface: {dbInfo.adminInterface}</p>
            </>
          ) : (
            <p>Loading database information...</p>
          )}
        </div>
        
        <div className="content-section">
          <form onSubmit={addItem} className="add-form">
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Add new item"
            />
            <button type="submit" className="btn-add">Add Item</button>
          </form>
          
          <div className="items-list">
            <h2>Items in Database:</h2>
            {loading ? (
              <p>Loading...</p>
            ) : data.length > 0 ? (
              <ul>
                {data.map((itemData) => (
                  <li key={itemData._id} className="item-row">
                    {editingItem && editingItem.id === itemData._id ? (
                      <form onSubmit={updateItem} className="edit-form">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        />
                        <div className="button-group">
                          <button type="submit" className="btn-update">Save</button>
                          <button type="button" onClick={cancelEdit} className="btn-cancel">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <span className="item-name">{itemData.name}</span>
                        <div className="button-group">
                          <button onClick={() => startEdit(itemData)} className="btn-edit">Edit</button>
                          <button onClick={() => startDelete(itemData._id)} className="btn-delete">Delete</button>
                        </div>
                      </>
                    )}
                    
                    {confirmDelete === itemData._id && (
                      <div className="delete-confirm">
                        <p>Are you sure you want to delete this item?</p>
                        <div className="button-group">
                          <button onClick={() => deleteItem(itemData._id)} className="btn-confirm">Yes, Delete</button>
                          <button onClick={cancelDelete} className="btn-cancel">Cancel</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found. Add some!</p>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;