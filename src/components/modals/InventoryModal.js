
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import Modal from '../common/Modal';

const InventoryModal = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);
  const { allProducts } = useSelector(state => state.products);
  
  const [activeTab, setActiveTab] = useState('all');

  const lowStockItems = allProducts.filter(product => product.stock < 5);

  return (
    <Modal>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Inventory Management</h2>
      
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-green-500 text-white'
              : darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-800'
          }`}
        >
          All Items
        </button>
        
        <button
          onClick={() => setActiveTab('low')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'low'
              ? 'bg-green-500 text-white'
              : darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-800'
          }`}
        >
          Low Stock
        </button>
        
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'categories'
              ? 'bg-green-500 text-white'
              : darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-800'
          }`}
        >
          Categories
        </button>
        
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'add'
              ? 'bg-green-500 text-white'
              : darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-800'
          }`}
        >
          Add New Item
        </button>
      </div>
      
      <div className="max-h-72 overflow-y-auto mb-4">
        {activeTab === 'all' && (
          <div className={`rounded-lg border ${
            darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
          }`}>
            <div className="grid grid-cols-2 font-bold p-3 border-b dark:border-gray-700">
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>Product Name</span>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>Stock</span>
            </div>
            
            {allProducts.slice(0, 10).map(product => (
              <div key={product.id} className="grid grid-cols-2 p-3 border-b dark:border-gray-700">
                <span className={darkMode ? 'text-white' : 'text-gray-800'}>{product.name}</span>
                <span className={product.stock < 5 ? 'text-red-500 font-semibold' : darkMode ? 'text-white' : 'text-gray-800'}>
                  {product.stock}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'low' && (
          <div className={`rounded-lg border ${
            darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
          }`}>
            <div className="flex justify-between items-center p-3 border-b dark:border-gray-700 text-green-500 font-semibold">
              <span>Low Stock Alert</span>
              <span>Quantity</span>
            </div>
            
            {lowStockItems.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 dark:text-red-400">
                    <i className={product.icon}></i>
                  </div>
                  <span className={darkMode ? 'text-white' : 'text-gray-800'}>{product.name}</span>
                </div>
                <span className="text-red-500 font-semibold">{product.stock} left</span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className={`p-3 rounded-lg border ${
            darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
          }`}>
            <p className="text-center text-gray-500 dark:text-gray-400">Category management would be implemented here</p>
          </div>
        )}
        
        {activeTab === 'add' && (
          <div className={`p-3 rounded-lg border ${
            darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
          }`}>
            <p className="text-center text-gray-500 dark:text-gray-400">Add new product form would be implemented here</p>
          </div>
        )}
      </div>
      
      <button
        className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <i className="fas fa-sync-alt"></i> Update Inventory
      </button>
    </Modal>
  );
};

export default InventoryModal;