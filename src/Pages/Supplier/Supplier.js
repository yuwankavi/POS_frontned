import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiTruck,
  FiUserCheck,
  FiUserX,
  FiX,
  FiSearch,
  FiCheckCircle,
  FiHome,
  FiChevronRight,
  FiPackage,
} from "react-icons/fi";
import {
  listSupplier,
  updateSupplierStatus,
  addSupplier,
} from "../../actions/supplierAction";
import { Country, State, City } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Breadcrumb from '../../components/common/Breadcrumb'

const SupplierAccessPage = () => {
  const dispatch = useDispatch();
  const { loading, suppliers = [], error } = useSelector(
    (state) => state.supplierList
  );

  const { darkMode } = useSelector((state) => state.ui);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    P_SUPNAME: "",
    P_CONPERSON: "",
    P_EMAIL: "",
    P_PHONENO: "",
    P_ADDRESS: "",
    P_CITY: "",
    P_COUNTRY: "",
    P_REMARKS: "",
  });
  const [supplierToUpdate, setSupplierToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showOdit, setShowOdit] = useState(false);
  const [buttonFocused, setButtonFocused] = useState(false);

  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const counrtyRef = useRef(null);
  const counrtyInputRef = useRef(null);
  const cityRef = useRef(null);

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find(
    (c) => c.name === currentSupplier.P_COUNTRY
  );
  const countryCode = selectedCountry ? selectedCountry.isoCode : null;
  const citiesInCountry = countryCode
    ? City.getCitiesOfCountry(countryCode)
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (counrtyRef.current && !counrtyRef.current.contains(event.target)) {
        setShowCountrySuggestions(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySuggestionClick = (country) => {
    setCurrentSupplier({
      ...currentSupplier,
      P_COUNTRY: country,
    });
    setShowCountrySuggestions(false);
  };
  const handleCitySuggestionClick = (city) => {
    setCurrentSupplier({
      ...currentSupplier,
      P_CITY: city,
    });
    setShowCitySuggestions(false);
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const countrySuggestions = countries.filter((country) =>
    currentSupplier.P_COUNTRY === ""
      ? true
      : country.name.includes(currentSupplier.P_COUNTRY)
  );
  const citySuggestions = citiesInCountry.filter((city) =>
    currentSupplier.P_CITY === ""
      ? true
      : city.name.includes(currentSupplier.P_CITY)
  );

  useEffect(() => {
    dispatch(listSupplier());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const openModal = () => {
    setCurrentSupplier({
      P_SUPNAME: "",
      P_CONPERSON: "",
      P_EMAIL: "",
      P_PHONENO: "",
      P_ADDRESS: "",
      P_CITY: "",
      P_COUNTRY: "",
      P_REMARKS: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openStatusModal = (supplier) => {
    setSupplierToUpdate(supplier);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => setIsStatusModalOpen(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !currentSupplier.P_SUPNAME ||
      !currentSupplier.P_CONPERSON ||
      !currentSupplier.P_EMAIL ||
      !currentSupplier.P_PHONENO ||
      !currentSupplier.P_ADDRESS ||
      !currentSupplier.P_CITY ||
      !currentSupplier.P_COUNTRY
    ) {
      showAlertMessage(
        "Please fill all required fields before saving.",
        "error"
      );
      return;
    }

    const temp = countries.filter(
      (country) => country.name === currentSupplier.P_COUNTRY
    );

    if (temp.length <= 0) {
      showAlertMessage("Please select a valid country from the list.", "error");
      currentSupplier.P_COUNTRY = "";
      counrtyInputRef.current.focus();
      return;
    }
    const finalSupplier = { ...currentSupplier, P_PHONENO: "+" + currentSupplier.P_PHONENO }
    if (!isValidEmail(currentSupplier.P_EMAIL)) {
      showAlertMessage("Invalid email format.", "error");
      return;
    }



    try {
      await dispatch(addSupplier(finalSupplier));
      closeModal();
      dispatch(listSupplier());


      showAlertMessage(
        `Supplier "${currentSupplier.P_SUPNAME}" created successfully!`,
        "success"
      );
    } catch (error) {

      showAlertMessage("Failed to create supplier. Please try again.", "error");
    }
  };

  const handleStatusChange = async () => {
    if (supplierToUpdate) {
      try {
        const status = supplierToUpdate.SUP_STATUS === "A" ? "I" : "A"; 
        await dispatch(updateSupplierStatus(supplierToUpdate.SUP_CODE, status));
        closeStatusModal();
        dispatch(listSupplier());

        
        const action =
          supplierToUpdate.SUP_STATUS === "A" ? "deactivated" : "activated";
        showAlertMessage(
          `Supplier "${supplierToUpdate.SUP_NAME}" ${action} successfully!`,
          "success"
        );
      } catch (error) {

        showAlertMessage(
          "Failed to change supplier status. Please try again.",
          "error"
        );
      }
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.SUP_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(supplier.SUP_CODE)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "active")
      return matchesSearch && supplier.SUP_STATUS === "A";
    if (activeFilter === "inactive")
      return matchesSearch && supplier.SUP_STATUS !== "A";

    return matchesSearch && supplier.SUP_STATUS === activeFilter;
  });

  const getStatusColor = (status) => {
    return status === "A"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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

  return (
    <div
      className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}
    >

      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in-down w-full max-w-md px-2 sm:px-0">
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

      <Breadcrumb current="Suppliers Management" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow">
              <FiTruck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Suppliers Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage suppliers
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" /> Add Supplier
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
                  Total Suppliers
                </p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {suppliers.length}
                </p>
              </div>
              <FiTruck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
                  {suppliers.filter((s) => s.SUP_STATUS === "A").length}
                </p>
              </div>
              <FiUserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                  {suppliers.filter((s) => s.SUP_STATUS !== "A").length}
                </p>
              </div>
              <FiUserX className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search suppliers by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>
          {/* active inactive buttons */}
          <div className="flex flex-wrap gap-1">

            {["all", "active", "inactive"].map((f) => (

              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === f
                  ? "bg-amber-600 text-white"
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
                    className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-amber-800" : "border-amber-200"
                      }`}
                  ></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Loading suppliers...
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
                <div className="max-h-100 overflow-y-auto">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          ID
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Supplier
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Contact Person
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          Email
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          Phone Number
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          Address
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          Country
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          City
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          Remarks
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
                      {filteredSuppliers.map((supplier) => (
                        <tr
                          key={supplier.SUP_ID}
                          className={`transition-colors duration-150 ${darkMode
                            ? "hover:bg-gray-700/50"
                            : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden md:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_CODE}
                            </span>
                          </td>
                          {/* Supplier column (left aligned) */}
                          <td className="px-2 py-2 whitespace-nowrap text-left">
                            <div className="flex items-center gap-2">
                              {/* <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {supplier.SUP_NAME.charAt(0).toUpperCase()}
                              </div> */}
                              <div>
                                <div className="text-xs font-medium">
                                  {supplier.SUP_NAME}
                                </div>
                                {/* <div className="text-xs hidden sm:block">
                                  ID: {supplier.SUP_CODE}
                                </div> */}
                              </div>
                            </div>
                          </td>

                          {/* Contact Person column - Hidden on mobile */}
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden md:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_CONPERSON}
                            </span>
                          </td>

                          {/* Email column - Hidden on smaller screens */}
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_EMAIL}
                            </span>
                          </td>


                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_PHONENO}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_ADDRESS}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_COUNTRY}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_CITY}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span className="text-xs">
                              {supplier.SUP_REMARKS}
                            </span>
                          </td>
                          {/* Status column */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                supplier.SUP_STATUS
                              )}`}
                            >
                              {supplier.SUP_STATUS === "A" ? (
                                <>
                                  <FiUserCheck className="w-3 h-3" />
                                  <span className="hidden xs:inline">
                                    Active
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FiUserX className="w-3 h-3" />
                                  <span className="hidden xs:inline">
                                    Inactive
                                  </span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* Actions column (centered) */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={() => openStatusModal(supplier)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${supplier.SUP_STATUS === "A"
                                ? darkMode
                                  ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                                : darkMode
                                  ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                              {supplier.SUP_STATUS === "A"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredSuppliers.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiTruck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        No suppliers found
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

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="relative">
              {/* Modal Header */}

              <div
                className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${darkMode ? "bg-amber-900/30" : "bg-amber-100"
                      }`}
                  >
                    <FiPackage className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold">Add New Supplier</h2>
                </div>
                <button
                  onClick={closeModal}
                  className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={handleSave}
                className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter supplier name"
                    value={currentSupplier.P_SUPNAME}
                    onChange={(e) =>
                      setCurrentSupplier({
                        ...currentSupplier,
                        P_SUPNAME: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter contact person"
                    value={currentSupplier.P_CONPERSON}
                    onChange={(e) =>
                      setCurrentSupplier({
                        ...currentSupplier,
                        P_CONPERSON: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">Email *</label>
                  <input
                    type="text"
                    placeholder="Enter supplier email"
                    value={currentSupplier.P_EMAIL}
                    onChange={(e) =>
                      setCurrentSupplier({
                        ...currentSupplier,
                        P_EMAIL: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Phone Number *
                  </label>
                  <div className={`react-tel-input ${darkMode ? 'dark' : ''}`}>
                    <PhoneInput
                      country={"lk"}
                      value={currentSupplier.P_PHONENO}
                      onChange={(phone) =>
                        setCurrentSupplier({ ...currentSupplier, P_PHONENO: phone })
                      }
                      containerClass="w-full"
                      inputStyle={{
                        backgroundColor: darkMode ? "#374151" : "#f9fafb",
                        color: darkMode ? "#ffffff" : "#111827",
                        border: darkMode ? "2px solid #4B5563" : "2px solid #E5E7EB",
                        borderRadius: "0.5rem",
                        height: "40px",
                        width: "315px",
                        paddingLeft: "3.5rem"
                      }}
                      buttonStyle={{
                        backgroundColor: darkMode ? "#374151" : "#f9fafb",
                        border: darkMode ? "2px solid #4B5563" : "2px solid #E5E7EB",
                        borderRight: "0",
                        borderRadius: "0.5rem",
                        color: darkMode ? "#ffffff" : "#111827"
                      }}
                      dropdownStyle={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#ffffff" : "#111827"
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-medium">Address *</label>
                  <input
                    type="text"
                    placeholder="Enter supplier address"
                    value={currentSupplier.P_ADDRESS}
                    onChange={(e) =>
                      setCurrentSupplier({
                        ...currentSupplier,
                        P_ADDRESS: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">Country *</label>
                  <input
                    type="text"
                    ref={counrtyInputRef}
                    placeholder="Enter supplier country"
                    value={currentSupplier.P_COUNTRY}
                    onFocus={() => setShowCountrySuggestions(true)}
                    onChange={(e) =>
                      setCurrentSupplier({
                        ...currentSupplier,
                        P_COUNTRY: capitalizeWords(e.target.value),
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    required
                  />
                  {showCountrySuggestions && (
                    <ul
                      ref={counrtyRef}
                      className="absolute z-10 mt-1 w-72 bg-white dark:bg-gray-700  rounded-lg shadow-lg max-h-24 overflow-y-auto"
                    >
                      {countrySuggestions.length > 0 &&
                        currentSupplier.P_COUNTRY !== "" ? (
                        countrySuggestions.map((country, index) => (
                          <li
                            key={index}
                            onClick={() =>
                              handleCountrySuggestionClick(country.name)
                            }
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                          >
                            {country.name}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          not found!
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium">City *</label>
                  <input
                    type="text"
                    placeholder="Enter supplier city"
                    value={currentSupplier.P_CITY}
                    onFocus={() => setShowCitySuggestions(true)}
                    onChange={(e) =>
                      setCurrentSupplier({
                        ...currentSupplier,
                        P_CITY: capitalizeWords(e.target.value),
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    required
                  />
                  {showCitySuggestions && (
                    <ul
                      ref={cityRef}
                      className="absolute z-10 mt-1 w-72 bg-white dark:bg-gray-700  rounded-lg shadow-lg max-h-24 overflow-y-auto"
                    >
                      {citySuggestions.length > 0 &&
                        currentSupplier.P_CITY !== "" ? (
                        citySuggestions.map((city, index) => (
                          <li
                            key={index}
                            onClick={() => handleCitySuggestionClick(city.name)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                          >
                            {city.name}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          not found!
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-medium">Remarks</label>
                  <input
                    type="text"
                    placeholder="Enter supplier remarks"
                    value={currentSupplier.P_REMARKS}
                    onChange={(e) =>
                      setCurrentSupplier({
                        ...currentSupplier,
                        P_REMARKS: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                {/* Modal Footer */}
                <div className="md:col-span-2 flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-white text-gray-700 border-gray-300"
                      } border`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                  >
                    Create Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {isStatusModalOpen && supplierToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${supplierToUpdate.SUP_STATUS === "A"
                    ? darkMode
                      ? "bg-red-900/30"
                      : "bg-red-100"
                    : darkMode
                      ? "bg-green-900/30"
                      : "bg-green-100"
                    }`}
                >
                  {supplierToUpdate.SUP_STATUS === "A" ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {supplierToUpdate.SUP_STATUS === "A"
                    ? "Deactivate Supplier"
                    : "Activate Supplier"}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to{" "}
                  {supplierToUpdate.SUP_STATUS === "A"
                    ? "deactivate"
                    : "activate"}{" "}
                  supplier <strong>{supplierToUpdate.SUP_NAME}</strong>?
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
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${supplierToUpdate.SUP_STATUS === "A"
                    ? "bg-red-600"
                    : "bg-green-600"
                    }`}
                >
                  {supplierToUpdate.SUP_STATUS === "A"
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
};

export default SupplierAccessPage;
