import React from 'react';
import { useSelector } from 'react-redux';

export default function SeachedItemCard({ productName, sku, price, onClick }) {
  const { darkMode } = useSelector(state => state.ui);

  return (
    <div
      onClick={onClick}
      className={`w-[440px] h-[90px] border rounded-lg p-4 shadow-sm transition-transform duration-200 select-none cursor-pointer
        ${darkMode
          ? 'bg-gray-800 border-gray-700 hover:-translate-y-1 hover:shadow-md'
          : 'bg-white border-gray-300 hover:-translate-y-1 hover:shadow-md'
        }`}
    >
      <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {productName}
      </h2>

      <div className={`flex justify-between text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <span>SKU Id: {sku}</span>
        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Price: {price}</span>
      </div>
    </div>
  );
}
