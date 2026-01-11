
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import Modal from '../common/Modal';

const ERPSystemModal = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  return (
    <Modal size="xl">
      <div className={`p-4 border-b flex justify-between items-center ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
      }`}>
        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <i className="fas fa-external-link-alt"></i> DS Pos System - Inventory Management
        </h2>
      </div>
      
      <iframe 
        src="https://testpos.dtselife.com/" 
        className="w-full h-[85vh] border-none rounded-b-lg"
        title="ERP System"
      ></iframe>
    </Modal>
  );
};

export default ERPSystemModal;