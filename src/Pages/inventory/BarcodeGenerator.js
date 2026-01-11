import React, { useState, useEffect, useRef } from "react";
import {
  FiTag,
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
} from "react-icons/fi";
import Barcode from "react-barcode";
import { useSelector, useDispatch } from "react-redux";

import { listProductDetails } from "../../actions/Inventory/inventoryProductDetailActions";
import { listInventoryProductsByStatus } from "../../actions/Inventory/inventoryProductActions";

import Breadcrumb from "../../components/common/Breadcrumb";

<Breadcrumb current="Inventory / Store Transaction / Goods Received Note " />;

{

}
<div className="mt-2 mb-3 md:mb-5 ml-1"></div>;

const BarCodeGenarationPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    sku: "",
    productName: "",
    barcode: "",
    quntity: 1,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [productSuggestion, setProductSuggestion] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const state = useSelector((state) => state);

  const removeNonDigits = (value) => value.replace(/\D/g, "");

  const inventoryProducts =
    useSelector((state) => state.inventoryProducts.inventoryProducts) || [];



  const skuSuggestions = inventoryProducts.filter((item) =>
    formData.sku === "" ? true : item.PC_SKU.startsWith(formData.sku)
  );

  const productSuggestions = inventoryProducts.filter((item) =>
    formData.productName === ""
      ? true
      : (item.PC_DEC || "")
        .toLowerCase()
        .includes(formData.productName.toLowerCase())
  );

  useEffect(() => {
    dispatch(listInventoryProductsByStatus("A"));
  }, []);

  const suggestionRef = useRef(null);
  const productRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      if (productRef.current && !productRef.current.contains(event.target)) {
        setProductSuggestion(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrint = () => {
    const { sku, productName, barcode, quntity } = formData;

    if (!sku || !productName || !barcode) {
      showAlertMessage(
        `Please fill all the fields before printing the barcode.`,
        "error"
      );
      return;
    }

    if (quntity < 1) {
      showAlertMessage(`Quantity must be at least 1.`, "error");
      setFormData({ ...formData, quntity: 1 });
      return;
    }
    showAlertMessage(
      `Printing barcode: ${barcode} | ${productName} | Qty: ${quntity}`,
      "success"
    );
  };

  const handleClear = () => {
    setFormData({
      sku: "",
      productName: "",
      barcode: "",
      quntity: 1,
    });
  };

  useEffect(() => {
    handleSKUClear();
  }, [formData.sku]);

  useEffect(() => {
    const matchedProduct = inventoryProducts.find(
      (item) => item.PC_SKU === formData.sku
    );
    if (matchedProduct) {
      setFormData({
        sku: matchedProduct.PC_SKU,
        productName: matchedProduct.PC_DEC,
        barcode: matchedProduct.PC_BARCODE,
        quntity: formData.quntity,
      });
      setShowSuggestions(false);
    }
  }, [formData.sku, inventoryProducts]);


  const handleSuggestionClick = (item) => {
    setFormData({
      sku: item.PC_SKU,
      productName: item.PC_DEC,
      barcode: item.PC_BARCODE,
      quntity: formData.quntity,
    });
    setShowSuggestions(false);
  };

  const handleSKUClear = () => {
    if (formData.sku === "") {
      setFormData({
        sku: "",
        productName: "",
        barcode: "",
        quntity: 1,
      });
      return;
    }
  };

  const handleProductSuggestionClick = (item) => {
    setFormData({
      sku: item.PC_SKU,
      productName: item.PC_DEC,
      barcode: item.PC_SKU,
      quntity: formData.quntity,
    });
    setProductSuggestion(false);
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

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-0 md:p-0">
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

      <div className="max-w-7xl mx-auto ">
        {/* Card */}
        <div className="pb-56 bg-white m-0 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
          <div className="pl-1 mb-3.5 pt-1">
            <Breadcrumb current="Inventory / Bar Code Generation " />
          </div>

          {/* Header */}
          <div className="mt-0 mb-1 md:mb-1"></div>
          <div className="p-1 dark:border-gray-700">
            <div className="flex items-center justify-between ml-0 mb-1 md:mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg shadow">
                  <FiTag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Bar Code Generation
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Manage your bar code generation here.
                  </p>
                </div>
              </div>
            </div>

            {/* Form + Preview */}
            <div className="flex justify-center items-center py-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-4xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-start gap-6 py-6 pl-4">
                  {/* Inputs */}
                  <div className="flex-1 flex flex-col gap-4 w-full max-w-md ">
                    {/* SKU */}
                    <div className="relative" ref={suggestionRef}>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5 dark:text-gray-200">
                        SKU Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter SKU number"
                        value={formData.sku}
                        onChange={(e) => {
                          setFormData({ ...formData, sku: e.target.value });
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="border px-2 py-1 text-sm rounded w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                      />

                      {/* Suggestions Dropdown */}
                      {showSuggestions && skuSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto text-sm">
                          {skuSuggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleSuggestionClick(item)}
                              className="px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                            >
                              {item.PC_SKU} — {item.PC_DEC}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Product Name */}
                    <div className="relative" ref={productRef}>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5 dark:text-gray-200">
                        Product Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            productName: e.target.value,
                          });
                        }}
                        value={formData.productName}
                        readOnly
                        className="border px-2 py-1 text-sm rounded w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                      />

                      {/* Suggestions Dropdown */}
                      {productSuggestion && productSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto text-sm">
                          {productSuggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleProductSuggestionClick(item)}
                              className="px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                            >
                              {item.PC_DEC}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Barcode */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5 dark:text-gray-200">
                        Bar Code
                      </label>
                      <input
                        type="text"
                        placeholder="Bar Code number"
                        value={formData.barcode}
                        readOnly={true}
                        className="border px-2 py-1 text-sm rounded w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5 dark:text-gray-200">
                        Quantity
                      </label>
                      <input
                        type="text"
                        step="1"
                        min="1"
                        placeholder="Enter quantity"
                        value={formData.quntity}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setFormData({ ...formData, quntity: value });
                        }}
                        className="border px-2 py-1 text-sm rounded w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-row w-64 ">
                      <button
                        onClick={handlePrint}
                        className="w-full mr-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white p-2 rounded-md text-sm font-semibold transition-all duration-200 mt-2 shadow-md hover:shadow-lg"
                      >
                        Print Barcode
                      </button>

                      <button
                        onClick={handleClear}
                        className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white p-2 rounded-md text-sm font-semibold transition-all duration-200 mt-2 shadow-md hover:shadow-lg"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Preview - Moved closer to inputs */}
                  <div className="w-full md:w-full h-80 mr-8 mt-0 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 p-2">
                    {formData.barcode ? (
                      <Barcode
                        value={formData.barcode}
                        text={`${formData.barcode} | ${formData.productName}`}
                        format="CODE128"
                        height={80}
                        width={2}
                        displayValue={true}
                        background="transparent"
                      />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-300 text-xs text-center">
                        Barcode Preview
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarCodeGenarationPage;
