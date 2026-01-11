import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiSearch,
  FiLayers,
  FiEye,
  FiFileText,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiX,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";
import { openModal } from "../../../actions/modalActions.js";
import { listPurchaseReturnOrders } from "../../../actions/Inventory/purchaseReturnActions.js";
import Breadcrumb from "../../../components/common/Breadcrumb.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function PurchaseReturnTable() {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    returns: purchaseReturnOrders = [],
  } = useSelector((state) => state.purchaseReturnOrders) || {};

  const { darkMode } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);


  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [focusedField, setFocusedField] = useState(null);


  const reasonLabels = {
    E: "Expired",
    D: "Damaged",
    N: "Non-Moving",
    X: "Exchange",
  };


  const statusLabels = {
    A: "Active",
    I: "Inactive",
  };


  useEffect(() => {
    dispatch(listPurchaseReturnOrders());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleViewClick = (r) => {
    setSelectedReturn(r);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };


  const filteredReturns = purchaseReturnOrders.filter((r) => {
    const matchesSearch =
      r.DOCNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.PRN_PDate?.toLowerCase().includes(searchTerm.toLowerCase());

    const status = r.PRN_DOCPrintStatus?.toUpperCase() || "PENDING";


    let matchesDate = true;
    if (startDate) {
      matchesDate =
        matchesDate &&
        new Date(r.PRN_PDate) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate =
        matchesDate &&
        new Date(r.PRN_PDate) <= new Date(endDate);
    }

    if (activeFilter === "all") return matchesSearch && matchesDate;
    return matchesSearch && matchesDate && status === activeFilter;
  });


  const totalReturns = purchaseReturnOrders.length;
  const pendingReturns = purchaseReturnOrders.filter(
    (r) => (r.PRN_DOCPrintStatus?.toUpperCase() || "PENDING") === "PENDING"
  ).length;
  const approvedReturns = purchaseReturnOrders.filter(
    (r) => r.PRN_DOCPrintStatus?.toUpperCase() === "APPROVED"
  ).length;
  const completedReturns = purchaseReturnOrders.filter(
    (r) => r.PRN_DOCPrintStatus?.toUpperCase() === "COMPLETED"
  ).length;

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        label: "Pending",
        icon: <FiClock className="w-3 h-3" />,
      },
      APPROVED: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        label: "Approved",
        icon: <FiCheck className="w-3 h-3" />,
      },
      REJECTED: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        label: "Rejected",
        icon: <FiX className="w-3 h-3" />,
      },
      COMPLETED: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
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

      <Breadcrumb current="Inventory / Store Transaction / Purchase Return Note (PRN) " />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiLayers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Purchase Return Note (PRN)
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Track and manage all purchase returns
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(openModal("ADD_PRN"))}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by document no..."
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
                  Loading purchase returns...
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
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Doc No
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Product Code
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Product Name
                        </th>

                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden md:table-cell">
                          Warehouse
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Supplier Name
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Batch ID
                        </th>
                        {/* <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden lg:table-cell">
                          GRN No
                        </th> */}
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden xl:table-cell">
                          PRN Date
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider">
                          PRN Quantity
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Reason
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
                      {filteredReturns.map((r) => (
                        <tr
                          key={r.PRN_ID || r.DOCNo}
                          className={`transition-colors duration-150 ${darkMode
                            ? "hover:bg-gray-700/50"
                            : "hover:bg-gray-100"
                            }`}
                        >
                          {/* Document No column */}
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                            {r.DOCNo}
                          </td>

                          {/* Product column */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <div className="flex flex-col">
                              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                {r.PRN_PrCode}
                              </div>

                            </div>
                          </td>

                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                            {r.PRN_ProName || "-"}
                          </td>


                          {/* Warehouse column - Hidden on mobile */}
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden md:table-cell">
                            {r.PRN_WHCode}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                            {r.PRN_DOCSupName}
                          </td>
                          {/* Batch ID column */}
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs">
                            {r.PRN_BatchId || "-"}
                          </td>

                          {/* GRN No column - Hidden on smaller screens */}

                          {/* <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden lg:table-cell">
                            {r.PRN_DOCRDNo || "-"}
                          </td> */}

                          {/* Date column - Hidden on extra small screens */}
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden xl:table-cell">
                            {formatDate(r.PRN_DOCPDate)}
                          </td>

                          {/* PRN Quantity column */}
                          <td className="px-2 py-2 whitespace-nowrap text-right text-xs font-medium">
                            {r.PRN_Qty || "0"}
                          </td>

                          {/* Return Reason column */}
                          <td className="px-2 py-2 whitespace-nowrap text-center text-xs">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-200"
                              }`}>
                              {reasonLabels[r.PRN_RStatus] || r.PRN_RStatus || "-"}
                            </span>
                          </td>



                          {/* Actions column (centered) */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleViewClick(r)}
                              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${darkMode
                                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/50"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                              title="View Details"
                            >
                              <FiEye className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredReturns.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiFileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        No purchase returns found
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

      {/* View Modal */}
      {showViewModal && selectedReturn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 md:p-4">
          <div
            className={`rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
          >
            <button
              onClick={() => setShowViewModal(false)}
              className={`absolute top-4 right-4 p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                } transition`}
            >
              <FiX className="w-5 h-5" />
            </button>
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Purchase Return Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">

                {/* Warehouse */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Warehouse
                  </label>
                  <input
                    value={selectedReturn.PRN_WHCode}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* PRN No */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Document No
                  </label>
                  <input
                    value={selectedReturn.DOCNo}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* Product Code */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Product Code
                  </label>
                  <input
                    value={selectedReturn.PRN_PrCode}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Product Name
                  </label>
                  <input
                    value={selectedReturn.PRN_ProName || "-"}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* GRN No */}
                {/* <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    GRN No
                  </label>
                  <input
                    value={selectedReturn.PRN_DOCRDNo || "-"}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div> */}

                {/* Status */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Status
                  </label>
                  <input
                    value={
                      statusLabels[selectedReturn.PRN_Status] ||
                      selectedReturn.PRN_Status
                    }
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* Date */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    PRN Date
                  </label>
                  <input
                    value={formatDate(selectedReturn.PRN_DOCPDate)}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* Batch ID */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Batch ID
                  </label>
                  <input
                    value={selectedReturn.PRN_BatchId}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    PRN Quantity
                  </label>
                  <input
                    value={selectedReturn.PRN_Qty}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* Value */}
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Value
                  </label>
                  <input
                    value={selectedReturn.PRN_Val}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Avg Rate
                  </label>
                  <input
                    value={selectedReturn.AVERate}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Balance Qty
                  </label>
                  <input
                    value={selectedReturn.PRN_BLQty}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Invoice No
                  </label>
                  <input
                    value={selectedReturn.PRN_DOCINNo}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Invoice Date
                  </label>
                  <input
                    value={formatDate(selectedReturn.PRN_DOCINDate)}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Supplier Name
                  </label>
                  <input
                    value={selectedReturn.PRN_DOCSupName}
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    Return Reason
                  </label>
                  <input
                    value={
                      reasonLabels[selectedReturn.PRN_RStatus] ||
                      selectedReturn.PRN_RStatus
                    }
                    readOnly
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}