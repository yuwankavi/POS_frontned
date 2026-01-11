
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiSearch,
  FiPackage,
  FiUserCheck,
  FiUserX,
  FiCheckCircle,
  FiXCircle,
  FiX,
} from "react-icons/fi";
import {
  listUnitsActive,
  listUnitsInactive,
  updateUnitStatus,
} from "../../../actions/Inventory/unitActions";
import { openModal } from "../../../actions/modalActions";
import Breadcrumb from "../../../components/common/Breadcrumb";
import UnitAddModal from "../../../components/Inventory/modals/unitAddModal";

export default function UnitTable() {
  const dispatch = useDispatch();


  const { units, loading, error } = useSelector(
    (state) => state.unitActiveList
  );
  const { units: inactiveUnits } = useSelector(
    (state) => state.unitInactiveList
  );
  const { darkMode } = useSelector((state) => state.ui);
  const { modalType } = useSelector((state) => state.modal || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [unitToUpdate, setUnitToUpdate] = useState(null);

  useEffect(() => {
    dispatch(listUnitsActive());
    dispatch(listUnitsInactive());
  }, [dispatch]);


  const handleStatusChange = () => {
    if (!unitToUpdate) return;

    const newStatus = unitToUpdate.P_STATUS === "A" ? "I" : "A";
    console.log(
      `Changing status for ${unitToUpdate.P_UNDESC} (${unitToUpdate.P_UNCODE}) to ${newStatus}`
    );

    dispatch(updateUnitStatus(unitToUpdate.P_UNCODE, newStatus))
      .then(() => {
        console.log("Status update success");
        showAlertMessage(
          `Unit "${unitToUpdate.P_UNDESC}" ${newStatus === "A" ? "activated" : "deactivated"
          }`
        );
        setUnitToUpdate(null);
        setIsStatusModalOpen(false);
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


  const openStatusModal = (unit) => {
    setUnitToUpdate(unit);
    setIsStatusModalOpen(true);
  };
  const closeStatusModal = () => setIsStatusModalOpen(false);


  const sourceUnits = activeFilter === "inactive" ? inactiveUnits : units;
  const filteredUnits = sourceUnits.filter((u) => {
    const matchesSearch =
      u.P_UNDESC.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.P_UNCODE.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const allUnits = [...units, ...inactiveUnits];

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

      <Breadcrumb current="Inventory / Unit Management" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiPackage className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Unit Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage units and measurement codes
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              dispatch(openModal("ADD_UNIT", { onSuccess: showAlertMessage }))
            }
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add New Unit
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
                  Total Units
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {allUnits.length}
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
                  {units.length}
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
                  {inactiveUnits.length}
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
              placeholder="Search units by code or description..."
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
                  Loading units...
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
                          Code
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Description
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
                      {filteredUnits.map((unit) => (
                        <tr
                          key={unit.P_UNCODE}
                          className={`transition-colors duration-150 ${darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                            {unit.P_UNCODE}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="text-xs font-medium">
                                  {unit.P_UNDESC}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            {getStatusBadge(unit.P_STATUS)}
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={() => openStatusModal(unit)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${unit.P_STATUS === "A"
                                  ? darkMode
                                    ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                  : darkMode
                                    ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                              {unit.P_STATUS === "A"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUnits.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        No units found
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
      {isStatusModalOpen && unitToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${unitToUpdate.P_STATUS === "A"
                      ? darkMode
                        ? "bg-red-900/30"
                        : "bg-red-100"
                      : darkMode
                        ? "bg-green-900/30"
                        : "bg-green-100"
                    }`}
                >
                  {unitToUpdate.P_STATUS === "A" ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {unitToUpdate.P_STATUS === "A"
                    ? "Deactivate Unit"
                    : "Activate Unit"}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to{" "}
                  {unitToUpdate.P_STATUS === "A" ? "deactivate" : "activate"}{" "}
                  unit <strong>{unitToUpdate.P_UNDESC}</strong>?
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
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${unitToUpdate.P_STATUS === "A"
                      ? "bg-red-600"
                      : "bg-green-600"
                    }`}
                >
                  {unitToUpdate.P_STATUS === "A" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
