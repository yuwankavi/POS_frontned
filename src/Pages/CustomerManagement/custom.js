import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  FiCalendar,
  FiPlus,
  FiUsers,
  FiShield,
  FiTruck,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
  FiX,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiKey,
  FiCheckCircle,
  FiHome,
  FiChevronRight,
  FiPackage,
  FiAward,
  FiStar,
  FiUser,
  FiPhone,
  FiEdit,
} from "react-icons/fi";

import "react-datepicker/dist/react-datepicker.css";
import {
  getCustomerByPhoneNumber,
  listCustomers,
  addCustomer,
  updateCustomerAction,
} from "../../actions/customerAction.js";
import Breadcrumb from "../../components/common/Breadcrumb";
import PhoneInput from "react-phone-input-2";
import { DatePicker, ConfigProvider } from "antd";

const CustomerAccessPage = () => {
  const dispatch = useDispatch();
  const datePickerRef = useRef(null);

  const handleBritheDate = () => {
    datePickerRef.current.setFocus();
  };
  const state = useSelector((state) => state);

  const {
    loading,
    customers = [],
    error,
  } = useSelector((state) => state.customerList);

  const { loadingAdd, errorAdd } = useSelector((state) => state.customerAdd);
  const { darkMode } = useSelector((state) => state.ui);

  const customTheme = {
    token: {

      controlHeight: 40,
      paddingContentHorizontal: 12,


      borderRadius: 8,


      colorBgContainer: darkMode ? "#374151" : "#f9fafb",
      colorBorder: darkMode ? "#4b5563" : "#e5e7eb",
      colorText: darkMode ? "#ffffff" : "#111827",
      colorTextPlaceholder: darkMode ? "#9ca3af" : "#9ca3af",

      colorPrimary: "#d97706",
      controlOutline: "rgba(217, 119, 6, 0.2)",
      controlOutlineWidth: 2,

      controlOutline: "transparent",
      controlOutlineWidth: 0,
      controlItemBgHover: "transparent",


      motionDurationMid: "0.2s",


      fontSize: 14,


      colorBgElevated: darkMode ? "#1f2937" : "#ffffff",
      colorBgLayout: darkMode ? "#111827" : "#f3f4f6",
      colorTextHeading: darkMode ? "#f3f4f6" : "#374151",
      colorSplit: darkMode ? "#374151" : "#e5e7eb",

      colorIcon: darkMode ? "#d97706" : "#d97706",
      colorIconHover: darkMode ? "#f59e0b" : "#b45309",
      colorText: darkMode ? "#ffffff" : "#111827",
      colorTextHeading: darkMode ? "#ffffff" : "#374151",
    },


    components: {
      DatePicker: {
        activeBorderColor: "#d97706",
        hoverBorderColor: "#f59e0b",
        activeShadow: "0 0 0 2px rgba(217, 119, 6, 0.2)",


        cellActiveWithRangeBg: darkMode
          ? "rgba(217, 119, 6, 0.3)"
          : "rgba(217, 119, 6, 0.1)",
        cellHoverWithRangeBg: darkMode
          ? "rgba(217, 119, 6, 0.2)"
          : "rgba(217, 119, 6, 0.05)",
        cellRangeBorderColor: "#d97706",


        colorBgContainerDisabled: darkMode ? "#374151" : "#f9fafb",
        colorIcon: darkMode ? "#d97706" : "#d97706",
        colorIconHover: darkMode ? "#f59e0b" : "#b45309",
      },
      Calendar: {

        colorBgContainer: darkMode ? "#1f2937" : "#ffffff",
        colorBgLayout: darkMode ? "#111827" : "#f3f4f6",
        colorText: darkMode ? "#f3f4f6" : "#374151",
        colorTextHeading: darkMode ? "#f3f4f6" : "#374151",
        colorSplit: darkMode ? "#374151" : "#e5e7eb",
        colorPrimary: "#d97706",
        colorPrimaryHover: "#f59e0b",


        cellBg: darkMode ? "#1f2937" : "#ffffff",
        cellHoverBg: darkMode
          ? "rgba(217, 119, 6, 0.2)"
          : "rgba(217, 119, 6, 0.1)",
        cellActiveBg: darkMode
          ? "rgba(217, 119, 6, 0.3)"
          : "rgba(217, 119, 6, 0.2)",
        cellRangeBorderColor: "#d97706",

        colorBgContainer: darkMode ? "#1f2937" : "#ffffff",
        colorPrimary: "#d97706",
      },
    },
  };
  const removeHoverStyles = `

.ant-picker {
  border-color: ${darkMode ? "#4b5563" : "#e5e7eb"} !important;
  box-shadow: none !important;
}

.ant-picker:hover {
  border-color: ${darkMode ? "#4b5563" : "#e5e7eb"} !important;
  box-shadow: none !important;
  outline: none !important;
}
.ant-picker-cell-disabled .ant-picker-cell-inner {
    color: ${darkMode ? "#6b7280" : "#9ca3af"} !important;
    background: ${darkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.1)"
    } !important;
    cursor: not-allowed;
  }
.ant-picker:focus,
.ant-picker:focus-within,
.ant-picker.ant-picker-focused {
  border-color: #d97706 !important;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2) !important;
  outline: none !important;
}


.ant-picker-cell-in-view:hover {
  background-color: ${darkMode ? "rgba(217, 119, 6, 0.2)" : "rgba(217, 119, 6, 0.1)"
    } !important;
}


.ant-picker-cell-selected,
.ant-picker-cell-range-start,
.ant-picker-cell-range-end,
.ant-picker-cell-range-hover-start,
.ant-picker-cell-range-hover-end {
  background-color: ${darkMode ? "rgba(217, 119, 6, 0.3)" : "rgba(217, 119, 6, 0.2)"
    } !important;
  color: ${darkMode ? "#ffffff" : "#111827"} !important;
}


.ant-picker-cell-disabled:hover {
  background-color: transparent !important;
  cursor: not-allowed;
}
`;

  const iconStyles = `

.ant-picker .ant-picker-suffix svg {
  color: ${darkMode ? "#d97706" : "#d97706"} !important;
  fill: ${darkMode ? "#d97706" : "#d97706"} !important;
}

.ant-picker:hover .ant-picker-suffix svg {
  color: ${darkMode ? "#f59e0b" : "#b45309"} !important;
  fill: ${darkMode ? "#f59e0b" : "#b45309"} !important;
}
`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    p_name: "",
    p_phone: "",
    p_email: "",
    p_address: "",
    p_dob: null,
    p_points_balance: "",
    p_tier_level: "User",
  });
  const [updateCustomer, setUpdateCustomer] = useState({
    phoneNumber: "",
    name: "",
    email: "",
    address: "",
    dob: "",
    pointsBalance: "",
    tierLevel: "",
  });

  const [customerToUpdate, setCustomerToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [showOdit, setShowOdit] = useState(false);

  const tireLevels = ["User", "Bronze", "Silver", "Gold", "Platinum"];

  useEffect(() => {
    dispatch(listCustomers());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const today = formatDate(new Date());
  const openModal = (
    user = {
      p_name: "",
      p_phone: "",
      p_email: "",
      p_address: "",
      p_dob: "",
      p_points_balance: "",
      p_tier_level: "User",
    }
  ) => {
    setCurrentCustomer(user);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const formatWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const removeNonDigits = (value) => value.replace(/\D/g, "");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !currentCustomer.p_name ||
      !currentCustomer.p_phone ||
      !currentCustomer.p_email ||
      !currentCustomer.p_address ||
      !currentCustomer.p_dob ||
      !currentCustomer.p_points_balance ||
      !currentCustomer.p_tier_level
    ) {
      showAlertMessage("Please fill all fields before saving.", "error");
      return;
    }
    if (currentCustomer.p_phone.slice(0, 2) === "94") {
      if (currentCustomer.p_phone.length !== 11) {
        showAlertMessage("Invalid phone number format.", "error");
        return;
      }
    }

    if (!isValidEmail(currentCustomer.p_email)) {
      showAlertMessage("Invalid email format.", "error");
      return;
    }

    try {

      const customerWithFullPhone = {
        ...currentCustomer,
        p_phone: "+" + currentCustomer.p_phone,
      };

      await dispatch(addCustomer(customerWithFullPhone));
      closeModal();
      dispatch(listCustomers());

      showAlertMessage(
        `Customer "${currentCustomer.p_name}" created successfully!`,
        "success"
      );
    } catch (errorAdd) {

      showAlertMessage("Failed to create customer Please try again.", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !updateCustomer.name ||
      !updateCustomer.phoneNumber ||
      !updateCustomer.email ||
      !updateCustomer.address ||
      !updateCustomer.dob ||
      !updateCustomer.pointsBalance ||
      !updateCustomer.tierLevel
    ) {
      showAlertMessage("Please fill all fields before updateing.", "error");
      return;
    }

    if (!isValidEmail(updateCustomer.email)) {
      showAlertMessage("Invalid email format.", "error");
      return;
    }

    try {


      await dispatch(updateCustomerAction(updateCustomer));

      setIsUpdateModalOpen(false);
      dispatch(listCustomers());

      showAlertMessage(
        `Customer "${updateCustomer.name}" updated successfully!`,
        "success"
      );
    } catch (error) {

      showAlertMessage("Failed to update customer Please try again.", "error");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.CUS_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // customer.CUS_PHONE.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // customer.CUS_DOB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // customer.CUS_ADDRESS.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // customer.CUS_TIERLEVEL.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // customer.CUS_PHONE.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(customer.CUS_ID).toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "all") return matchesSearch;


    return matchesSearch && customer.CUS_TIERLEVEL === activeFilter;
  });

  const formatPoints = (points) => {
    if (!points) return 0;
    return Number(points).toLocaleString();
  };

  const getTireTypeIcon = (tire) => {
    switch (tire) {
      case "Bronze":
        return <FiAward className="w-4 h-4 text-amber-700" />;
      case "Silver":
        return <FiAward className="w-4 h-4 text-gray-400" />;
      case "Gold":
        return <FiAward className="w-4 h-4 text-yellow-500" />;
      case "Platinum":
        return <FiStar className="w-4 h-4 text-blue-400" />;
      default:
        return <FiUser className="w-4 h-4" />;
    }
  };

  const getTireType = (tire) => {
    switch (tire) {
      case "Bronze":
        return "Bronze";
      case "Silver":
        return "Silver";
      case "Gold":
        return "Gold";
      case "Platinum":
        return "Platinum";
      default:
        return "User";
    }
  };

  const getTierBadgeColor = (tier) => {
    switch (tier) {
      case "Bronze":
        return "bg-amber-200 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Silver":
        return "bg-gray-200 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "Gold":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Platinum":
        return "bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getBalanceBadgeColor = (balance) => {
    if (balance < 0) {
      return "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    } else if (balance > 0) {
      return "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
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
          <FiKey className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      case "info":
        return <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <FiUsers className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div
      className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}
    >
      {/* Alert Message */}
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

      <Breadcrumb current="Customer Management" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-yellow-600 to-orange-400 rounded-lg shadow">
              <FiUsers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Customer Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage customers
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-800 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" /> Add Customer
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
                  Total Customers
                </p>
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-600">
                  {customers.length}
                </p>
              </div>
              <FiUsers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
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
                  Bronze Tier
                </p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {customers.filter((c) => c.CUS_TIERLEVEL === "Bronze").length}
                </p>
              </div>
              <FiAward className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
                  Silver Tier
                </p>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {customers.filter((c) => c.CUS_TIERLEVEL === "Silver").length}
                </p>
              </div>
              <FiAward className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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
                  Gold Tier
                </p>
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  {customers.filter((c) => c.CUS_TIERLEVEL === "Gold").length}
                </p>
              </div>
              <FiAward className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {["all", "Bronze", "Silver", "Gold", "Platinum"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === f
                    ? "bg-yellow-600 text-white"
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
                    className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-yellow-600" : "border-purple-200"
                      }`}
                  ></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Loading customers...
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
                {/*@Shan CHanged here*/}
                <div className="max-h-80 overflow-y-60">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          ID
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                          Customer
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden sm:table-cell">
                          Phone
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                          Email
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
                          Address
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Points
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Tier
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                        }`}
                    >
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.CUS_ID}
                          className={`transition-colors duration-150 ${darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          {/* Customer column */}
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden sm:table-cell">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              {customer.CUS_ID}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-left">
                            <div className="flex items-center gap-2">
                              {/* <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {customer.CUS_NAME.charAt(0).toUpperCase()}
                              </div> */}
                              <div>
                                <div className="text-xs font-medium">
                                  {customer.CUS_NAME}
                                </div>
                                {/* <div className="text-xs hidden sm:block">
                                  ID: {customer.CUS_ID}
                                </div> */}
                              </div>
                            </div>
                          </td>



                          {/* Phone column - Hidden on mobile */}
                          <td className="px-2 py-2 whitespace-nowrap text-center hidden sm:table-cell">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              {customer.CUS_PHONE}
                            </span>
                          </td>

                          {/* Email column - Hidden on medium screens */}
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden md:table-cell">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              {customer.CUS_EMAIL}
                            </span>
                          </td>

                          {/* Address column - Hidden on large screens */}
                          <td className="px-2 py-2 whitespace-nowrap text-left hidden lg:table-cell">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                            >
                              {customer.CUS_ADDRESS}
                            </span>
                          </td>

                          {/* Points column */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBalanceBadgeColor(
                                customer.CUS_POINTSBALANCE
                              )}`}
                            >
                              {formatPoints(customer.CUS_POINTSBALANCE)}
                            </span>
                          </td>

                          {/* Tier column */}
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(
                                customer.CUS_TIERLEVEL
                              )}`}
                            >
                              {getTireTypeIcon(customer.CUS_TIERLEVEL)}
                              <span className="hidden xs:inline">
                                {getTireType(customer.CUS_TIERLEVEL)}
                              </span>
                            </span>
                          </td>

                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium `}
                            >
                              <button
                                className="bg-yellow-200 dark:bg-yellow-500 dark:hover:bg-yellow-600 hover:bg-yellow-300 p-1 rounded-lg px-2"
                                onClick={() => {
                                  setIsUpdateModalOpen(true);
                                  setUpdateCustomer({
                                    phoneNumber: customer.CUS_PHONE,
                                    name: customer.CUS_NAME,
                                    email: customer.CUS_EMAIL,
                                    address: customer.CUS_ADDRESS,
                                    dob: customer.CUS_DOB,
                                    pointsBalance: customer.CUS_POINTSBALANCE,
                                    tierLevel: customer.CUS_TIERLEVEL,
                                  });
                                }}
                              >
                                Edit
                              </button>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        No customers found
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

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
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
                    className={`p-2 rounded-lg ${darkMode ? "bg-yellow-900/30" : "bg-yellow-100"
                      }`}
                  >
                    <FiUserPlus className="w-4 h-4 text-yellow-600 dark:text-yellow-600" />
                  </div>
                  <h2 className="text-lg font-bold">Add New Customer</h2>
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
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={currentCustomer.p_name}
                    onChange={(e) => {
                      setCurrentCustomer({
                        ...currentCustomer,
                        p_name: e.target.value,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Contact Number (Eg:- 94 7xxxxxxxx)
                  </label>
                  <div className={`react-tel-input ${darkMode ? "dark" : ""}`}>
                    <PhoneInput
                      country={"lk"}
                      value={currentCustomer.p_phone}
                      onChange={(phone) =>
                        setCurrentCustomer({
                          ...currentCustomer,
                          p_phone: phone.replace(/\D/g, ""),
                        })
                      }
                      containerClass="w-full"
                      inputStyle={{
                        backgroundColor: darkMode ? "#374151" : "#f9fafb",
                        color: darkMode ? "#ffffff" : "#111827",
                        border: darkMode
                          ? "2px solid #4B5563"
                          : "2px solid #E5E7EB",
                        borderRadius: "0.5rem",
                        height: "40px",
                        width: "415px",
                        paddingLeft: "3.5rem",
                      }}
                      buttonStyle={{
                        backgroundColor: darkMode ? "#374151" : "#f9fafb",
                        border: darkMode
                          ? "2px solid #4B5563"
                          : "2px solid #E5E7EB",
                        borderRight: "0",
                        borderRadius: "0.5rem",
                        color: darkMode ? "#ffffff" : "#111827",
                      }}
                      dropdownStyle={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        color: darkMode ? "#ffffff" : "#111827",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter customer email"
                    value={currentCustomer.p_email}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        p_email: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    value={currentCustomer.p_address}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        p_address: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    maxLength="255"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Date of Birth
                  </label>

                  <style>{removeHoverStyles}</style>
                  <style>{iconStyles}</style>
                  <ConfigProvider theme={customTheme}>
                    <DatePicker
                      picker="date"
                      format="YYYY-MM-DD"
                      style={{ width: "100%" }}
                      placeholder="Select date"
                      value={
                        currentCustomer.p_dob
                          ? dayjs(currentCustomer.p_dob)
                          : null
                      }
                      onChange={(date, dateString) =>
                        setCurrentCustomer({
                          ...currentCustomer,
                          p_dob: dateString,
                        })
                      }
                      disabledDate={(current) => {

                        return current && current > dayjs().endOf("day");
                      }}
                    />
                  </ConfigProvider>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Balance Points
                  </label>
                  <input
                    type="text"
                    placeholder="Enter balance points"
                    value={formatWithCommas(currentCustomer.p_points_balance)}
                    onChange={(e) => {

                      const digitsOnly = removeNonDigits(e.target.value);
                      setCurrentCustomer({
                        ...currentCustomer,
                        p_points_balance: digitsOnly,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    maxLength="255"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Tier Level
                  </label>
                  <select
                    value={currentCustomer.p_tier_level}
                    onChange={(e) =>
                      setCurrentCustomer({
                        ...currentCustomer,
                        p_tier_level: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  >
                    {tireLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={`flex justify-end gap-2 p-4 rounded-b-xl ${darkMode ? "bg-gray-900/50" : "bg-gray-50"
                  }`}
              >
                <button
                  onClick={closeModal}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-800"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-slate-100"
                    } border`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  Create Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
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
                    className={`p-2 rounded-lg ${darkMode ? "bg-yellow-900/30" : "bg-yellow-100"
                      }`}
                  >
                    <FiEdit className="w-4 h-4 text-yellow-600 dark:text-yellow-600" />
                  </div>
                  <h2 className="text-lg font-bold">Update Customer</h2>
                </div>
                <button
                  onClick={() => {
                    setIsUpdateModalOpen();
                  }}
                  className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={updateCustomer.name}
                    onChange={(e) => {
                      setUpdateCustomer({
                        ...updateCustomer,
                        name: e.target.value,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter customer email"
                    value={updateCustomer.email}
                    onChange={(e) => {
                      setUpdateCustomer({
                        ...updateCustomer,
                        email: e.target.value,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    value={updateCustomer.address}
                    onChange={(e) => {
                      setUpdateCustomer({
                        ...updateCustomer,
                        address: e.target.value,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    maxLength="255"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Date of Birth
                  </label>

                  <style>{removeHoverStyles}</style>
                  <style>{iconStyles}</style>
                  <ConfigProvider theme={customTheme}>
                    <DatePicker
                      picker="date"
                      format="YYYY-MM-DD"
                      style={{ width: "100%" }}
                      placeholder="Select date"
                      value={
                        updateCustomer.dob ? dayjs(updateCustomer.dob) : null
                      }
                      onChange={(date, dateString) =>
                        setUpdateCustomer({
                          ...updateCustomer,
                          dob: dateString,
                        })
                      }
                      disabledDate={(current) => {

                        return current && current > dayjs().endOf("day");
                      }}
                    />
                  </ConfigProvider>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Balance Points
                  </label>
                  <input
                    type="text"
                    placeholder="Enter balance points"
                    value={updateCustomer.pointsBalance}
                    onChange={(e) => {
                      setUpdateCustomer({
                        ...updateCustomer,
                        pointsBalance: e.target.value,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    maxLength="255"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">
                    Tier Level
                  </label>
                  <select
                    value={updateCustomer.tierLevel}
                    onChange={(e) => {
                      setUpdateCustomer({
                        ...updateCustomer,
                        tierLevel: e.target.value,
                      });
                    }}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  >
                    {tireLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={`flex justify-end gap-2 p-4 rounded-b-xl ${darkMode ? "bg-gray-900/50" : "bg-gray-50"
                  }`}
              >
                <button
                  onClick={() => {
                    setIsUpdateModalOpen();
                  }}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-800"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-slate-100"
                    } border`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  Update Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAccessPage;
