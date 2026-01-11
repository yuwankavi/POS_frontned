
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import Modal from '../common/Modal';
import { COMPANY_NAME, COMPANY_ADDRESS, COMPANY_PHONE } from '../../constants/config';

const SettingsModal = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  const [settings, setSettings] = useState({
    storeName: COMPANY_NAME,
    storeAddress: COMPANY_ADDRESS,
    storePhone: COMPANY_PHONE,
    taxRate: 8,
    receiptTemplate: 'standard',
    scannerMode: 'auto',
    currencyFormat: 'lkr'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
    dispatch(closeModal());
  };

  return (
    <Modal size="lg">
      <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
        <i className="fas fa-cog"></i> System Settings
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Store Information</h3>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            type="text"
            name="storeName"
            value={settings.storeName}
            onChange={handleInputChange}
            placeholder="Store Name"
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <input
            type="text"
            name="storeAddress"
            value={settings.storeAddress}
            onChange={handleInputChange}
            placeholder="Store Address"
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <input
            type="text"
            name="storePhone"
            value={settings.storePhone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Tax Settings</h3>

        <input
          type="number"
          name="taxRate"
          value={settings.taxRate}
          onChange={handleInputChange}
          placeholder="Tax Rate %"
          step="0.01"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Receipt Settings</h3>

        <select
          name="receiptTemplate"
          value={settings.receiptTemplate}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="standard">Standard Receipt</option>
          <option value="detailed">Detailed Receipt</option>
          <option value="minimal">Minimal Receipt</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Scanner Settings</h3>

        <select
          name="scannerMode"
          value={settings.scannerMode}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="auto">Auto-detect Scanner</option>
          <option value="manual">Manual Input Only</option>
          <option value="camera">Camera Scanner</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Display Settings</h3>

        <select
          name="currencyFormat"
          value={settings.currencyFormat}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="lkr">LKR (Rs.)</option>
          <option value="usd">USD ($)</option>
          <option value="eur">EUR (€)</option>
        </select>
      </div>

      <button
        onClick={handleSaveSettings}
        className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <i className="fas fa-save"></i> Save Settings
      </button>
    </Modal>
  );
};

export default SettingsModal;