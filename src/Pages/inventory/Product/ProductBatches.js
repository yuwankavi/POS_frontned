import React from 'react';
import BatchTable from '../../../components/Inventory/common/batchTable';

const CategoryPage = () => {
  return (
    // <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full">
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[90vh] overflow-y-auto">
      {/* <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Product Batch</h1> */}
      {/* <p>Manage roles, permissions, and access here.</p> */}
      <BatchTable />
    </div>
  );
};

export default CategoryPage;   
