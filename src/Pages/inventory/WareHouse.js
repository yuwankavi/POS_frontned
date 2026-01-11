import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiInfo } from "react-icons/fi";
import {
  FiPlus,
  FiSearch,
  FiHome,
  FiChevronRight,
  FiEdit3,
  FiArchive,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiXCircle,
  FiBarChart2,
  FiMapPin,
  FiTruck,
  FiUserCheck,
  FiUserX,
  FiCalendar,
  FiClock,
  FiTrendingUp
} from "react-icons/fi";
import {
  listWarehouses,
  updateWarehouseStatus,
  processMonthEnd,
  getMonthEndHistory
} from "../../actions/warehouseActions.js";
import { openModal } from "../../actions/modalActions.js";
import Breadcrumb from "../../components/common/Breadcrumb.js";

export default function WarehouseTable() {
  const dispatch = useDispatch();
  const { warehouses, loading, error, monthEndProcessing } = useSelector((state) => state.warehouse);
  const { darkMode } = useSelector(state => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [warehouseToUpdate, setWarehouseToUpdate] = useState(null);
  const [isMonthEndModalOpen, setIsMonthEndModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [monthEndHistory, setMonthEndHistory] = useState([]);
  const [processingMonth, setProcessingMonth] = useState(new Date().getMonth() + 1);
  const [processingYear, setProcessingYear] = useState(new Date().getFullYear());
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lastProcessedMonthMap, setLastProcessedMonthMap] = useState({});
  const [monthToggleNext, setMonthToggleNext] = useState(true);





  useEffect(() => {
    dispatch(listWarehouses());
  }, [dispatch]);




  const getMonthDateRange = (month, year) => {

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    const firstDay = new Date(yearNum, monthNum - 1, 1);


    const lastDay = new Date(yearNum, monthNum, 0);


    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
      monthName: firstDay.toLocaleString('default', { month: 'long' })
    };
  };


  const handleMonthEndProcess = async () => {
    if (!selectedWarehouse || !processingMonth || !processingYear) {
      showAlertMessage("Please select month and year", "error");
      return;
    }

    try {
      const { firstDay, lastDay, monthName } = getMonthDateRange(processingMonth, processingYear);

      await dispatch(processMonthEnd(
        firstDay,
        lastDay,
        selectedWarehouse.WH_Code
      ));


      setLastProcessedMonthMap(prev => ({
        ...prev,
        [selectedWarehouse.WH_Code]: processingMonth
      }));

      showAlertMessage(
        `Month-end processing for ${monthName} ${processingYear} completed for ${selectedWarehouse.WH_Name}`,
        "success"
      );
      closeMonthEndModal();
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error?.message || "Month-end failed";
      showAlertMessage(errMsg, "error");
    }
  };


  const openMonthEndModal = (warehouse) => {
    setSelectedWarehouse(warehouse);

    const lastMonth = lastProcessedMonthMap[warehouse.WH_Code];
    let newMonth;


    if (!lastMonth) {

      if (warehouse?.WH_EDate) {
        const endDate = new Date(warehouse.WH_EDate);
        newMonth = endDate.getMonth() + 2;
        if (newMonth > 12) newMonth = 1;
      } else {
        const currentMonth = new Date().getMonth() + 1;
        newMonth = currentMonth + 1 > 12 ? 1 : currentMonth + 1;
      }
    } else {

      newMonth = lastMonth + 1;
      if (newMonth > 12) newMonth = 1;
    }

    setProcessingMonth(newMonth);
    setIsMonthEndModalOpen(true);
  };

  const closeMonthEndModal = () => {
    setIsMonthEndModalOpen(false);
    setSelectedWarehouse(null);
    setMonthEndHistory([]);
  };

  const handleStatusChange = () => {
    if (!warehouseToUpdate) return;
    const newStatus = warehouseToUpdate.WH_Status === "A" ? "I" : "A";

    dispatch(updateWarehouseStatus(warehouseToUpdate.WH_Code, newStatus))
      .then(() => {
        showAlertMessage(
          `Warehouse "${warehouseToUpdate.WH_Name}" ${newStatus === "A" ? "activated" : "deactivated"}`
        );
        closeStatusModal();
      })
      .catch(() => {
        showAlertMessage("Failed to update status", "error");
      });
  };

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };


  const openStatusModal = (warehouse) => {
    setWarehouseToUpdate(warehouse);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => setIsStatusModalOpen(false);






  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" }
  ];

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
        return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "error":
        return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case "info":
        return <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const filteredWarehouses = warehouses.filter((w) => {
    const matchesSearch =
      w.WH_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.WH_Code.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "active") return matchesSearch && w.WH_Status === "A";
    if (activeFilter === "inactive") return matchesSearch && w.WH_Status !== "A";
    return matchesSearch;
  });


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);


  const getSelectableMonths = (warehouse) => {
    if (!warehouse?.WH_EDate) return months;
    const endDate = new Date(warehouse.WH_EDate);
    const endMonth = endDate.getMonth() + 1;


    return months.filter(m => m.value > endMonth);
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

      <Breadcrumb current="Inventory / Warehouse Management" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiPackage className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Warehouse Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage warehouses and storage locations
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              dispatch(
                openModal("ADD_WAREHOUSE", { onSuccess: showAlertMessage })
              )
            }
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Warehouse
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div
            className={`rounded-lg p-2 shadow border ${darkMode
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-100"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Warehouses
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {warehouses.length}
                </p>
              </div>
              <FiPackage className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                  {warehouses.filter((w) => w.WH_Status === "A").length}
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
                  {warehouses.filter((w) => w.WH_Status !== "A").length}
                </p>
              </div>
              <FiXCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
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
                  Month-End Ready
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {warehouses.filter((w) => w.WH_Status === "A").length}
                </p>
              </div>
              <FiTrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Wrehouses by Name or Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                onClick={() => setActiveFilter(f)}
                className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === f
                    ? "bg-blue-600 text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
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
                  Loading warehouses...
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
                          Warehouse Code
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Warehouse Name
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Start Date
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          End Date
                        </th>
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
                      {filteredWarehouses.map((warehouse) => (
                        <tr
                          key={warehouse.WH_Code}
                          className={`transition-colors duration-150 ${darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                            {warehouse.WH_Code}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="text-xs font-medium">
                                  {warehouse.WH_Name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden md:table-cell">
                            <span className="text-xs">
                              {formatDate(warehouse.WH_SDate)}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span className="text-xs">
                              {formatDate(warehouse.WH_EDate)}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            {getStatusBadge(warehouse.WH_Status)}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => openStatusModal(warehouse)}
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${warehouse.WH_Status === "A"
                                    ? darkMode
                                      ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                    : darkMode
                                      ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                              >
                                {warehouse.WH_Status === "A"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                              <button
                                onClick={() => openMonthEndModal(warehouse)}
                                disabled={warehouse.WH_Status !== "A"}
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${warehouse.WH_Status === "A"
                                    ? darkMode
                                      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/50"
                                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  }`}
                              >
                                <FiCalendar className="w-3 h-3" />
                                Month End
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredWarehouses.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        No warehouses found
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

      {/* Status Change Confirmation Modal */}
      {isStatusModalOpen && warehouseToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${warehouseToUpdate.WH_Status === "A"
                      ? darkMode
                        ? "bg-red-900/30"
                        : "bg-red-100"
                      : darkMode
                        ? "bg-green-900/30"
                        : "bg-green-100"
                    }`}
                >
                  {warehouseToUpdate.WH_Status === "A" ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {warehouseToUpdate.WH_Status === "A"
                    ? "Deactivate Warehouse"
                    : "Activate Warehouse"}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to{" "}
                  {warehouseToUpdate.WH_Status === "A"
                    ? "deactivate"
                    : "activate"}{" "}
                  warehouse <strong>{warehouseToUpdate.WH_Name}</strong>?
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
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${warehouseToUpdate.WH_Status === "A"
                      ? "bg-red-600"
                      : "bg-green-600"
                    }`}
                >
                  {warehouseToUpdate.WH_Status === "A"
                    ? "Deactivate"
                    : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Month End Processing Modal */}
      {isMonthEndModalOpen && selectedWarehouse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-blue-500" />
                  Month-End Processing - {selectedWarehouse.WH_Name}
                </h3>
                <button
                  onClick={closeMonthEndModal}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Month Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Month
                </label>
                <select
                  value={processingMonth}
                  onChange={(e) => setProcessingMonth(parseInt(e.target.value))}
                  className={`w-full p-3 rounded-lg border ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                    }`}
                >
                  {months
                    .filter((m) => m.value === processingMonth)
                    .map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Processing Information */}
              <div
                className={`rounded-lg p-4 mb-6 ${darkMode
                    ? "bg-blue-900/20 border-blue-800"
                    : "bg-blue-50 border-blue-200"
                  } border`}
              >
                <div className="flex items-center gap-3">
                  <FiInfo className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-sm">
                      What happens during month-end processing?
                    </h4>
                    <ul className="text-xs mt-1 space-y-1">
                      <li>• Inventory valuation and stock counting</li>
                      <li>• Financial reporting and analytics</li>
                      <li>• Data archiving and cleanup</li>
                      <li>• Performance metrics calculation</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeMonthEndModal}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMonthEndProcess}
                  disabled={monthEndProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {monthEndProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      Process Month End
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}