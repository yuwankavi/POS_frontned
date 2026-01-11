// components/modals/AddBrandModal.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiAward } from "react-icons/fi";
import { closeModal } from "../../../../actions/modalActions.js";
import { addBrand } from "../../../../actions/Inventory/brandActions.js";

export default function AddBrandModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [formData, setFormData] = useState({
    P_BNAME: "",
    P_STATUS: "A",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation - Brand Name is required
    if (!formData.P_BNAME.trim()) {
      alert("Brand Name is required");
      return;
    }

    const newBrand = {
      ...formData,
      P_BNAME: formData.P_BNAME,
      B_Status: formData.status,
    };
    dispatch(addBrand(newBrand));

    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div
        className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"
                }`}
            >
              <FiAward className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Add New Brand
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* Brand Name */}
          <div className="space-y-1 md:col-span-2">
            <label
              className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Brand Name *
            </label>
            <input
              name="P_BNAME"
              placeholder="Enter brand name"
              value={formData.P_BNAME}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              required
            />
          </div>

          {/* Information Note */}
          <div
            className={`md:col-span-2 rounded-lg p-3 border ${darkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
              }`}
          >
            <p
              className={`text-xs ${darkMode ? "text-blue-300" : "text-blue-800"
                }`}
            >
              <strong>Note:</strong> Brand ID will be automatically generated
              when the brand is saved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-600"
                  : "bg-white text-gray-700 border-gray-300"
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
