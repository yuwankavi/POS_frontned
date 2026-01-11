import React from 'react';
import InventoryTable from '../../../components/Inventory/common/InventoryTable'

const CategoryPage = () => {
  return (
    // <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full">
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[90vh] overflow-y-auto">
    
      <InventoryTable />
      {/* <p>Manage roles, permissions, and access here.</p> */}
    </div>
  );
};

export default CategoryPage;   
