
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { listAdjustments, addAdjustment } from "../../../actions/Inventory/adjustmentActions.js";
import { openModal } from "../../../actions/modalActions.js";
import Breadcrumb from "../../../components/common/Breadcrumb.js";




const adjustmentReasons = {
  L: "LOSS",
  D: "DAMAGE",
  E: "EXPIRED",
  G: "GAIN",
};

export default function AdjustmentTable() {
  const dispatch = useDispatch();
  const { adjustments = [], loading, error } = useSelector(
    (state) => state.adjustment
  );
  const { darkMode } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    dispatch(listAdjustments());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const filteredAdjustments = adjustments.filter((adj) => {
    const whCode = adj.ADJ_WHCode || "";
    const prCode = adj.ADJ_PrCode || "";
    const prName = adj.ADJ_Proname || "";

    return (
      whCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getReasonLabel = (code) => adjustmentReasons[code] || code;




  const getAlertBgColor = () => {
    switch (alertType) {
      case "success": return "bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700";
      case "error": return "bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700";
      default: return "bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700";
    }
  };

  const getAlertTextColor = () => {
    switch (alertType) {
      case "success": return "text-green-800 dark:text-green-200";
      case "error": return "text-red-800 dark:text-red-200";
      default: return "text-gray-800 dark:text-gray-200";
    }
  };

  const getAlertIcon = () => {
    switch (alertType) {
      case "success": return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "error": return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default: return <FiPackage className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };
  return (
    <div className={`flex flex-col p-2 md:p-4 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}>

      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
          <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {getAlertIcon()}
              <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
            </div>
            <button onClick={() => setShowAlert(false)} className="hover:opacity-70 transition-opacity">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Breadcrumb current="Inventory / Adjustments" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
            <FiPackage className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Inventory Adjustments
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              View and manage product adjustments
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(openModal("ADD_ADJUSTMENT", { onSuccess: showAlertMessage }))}
          className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Adjustment
        </button>
      </div>

      {/* Search */}
      <div className="mb-2 flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search warehouse or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-y-auto">
        <div className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
          }`}>
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Loading adjustments...</p>
            </div>
          ) : error ? (
            <div className={`rounded-xl p-4 text-center h-full flex items-center justify-center border ${darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
              }`}>
              <div>
                <div className={`font-medium text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}>⚠️ Error</div>
                <p className={`mt-1 text-xs ${darkMode ? "text-red-400" : "text-red-600"}`}>{error}</p>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border overflow-hidden h-full ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
              <div className="overflow-x-auto h-full max-h-96">
                <table className="w-full">
                  <thead className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">Warehouse</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">Doc Date</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold tracking-wider">Product</th>
                      <th className="px-1 py-2 text-center text-xs font-semibold tracking-wider">Batch</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider">Adjustment Quantity</th>
                      <th className="px-0 py-3 text-right text-xs font-semibold tracking-wider">Balance Qty</th>

                      <th className="px-0 py-2 text-center text-xs font-semibold tracking-wider">Remark</th>
                      <th className="px-0 py-2 text-left text-xs font-semibold tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                    {filteredAdjustments.length > 0 ? (
                      filteredAdjustments.map((adj, i) => (
                        <tr
                          key={i}
                          className={`transition-colors duration-150 ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-2 py-2 text-xs ">{adj.ADJ_WHCode}</td>
                          <td className="px-2 py-2 text-xs text-center">{adj.ADJ_DOCDate}</td>
                          <td className="px-2 py-2 text-xs text-left">{adj.ADJ_Proname}</td>
                          <td className="px-2 py-2 text-xs text-center">{adj.ADJ_BatchId}</td>
                          <td className="px-2 py-2 text-xs text-right">{adj.ADJ_Qty}</td>
                          <td className="px-2 py-2 text-xs text-right">{adj.ADJ_BLQty}</td>

                          <td className="px-2 py-2 text-xs text-center">{adj.ADJ_Remark}</td>
                          <td className="px-2 py-2 text-xs">{getReasonLabel(adj.ADJ_Reason) || adj.ADJ_Reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                          No adjustments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
