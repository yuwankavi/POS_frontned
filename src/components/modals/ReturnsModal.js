
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import Modal from '../common/Modal';

const ReturnsModal = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  const [searchTerm, setSearchTerm] = useState('');

  const returns = [
    { id: 1, receipt: 'INV-2023-0012', product: 'Ryzen 7 5800X', date: '2023-03-15' },
    { id: 2, receipt: 'INV-2023-0011', product: 'RTX 4070', date: '2023-03-14' }
  ];

  const filteredReturns = returns.filter(item =>
    item.receipt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveReturn = () => {
    alert('Return approved! In a real system, this would require supervisor auth.');
  };

  return (
    <Modal>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Returns & Exchanges</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by receipt ID or item..."
        className="w-full px-3 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      <div className={`max-h-48 overflow-y-auto border rounded-lg mb-4 ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
        }`}>
        {filteredReturns.length === 0 ? (
          <div className="p-3 text-center text-gray-500 dark:text-gray-400">
            No returns found
          </div>
        ) : (
          filteredReturns.map(item => (
            <div
              key={item.id}
              className={`p-3 border-b flex items-center cursor-pointer ${darkMode ? 'border-gray-600 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-200'
                }`}
            >
              <i className="fas fa-receipt text-yellow-500 mr-2"></i>
              <div>
                <div className="font-semibold dark:text-white">Receipt #{item.receipt}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.product}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleApproveReturn}
        className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <i className="fas fa-check"></i> Approve Return (Supervisor)
      </button>
    </Modal>
  );
};

export default ReturnsModal;