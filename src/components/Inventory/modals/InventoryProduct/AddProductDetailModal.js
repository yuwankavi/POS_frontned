// import { useSelector, useDispatch } from "react-redux";
// import { FiX, FiBox } from "react-icons/fi";
// import { closeModal } from "../../../../actions/modalActions";
// import { useState } from "react";
// import { addProductDetail } from "../../../../actions/Inventory/inventoryProductDetailActions.js";

// export function AddProductDetailModal() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);

//   const [formData, setFormData] = useState({
//     PWHCODE: "",
//     PPROCODE: "",
//     PBINLOCATION: "",
//     PREOLEVEL: "",
//     PMINSTOCK: "",
//     PTYPE: "",
//     PBALQTY: "",
//     PBALVALUE: "",
//     // PSELPRICE: "",
//     // PSTATUS: "A",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validation - Warehouse Code and Product Code are required
//     if (!formData.PWHCODE.trim()) {
//       alert("Warehouse Code is required");
//       return;
//     }

//     if (!formData.PPROCODE.trim()) {
//       alert("Product Code is required");
//       return;
//     }

//     const newProductDetail = { ...formData };
//     dispatch(addProductDetail(newProductDetail));
//     dispatch(closeModal());
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
//       <div className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
//         darkMode ? 'bg-gray-800' : 'bg-white'
//       }`}>

//         {/* Modal Header */}
//         <div className={`flex items-center justify-between p-4 border-b ${
//           darkMode ? 'border-gray-700' : 'border-gray-200'
//         }`}>
//           <div className="flex items-center gap-2">
//             <div className={`p-2 rounded-lg ${
//               darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
//             }`}>
//               <FiBox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Product Detail</h2>
//           </div>
//           <button
//             onClick={() => dispatch(closeModal())}
//             className={`p-1 rounded-lg transition-colors duration-200 ${
//               darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
//             }`}
//           >
//             <FiX className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
//           {/* Warehouse Code */}
//           <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Warehouse Code *
//             </label>
//             <input
//               name="PWHCODE"
//               placeholder="Enter Warehouse Code"
//               value={formData.PWHCODE}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//               required
//             />
//           </div>

//           {/* Product Code */}
//           <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Product Code *
//             </label>
//             <input
//               name="PPROCODE"
//               placeholder="Enter Product Code"
//               value={formData.PPROCODE}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//               required
//             />
//           </div>

//           {/* Bin Location */}
//           <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Bin Location
//             </label>
//             <input
//               name="PBINLOCATION"
//               placeholder="Enter Bin Location"
//               value={formData.PBINLOCATION}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             />
//           </div>

//           {/* Reorder Level */}
//           <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Reorder Level
//             </label>
//             <input
//               name="PREOLEVEL"
//               type="number"
//               placeholder="Enter Reorder Level"
//               value={formData.PREOLEVEL}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             />
//           </div>

//           {/* Min Stock */}
//           <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Min Stock
//             </label>
//             <input
//               name="PMINSTOCK"
//               type="number"
//               placeholder="Enter Min Stock"
//               value={formData.PMINSTOCK}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             />
//           </div>

//           {/* Type */}
//           <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Type
//             </label>
//             <input
//               name="PTYPE"
//               placeholder="Enter Type"
//               value={formData.PTYPE}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             />
//           </div>

//           {/* Balance Qty */}
//           {/* <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Balance Qty
//             </label>
//             <input
//               name="PBALQTY"
//               type="number"
//               placeholder="Enter Balance Qty"
//               value={formData.PBALQTY}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             />
//           </div> */}

//           {/* Balance Value */}
//           {/* <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Balance Value
//             </label>
//             <input
//               name="PBALVALUE"
//               type="number"
//               placeholder="Enter Balance Value"
//               value={formData.PBALVALUE}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             />
//           </div> */}

//           {/* Selling Price */}
//           {/* <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Selling Price
//             </label>
//             <input
//               name="PSELPRICE"
//               type="number"
//               placeholder="Enter Selling Price"
//               value={formData.PSELPRICE}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             />
//           </div> */}

//           {/* Status */}
//           {/* <div className="space-y-1">
//             <label className={`block text-xs font-medium ${
//               darkMode ? 'text-gray-300' : 'text-gray-700'
//             }`}>
//               Status
//             </label>
//             <select
//               name="PSTATUS"
//               value={formData.PSTATUS}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 border-gray-600 text-white' 
//                   : 'bg-gray-50 border-gray-200 text-gray-900'
//               }`}
//             >
//               <option value="A">Active</option>
//               <option value="I">Inactive</option>
//             </select>
//           </div> */}

//           {/* Action Buttons */}
//           <div className="md:col-span-2 flex justify-end gap-2 pt-3">
//             <button
//               type="button"
//               onClick={() => dispatch(closeModal())}
//               className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
//                 darkMode 
//                   ? 'bg-gray-700 text-gray-200 border-gray-600' 
//                   : 'bg-white text-gray-700 border-gray-300'
//               } border`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }







import { useSelector, useDispatch } from "react-redux";
import { FiX, FiBox } from "react-icons/fi";
import { closeModal } from "../../../../actions/modalActions";
import { useState, useEffect } from "react";
import { addProductDetail } from "../../../../actions/Inventory/inventoryProductDetailActions.js";
import { inventoryService } from "../../../../services/Inventory/commonDropdownService.js";

export function AddProductDetailModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [formData, setFormData] = useState({
    PWHCODE: "",
    PPROCODE: "",
    PBINLOCATION: "",
    PREOLEVEL: "",
    PMINSTOCK: "",
    PTYPE: "",
    PBALQTY: "",
    PBALVALUE: "",
  });

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoadingWarehouses(true);
      try {
        const response = await inventoryService.getWarehouses();
        if (response.data && response.data.ResultSet) {
          setWarehouses(response.data.ResultSet);
        }
      } catch (error) {

        alert("Error loading warehouses");
      } finally {
        setLoadingWarehouses(false);
      }
    };

    fetchWarehouses();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!formData.PWHCODE) {
        setProducts([]);
        return;
      }

      setLoadingProducts(true);
      try {
        const response = await inventoryService.getProductsByWarehouse(formData.PWHCODE);
        if (response.data && response.data.ResultSet) {
          setProducts(response.data.ResultSet);
        }
      } catch (error) {
        alert("Error loading products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [formData.PWHCODE]);

  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "PWHCODE") {
      setFormData({
        ...formData,
        PWHCODE: value,
        PPROCODE: ""
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.PWHCODE.trim()) {
      alert("Warehouse Code is required");
      return;
    }

    if (!formData.PPROCODE.trim()) {
      alert("Product Code is required");
      return;
    }

    try {

      await dispatch(addProductDetail(formData));


      dispatch(closeModal());

      if (selectedProductCode) {
        dispatch(fetchActiveProductDetails(selectedProductCode));
      }

    } catch (error) {
      console.error("Error adding product detail:", error);
      alert("Error adding product detail");
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>

        {/* Modal Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
              <FiBox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Product Detail</h2>
          </div>

          <button
            onClick={() => dispatch(closeModal())}
            className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Warehouse Code Dropdown */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Warehouse Code *
            </label>
            <select
              name="PWHCODE"
              value={formData.PWHCODE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.WH_Code} value={warehouse.WH_Code}>
                  {warehouse.WH_Code} - {warehouse.WH_Name}
                </option>
              ))}
            </select>
            {loadingWarehouses && (
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading warehouses...
              </p>
            )}
          </div>

          {/* Product Code Dropdown */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Product Code *
            </label>
            <select
              name="PPROCODE"
              value={formData.PPROCODE}
              onChange={handleChange}
              disabled={!formData.PWHCODE || loadingProducts}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
                } ${(!formData.PWHCODE || loadingProducts) ? 'opacity-50 cursor-not-allowed' : ''}`}
              required
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.PPROCODE} value={product.PPROCODE}>
                  {product.PPROCODE} - {product.PPDES}
                </option>
              ))}
            </select>
            {loadingProducts && (
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading products...
              </p>
            )}
            {!formData.PWHCODE && !loadingProducts && (
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Please select a warehouse first
              </p>
            )}
          </div>

          {/* Bin Location */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Bin Location
            </label>
            <input
              name="PBINLOCATION"
              placeholder="Enter Bin Location"
              value={formData.PBINLOCATION}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          {/* Reorder Level */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Reorder Level
            </label>
            <input
              name="PREOLEVEL"
              type="number"
              placeholder="Enter Reorder Level"
              value={formData.PREOLEVEL}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          {/* Min Stock */}
          <div className="space-y-1">
            <label className={`block text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Min Stock
            </label>
            <input
              name="PMINSTOCK"
              type="number"
              placeholder="Enter Min Stock"
              value={formData.PMINSTOCK}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
            />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label
              className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Type
            </label>

            <select
              name="PTYPE"
              value={formData.PTYPE}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            >
              <option value="">Select Type</option>
              <option value="F">FIFO</option>
              <option value="E">FEFO</option>
            </select>
          </div>


          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                ? 'bg-gray-700 text-gray-200 border-gray-600'
                : 'bg-white text-gray-700 border-gray-300'
                } border`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}