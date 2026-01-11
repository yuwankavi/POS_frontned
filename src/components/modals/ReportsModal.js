
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import Modal from '../common/Modal';

const ReportsModal = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  const stats = [
    { icon: 'fas fa-dollar-sign', value: '15,248', label: "Today's Sales" },
    { icon: 'fas fa-shopping-cart', value: '47', label: 'Transactions' },
    { icon: 'fas fa-chart-line', value: '324.89', label: 'Average Sale' }
  ];

  const topProducts = [
    { name: 'Ryzen 7 5800X', sold: 3, revenue: 899.97, stock: 12 },
    { name: 'GeForce RTX 4070', sold: 2, revenue: 1199.98, stock: 6 },
    { name: '32GB DDR5 RAM', sold: 5, revenue: 649.95, stock: 17 }
  ];

  return (
    <Modal size="lg">
      <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
        <i className="fas fa-chart-bar"></i> Sales Reports
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className={`p-4 rounded-xl text-center border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } shadow-md transition-all hover:-translate-y-1`}>
            <i className={`${stat.icon} text-2xl mb-2 bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent`}></i>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent my-2">
              Rs. {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={`h-48 rounded-xl border flex items-center justify-center mb-6 ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
        }`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <i className="fas fa-chart-area text-4xl mb-3"></i>
          <p>Sales Chart Placeholder</p>
          <p className="text-sm">Daily/Weekly/Monthly sales data would be displayed here</p>
        </div>
      </div>

      <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
        }`}>
        <table className="w-full">
          <thead>
            <tr className={darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Sold Today</th>
              <th className="p-3 text-left">Revenue</th>
              <th className="p-3 text-left">Stock Left</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index} className={`border-t ${darkMode
                  ? 'border-gray-600 hover:bg-gray-700/50'
                  : 'border-gray-200 hover:bg-gray-200'
                }`}>
                <td className="p-3 dark:text-white">{product.name}</td>
                <td className="p-3 dark:text-white">{product.sold}</td>
                <td className="p-3 dark:text-white">Rs. {product.revenue.toFixed(2)}</td>
                <td className="p-3 dark:text-white">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default ReportsModal;