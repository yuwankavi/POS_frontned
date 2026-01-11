import React, { useState, useEffect, useRef } from "react";
import { FiTag } from "react-icons/fi";
import Barcode from "react-barcode";
import { useSelector, useDispatch } from "react-redux";
import {
  listProductDetails,
} from "../../actions/Inventory/inventoryProductDetailActions";
import {
  listInventoryProductsByStatus,
} from "../../actions/Inventory/inventoryProductActions";

const BarCodeGenarationPage = () => {
  const dispatch = useDispatch();

  const inventoryProducts =
    useSelector((state) => state.inventoryProducts.inventoryProducts) || [];


  useEffect(() => {
    dispatch(listProductDetails());
    dispatch(listInventoryProductsByStatus("A"));
  }, []);

  const [formData, setFormData] = useState({
    sku: "",
    productName: "",
    barcode: "",
    quntity: 1,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [productSuggestion, setProductSuggestion] = useState(false);

  const state = useSelector((state) => state);


  const skuSuggestions = inventoryProducts.filter((item) =>
    formData.sku === "" ? true : item.PC_SKU.startsWith(formData.sku)
  );

  const productSuggestions = inventoryProducts.filter((item) =>
    formData.productName === ""
      ? true
      : item.PC_DEC.toLowerCase().includes(formData.productName.toLowerCase())
  );

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
      alert("Please fill all the fields before printing the barcode.");
      return;
    }

    if (quntity < 1) {
      alert("Quantity must be at least 1.");
      setFormData({ ...formData, quntity: 1 });
      return;
    }

    alert(`Printing barcode: ${barcode} | ${productName} | Qty: ${quntity}`);
  };

  // auto-fill product when exact SKU matches
  useEffect(() => {
    const matchedProduct = inventoryProducts.find(
      (item) => item.PC_SKU === formData.sku
    );
    if (matchedProduct) {
      setFormData({
        sku: matchedProduct.PC_SKU,
        productName: matchedProduct.PC_DEC,
        barcode: matchedProduct.PC_SKU, // use SKU as barcode
        quntity: formData.quntity,
      });
      setShowSuggestions(false);
    }
  }, [formData.sku, inventoryProducts]);

  // handle click on suggestion
  const handleSuggestionClick = (item) => {
    setFormData({
      sku: item.PC_SKU,
      productName: item.PC_DEC,
      barcode: item.PC_SKU, // use SKU as barcode
      quntity: formData.quntity,
    });
    setShowSuggestions(false);
  };

  const handleProductSuggestionClick = (item) => {
    setFormData({
      sku: item.PC_SKU,
      productName: item.PC_DEC,
      barcode: item.PC_SKU, // use SKU as barcode
      quntity: formData.quntity,
    });
    setProductSuggestion(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-1 md:p-1">
      <div className="max-w-7xl mx-auto">
        {/* Card */}
        <div className="pb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
          <div className="p-3 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1 md:mb-2">
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
                <div className="flex flex-col lg:flex-row items-start gap-6 py-6">
                  {/* Inputs */}
                  <div className="flex-1 flex flex-col gap-4 w-full max-w-md relative">
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
                        className="border px-2 py-1 text-sm rounded w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                      />

                      {/* Suggestions Dropdown */}
                      {showSuggestions && skuSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto text-sm">
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
                    <div ref={productRef}>
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
                          setProductSuggestion(true);
                        }}
                        onFocus={() => setProductSuggestion(true)}
                        value={formData.productName}
                        className="border px-2 py-1 text-sm rounded w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                      />

                      {/* Suggestions Dropdown */}
                      {productSuggestion && productSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto text-sm">
                          {productSuggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleProductSuggestionClick(item)
                              }
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
                        className="border px-2 py-1 text-sm rounded w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-0.5 dark:text-gray-200">
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        placeholder="Enter quantity"
                        value={formData.quntity}
                        onChange={(e) =>
                          setFormData({ ...formData, quntity: e.target.value })
                        }
                        className="border px-2 py-1 text-sm rounded w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handlePrint}
                      className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white p-2 rounded-md text-sm font-semibold transition-all duration-200 mt-2 shadow-md hover:shadow-lg"
                    >
                      Print Barcode
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="w-64 h-40 border-2 mt-20 ml-10 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-300 p-2">
                    {formData.barcode ? (
                      <Barcode
                        value={formData.barcode}
                        text={`${formData.barcode} | ${formData.productName}`}
                        format="CODE128"
                        height={60}
                        width={2}
                        displayValue={true}
                        background="transparent"
                      />

                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs text-center">
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
