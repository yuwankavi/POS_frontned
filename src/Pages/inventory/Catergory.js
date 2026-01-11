import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiHome,
  FiChevronRight,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import {
  listMainCategories,
  updateMainCategoryStatus,
} from "../../actions/Inventory/mainCatActions.js";
import {
  listSubCategories,
  updateSubCategoryStatus,
} from "../../actions/Inventory/subCatActions.js";
import Breadcrumb from "../../components/common/Breadcrumb.js";
import CategoryAddModal from "../../components/Inventory/modals/CategoryAddModal.js";
import SubCategoryAddModal from "../../components/Inventory/modals/SubCategoryAddModal.js";
import { FiXCircle } from "react-icons/fi";

export default function CategoryManagement() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);
  const {
    mainCategories = [],
    loading: mainLoading,
    error: mainError,
  } = useSelector((state) => state.mainCategory);
  const [mainSearchTerm, setMainSearchTerm] = useState("");
  const [mainFilter, setMainFilter] = useState("active");


  const {
    subCategories = [],
    loading: subLoading,
    error: subError,
  } = useSelector((state) => state.subCategory);
  const [subSearchTerm, setSubSearchTerm] = useState("");
  const [subFilter, setSubFilter] = useState("active");

  const [selectedMainCat, setSelectedMainCat] = useState(null);

  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  const [isMainStatusModalOpen, setIsMainStatusModalOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [isSubStatusModalOpen, setIsSubStatusModalOpen] = useState(false);
  const [subCategoryToUpdate, SetSubCategoryToUpdate] = useState(null);

  const [selectedRow, setSelectedRow] = useState(null);

  const openStatusModal = (category) => {
    setCategoryToUpdate(category);
    setIsMainModalOpen(true);
  };

  const openSubstatusModal = (subCategory) => {
    SetSubCategoryToUpdate(subCategory);
    setIsSubStatusModalOpen(true);
  };

  const closeStatusModal = () => setIsMainModalOpen(false);
  const closeSubStatusModal = () => setIsSubStatusModalOpen(false);


  const handleStatusChange = () => {
    if (!categoryToUpdate) return;

    const newStatus = categoryToUpdate.Main_CatStatus === "A" ? "I" : "A";

    dispatch(updateMainCategoryStatus(categoryToUpdate.Main_CatID, newStatus))
      .then(() => {
        showAlertMessage(
          `Category "${categoryToUpdate.Main_CatName}" ${newStatus === "A" ? "activated" : "deactivated"
          }`
        );
        closeStatusModal();
      })
      .catch(() => {
        showAlertMessage("Failed to update status", "error");
      });
  };


  const handleSubStatusChange = () => {
    if (!subCategoryToUpdate) return;

    const newStatus = subCategoryToUpdate.Sub_CatStatus === "A" ? "I" : "A";


    dispatch(updateSubCategoryStatus(subCategoryToUpdate.Sub_CatID, newStatus))
      .then(() => {
        showAlertMessage(
          `Category "${subCategoryToUpdate.Sub_CatName}" ${newStatus === "A" ? "activated" : "deactivated"
          }`
        );
        closeSubStatusModal();
      })
      .catch(() => {
        showAlertMessage("Failed to update status", "error");
      });
  };

  useEffect(() => {
    dispatch(listMainCategories());
    dispatch(listSubCategories());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const getStatusBadge = (status) =>
    status === "A" ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <FiUserCheck className="w-3 h-3" />
        <span className="hidden xs:inline">Active</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
        <FiUserX className="w-3 h-3" />
        <span className="hidden xs:inline">Inactive</span>
      </span>
    );

  const filteredMainCategories = mainCategories.filter((c) => {
    const matchesSearch =
      c.Main_CatName.toLowerCase().includes(mainSearchTerm.toLowerCase()) ||
      c.Main_CatID.toLowerCase().includes(mainSearchTerm.toLowerCase());

    if (mainFilter === "all") return matchesSearch;
    if (mainFilter === "active")
      return matchesSearch && c.Main_CatStatus === "A";
    if (mainFilter === "inactive")
      return matchesSearch && c.Main_CatStatus !== "A";
    return matchesSearch;
  });


  const filteredSubCategories = subCategories
    .filter((s) => {

      if (!selectedMainCat && !subSearchTerm) return false;


      return !selectedMainCat || s.Sub_MainCatID === selectedMainCat.Main_CatID;
    })
    .filter((s) => {
      const matchesSearch =
        s.Sub_CatName?.toLowerCase().includes(subSearchTerm.toLowerCase()) ||
        s.Sub_CatID?.toLowerCase().includes(subSearchTerm.toLowerCase());

      if (subFilter === "all") return matchesSearch;
      if (subFilter === "active")
        return matchesSearch && s.Sub_CatStatus === "A";
      if (subFilter === "inactive")
        return matchesSearch && s.Sub_CatStatus !== "A";
      return matchesSearch;
    });

  if (subFilter === "active") {
    filteredSubCategories.sort((a, b) => {
      const aID = a.Sub_CatID || "";
      const bID = b.Sub_CatID || "";
      return bID.localeCompare(aID);
    });
  }


  const totalMainCategories = mainCategories.length;
  const activeMainCategories = mainCategories.filter(
    (c) => c.Main_CatStatus === "A"
  ).length;
  const inactiveMainCategories = mainCategories.filter(
    (c) => c.Main_CatStatus !== "A"
  ).length;

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
        return (
          <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      default:
        return (
          <FiPackage className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  return (
    <div
      className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}
    >
      {/* Alert Message */}
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

      <Breadcrumb current="Inventory / Category Management" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiPackage className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Category Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage categories and sub-categories
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMainStatusModalOpen(true)}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Main Category
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-1 md:mb-2">
          <div
            className={`rounded-lg p-2 shadow border ${darkMode
              ? "bg-gray-700/50 border-gray-600"
              : "bg-gray-50 border-gray-100"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Categories
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {totalMainCategories}
                </p>
              </div>
              <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div
            className={`rounded-lg p-2 shadow border ${darkMode
              ? "bg-gray-700/50 border-gray-600"
              : "bg-gray-50 border-gray-100"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {activeMainCategories}
                </p>
              </div>
              <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div
            className={`rounded-lg p-2 shadow border ${darkMode
              ? "bg-gray-700/50 border-gray-600"
              : "bg-gray-50 border-gray-100"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Inactive
                </p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {inactiveMainCategories}
                </p>
              </div>
              <FiXCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Main Category Name"
              value={mainSearchTerm}
              onChange={(e) => setMainSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {["active", "inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setMainFilter(f)}
                className={`px-2 py-1.5 text-xs rounded-lg font-medium ${mainFilter === f
                  ? "bg-blue-600 text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area - Main Categories */}
      <div className="flex-grow overflow-y-auto">
        <div
          className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
            }`}
        >
          {mainLoading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-blue-800" : "border-blue-200"
                      }`}
                  ></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Loading main categories...
                </p>
              </div>
            </div>
          ) : mainError ? (
            <div
              className={`rounded-xl p-4 text-center h-48 flex items-center justify-center border ${darkMode
                ? "bg-red-900/20 border-red-800"
                : "bg-red-50 border-red-200"
                }`}
            >
              <div>
                <div
                  className={`font-medium text-sm ${darkMode ? "text-red-400" : "text-red-600"
                    }`}
                >
                  ⚠️ Error
                </div>
                <p
                  className={`mt-1 text-xs ${darkMode ? "text-red-400" : "text-red-600"
                    }`}
                >
                  {mainError}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-xl border overflow-hidden h-full ${darkMode
                ? "bg-gray-700/30 border-gray-600"
                : "bg-gray-50 border-gray-200"
                }`}
            >
              {/* Table */}
              <div className="overflow-x-auto h-full">
                <div className="max-h-44 overflow-y-60">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Main Cat ID
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Name
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Description
                        </th>
                        {/* <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Created By
                        </th> */}
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Created Date
                        </th>
                        {/* <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Updated by
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Updated Date
                        </th> */}
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Status
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                        }`}
                    >
                      {filteredMainCategories.map((mainCategory) => (
                        <tr
                          key={mainCategory.Main_CatID}
                          onClick={() => setSelectedMainCat(mainCategory)}
                          className={`cursor-pointer transition-colors duration-150 ${selectedMainCat?.Main_CatID === mainCategory.Main_CatID
                            ? darkMode
                              ? "bg-blue-900"
                              : "bg-blue-100"
                            : darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          {/* Main Cat ID column */}
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                            {mainCategory.Main_CatID}
                          </td>

                          {/* Name column */}
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                            {mainCategory.Main_CatName}
                          </td>

                          {/* Description column - Hidden on mobile */}
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                            {mainCategory.Main_CatDes}
                          </td>

                          {/* <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                            {mainCategory.Main_Created_By}
                          </td> */}

                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                            {mainCategory.Main_PC_Created_Date}
                          </td>

                          {/* <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                            {mainCategory.Main_Updated_By}
                          </td>

                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                            {mainCategory.Main_Updated_Date}
                          </td> */}

                          {/* Status column (centered) */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            {getStatusBadge(mainCategory.Main_CatStatus)}
                          </td>
                          {/* Actions column (centered) */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={() => openStatusModal(mainCategory)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${mainCategory.Main_CatStatus === "A"
                                ? darkMode
                                  ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                                : darkMode
                                  ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                              {mainCategory.Main_CatStatus === "A"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredMainCategories.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        No main categories found
                      </p>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                      >
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub Categories Section */}
      {true && (
        <>
          <div className="flex items-center justify-between mb-1 md:mb-2 mt-4">
            {/* <h2 className="text-md font-bold text-gray-900 dark:text-white">
              Sub Categories of {selectedMainCat.Main_CatName}
            </h2> */}

            {/* button moved down */}
            {/* <button
              onClick={() => setIsSubModalOpen(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
            >
              <FiPlus className="w-4 h-4" />
              Add
            </button> */}
          </div>

          {/* Search and Filters for Sub Categories */}
          <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
            {/* <h2 className="text-md font-bold text-gray-900 dark:text-white">
              Sub Categories of {selectedMainCat.Main_CatName}
            </h2> */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

              <input
                type="text"
                placeholder="Search Sub Category Name..."
                value={subSearchTerm}
                onChange={(e) => setSubSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {["active", "inactive"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSubFilter(f)}
                  className={`px-2 py-1.5 text-xs rounded-lg font-medium ${subFilter === f
                    ? "bg-blue-600 text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsSubModalOpen(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
            >
              <FiPlus className="w-4 h-4" />
              Add sub category
            </button>
          </div>

          {/* Sub Categories Table */}
          <div className="flex-grow overflow-y-auto mb-1 md:mb-1">
            <div
              className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
                }`}
            >
              {subLoading ? (
                <div className="flex items-center justify-center py-8 rounded-xl h-full">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div
                        className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-green-800" : "border-green-200"
                          }`}
                      ></div>
                      <div className="absolute inset-0 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p
                      className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Loading sub categories...
                    </p>
                  </div>
                </div>
              ) : subError ? (
                <div
                  className={`rounded-xl p-4 text-center h-full flex items-center justify-center border ${darkMode
                    ? "bg-red-900/20 border-red-800"
                    : "bg-red-50 border-red-200"
                    }`}
                >
                  <div>
                    <div
                      className={`font-medium text-sm ${darkMode ? "text-red-400" : "text-red-600"
                        }`}
                    >
                      ⚠️ Error
                    </div>
                    <p
                      className={`mt-1 text-xs ${darkMode ? "text-red-400" : "text-red-600"
                        }`}
                    >
                      {subError}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-xl border overflow-hidden h-full ${darkMode
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                    }`}
                >
                  {/* Table */}
                  <div className="overflow-x-auto h-48">
                    <div className="max-h-[calc(100vh-300px)] overflow-y-40">
                      <table className="w-full">
                        <thead
                          className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                        >
                          <tr>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Sub cat ID
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Name
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                              Description
                            </th>
                            {/* <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Created by
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Created date
                            </th> */}
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                              Main Category ID
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Main Category Name
                            </th>
                            {/* <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Updated by
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Updated date
                            </th> */}
                            <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                              Status
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                        >

                          {filteredSubCategories.map((subCategory, index) => (
                            <tr
                              key={subCategory.Sub_CatID}
                              className={`transition-colors duration-150 ${darkMode
                                ? "hover:bg-gray-700/50"
                                : "hover:bg-gray-100"
                                }`}
                            >
                              {/* Row number column */}
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                                {index + 1}
                              </td>

                              {/* Name column */}
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                                {subCategory.Sub_CatName}
                              </td>

                              {/* Description column - Hidden on mobile */}
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                                {subCategory.Sub_CatDes}
                              </td>

                              {/* created by column (centered) */}
                              {/* <td className="px-2 py-2 whitespace-nowrap text-center text-xs">
                                {subCategory.Sub_Created_By}
                              </td> */}

                              {/* Created date column */}
                              {/* <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                                {subCategory.Sub_Created_Date}
                              </td> */}

                              {/* main category ID column */}
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                                {subCategory.Sub_MainCatID}
                              </td>

                              {/* main category name column */}
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                                {subCategory.Sub_MainCatName}
                              </td>

                              {/* updated by column */}
                              {/* <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                                {subCategory.Sub_Updated_By}
                              </td> */}

                              {/* updated dated column */}
                              {/* <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                                {subCategory.Sub_Updated_Date}
                              </td> */}

                              {/* Status column (centered) */}
                              <td className="px-2 py-2 whitespace-nowrap text-center">
                                {getStatusBadge(subCategory.Sub_CatStatus)}
                              </td>

                              {/* Actions column */}
                              <td className="px-2 py-2 whitespace-nowrap text-center">
                                <button
                                  onClick={() =>
                                    openSubstatusModal(subCategory)
                                  }
                                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${subCategory.Sub_CatStatus === "A"
                                    ? darkMode
                                      ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                    : darkMode
                                      ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                    }`}
                                >
                                  {subCategory.Sub_CatStatus === "A"
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredSubCategories.length === 0 && (
                      <div className="text-center py-8 h-full flex items-center justify-center">
                        <div>
                          <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p
                            className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                          >
                            No sub categories found
                          </p>
                          <p
                            className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                          >
                            Select a category or adjust filters
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}

      <SubCategoryAddModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        category={{ selectedMainCat }}
      />

      {/* category Status Change Confirmation Modal */}
      {isMainModalOpen && categoryToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${categoryToUpdate.Main_CatStatus === "A"
                    ? darkMode
                      ? "bg-red-900/30"
                      : "bg-red-100"
                    : darkMode
                      ? "bg-green-900/30"
                      : "bg-green-100"
                    }`}
                >
                  {categoryToUpdate.Main_CatStatus === "A" ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {categoryToUpdate.Main_CatStatus === "A"
                    ? "Deactivate category"
                    : "Activate category"}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to{" "}
                  {categoryToUpdate.Main_CatStatus === "A"
                    ? "deactivate"
                    : "activate"}{" "}
                  category <strong>{categoryToUpdate.Main_CatName}</strong>?
                </p>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={closeStatusModal}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${categoryToUpdate.Main_CatStatus === "A"
                    ? "bg-red-600"
                    : "bg-green-600"
                    }`}
                >
                  {categoryToUpdate.Main_CatStatus === "A"
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CategoryAddModal
        isOpen={isMainStatusModalOpen}
        onClose={() => setIsMainStatusModalOpen(false)}
        category={{ P_SMCID: selectedMainCat?.Main_CatID }}
      />

      {/* sub category Status Change Confirmation Modal isSubModalOpen && subCategoryToUpdate &&  */}
      {isSubStatusModalOpen && subCategoryToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${subCategoryToUpdate.Sub_CatStatus === "A"
                    ? darkMode
                      ? "bg-red-900/30"
                      : "bg-red-100"
                    : darkMode
                      ? "bg-green-900/30"
                      : "bg-green-100"
                    }`}
                >
                  {subCategoryToUpdate.Sub_CatStatus === "A" ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {subCategoryToUpdate.Sub_CatStatus === "A"
                    ? "Deactivate category"
                    : "Activate category"}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to{" "}
                  {subCategoryToUpdate.Sub_CatStatus === "A"
                    ? "deactivate"
                    : "activate"}{" "}
                  sub category <strong>{subCategoryToUpdate.Sub_CatName}</strong>?
                </p>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={closeSubStatusModal}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubStatusChange}
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${subCategoryToUpdate.Sub_CatStatus === "A"
                    ? "bg-red-600"
                    : "bg-green-600"
                    }`}
                >
                  {subCategoryToUpdate.Sub_CatStatus === "A"
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
