import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiSearch,
  FiEdit3,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiBox,
  FiUserCheck,
  FiUserX,
  FiXCircle,
} from "react-icons/fi";
import { openModal } from "../../../actions/modalActions.js";
import {
  listInventoryProducts,
  listInventoryProductsById,
  listInventoryProductsByStatus,
  listActiveProducts,
  listInactiveProducts,
  updateProductStatus,
} from "../../../actions/Inventory/inventoryProductActions.js";
import {
  listProductDetails,
  listActiveProductDetails,
  fetchActiveProductDetails,
} from "../../../actions/Inventory/inventoryProductDetailActions.js";
import Breadcrumb from "../../common/Breadcrumb";
import SubCategoryAddModal from "../../Inventory/modals/ProductSubadd.js";

export default function InventoryTable() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [detailSearchTerm, setDetailSearchTerm] = useState("");
  const [detailFilter, setDetailFilter] = useState("active");
  const [activeFilter, setActiveFilter] = useState("active");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState(null);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const inventoryProducts =
    useSelector((state) => state.inventoryProducts.inventoryProducts) || [];
  const loading = useSelector((state) => state.inventoryProducts.loading);
  const error = useSelector((state) => state.inventoryProducts.error);

  const formatWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const removeNonDigits = (value) => value.replace(/\D/g, "");


  const activeProductDetails =
    useSelector((state) => state.activeProductDetails.activeProductDetails) ||
    [];

  const {
    details = [],
    loading: detailsLoading,
    error: detailsError,
  } = useSelector((state) => state.productDetails);


  const {
    productDeatilsByIdData = [],
    loadingById,
    errorById,
  } = useSelector((state) => state.productDeatilsById);

  const filteredDeatilProducts = productDeatilsByIdData.filter((p) => {
    const term = detailSearchTerm.toLowerCase();

    const matchesDetailSearch =
      (p.PBINLOCATION?.toString().toLowerCase().includes(term)) ||
      (p.PWHCODE?.toString().toLowerCase().includes(term)) ||
      (p.PPDES?.toString().toLowerCase().includes(term)) ||
      (p.PPROCODE?.toString().toLowerCase().includes(term));

    if (detailFilter === "active")
      return matchesDetailSearch && p.PSTATUS === "A";
    if (detailFilter === "inactive")
      return matchesDetailSearch && p.PSTATUS !== "A";

    return matchesDetailSearch;
  });



  useEffect(() => {

    dispatch(listInventoryProductsByStatus("A"));
    dispatch(listActiveProductDetails());
  }, [dispatch]);

  const state = useSelector((state) => state);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };


  const filteredProducts = inventoryProducts.filter((p) => {
    const matchesSearch =
      p.PC_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.PC_SKU?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.PC_DEC?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "active") return matchesSearch && p.PC_Status === "A";
    if (activeFilter === "inactive")
      return matchesSearch && p.PC_Status !== "A";
    return matchesSearch;
  });


  const filteredDetails = (Array.isArray(details) ? details : []).filter(
    (d) => {

      const matchesProductCode =
        !selectedProductCode || d.PPROCODE == selectedProductCode;

      const matchesSearch =
        d.PWHCODE?.toLowerCase().includes(detailSearchTerm.toLowerCase()) ||
        d.PPROCODE?.toLowerCase().includes(detailSearchTerm.toLowerCase()) ||
        d.PBINLOCATION?.toLowerCase().includes(
          detailSearchTerm.toLowerCase()
        ) ||
        d.PTYPE?.toLowerCase().includes(detailSearchTerm.toLowerCase());

      const matchesStatus =
        detailFilter === "active"
          ? d.PSTATUS === "A"
          : detailFilter === "inactive"
            ? d.PSTATUS !== "A"
            : true;


      return matchesProductCode && matchesSearch && matchesStatus;
    }
  );

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

      <Breadcrumb current="Inventory / Product / Product Catalogue " />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiBox className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Product Catalogue
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage Products and Product details
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products by code, SKU or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {/* Active Button */}
            <button
              onClick={() => {
                dispatch(listInventoryProductsByStatus("A"));
                setActiveFilter("active");
              }}
              className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === "active"
                ? "bg-green-600 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              Active
            </button>

            {/* Inactive Button */}
            <button
              onClick={() => {
                dispatch(listInventoryProductsByStatus("I"));
                setActiveFilter("inactive");
              }}
              className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === "inactive"
                ? "bg-red-600 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              Inactive
            </button>
            {/* <button
              onClick={() => {
                setActiveFilter("all");
                setSelectedProductCode(null);
              }}
              className={`px-2 py-1.5 text-xs rounded-lg font-medium ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              All
            </button> */}
          </div>
          {/* <button
            onClick={() => setIsSubCategoryModalOpen(true)}  
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Sub Category   
          </button> */}
          <button
            onClick={() => dispatch(openModal("ADD_INVENTORY_PRODUCT"))}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </button>

        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div
          className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
            }`}
        >
          {/* Products Section */}
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-0">
            Product Catalogue
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-48">
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
                  Loading products...
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
            <div className="h-48 flex flex-col gap-1 mb-4">
              <div
                className={`rounded-xl border overflow-hidden h-60 ${darkMode
                  ? "bg-gray-700/30 border-gray-600"
                  : "bg-gray-50 border-gray-200"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto h-48">
                    <table className="w-full">
                      <thead
                        className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                      >
                        <tr>
                          <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                            Product Code
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                            SKU
                          </th>

                          <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                            Product Name
                          </th>
                          <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                            Category
                          </th>
                          <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
                            Brand
                          </th>
                          <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden lg:table-cell">
                            Unit
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
                        {/* {filteredProducts.map((product) => (
                          <tr
                            key={product.PC_Code}
                            onClick={() => { 
                              setSelectedProductCode(product.PC_Code);
                              dispatch(
                                fetchActiveProductDetails(product.PC_Code)
                              );
                            }} 
                            className={`transition-colors duration-150 cursor-pointer ${selectedProductCode === product.PC_Code
                                ? darkMode
                                  ? "bg-blue-900/50"
                                  : "bg-blue-100"
                                : darkMode
                                  ? "hover:bg-gray-700/50"
                                  : "hover:bg-gray-100"
                              }`}
                          >
                            <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                              {product.PC_Code}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-left text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {product.PC_SKU}
                            </td>
                            
                            <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                              {product.PC_DEC}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                              {product.PC_MCNAME} / {product.PC_SCNAME}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                              {product.PC_BRNAME}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden lg:table-cell">
                              {product.PC_UNIT}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-center">
                              {getStatusBadge(product.PC_Status)}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  const newStatus =
                                    product.PC_Status === "A" ? "I" : "A";
                                  dispatch(
                                    updateProductStatus(
                                      product.PC_Code,
                                      newStatus
                                    )
                                  );
                                }}
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${product.PC_Status === "A"
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                              >
                                {product.PC_Status === "A"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))} */}

                        {[...filteredProducts]
                          .sort((a, b) => b.PC_Code.localeCompare(a.PC_Code)) // descending by PC_Code
                          .map((product) => (
                            <tr
                              key={product.PC_Code}
                              onClick={() => {
                                setSelectedProductCode(product.PC_Code);
                                dispatch(fetchActiveProductDetails(product.PC_Code));
                              }}
                              className={`cursor-pointer transition-colors ${selectedProductCode === product.PC_Code
                                ? darkMode
                                  ? "bg-blue-900/50"
                                  : "bg-blue-100"
                                : darkMode
                                  ? "hover:bg-gray-700/50"
                                  : "hover:bg-gray-100"
                                }`}
                            >
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                                {product.PC_Code}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {product.PC_SKU}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
                                {product.PC_DEC}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                                {product.PC_MCNAME} / {product.PC_SCNAME}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
                                {product.PC_BRNAME}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden lg:table-cell">
                                {product.PC_UNIT}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center">
                                {getStatusBadge(product.PC_Status)}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center flex gap-2 justify-center">
                                {/* update */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      openModal("UPDATE_PRODUCT", { product })
                                    );
                                  }}
                                  className="px-2 py-1 rounded-lg text-xs font-medium transition-all bg-orange-100 text-orange-700 hover:bg-orange-200"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    //dispatch(
                                    //openModal("UPDATE_PRODUCT", {
                                    //productId: product.PC_Code,
                                    const newStatus =
                                      product.PC_Status === "A" ? "I" : "A";
                                    dispatch(
                                      updateProductStatus(
                                        product.PC_Code,
                                        newStatus
                                      )
                                    );
                                  }}
                                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${product.PC_Status === "A"
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                    }`}
                                >
                                  {/* Edit */}
                                  {product.PC_Status === "A"
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              </td>
                            </tr>
                          ))}

                      </tbody>
                    </table>
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 h-full flex items-center justify-center">
                      <div>
                        <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p
                          className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          No products found
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
            </div>
          )}



          {/* Details Section */}
          {true && ( //  Conditionally render based on selectedProductCode
            <>
              <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2 items-center">
                {/* H2 heading aligned properly */}
                <h2 className="text-base font-bold text-gray-800 dark:text-white md:mr-4 whitespace-nowrap">
                  Product Details
                </h2>

                <div className="relative flex-1 w-full">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products details by code, SKU or description..."
                    value={detailSearchTerm}
                    onChange={(e) => setDetailSearchTerm(e.target.value)}
                    className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {/* Active Button */}



                  <button
                    onClick={() => {
                      dispatch(listProductDetails(""));
                      setDetailFilter("active");
                    }}
                    className={`px-2 py-1.5 text-xs rounded-lg font-medium ${detailFilter === "active"
                      ? "bg-green-600 text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    Active
                  </button>



                  {/* Inactive Button */}
                  <button
                    onClick={() => {
                      dispatch(listProductDetails("I"));
                      setDetailFilter("inactive");
                    }}
                    className={`px-2 py-1.5 text-xs rounded-lg font-medium ${detailFilter === "inactive"
                      ? "bg-red-600 text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    Inactive
                  </button>

                  <button
                    onClick={() => dispatch(openModal("ADD_PRODUCT_DETAIL"))}
                    className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Product Details
                  </button>
                </div>

              </div>

              {loadingById ? (
                <div className="flex items-center justify-center py-8 rounded-xl h-36">
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
                      Loading details...
                    </p>
                  </div>
                </div>
              ) : errorById ? (
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
                      {errorById}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-xl border overflow-hidden max-h-36 ${darkMode
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <div className="overflow-x-auto h-full">
                    {/*  Reduced from max-h-96 to max-h-64 */}
                    <div className="max-h-36 overflow-y-auto">
                      <table className="w-full">
                        <thead
                          className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                        >
                          <tr>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Warehouse
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                              Product Code
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
                              Product Name
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden sm:table-cell">
                              Bin Location
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden md:table-cell">
                              Reorder Level
                            </th>
                            <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider hidden lg:table-cell">
                              Min Stock
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider hidden xl:table-cell">
                              Type
                            </th>
                            {/* <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider">
                              Balance Quantity
                            </th>
                            <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider">
                              Balance Value
                            </th> */}
                            <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                              Status
                            </th>
                            {/* <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
                              Actions
                            </th> */}
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                        >
                          {filteredDeatilProducts.map((detail) => (
                            <tr
                              key={detail.PPROCODE}
                              className={`transition-colors duration-150 ${darkMode
                                ? "hover:bg-gray-700/50"
                                : "hover:bg-gray-100"
                                }`}
                            >
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
                                {detail.PWHCODE}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden sm:table-cell">
                                {detail.PPROCODE}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden sm:table-cell">
                                {detail.PPDES}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden sm:table-cell">
                                {detail.PBINLOCATION}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden md:table-cell">
                                {formatWithCommas(detail.PREOLEVEL)}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-right text-xs hidden lg:table-cell">
                                {formatWithCommas(detail.PMINSTOCK)}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center text-xs hidden xl:table-cell">
                                {detail.PTYPE === "E"
                                  ? "FEFO"
                                  : detail.PTYPE === "F"
                                    ? "FIFO"
                                    : detail.P_TYPE
                                }
                              </td>

                              {/* <td className="px-2 py-2 whitespace-nowrap text-right text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {formatWithCommas(detail.PBALQTY)}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-right text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {formatWithCommas(detail.PBALVALUE)}
                              </td> */}
                              <td className="px-2 py-2 whitespace-nowrap text-center">
                                {getStatusBadge(detail.PSTATUS)}
                              </td>
                              <td className="px-2 py-2 whitespace-nowrap text-center">
                                {/* <button
                                  onClick={() =>
                                    dispatch(
                                      openModal("UPDATE_PRODUCT_DETAIL", {
                                        detailId: detail.PWHCODE,
                                      })
                                    )
                                  }
                                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                                    darkMode
                                      ? "bg-orange-900/30 text-orange-400 hover:bg-orange-800/50"
                                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                  }`}
                                >
                                  Edit
                                </button> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredDeatilProducts.length === 0 && (
                      <div className="text-center py-8 h-full flex items-center justify-center">
                        <div>
                          <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p
                            className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                          >
                            No details found for this product
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
            </>
          )}
        </div>
      </div>
      <SubCategoryAddModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
      />
    </div>
  );
}
