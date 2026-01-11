import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiSettings, FiSearch } from "react-icons/fi";
import { closeModal } from "../../../actions/modalActions";
import { addAdjustment } from "../../../actions/Inventory/adjustmentActions";
import {
  listWarehouses,
  listProductsByWarehouse,
  listBatchesByProduct,
  resetProducts,
  resetBatches,
} from "../../../actions/Inventory/commonDropdownAction";

export default function AddAdjustmentModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  
  const { warehouses, loading: warehousesLoading, error: warehousesError } = useSelector((state) => state.warehouseList);
  const { products, loading: productsLoading } = useSelector((state) => state.productList);
  const { batches, loading: batchesLoading } = useSelector((state) => state.batchList);

  const [formData, setFormData] = useState({
    P_WHCODE: "",
    PRODUCT_CODE: "",
    BATCH_ID: "",
    QUANTITY: "",
    UNIT_PRICE: "",
    ADJ_TYPE: "LOSS",
    REMARK: "",
    P_BLQRTY: "",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  
  
  const [searchTerm, setSearchTerm] = useState({
    warehouse: "",
    product: "",
    batch: ""
  });
  
  const [showDropdown, setShowDropdown] = useState({
    warehouse: false,
    product: false,
    batch: false
  });

  
  useEffect(() => { 
    dispatch(listWarehouses());
  }, [dispatch]);

  
  const filteredWarehouses = warehouses?.filter(warehouse => {
    const code = warehouse.WH_Code || '';
    const name = warehouse.WH_Name || '';
    const search = searchTerm.warehouse.toLowerCase();
    return code.toLowerCase().includes(search) || name.toLowerCase().includes(search);
  }) || [];

  const filteredProducts = products?.filter(product => {
    const code = product.PPROCODE || '';
    const name = product.PPDES || '';
    const search = searchTerm.product.toLowerCase();
    return code.toLowerCase().includes(search) || name.toLowerCase().includes(search);
  }) || [];

  const filteredBatches = batches?.filter(batch => {
    const batchId = String(batch.PB_BId || '');
    const search = searchTerm.batch.toLowerCase();
    return batchId.toLowerCase().includes(search);
  }) || [];

  
  const handleWarehouseSelect = (warehouse) => {
    const warehouseCode = warehouse.WH_Code;
 
    
    setFormData({
      ...formData,
      P_WHCODE: warehouseCode,
      PRODUCT_CODE: "",
      BATCH_ID: "",
      P_BLQRTY: "",
      UNIT_PRICE: "",
    });
    setSelectedProduct(null);
    setSearchTerm(prev => ({ ...prev, warehouse: `${warehouseCode} - ${warehouse.WH_Name}`, product: "", batch: "" }));
    setShowDropdown({ warehouse: false, product: false, batch: false });
    dispatch(resetProducts());
    dispatch(resetBatches());

    if (warehouseCode) {
 
      dispatch(listProductsByWarehouse(warehouseCode));
    }
  };

  
  const handleProductSelect = (product) => {
 
    
    setFormData({
      ...formData,
      PRODUCT_CODE: product.PPROCODE,
      BATCH_ID: "",
      P_BLQRTY: product.PBALQTY || "",
      UNIT_PRICE: "",
    });
    setSelectedProduct(product);
    setSearchTerm(prev => ({ ...prev, product: `${product.PPROCODE} - ${product.PPDES}`, batch: "" }));
    setShowDropdown({ ...showDropdown, product: false, batch: false });

    if (product.PPROCODE && formData.P_WHCODE) {
 
      dispatch(listBatchesByProduct(product.PPROCODE, formData.P_WHCODE));
    }
  };


  const handleBatchSelect = (batch) => {
    const batchId = String(batch.PB_BId);

    setFormData({
      ...formData,
      BATCH_ID: batchId,
      UNIT_PRICE: batch.PB_PPrice || selectedProduct?.PBALVALUE || 0,
    });
    setSearchTerm(prev => ({ ...prev, batch: batchId }));
    setShowDropdown({ ...showDropdown, batch: false });
  };

  
  const handleSearchChange = (field, value) => {
    setSearchTerm(prev => ({ ...prev, [field]: value }));
    
    if (value) {
      setShowDropdown(prev => ({ ...prev, [field]: true }));
    }

    
    if (value === "") {
      if (field === 'warehouse') {
        setFormData(prev => ({ ...prev, P_WHCODE: "", PRODUCT_CODE: "", BATCH_ID: "" }));
        setSearchTerm({ warehouse: "", product: "", batch: "" });
      } else if (field === 'product') {
        setFormData(prev => ({ ...prev, PRODUCT_CODE: "", BATCH_ID: "" }));
        setSearchTerm(prev => ({ ...prev, product: "", batch: "" }));
      } else if (field === 'batch') {
        setFormData(prev => ({ ...prev, BATCH_ID: "" }));
      }
    }
  };

  
  const handleSearchFocus = (field) => {
    setShowDropdown(prev => ({ ...prev, [field]: true }));
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowDropdown({ warehouse: false, product: false, batch: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "QUANTITY") {
      let inputQty = Number(value);
      const availableQty = Number(formData.P_BLQRTY) || 0;
      const isNegativeType = ["LOSS", "DAMAGE", "EXPIRED"].includes(formData.ADJ_TYPE);

      if (inputQty <= 0) {
        setFormData({ ...formData, QUANTITY: "" });
        return;
      }

      if (isNegativeType && inputQty > availableQty) {
        alert(`Quantity cannot exceed available balance (${availableQty})`);
        inputQty = availableQty;
      }

      setFormData({ ...formData, QUANTITY: inputQty });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!formData.P_WHCODE.trim()) {
      alert("Warehouse Code is required");
      return;
    }
    if (!formData.PRODUCT_CODE) {
      alert("Product Code is required");
      return;
    }
    if (!formData.QUANTITY || Number(formData.QUANTITY) <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (["LOSS", "DAMAGE", "EXPIRED"].includes(formData.ADJ_TYPE)) {
      const availableQty = Number(formData.P_BLQRTY) || 0;
      if (Number(formData.QUANTITY) > availableQty) {
        alert(`Quantity cannot exceed available balance (${availableQty})`);
        return;
      }
    }

    const adjTypeMap = {
      LOSS: "L",
      GAIN: "G",
      DAMAGE: "D",
      EXPIRED: "E",
    };

    const isNegativeType = ["LOSS", "DAMAGE", "EXPIRED"].includes(formData.ADJ_TYPE);
    const adjustedQuantity = isNegativeType
      ? Math.abs(Number(formData.QUANTITY))
      : Math.abs(Number(formData.QUANTITY));

    const payload = [
      {
        P_WHCODE: formData.P_WHCODE,
        ReturnLines: [
          {
            PRODUCT_CODE: Number(formData.PRODUCT_CODE),
            BATCH_ID: Number(formData.BATCH_ID),
            QUANTITY: adjustedQuantity,
            UNIT_PRICE: Number(formData.UNIT_PRICE) || 0,
            ADJ_TYPE: adjTypeMap[formData.ADJ_TYPE] || "L",
            REMARK: formData.REMARK || null,
          },
        ],
      },
    ];

    
    dispatch(addAdjustment(payload));
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div
        className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-indigo-900/30" : "bg-indigo-100"
              }`}
            >
              <FiSettings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Add Stock Adjustment
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
          className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* Warehouse Code - Searchable */}
          <div className="space-y-1 search-container relative">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Warehouse Code *
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search warehouse..."
                value={searchTerm.warehouse}
                onChange={(e) => handleSearchChange('warehouse', e.target.value)}
                onFocus={() => handleSearchFocus('warehouse')}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
                required
              />
            </div>
            
            {/* Warehouse Dropdown */}
            {showDropdown.warehouse && (
              <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
              }`}>
                {warehousesLoading ? (
                  <div className="p-3 text-sm text-gray-500">Loading warehouses...</div>
                ) : filteredWarehouses.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No warehouses found</div>
                ) : (
                  filteredWarehouses.map((warehouse) => (
                    <div
                      key={warehouse.WH_Code}
                      onClick={() => handleWarehouseSelect(warehouse)}
                      className={`p-3 cursor-pointer border-b ${
                        darkMode 
                          ? "border-gray-600 hover:bg-gray-600" 
                          : "border-gray-200 hover:bg-gray-50"
                      } last:border-b-0`}
                    >
                      {/* <div className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {warehouse.WH_Code}
                      </div> */}
                      <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {warehouse.WH_Name}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {warehousesError && (
              <p className="text-xs text-red-500 mt-1">Error: {warehousesError}</p>
            )}
          </div>

          {/* Product Code - Searchable */}
          <div className="space-y-1 search-container relative">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Product Code *
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search product..."
                value={searchTerm.product}
                onChange={(e) => handleSearchChange('product', e.target.value)}
                onFocus={() => handleSearchFocus('product')}
                disabled={!formData.P_WHCODE || productsLoading}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                } ${!formData.P_WHCODE ? "opacity-50 cursor-not-allowed" : ""}`}
                required
              />
            </div>
            
            {/* Product Dropdown */}
            {showDropdown.product && formData.P_WHCODE && (
              <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
              }`}>
                {productsLoading ? (
                  <div className="p-3 text-sm text-gray-500">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No products found</div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.PPROCODE}
                      onClick={() => handleProductSelect(product)}
                      className={`p-3 cursor-pointer border-b ${
                        darkMode 
                          ? "border-gray-600 hover:bg-gray-600" 
                          : "border-gray-200 hover:bg-gray-50"
                      } last:border-b-0`}
                    >
                      {/* <div className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {product.PPROCODE}
                      </div> */}
                      <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {product.PPDES}
                      </div>
                      <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Available: {product.PBALQTY || 0}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Batch ID - Searchable */}
          <div className="space-y-1 search-container relative">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Batch ID
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search batch..."
                value={searchTerm.batch}
                onChange={(e) => handleSearchChange('batch', e.target.value)}
                onFocus={() => handleSearchFocus('batch')}
                disabled={!formData.PRODUCT_CODE || batchesLoading}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                } ${!formData.PRODUCT_CODE ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>
            
            {/* Batch Dropdown */}
            {showDropdown.batch && formData.PRODUCT_CODE && (
              <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
              }`}>
                {batchesLoading ? (
                  <div className="p-3 text-sm text-gray-500">Loading batches...</div>
                ) : filteredBatches.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">No batches found</div>
                ) : (
                  filteredBatches.map((batch) => (
                    <div
                      key={batch.PB_BId}
                      onClick={() => handleBatchSelect(batch)}
                      className={`p-3 cursor-pointer border-b ${
                        darkMode 
                          ? "border-gray-600 hover:bg-gray-600" 
                          : "border-gray-200 hover:bg-gray-50"
                      } last:border-b-0`}
                    >
                      <div className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {batch.PB_BId}
                      </div>
                      <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Price: {batch.PB_PPrice || 0}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Rest of your form fields remain the same */}
          {/* Balance Quantity */}
          <div className="space-y-1">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Balance Quantity
            </label>
            <input
              name="P_BLQRTY"
              value={formData.P_BLQRTY}
              readOnly
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {/* Adjustment Type */}
          <div className="space-y-1">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Adjustment Type *
            </label>
            <select
              name="ADJ_TYPE"
              value={formData.ADJ_TYPE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            >
              <option value="DAMAGE">Damage</option>
              <option value="EXPIRED">Expired</option>
              <option value="GAIN">Gain</option>
              <option value="LOSS">Loss</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Adjustment Quantity *
            </label>
            <input
              name="QUANTITY"
              type="number"
             
              placeholder="e.g., 100"
              value={formData.QUANTITY}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              required
            />
          </div>

          {/* Unit Price */}
          <div className="space-y-1">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Unit Price
            </label>
            <input
              name="UNIT_PRICE"
              type="number"
              step="0.01"
              placeholder="e.g., 95.00"
              value={formData.UNIT_PRICE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {/* Remark */}
          <div className="space-y-1 md:col-span-2">
            <label
              className={`block text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Remark
            </label>
            <textarea
              name="REMARK"
              placeholder="Enter remarks here..."
              value={formData.REMARK}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              rows="2"
            />
          </div>

          {/* Buttons */}
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
              className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Save Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}