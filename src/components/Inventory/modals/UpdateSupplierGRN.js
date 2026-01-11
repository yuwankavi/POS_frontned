// components/modals/UpdateGrnSupplierModal.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiPackage, FiCheckCircle } from "react-icons/fi";
import { closeModal } from "../../../actions/modalActions";
import {
  listPurchaseOrders,
  updateSupplier,
} from "../../../actions/Inventory/purchaseActions";
import { listSupplier } from "../../../actions/supplierAction";

export default function UpdateGrnSupplierModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [showDropdown, setShowDropdown] = useState(false); // GRN dropdown
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false); // Supplier dropdown

  // Alert state
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // get GRNs from redux
  const { orders: grns = [] } =
    useSelector((state) => state.purchaseOrders) || {};

  // suppliers
  const { suppliers = [] } = useSelector((state) => state.supplierList) || {};

  useEffect(() => {
    dispatch(listPurchaseOrders());
    dispatch(listSupplier());
  }, [dispatch]);

  const [selectedGrn, setSelectedGrn] = useState("");
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState("");

  // when GRN changes, set current supplier
  useEffect(() => {
    const grn = grns.find((g) => g.DOCNo === selectedGrn);
    if (grn) {
      setCurrentSupplier(grn.GRN_DOCSupName);
      setNewSupplier(grn.GRN_DOCSupID);
    } else {
      setCurrentSupplier(null);
      setNewSupplier("");
    }
  }, [selectedGrn, grns]);

  const handleSubmit = (e) => {
    e.preventDefault();

    showAlertMessage(`Supplier Updated Successfully!`, "success");

    if (!selectedGrn || !newSupplier) {
      alert("Please select GRN and Supplier");
      return;
    }

    dispatch(updateSupplier({ P_DOCNO: selectedGrn, P_SUPCODE: newSupplier }));
    setTimeout(()=>{ dispatch(closeModal());},3000)
  };

    // Function to show alert messages

    const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

    // Alert styling functions
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
        {/* Header */}
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
              <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Update GRN Supplier
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className={`p-1 rounded-lg transition-colors duration-200 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-2 md:grid-cols-2 gap-3"
        >
          {/* Select GRN */}
          <div className="space-y-1 md:col-span-2">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Search or Select GRN *
            </label>

            <div className="relative">
              {/* Search */}
              <input
                type="text"
                value={selectedGrn}
                onChange={(e) => setSelectedGrn(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="-- Search or Select GRN --"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
                required
              />

              {/* Dropdown */}
              {showDropdown && (
                <ul
                  className={`absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border shadow-lg text-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  {grns
                    .filter((grn) =>
                      grn.DOCNo.toLowerCase().includes(
                        selectedGrn.toLowerCase()
                      )
                    )
                    .slice(0, 50)
                    .map((grn) => (
                      <li
                        key={grn.DOCNo}
                        onClick={() => {
                          setSelectedGrn(grn.DOCNo);
                          setShowDropdown(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                          darkMode ? "hover:bg-blue-600" : "hover:bg-blue-100"
                        }`}
                      >
                        {grn.DOCNo}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Current Supplier */}
          {currentSupplier && (
            <div className="space-y-1 md:col-span-2">
              <label
                className={`block text-xs font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Current Supplier
              </label>
              <div
                className={`px-3 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                {currentSupplier} –{" "}
                {grns.find((g) => g.DOCNo === selectedGrn)?.GRN_DOCSupID || ""}
              </div>
            </div>
          )}

          {/* New Supplier */}
          <div className="space-y-1 md:col-span-2">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Search or Select New Supplier *
            </label>

            <div className="relative">
              {/* Search input */}
              <input
                type="text"
                value={
                  suppliers.find((s) => s.SUP_CODE === newSupplier)
                    ? `${
                        suppliers.find((s) => s.SUP_CODE === newSupplier)
                          ?.SUP_NAME
                      } – ${
                        suppliers.find((s) => s.SUP_CODE === newSupplier)
                          ?.SUP_CODE
                      }`
                    : newSupplier
                }
                onChange={(e) => {
                  setNewSupplier(e.target.value);
                  setShowSupplierDropdown(true);
                }}
                onFocus={() => setShowSupplierDropdown(true)}
                placeholder="-- Search or Select Supplier --"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
                required
              />

              {/* Dropdown */}
              {showSupplierDropdown && (
                <ul
                  className={`absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border shadow-lg text-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  {suppliers
                    .filter((supplier) => {
                      const code = supplier.SUP_CODE
                        ? String(supplier.SUP_CODE)
                        : "";
                      const name = supplier.SUP_NAME
                        ? String(supplier.SUP_NAME)
                        : "";
                      return (
                        name
                          .toLowerCase()
                          .includes(newSupplier.toLowerCase()) ||
                        code.toLowerCase().includes(newSupplier.toLowerCase())
                      );
                    })
                    .slice(0, 50)
                    .map((supplier) => (
                      <li
                        key={supplier.SUP_CODE}
                        onClick={() => {
                          setNewSupplier(supplier.SUP_CODE);
                          setShowSupplierDropdown(false);
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                          darkMode ? "hover:bg-blue-600" : "hover:bg-blue-100"
                        }`}
                      >
                        {supplier.SUP_NAME} – {supplier.SUP_CODE}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}