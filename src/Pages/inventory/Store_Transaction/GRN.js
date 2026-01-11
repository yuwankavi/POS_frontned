import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiEdit,
  FiEdit2,
  FiEdit3,
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiFileText,
  FiClock,
  FiCheck,
  FiXCircle,
  FiLayers,
} from "react-icons/fi";
import { openModal } from "../../../actions/modalActions.js";
import { listPurchaseOrders } from "../../../actions/Inventory/purchaseActions.js";
import Breadcrumb from "../../../components/common/Breadcrumb.js";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function PurchaseOrderPage() {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    orders: purchaseOrders = [],
  } = useSelector((state) => state.purchaseOrders) || {};
  const { darkMode } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    dispatch(listPurchaseOrders());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-900/20",
        text: "text-yellow-800 dark:text-yellow-400",
        label: "Pending",
        icon: <FiClock className="w-3 h-3" />,
      },
      APPROVED: {
        bg: "bg-green-100 dark:bg-green-900/20",
        text: "text-green-800 dark:text-green-400",
        label: "Approved",
        icon: <FiCheck className="w-3 h-3" />,
      },
      REJECTED: {
        bg: "bg-red-100 dark:bg-red-900/20",
        text: "text-red-800 dark:text-red-400",
        label: "Rejected",
        icon: <FiXCircle className="w-3 h-3" />,
      },
      COMPLETED: {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-800 dark:text-blue-400",
        label: "Completed",
        icon: <FiCheckCircle className="w-3 h-3" />,
      },
    };

    const statusConfig = statusMap[status] || statusMap.PENDING;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
      >
        {statusConfig.icon}
        <span className="hidden xs:inline">{statusConfig.label}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  // State for date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  // Filtering logic
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.DOCNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.GRN_PrCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const status = order.GRN_DOCStatus?.toUpperCase() || "PENDING";

    // --- Date filtering ---
    let matchesDate = true;
    if (startDate) {
      matchesDate =
        matchesDate && new Date(order.GRN_DOCDate) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate =
        matchesDate && new Date(order.GRN_DOCDate) <= new Date(endDate);
    }

    if (activeFilter === "all") return matchesSearch && matchesDate;
    return matchesSearch && matchesDate && status === activeFilter;
  });

  // Stats
  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(
    (o) => (o.GRN_DOCStatus?.toUpperCase() || "PENDING") === "PENDING"
  ).length;
  const approvedOrders = purchaseOrders.filter(
    (o) => o.GRN_DOCStatus?.toUpperCase() === "APPROVED"
  ).length;
  const completedOrders = purchaseOrders.filter(
    (o) => o.GRN_DOCStatus?.toUpperCase() === "COMPLETED"
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
          <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      case "info":
        return (
          <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      default:
        return (
          <FiFileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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

      <Breadcrumb current="Inventory / Store Transaction / Goods Received Note " />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiPackage className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Goods Received Note
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Track and manage all purchase orders
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(openModal("ADD_GRN"))}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add New GRN
          </button>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className={`rounded-lg p-2 shadow border ${
            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{totalOrders}</p>
              </div>
              <FiFileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${
            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{pendingOrders}</p>
              </div>
              <FiClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${
            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">{approvedOrders}</p>
              </div>
              <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${
            darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{completedOrders}</p>
              </div>
              <FiCheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div> */}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by GRN No"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>

          <div className="flex gap-4">
            {/* Start Date */}
            <div className="relative flex-1">
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none px-1 z-10 
                ${startDate || focusedField === "start"
                    ? "-top-2 text-xs bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    : "top-3 text-gray-400"
                  }`}
              >
                Start Date
              </label>

              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={(date) =>
                  setStartDate(date ? date.toISOString().split("T")[0] : "")
                }
                onFocus={() => setFocusedField("start")}
                onBlur={() => setFocusedField(null)}
                dateFormat="yyyy-MM-dd"
                className={`w-full px-2 pr-8 py-2 text-sm rounded-lg border focus:outline-none
                ${darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
              />

              {startDate && (
                <button
                  onClick={() => setStartDate("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* End Date */}
            <div className="relative flex-1">
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none z-10 px-1
                ${endDate || focusedField === "end"
                    ? "-top-2 text-xs px-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    : "top-3 text-gray-400"
                  }`}
              >
                End Date
              </label>

              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={(date) =>
                  setEndDate(date ? date.toISOString().split("T")[0] : "")
                }
                onFocus={() => setFocusedField("end")}
                onBlur={() => setFocusedField(null)}
                dateFormat="yyyy-MM-dd"
                className={`w-full px-2 pr-8 py-2  text-sm rounded-lg border focus:outline-none
                ${darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
              />

              {endDate && (
                <button
                  onClick={() => setEndDate("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => dispatch(openModal("UPDATE_SUPPLIER_GRN"))}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
            >
              <FiEdit2 className="w-4 h-4" />
              Change Supplier
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div
          className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-green-800" : "border-green-200"
                      }`}
                  ></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Loading purchase orders...
                </p>
              </div>
            </div>
          ) : error ? (
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
                  {error}
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
                <div className="max-h-100 overflow-y-60">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          GRN No
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Supplier Name
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden lg:table-cell">
                          GRN Date
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden lg:table-cell">
                          Product Code
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Batch No
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Line No
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Description
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider">
                          Balance Quantity
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider">
                          GRN Quantity
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                        }`}
                    >
                      {filteredOrders.map((order, idx) => (
                        <tr
                          key={`${order.DOCNo}-${idx}`}
                          className={`transition-colors duration-150 ${darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                            {order.DOCNo}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                            {order.GRN_DOCSupName || "-"}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden md:table-cell">
                            {formatDate(order.GRN_DOCDate)}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden md:table-cell">
                            {order.GRN_PrCode}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden md:table-cell">
                            {order.GRN_BatchId}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden md:table-cell">
                            {order.GRN_Line}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                            {order.GRN_Proname || "-"}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-right text-xs hidden lg:table-cell">
                            {order.GRN_BLQty}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-right text-xs hidden lg:table-cell">
                            {order.GRN_Qty}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-right text-xs hidden lg:table-cell">
                            {(order.GRN_Val)}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiFileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        No purchase orders found
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
    </div>
  );
}

