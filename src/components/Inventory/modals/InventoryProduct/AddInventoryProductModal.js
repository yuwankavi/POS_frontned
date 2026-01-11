// import React, { useEffect, useRef, useState } from "react";
// import { FiPackage, FiUpload, FiX, FiSearch ,FiPlus} from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { getBrandbyStatus } from "../../../../actions/Inventory/brandActions.js";
// import { addInventoryProduct } from "../../../../actions/Inventory/inventoryProductActions.js";
// import { listMainCategories } from "../../../../actions/Inventory/mainCatActions.js";
// import { listSubCategories } from "../../../../actions/Inventory/subCatActions.js";
// import { closeModal } from "../../../../actions/modalActions.js";
// import { listWarehouses } from "../../../../actions/warehouseActions.js";
// import { listUnitsActive } from "../../../../actions/Inventory/unitActions.js";
// import SubCategoryAddModal from "../../../Inventory/modals/ProductSubadd.js";


// export default function AddInventoryProductModal() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [isGeneratingSKU, setIsGeneratingSKU] = useState(false);
//   const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
//   const unitState = useSelector((state) => state.unitActiveList) || {};
//   const { loading: unitsLoading, error: unitsError, units = [] } = unitState;

//   // Fetch active units on component mount
//   useEffect(() => {
//     dispatch(listUnitsActive());
//   }, [dispatch]);

//   const inventoryState = useSelector((state) => state.inventoryProduct) || {};
//   const { inventoryProducts = [] } = inventoryState;

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setFileName(file.name);
//     }
//   };

//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setFileName("");
//   };

//   const mainCategoriesState = useSelector((state) => state.mainCategory) || {};
//   const { loading, error, mainCategories } = mainCategoriesState;

//   React.useEffect(() => {
//     dispatch(listMainCategories());
//   }, [dispatch]);

//   const subCategoriesState = useSelector((state) => state.subCategory) || {};
//   const { loadingsub, errorsub, subCategories = [] } = subCategoriesState;

//   React.useEffect(() => {
//     dispatch(listSubCategories());
//   }, [dispatch]);

//   const brandsState = useSelector((state) => state.brand) || {};
//   const { loadingbrand, errorbrand, brands } = brandsState;

//   React.useEffect(() => {
//     dispatch(getBrandbyStatus("A"));
//   }, [dispatch]);

//   const warehouseState = useSelector((state) => state.warehouse) || {};
//   const { loadingWH, errorWH, warehouses } = warehouseState;

//   React.useEffect(() => {
//     dispatch(listWarehouses());
//   }, [dispatch]);

//   const [formData, setFormData] = useState({
//     P_WHCODE: "",
//     P_BINLOCATION: "",
//     P_REOLEVEL: "",
//     P_MINSTOCK: "",
//     P_TYPE: "1",
//     P_BALQTY: "",
//     P_BALVALUE: "",
//     P_SELPRICE: "",
//     P_SKU: "",
//     P_MCID: "",
//     P_SCID: "",
//     P_BRID: "",
//     P_DES: "",
//     P_MSPEC: "",
//     P_UNIT: " ",
//   });

//   const [mainCatName, setMainCatName] = useState("");
//   const [subCatName, setSubCatName] = useState("");
//   const [brandName, setBrandName] = useState("");
//   const [unit, setUnit] = useState(" ");
//   const [warehouseName, setWarehouseName] = useState("");

//   // Search states
//   const [mainSearch, setMainSearch] = useState("");
//   const [subSearch, setSubSearch] = useState("");
//   const [brandSearch, setBrandSearch] = useState("");
//   const [unitSearch, setUnitSearch] = useState("");
//   const [warehouseSearch, setWarehouseSearch] = useState("");

//   const generateSKU = () => {
//     if (!mainCatName && !subCatName && !brandName && !unit) {
//       alert("Please select Main Category, Sub Category, Brand, and Unit first");
//       return;
//     }

//     setIsGeneratingSKU(true);

//     const mainCatCode = mainCatName
//       ? mainCatName.substring(0, 3).toUpperCase().replace(/\s/g, "")
//       : "GEN";
//     const subCatCode = subCatName
//       ? subCatName.substring(0, 3).toUpperCase().replace(/\s/g, "")
//       : "SUB";
//     const brandCode = brandName
//       ? brandName.substring(0, 3).toUpperCase().replace(/\s/g, "")
//       : "BRD";
//     const unitCode = unit ? unit : "PCS";

//     const similarSKUs = inventoryProducts.filter(
//       (product) =>
//         product.P_SKU &&
//         product.P_SKU.startsWith(`${mainCatCode}-${subCatCode}-${brandCode}`)
//     );

//     const sequentialNumber = (similarSKUs.length + 1)
//       .toString()
//       .padStart(3, "0");

//     const generatedSKU = `${mainCatCode}-${subCatCode}-${brandCode}-${unitCode}-${sequentialNumber}`;

//     setFormData((prev) => ({
//       ...prev,
//       P_SKU: generatedSKU,
//     }));

//     setIsGeneratingSKU(false);
//   };

//   useEffect(() => {
//     if (mainCatName && subCatName && brandName && unit) {
//       generateSKU();
//     }
//   }, [mainCatName, subCatName, brandName, unit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "P_UNIT") {
//       setUnit(value);
//     }
//   };

//   // Filtered lists with search
//   const filteredMainCategories = mainCategories.filter(item =>
//     item.Main_CatName.toLowerCase().includes(mainSearch.toLowerCase())
//   );

//   const filteredSubCategories = subCategories
//     .filter(item => item.Sub_MainCatID === formData.P_MCID)
//     .filter(item =>
//       item.Sub_CatName.toLowerCase().includes(subSearch.toLowerCase())
//     );

//   const filteredBrands = brands.filter(item =>
//     item.B_Name.toLowerCase().includes(brandSearch.toLowerCase())
//   );

//   const filteredUnits = units.filter(item =>
//     item.P_UNCODE.toLowerCase().includes(unitSearch.toLowerCase())
//   );

//   const filteredWarehouses = warehouses.filter(item =>
//     item.WH_Name.toLowerCase().includes(warehouseSearch.toLowerCase())
//   );

//   // Dropdown visibility states
//   const [showMainDropdown, setShowMainDropdown] = useState(false);
//   const [showSubDropdown, setShowSubDropdown] = useState(false);
//   const [showBrandDropdown, setShowBrandDropdown] = useState(false);
//   const [showUnitDropdown, setShowUnitDropdown] = useState(false);
//   const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

//   // Refs for dropdowns
//   const mainDropdownRef = useRef(null);
//   const subDropdownRef = useRef(null);
//   const brandDropdownRef = useRef(null);
//   const unitDropdownRef = useRef(null);
//   const warehouseDropdownRef = useRef(null);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target)) {
//         setShowMainDropdown(false);
//       }
//       if (subDropdownRef.current && !subDropdownRef.current.contains(event.target)) {
//         setShowSubDropdown(false);
//       }
//       if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
//         setShowBrandDropdown(false);
//       }
//       if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target)) {
//         setShowUnitDropdown(false);
//       }
//       if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(event.target)) {
//         setShowWarehouseDropdown(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handler functions
//   const handleMainSelect = (item) => {
//     setFormData({ ...formData, P_MCID: item.Main_CatID });
//     setMainCatName(item.Main_CatName);
//     setShowMainDropdown(false);
//     setMainSearch("");
//   };

//   const handleSubSelect = (item) => {
//     setFormData({ ...formData, P_SCID: item.Sub_CatID });
//     setSubCatName(item.Sub_CatName);
//     setShowSubDropdown(false);
//     setSubSearch("");
//   };

//   const handleBrandSelect = (item) => {
//     setFormData({ ...formData, P_BRID: item.B_Id });
//     setBrandName(item.B_Name);
//     setShowBrandDropdown(false);
//     setBrandSearch("");
//   };

//   const handleUnitSelect = (unitItem) => {
//     setFormData({ ...formData, P_UNIT: unitItem.P_UNCODE });
//     setUnit(unitItem.P_UNCODE);
//     setShowUnitDropdown(false);
//     setUnitSearch("");
//   };

//   const handleWarehouseSelect = (item) => {
//     setFormData({ ...formData, P_WHCODE: item.WH_Code });
//     setWarehouseName(item.WH_Name);
//     setShowWarehouseDropdown(false);
//     setWarehouseSearch("");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.P_SKU.trim()) {
//       alert("SKU is required");
//       return;
//     }
//     if (!formData.P_MCID.trim()) {
//       alert("Main Category is required");
//       return;
//     }
//     if (!formData.P_SCID.trim()) {
//       alert("Sub Category is required");
//       return;
//     }
//     if (!formData.P_WHCODE.trim()) {
//       alert("Warehouse is required");
//       return;
//     }
//     if (!formData.P_DES.trim()) {
//       alert("Product Description is required");
//       return;
//     }
//     if (!formData.P_UNIT.trim()) {
//       alert("Unit is required");
//       return;
//     }

//     const newInventoryProduct = { ...formData };
//     dispatch(addInventoryProduct(newInventoryProduct, selectedFile));
//     console.log("Add Product:", newInventoryProduct);
//     dispatch(closeModal());
//   };

//   // Custom dropdown component with search
//   const CustomDropdown = ({ 
//     show, 
//     search, 
//     onSearchChange, 
//     items, 
//     onSelect, 
//     placeholder, 
//     displayKey,
//     dropdownRef 
//   }) => (
//     <div 
//       ref={dropdownRef}
//       className={`absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
//         show ? 'block' : 'hidden'
//       }`}
//     >
//       {/* Search Input */}
//       <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder={`Search ${placeholder}...`}
//             value={search}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             autoFocus
//           />
//         </div>
//       </div>

//       {/* Dropdown Items */}
//       <div className="py-1">
//         {items.length > 0 ? (
//           items.map((item) => (
//             <button
//               key={item[displayKey]}
//               type="button"
//               onClick={() => onSelect(item)}
//               className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
//             >
//               {item[displayKey]}
//             </button>
//           ))
//         ) : (
//           <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
//             No {placeholder.toLowerCase()} found
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
//       <div
//         className={`rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         }`}
//       >
//         {/* Modal Header */}
//         <div
//           className={`flex items-center justify-between p-4 border-b ${
//             darkMode ? "border-gray-700" : "border-gray-200"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             <div
//               className={`p-2 rounded-lg ${
//                 darkMode ? "bg-blue-900/30" : "bg-blue-100"
//               }`}
//             >
//               <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//               Add New Product
//             </h2>
//           </div>
//           <button
//             onClick={() => dispatch(closeModal())}
//             className={`p-1 rounded-lg transition-colors duration-200 ${
//               darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <FiX className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Product Catalogue Section */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//                 Product Catalogue
//               </h2>

//               <button
//                 onClick={() => setIsSubCategoryModalOpen(true)}
//                 className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
//               >
//                 <FiPlus className="w-4 h-4" />
//                 Add Sub Category
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* File Upload */}
//               <div className="space-y-1 md:col-span-2">
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Product Image
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <label
//                     className={`flex-1 px-3 py-2 rounded-lg border-2 border-dashed text-center cursor-pointer transition-colors ${
//                       darkMode
//                         ? "border-gray-600 hover:border-gray-500 bg-gray-700"
//                         : "border-gray-300 hover:border-gray-400 bg-gray-50"
//                     }`}
//                   >
//                     <FiUpload className="inline w-4 h-4 mr-2" />
//                     {fileName || "Choose file"}
//                     <input
//                       type="file"
//                       className="hidden"
//                       onChange={handleFileChange}
//                       accept="image/*"
//                     />
//                   </label>
//                   {selectedFile && (
//                     <button
//                       type="button"
//                       onClick={handleRemoveFile}
//                       className="p-2 text-red-500 hover:text-red-700"
//                     >
//                       <FiX className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Main Category */}
//               <div className="space-y-1 relative" ref={mainDropdownRef}>
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Main Category *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowMainDropdown(!showMainDropdown)}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 >
//                   <span>{mainCatName || "Select Main Category"}</span>
//                   <FiSearch className="w-4 h-4 text-gray-400" />
//                 </button>

//                 <CustomDropdown
//                   show={showMainDropdown}
//                   search={mainSearch}
//                   onSearchChange={setMainSearch}
//                   items={filteredMainCategories}
//                   onSelect={handleMainSelect}
//                   placeholder="Main Category"
//                   displayKey="Main_CatName"
//                   dropdownRef={mainDropdownRef}
//                 />
//               </div>

//               {/* Sub Category */}
//               <div className="space-y-1 relative" ref={subDropdownRef}>
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Sub Category *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     mainCatName && setShowSubDropdown(!showSubDropdown)
//                   }
//                   disabled={!mainCatName}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   } ${!mainCatName ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   <span>
//                     {!mainCatName
//                       ? "Choose a Main Category"
//                       : subCatName || "Select Sub Category"}
//                   </span>
//                   <FiSearch className="w-4 h-4 text-gray-400" />
//                 </button>

//                 <CustomDropdown
//                   show={showSubDropdown}
//                   search={subSearch}
//                   onSearchChange={setSubSearch}
//                   items={filteredSubCategories}
//                   onSelect={handleSubSelect}
//                   placeholder="Sub Category"
//                   displayKey="Sub_CatName"
//                   dropdownRef={subDropdownRef}
//                 />
//               </div>

//               {/* Brand */}
//               <div className="space-y-1 relative" ref={brandDropdownRef}>
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Brand Name *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowBrandDropdown(!showBrandDropdown)}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 >
//                   <span>{brandName || "Select Brand"}</span>
//                   <FiSearch className="w-4 h-4 text-gray-400" />
//                 </button>

//                 <CustomDropdown
//                   show={showBrandDropdown}
//                   search={brandSearch}
//                   onSearchChange={setBrandSearch}
//                   items={filteredBrands}
//                   onSelect={handleBrandSelect}
//                   placeholder="Brand"
//                   displayKey="B_Name"
//                   dropdownRef={brandDropdownRef}
//                 />
//               </div>

//               {/* Unit */}
//               <div className="space-y-1 relative" ref={unitDropdownRef}>
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Unit *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowUnitDropdown(!showUnitDropdown)}
//                   disabled={unitsLoading}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   } ${unitsLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   <span>
//                     {unitsLoading
//                       ? "Loading units..."
//                       : formData.P_UNIT.trim() || "Select Unit"}
//                   </span>
//                   <FiSearch className="w-4 h-4 text-gray-400" />
//                 </button>

//                 <CustomDropdown
//                   show={showUnitDropdown}
//                   search={unitSearch}
//                   onSearchChange={setUnitSearch}
//                   items={filteredUnits}
//                   onSelect={handleUnitSelect}
//                   placeholder="Unit"
//                   displayKey="P_UNCODE"
//                   dropdownRef={unitDropdownRef}
//                 />
//                 {unitsError && (
//                   <p className="text-xs text-red-500 mt-1">
//                     Error loading units: {unitsError}
//                   </p>
//                 )}
//               </div>

//               {/* Product Description */}
//               <div className="space-y-1 md:col-span-2">
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Product Name *
//                 </label>
//                 <input
//                   name="P_DES"
//                   placeholder="Enter Product Name"
//                   value={formData.P_DES}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                   required
//                 />
//               </div>

//               {/* Material Specification */}
//               <div className="space-y-1 md:col-span-2">
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Material Specification
//                 </label>
//                 <input
//                   name="P_MSPEC"
//                   placeholder="Enter Material Specification"
//                   value={formData.P_MSPEC}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Product Details Section */}
//           <div>
//             <h2 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
//               Product Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Warehouse */}
//               <div className="space-y-1 relative" ref={warehouseDropdownRef}>
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Warehouse *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowWarehouseDropdown(!showWarehouseDropdown)
//                   }
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 >
//                   <span>{warehouseName || "Select Warehouse"}</span>
//                   <FiSearch className="w-4 h-4 text-gray-400" />
//                 </button>

//                 <CustomDropdown
//                   show={showWarehouseDropdown}
//                   search={warehouseSearch}
//                   onSearchChange={setWarehouseSearch}
//                   items={filteredWarehouses}
//                   onSelect={handleWarehouseSelect}
//                   placeholder="Warehouse"
//                   displayKey="WH_Name"
//                   dropdownRef={warehouseDropdownRef}
//                 />
//               </div>

//               {/* Bin Location */}
//               <div className="space-y-1">
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Bin Location
//                 </label>
//                 <input
//                   name="P_BINLOCATION"
//                   placeholder="Enter Bin Location"
//                   value={formData.P_BINLOCATION}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 />
//               </div>

//               {/* Re-Order Level */}
//               <div className="space-y-1">
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Re-Order Level
//                 </label>
//                 <input
//                   name="P_REOLEVEL"
//                   type="number"
//                   placeholder="Enter Re-Order Level"
//                   value={formData.P_REOLEVEL}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 />
//               </div>

//               {/* Minimum Stock */}
//               <div className="space-y-1">
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Minimum Stock
//                 </label>
//                 <input
//                   name="P_MINSTOCK"
//                   type="number"
//                   placeholder="Enter Minimum Stock"
//                   value={formData.P_MINSTOCK}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 />
//               </div>

//               {/* Type */}
//               <div className="space-y-1">
//                 <label
//                   className={`block text-xs font-medium ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Type
//                 </label>

//                 <select
//                   name="P_TYPE"
//                   value={formData.P_TYPE}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${
//                     darkMode
//                       ? "bg-gray-700 border-gray-600 text-white"
//                       : "bg-gray-50 border-gray-200 text-gray-900"
//                   }`}
//                 >
//                   <option value="F">FIFO</option>
//                   <option value="E">FEFO</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Info Note */}
//           <div
//             className={`rounded-lg p-3 border ${
//               darkMode
//                 ? "bg-blue-900/20 border-blue-800"
//                 : "bg-blue-50 border-blue-200"
//             }`}
//           >
//             <p
//               className={`text-xs ${
//                 darkMode ? "text-blue-300" : "text-blue-800"
//               }`}
//             >
//               <strong>Note:</strong> Fields marked with * are required. Click
//               the search icon to find and filter options in dropdowns.
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={() => dispatch(closeModal())}
//               className={`px-4 py-2 rounded-lg font-medium text-sm border transition-all duration-200 ${
//                 darkMode
//                   ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//               }`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
//             >
//               Save Product
//             </button>
//           </div>
//         </form>
//       </div>
//       <SubCategoryAddModal
//         isOpen={isSubCategoryModalOpen}
//         onClose={() => setIsSubCategoryModalOpen(false)}
//       />
//     </div>
//   );
// }








import React, { useEffect, useRef, useState } from "react";
import { FiPackage, FiUpload, FiX, FiSearch, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getBrandbyStatus } from "../../../../actions/Inventory/brandActions.js";
import { addInventoryProduct } from "../../../../actions/Inventory/inventoryProductActions.js";
import { listMainCategories } from "../../../../actions/Inventory/mainCatActions.js";
import { listSubCategories } from "../../../../actions/Inventory/subCatActions.js";
import { closeModal } from "../../../../actions/modalActions.js";
import { listWarehouses } from "../../../../actions/warehouseActions.js";
import { listUnitsActive } from "../../../../actions/Inventory/unitActions.js";
import SubCategoryAddModal from "../../../Inventory/modals/ProductSubadd.js";


export default function AddInventoryProductModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [isGeneratingSKU, setIsGeneratingSKU] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const unitState = useSelector((state) => state.unitActiveList) || {};
  const { loading: unitsLoading, error: unitsError, units = [] } = unitState;

  // Fetch active units on component mount
  useEffect(() => {
    dispatch(listUnitsActive());
  }, [dispatch]);

  const inventoryState = useSelector((state) => state.inventoryProduct) || {};
  const { inventoryProducts = [] } = inventoryState;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(""); // Clear previous errors

    if (file) {
      // Check file type
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setFileError("Please select a valid image file (JPEG, PNG, GIF, WebP)");
        setSelectedFile(null);
        setFileName("");
        return;
      }

      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setFileError("File size must be less than 5MB");
        setSelectedFile(null);
        setFileName("");
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName("");
    setFileError("");
  };

  const mainCategoriesState = useSelector((state) => state.mainCategory) || {};
  const { loading, error, mainCategories } = mainCategoriesState;

  React.useEffect(() => {
    dispatch(listMainCategories());
  }, [dispatch]);

  const subCategoriesState = useSelector((state) => state.subCategory) || {};
  const { loadingsub, errorsub, subCategories = [] } = subCategoriesState;

  React.useEffect(() => {
    dispatch(listSubCategories());
  }, [dispatch]);

  const brandsState = useSelector((state) => state.brand) || {};
  const { loadingbrand, errorbrand, brands } = brandsState;

  React.useEffect(() => {
    dispatch(getBrandbyStatus("A"));
  }, [dispatch]);

  const warehouseState = useSelector((state) => state.warehouse) || {};
  const { loadingWH, errorWH, warehouses } = warehouseState;

  React.useEffect(() => {
    dispatch(listWarehouses());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    P_WHCODE: "",
    P_BINLOCATION: "",
    P_REOLEVEL: "",
    P_MINSTOCK: "",
    P_TYPE: "",
    P_BALQTY: "",
    P_BALVALUE: "",
    P_SELPRICE: "",
    P_SKU: "",
    P_MCID: "",
    P_SCID: "",
    P_BRID: "",
    P_DES: "",
    P_MSPEC: "",
    P_UNIT: " ",
  });

  const [mainCatName, setMainCatName] = useState("");
  const [subCatName, setSubCatName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [unit, setUnit] = useState(" ");
  const [warehouseName, setWarehouseName] = useState("");

  // Search states
  const [mainSearch, setMainSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");
  const [warehouseSearch, setWarehouseSearch] = useState("");

  const generateSKU = () => {
    if (!mainCatName && !subCatName && !brandName && !unit) {
      alert("Please select Main Category, Sub Category, Brand, and Unit first");
      return;
    }

    setIsGeneratingSKU(true);

    const mainCatCode = mainCatName
      ? mainCatName.substring(0, 3).toUpperCase().replace(/\s/g, "")
      : "GEN";
    const subCatCode = subCatName
      ? subCatName.substring(0, 3).toUpperCase().replace(/\s/g, "")
      : "SUB";
    const brandCode = brandName
      ? brandName.substring(0, 3).toUpperCase().replace(/\s/g, "")
      : "BRD";
    const unitCode = unit ? unit : "PCS";

    const similarSKUs = inventoryProducts.filter(
      (product) =>
        product.P_SKU &&
        product.P_SKU.startsWith(`${mainCatCode}-${subCatCode}-${brandCode}`)
    );

    const sequentialNumber = (similarSKUs.length + 1)
      .toString()
      .padStart(3, "0");

    const generatedSKU = `${mainCatCode}-${subCatCode}-${brandCode}-${unitCode}-${sequentialNumber}`;

    setFormData((prev) => ({
      ...prev,
      P_SKU: generatedSKU,
    }));

    setIsGeneratingSKU(false);
  };

  useEffect(() => {
    if (mainCatName && subCatName && brandName && unit) {
      generateSKU();
    }
  }, [mainCatName, subCatName, brandName, unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "P_UNIT") {
      setUnit(value);
    }
  };


  const filteredMainCategories = mainCategories.filter(item =>
    item.Main_CatName.toLowerCase().includes(mainSearch.toLowerCase())
  );

  const filteredSubCategories = subCategories
    .filter(item => item.Sub_MainCatID === formData.P_MCID)
    .filter(item =>
      item.Sub_CatName.toLowerCase().includes(subSearch.toLowerCase())
    );

  const filteredBrands = brands.filter(item =>
    item.B_Name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredUnits = units.filter(item =>
    item.P_UNCODE.toLowerCase().includes(unitSearch.toLowerCase())
  );

  const filteredWarehouses = warehouses.filter(item =>
    item.WH_Name.toLowerCase().includes(warehouseSearch.toLowerCase())
  );

  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);


  const mainDropdownRef = useRef(null);
  const subDropdownRef = useRef(null);
  const brandDropdownRef = useRef(null);
  const unitDropdownRef = useRef(null);
  const warehouseDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target)) {
        setShowMainDropdown(false);
      }
      if (subDropdownRef.current && !subDropdownRef.current.contains(event.target)) {
        setShowSubDropdown(false);
      }
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setShowBrandDropdown(false);
      }
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target)) {
        setShowUnitDropdown(false);
      }
      if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(event.target)) {
        setShowWarehouseDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler functions
  const handleMainSelect = (item) => {
    setFormData({ ...formData, P_MCID: item.Main_CatID });
    setMainCatName(item.Main_CatName);
    setShowMainDropdown(false);
    setMainSearch("");
  };

  const handleSubSelect = (item) => {
    setFormData({ ...formData, P_SCID: item.Sub_CatID });
    setSubCatName(item.Sub_CatName);
    setShowSubDropdown(false);
    setSubSearch("");
  };

  const handleBrandSelect = (item) => {
    setFormData({ ...formData, P_BRID: item.B_Id });
    setBrandName(item.B_Name);
    setShowBrandDropdown(false);
    setBrandSearch("");
  };

  const handleUnitSelect = (unitItem) => {
    setFormData({ ...formData, P_UNIT: unitItem.P_UNCODE });
    setUnit(unitItem.P_UNCODE);
    setShowUnitDropdown(false);
    setUnitSearch("");
  };

  const handleWarehouseSelect = (item) => {
    setFormData({ ...formData, P_WHCODE: item.WH_Code });
    setWarehouseName(item.WH_Name);
    setShowWarehouseDropdown(false);
    setWarehouseSearch("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!formData.P_TYPE.trim()) {
      alert("Select the Type");
      return;
    }
    if (!formData.P_SKU.trim()) {
      alert("SKU is required");
      return;
    }
    if (!formData.P_MCID.trim()) {
      alert("Main Category is required");
      return;
    }
    if (!formData.P_SCID.trim()) {
      alert("Sub Category is required");
      return;
    }
    if (!formData.P_WHCODE.trim()) {
      alert("Warehouse is required");
      return;
    }
    if (!formData.P_DES.trim()) {
      alert("Product Description is required");
      return;
    }
    if (!formData.P_UNIT.trim()) {
      alert("Unit is required");
      return;
    }


    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (selectedFile.size > maxSize) {
        setFileError("File size must be less than 5MB");
        return;
      }
    }

    const newInventoryProduct = { ...formData };
    dispatch(addInventoryProduct(newInventoryProduct, selectedFile));
    dispatch(closeModal());
  };

  const CustomDropdown = ({
    show,
    search,
    onSearchChange,
    items,
    onSelect,
    placeholder,
    displayKey,
    dropdownRef
  }) => (
    <div
      ref={dropdownRef}
      className={`absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto ${show ? 'block' : 'hidden'
        }`}
    >
      {/* Search Input */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${placeholder}...`}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      </div>

      {/* Dropdown Items */}
      <div className="py-1">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item[displayKey]}
              type="button"
              onClick={() => onSelect(item)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
            >
              {item[displayKey]}
            </button>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            No {placeholder.toLowerCase()} found
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div
        className={`rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"
                }`}
            >
              <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Add New Product
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Catalogue Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Product Catalogue
              </h2>

              <button
                onClick={() => setIsSubCategoryModalOpen(true)}
                className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
              >
                <FiPlus className="w-4 h-4" />
                Add Sub Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* File Upload */}
              <div className="space-y-1 md:col-span-2">
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Product Image (Max 5MB)
                </label>
                <div className="flex items-center gap-2">
                  <label
                    className={`flex-1 px-3 py-2 rounded-lg border-2 border-dashed text-center cursor-pointer transition-colors ${darkMode
                        ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                        : "border-gray-300 hover:border-gray-400 bg-gray-50"
                      } ${fileError ? "border-red-500 dark:border-red-500" : ""}`}
                  >
                    <FiUpload className="inline w-4 h-4 mr-2" />
                    {fileName || "Choose file"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    />
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {fileError && (
                  <p className="text-xs text-red-500 mt-1">{fileError}</p>
                )}
                {selectedFile && !fileError && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    File selected: {fileName} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supported formats: JPEG, PNG, GIF, WebP • Max size: 5MB
                </p>
              </div>

              {/* Main Category */}
              <div className="space-y-1 relative" ref={mainDropdownRef}>
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Main Category *
                </label>
                <button
                  type="button"
                  onClick={() => setShowMainDropdown(!showMainDropdown)}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                >
                  <span>{mainCatName || "Select Main Category"}</span>
                  <FiSearch className="w-4 h-4 text-gray-400" />
                </button>

                <CustomDropdown
                  show={showMainDropdown}
                  search={mainSearch}
                  onSearchChange={setMainSearch}
                  items={filteredMainCategories}
                  onSelect={handleMainSelect}
                  placeholder="Main Category"
                  displayKey="Main_CatName"
                  dropdownRef={mainDropdownRef}
                />
              </div>

              {/* Sub Category */}
              <div className="space-y-1 relative" ref={subDropdownRef}>
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Sub Category *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    mainCatName && setShowSubDropdown(!showSubDropdown)
                  }
                  disabled={!mainCatName}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    } ${!mainCatName ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span>
                    {!mainCatName
                      ? "Choose a Main Category"
                      : subCatName || "Select Sub Category"}
                  </span>
                  <FiSearch className="w-4 h-4 text-gray-400" />
                </button>

                <CustomDropdown
                  show={showSubDropdown}
                  search={subSearch}
                  onSearchChange={setSubSearch}
                  items={filteredSubCategories}
                  onSelect={handleSubSelect}
                  placeholder="Sub Category"
                  displayKey="Sub_CatName"
                  dropdownRef={subDropdownRef}
                />
              </div>

              {/* Brand */}
              <div className="space-y-1 relative" ref={brandDropdownRef}>
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Brand Name *
                </label>
                <button
                  type="button"
                  onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                >
                  <span>{brandName || "Select Brand"}</span>
                  <FiSearch className="w-4 h-4 text-gray-400" />
                </button>

                <CustomDropdown
                  show={showBrandDropdown}
                  search={brandSearch}
                  onSearchChange={setBrandSearch}
                  items={filteredBrands}
                  onSelect={handleBrandSelect}
                  placeholder="Brand"
                  displayKey="B_Name"
                  dropdownRef={brandDropdownRef}
                />
              </div>

              {/* Unit */}
              <div className="space-y-1 relative" ref={unitDropdownRef}>
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Unit *
                </label>
                <button
                  type="button"
                  onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                  disabled={unitsLoading}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    } ${unitsLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span>
                    {unitsLoading
                      ? "Loading units..."
                      : formData.P_UNIT.trim() || "Select Unit"}
                  </span>
                  <FiSearch className="w-4 h-4 text-gray-400" />
                </button>

                <CustomDropdown
                  show={showUnitDropdown}
                  search={unitSearch}
                  onSearchChange={setUnitSearch}
                  items={filteredUnits}
                  onSelect={handleUnitSelect}
                  placeholder="Unit"
                  displayKey="P_UNCODE"
                  dropdownRef={unitDropdownRef}
                />
                {unitsError && (
                  <p className="text-xs text-red-500 mt-1">
                    Error loading units: {unitsError}
                  </p>
                )}
              </div>

              {/* Product Description */}
              <div className="space-y-1 md:col-span-2">
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Product Name *
                </label>
                <input
                  name="P_DES"
                  placeholder="Enter Product Name"
                  value={formData.P_DES}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                  required
                />
              </div>

              {/* Material Specification */}
              <div className="space-y-1 md:col-span-2">
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Material Specification
                </label>
                <input
                  name="P_MSPEC"
                  placeholder="Enter Material Specification"
                  value={formData.P_MSPEC}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Warehouse */}
              <div className="space-y-1 relative" ref={warehouseDropdownRef}>
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Warehouse *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setShowWarehouseDropdown(!showWarehouseDropdown)
                  }
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm text-left flex justify-between items-center ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                >
                  <span>{warehouseName || "Select Warehouse"}</span>
                  <FiSearch className="w-4 h-4 text-gray-400" />
                </button>

                <CustomDropdown
                  show={showWarehouseDropdown}
                  search={warehouseSearch}
                  onSearchChange={setWarehouseSearch}
                  items={filteredWarehouses}
                  onSelect={handleWarehouseSelect}
                  placeholder="Warehouse"
                  displayKey="WH_Name"
                  dropdownRef={warehouseDropdownRef}
                />
              </div>

              {/* Bin Location */}
              <div className="space-y-1">
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Bin Location
                </label>
                <input
                  name="P_BINLOCATION"
                  placeholder="Enter Bin Location"
                  value={formData.P_BINLOCATION}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                />
              </div>

              {/* Re-Order Level */}
              <div className="space-y-1">
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Re-Order Level
                </label>
                <input
                  name="P_REOLEVEL"
                  type="number"
                  placeholder="Enter Re-Order Level"
                  value={formData.P_REOLEVEL}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                />
              </div>

              {/* Minimum Stock */}
              <div className="space-y-1">
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Minimum Stock
                </label>
                <input
                  name="P_MINSTOCK"
                  type="number"
                  placeholder="Enter Minimum Stock"
                  value={formData.P_MINSTOCK}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                />
              </div>

              {/* Type */}
              <div className="space-y-1">
                <label
                  className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Type *
                </label>

                <select
                  name="P_TYPE"
                  value={formData.P_TYPE}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                >
                  <option value="">Select a Type</option>
                  <option value="F">FIFO</option>
                  <option value="E">FEFO</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div
            className={`rounded-lg p-3 border ${darkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
              }`}
          >
            <p
              className={`text-xs ${darkMode ? "text-blue-300" : "text-blue-800"
                }`}
            >
              <strong>Note:</strong> Fields marked with * are required. Click
              the search icon to find and filter options in dropdowns. Image files must be less than 5MB.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-4 py-2 rounded-lg font-medium text-sm border transition-all duration-200 ${darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
      <SubCategoryAddModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
      />
    </div>
  );
}