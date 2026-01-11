 import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiLayers, FiCheckCircle, FiPackage, FiTruck, FiChevronDown } from "react-icons/fi";
import { addSubCategory } from "../../../actions/Inventory/subCatActions";
import { listMainCategories } from "../../../actions/Inventory/mainCatActions";

export default function SubCategoryAddModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const { mainCategories = [], loading: mainCategoriesLoading } = useSelector((state) => state.mainCategory);


  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    P_SCDES: "",
    P_SMCID: "", 
    P_SCNAME: "",
    status: "A",
  });
 
  useEffect(() => {
    if (isOpen) {
      dispatch(listMainCategories()); 
      setFormData({
        P_SCDES: "",
        P_SMCID: "",
        P_SCNAME: "",
        status: "A",
      });
    }
  }, [isOpen, dispatch]);
 
  const selectedMainCategory = mainCategories.find(
    cat => cat.Main_CatID === formData.P_SMCID
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainCategorySelect = (mainCatId, mainCatName) => {
    setFormData(prev => ({
      ...prev,
      P_SMCID: mainCatId
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (!formData.P_SMCID?.trim()) {
      showAlertMessage("Please select a main category", "error");
      return;
    }

    if (!formData.P_SCNAME?.trim()) {
      showAlertMessage("Sub Category Name is required", "error");
      return;
    }
 
    const payload = {
      P_SMCID: formData.P_SMCID,
      P_SCNAME: formData.P_SCNAME,
      P_SCDES: formData.P_SCDES,
      P_SCSTATUS: formData.status,
    };

 
    dispatch(addSubCategory(payload));
 
    showAlertMessage("Sub category added successfully!", "success");
 
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;
 
  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
 
  const getAlertBgColor = () => {
    switch (alertType) {
      case "success":
        return "bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700";
      case "error":
        return "bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/70 dark:border-yellow-700";
      case "info":
        return "bg-blue-100 border-blue-300 dark:bg-blue-900/70 dark:border-blue-700";
      default:
        return "bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700";
    }
  };

  const getAlertTextColor = () => {
    switch (alertType) {
      case "success":
        return "text-green-800 dark:text-green-200";
      case "error":
        return "text-red-800 dark:text-red-200";
      case "warning":
        return "text-yellow-800 dark:text-yellow-200";
      case "info":
        return "text-blue-800 dark:text-blue-200";
      default:
        return "text-gray-800 dark:text-gray-200";
    }
  };

  const getAlertIcon = () => {
    switch (alertType) {
      case "success":
        return (
          <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case "error":
        return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return (
          <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      case "info":
        return <FiTruck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <FiTruck className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };
 
  const activeMainCategories = mainCategories.filter(cat => cat.Main_CatStatus === "A");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div
        className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {showAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
            <div
              className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {getAlertIcon()}
                <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="hover:opacity-70 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            >
              <FiLayers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Add Sub Category
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors duration-200 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* Main Category Dropdown */}
          <div className="space-y-1 md:col-span-2">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Main Category *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm flex items-center justify-between ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                } ${!formData.P_SMCID ? "text-gray-400" : ""}`}
              >
                <span>
                  {selectedMainCategory 
                    ? `${selectedMainCategory.Main_CatName} (${selectedMainCategory.Main_CatID})`
                    : "Select a main category"
                  }
                </span>
                <FiChevronDown 
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              {isDropdownOpen && (
                <div
                  className={`absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border shadow-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {mainCategoriesLoading ? (
                    <div className="p-2 text-center text-sm">Loading categories...</div>
                  ) : activeMainCategories.length === 0 ? (
                    <div className="p-2 text-center text-sm">No active main categories available</div>
                  ) : (
                    activeMainCategories.map((category) => (
                      <button
                        key={category.Main_CatID}
                        type="button"
                        onClick={() => handleMainCategorySelect(category.Main_CatID, category.Main_CatName)}
                        className={`w-full text-left px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${
                          darkMode ? "text-white" : "text-gray-900"
                        } ${
                          formData.P_SMCID === category.Main_CatID
                            ? darkMode
                              ? "bg-blue-900/50"
                              : "bg-blue-100"
                            : ""
                        }`}
                      >
                        <div className="font-medium">{category.Main_CatName}</div>
                        <div className="text-xs opacity-70">ID: {category.Main_CatID}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Sub Category Name *
            </label>
            <input
              type="text"
              name="P_SCNAME"
              value={formData.P_SCNAME || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              required
            />
          </div>

          <div className="space-y-1">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              name="P_SCDES"
              value={formData.P_SCDES || ""}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              placeholder="Enter sub category description..."
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                darkMode
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
              Add Sub Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}