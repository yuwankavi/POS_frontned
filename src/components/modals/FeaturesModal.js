
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import Modal from '../common/Modal';

const FeaturesModal = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  const features = [
    { feature: 'Single Register Support', standard: '✅', pro: '✅', premium: '✅' },
    { feature: 'Multi-Register Support', standard: '×', pro: '✅', premium: '✅' },
    { feature: 'Multi-Store Support', standard: '×', pro: '×', premium: '✅' },
    { feature: 'Inventory Management', standard: 'Basic Stock Control', pro: 'Batch & Expiry Tracking', premium: 'Auto-Replenishment' },
    { feature: 'Sales & Billing', standard: 'Basic Billing', pro: 'Split Payments & Notes', premium: 'Loyalty & Gift Cards' },
    { feature: 'Reports & Analytics', standard: 'Daily Sales Report', pro: 'Detailed Sales & Inventory', premium: 'Real-Time Dashboards & Forecasting' },
    { feature: 'Pricing & Discounts', standard: 'Manual Discounts', pro: 'Tiered Pricing, Promotions', premium: 'Dynamic Pricing' },
    { feature: 'Receipts', standard: 'Custom Logo/Header', pro: 'Layout Customization', premium: 'Multilingual Templates' },
    { feature: 'Supplier & Purchase Management', standard: 'Manual Entry', pro: 'Supplier Records & GRN', premium: 'Auto-Reader & Vendor Portal' },
    { feature: 'Customer Management (CRM)', standard: '×', pro: 'Basic Loyalty Points', premium: 'Full CRM + Campaigns' },
    { feature: 'Security & Permissions', standard: 'Single Login', pro: 'Role-Based Permissions', premium: 'Advanced Permissions + Audit' },
    { feature: 'Support & Updates', standard: 'Documentation', pro: 'Priority Support', premium: '24/7 Dedicated Support' }
  ];

  const handleScheduleDemo = () => {
    alert('Demo scheduling feature would open here. In a real system, this would connect to a calendar booking service.');
  };

  return (
    <Modal size="xl">
      <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
        <i className="fas fa-file-invoice"></i> Version Comparison
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Compare features between Standard, Pro, and Premium versions</p>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className={darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}>
              <th className="p-3 text-left border dark:border-gray-700">Feature</th>
              <th className="p-3 text-center border dark:border-gray-700">Standard</th>
              <th className="p-3 text-center border dark:border-gray-700">Pro</th>
              <th className="p-3 text-center border dark:border-gray-700">Premium</th>
            </tr>
          </thead>
          <tbody>
            {features.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? (darkMode ? 'bg-gray-700/30' : 'bg-gray-100') : ''}`}>
                <td className="p-3 border dark:border-gray-700 dark:text-white font-medium">{item.feature}</td>
                <td className="p-3 border dark:border-gray-700 text-center dark:text-white">{item.standard}</td>
                <td className="p-3 border dark:border-gray-700 text-center dark:text-white">{item.pro}</td>
                <td className="p-3 border dark:border-gray-700 text-center dark:text-white">{item.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
          <i className="fas fa-headset"></i> Need Help Deciding?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Contact our sales team for more information</p>

        <div className="flex flex-wrap gap-3 justify-center">
          <a href="tel:+15551234567" className="px-4 py-2 bg-green-500 text-white rounded-lg transition-all hover:bg-green-600 hover:shadow-md flex items-center gap-2">
            <i className="fas fa-phone"></i> Call Us
          </a>

          <a href="mailto:sales@dockyardsoftware.com" className="px-4 py-2 bg-green-500 text-white rounded-lg transition-all hover:bg-green-600 hover:shadow-md flex items-center gap-2">
            <i className="fas fa-envelope"></i> Email Us
          </a>

          <button
            onClick={handleScheduleDemo}
            className="px-4 py-2 bg-green-500 text-white rounded-lg transition-all hover:bg-green-600 hover:shadow-md flex items-center gap-2"
          >
            <i className="fas fa-calendar"></i> Schedule Demo
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeaturesModal;