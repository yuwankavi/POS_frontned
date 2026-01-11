//components/modals/AddBatchModal.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiLayers } from "react-icons/fi";
import { closeModal } from "../../../../actions/modalActions.js";
import { addBatch } from "../../../../actions/Inventory/batchActions.js";

export default function AddBatchModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [formData, setFormData] = useState({
    P_WHCODE: "",
    P_PCODE: "",
    P_BCODE: "",
    P_EXDATE: "",
    P_SUPCODE: "",
    P_BLQTY: "",
    P_PPRICE: "",
    status: "A",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation - Warehouse Code, Product Code, and Batch Code are required
    if (!formData.P_WHCODE.trim()) {
      alert("Warehouse Code is required");
      return;
    }

    if (!formData.P_PCODE.trim()) {
      alert("Product Code is required");
      return;
    }

    if (!formData.P_BCODE.trim()) {
      alert("Batch Code is required");
      return;
    }

    const newBatch = {
      ...formData,
      P_WHCODE: formData.P_WHCODE,
      P_PCODE: formData.P_PCODE,
      P_BCODE: formData.P_BCODE,
      P_EXDATE: formData.P_EXDATE,
      P_SUPCODE: formData.P_SUPCODE,
      P_BLQTY: formData.P_BLQTY,
      P_PPRICE: formData.P_PPRICE,
      B_Status: formData.status,
    };
    dispatch(addBatch(newBatch));

    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>

        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
              <FiLayers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Batch</h2>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Warehouse Code */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Warehouse Code *
            </label>
            <input
              name="P_WHCODE"
              placeholder="Enter Warehouse Code"
              value={formData.P_WHCODE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              required
            />
          </div>

          {/* Product Code */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Product Code *
            </label>
            <input
              name="P_PCODE"
              placeholder="Enter Product Code"
              value={formData.P_PCODE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              required
            />
          </div>

          {/* Batch Code */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Batch Code *
            </label>
            <input
              name="P_BCODE"
              placeholder="Enter Batch Code"
              value={formData.P_BCODE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              required
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Expiry Date
            </label>
            <input
              name="P_EXDATE"
              type="date"
              value={formData.P_EXDATE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          {/* Supplier Code */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Supplier Code
            </label>
            <input
              name="P_SUPCODE"
              placeholder="Enter Supplier Code"
              value={formData.P_SUPCODE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          {/* Batch Quantity */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Batch Quantity
            </label>
            <input
              name="P_BLQTY"
              type="number"
              placeholder="Enter Batch Quantity"
              value={formData.P_BLQTY}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          {/* Product Price */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Product Price
            </label>
            <input
              name="P_PPRICE"
              type="number"
              step="0.01"
              placeholder="Enter Product Price"
              value={formData.P_PPRICE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                  ? 'bg-gray-700 text-gray-200 border-gray-600'
                  : 'bg-white text-gray-700 border-gray-300'
                } border`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}