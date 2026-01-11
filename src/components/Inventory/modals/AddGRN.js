// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { closeModal } from "../../../actions/modalActions";
// import { addGrn } from "../../../actions/Inventory/purchaseActions.js";
// import { FiX, FiPackage, FiPlus, FiTrash2, FiCalendar, FiCheckCircle } from "react-icons/fi";
// import dayjs from "dayjs";
// import { DatePicker, ConfigProvider } from "antd";
// import Select from "react-select";
// import "react-datepicker/dist/react-datepicker.css";
// import { listWarehouses } from "../../../actions/Inventory/warehouseActions.js";
// import { listSupplier } from "../../../actions/supplierAction.js";
// import { listProductDetails } from "../../../actions/Inventory/inventoryProductDetailActions.js";
// import { listInventoryProductsByStatus } from "../../../actions/Inventory/inventoryProductActions.js";
// import { listBatches } from "../../../actions/Inventory/batchActions.js";
// import purchaseService from "../../../services/Inventory/purchaseService.js";

// export default function AddGRNModal() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);
//   const customTheme = {
//     token: {
//       controlHeight: 40,
//       paddingContentHorizontal: 12,
//       borderRadius: 8,
//       colorBgContainer: darkMode ? "#374151" : "#F9FAFB",
//       colorBorder: darkMode ? "#4B5563" : "#E5E7EB",
//       colorText: darkMode ? "#FFFFFF" : "#111827",
//       colorTextPlaceholder: darkMode ? "#9CA3AF" : "#9CA3AF",
//       colorPrimary: "#D97706",
//       controlOutline: "rgba(217, 119, 6, 0.2)",
//       controlOutlineWidth: 2,
//       controlOutline: "transparent",
//       controlOutlineWidth: 0,
//       controlItemBgHover: "transparent",
//       motionDurationMid: "0.2s",
//       fontSize: 14,
//       colorBgElevated: darkMode ? "#1F2937" : "#FFFFFF",
//       colorBgLayout: darkMode ? "#111827" : "#F3F4F6",
//       colorTextHeading: darkMode ? "#F3F4F6" : "#374151",
//       colorSplit: darkMode ? "#374151" : "#E5E7EB",
//       colorIcon: darkMode ? "#D97706" : "#D97706",
//       colorIconHover: darkMode ? "#F59E0B" : "#B45309",
//       colorText: darkMode ? "#FFFFFF" : "#111827",
//       colorTextHeading: darkMode ? "#FFFFFF" : "#374151",
//     },
//     components: {
//       DatePicker: {
//         activeBorderColor: "#D97706",
//         hoverBorderColor: "#F59E0B",
//         activeShadow: "0 0 0 2px rgba(217, 119, 6, 0.2)",
//         cellActiveWithRangeBg: darkMode
//           ? "rgba(217, 119, 6, 0.3)"
//           : "rgba(217, 119, 6, 0.1)",
//         cellHoverWithRangeBg: darkMode
//           ? "rgba(217, 119, 6, 0.2)"
//           : "rgba(217, 119, 6, 0.05)",
//         cellRangeBorderColor: "#D97706",
//         colorBgContainerDisabled: darkMode ? "#374151" : "#F9FAFB",
//         colorIcon: darkMode ? "#D97706" : "#D97706",
//         colorIconHover: darkMode ? "#F59E0B" : "#B45309",
//       },
//       Calendar: {
//         colorBgContainer: darkMode ? "#1F2937" : "#FFFFFF",
//         colorBgLayout: darkMode ? "#111827" : "#F3F4F6",
//         colorText: darkMode ? "#F3F4F6" : "#374151",
//         colorTextHeading: darkMode ? "#F3F4F6" : "#374151",
//         colorSplit: darkMode ? "#374151" : "#E5E7EB",
//         colorPrimary: "#D97706",
//         colorPrimaryHover: "#F59E0B",
//         cellBg: darkMode ? "#1F2937" : "#FFFFFF",
//         cellHoverBg: darkMode
//           ? "rgba(217, 119, 6, 0.2)"
//           : "rgba(217, 119, 6, 0.1)",
//         cellActiveBg: darkMode
//           ? "rgba(217, 119, 6, 0.3)"
//           : "rgba(217, 119, 6, 0.2)",
//         cellRangeBorderColor: "#D97706",
//         colorBgContainer: darkMode ? "#1F2937" : "#FFFFFF",
//         colorPrimary: "#D97706",
//       },
//     },
//   };
  
//   const removeHoverStyles = `
//     .ant-picker {
//       border-color: ${darkMode ? "#4B5563" : "#E5E7EB"} !important;
//       box-shadow: none !important;
//     }
//     .ant-picker:hover {
//       border-color: ${darkMode ? "#4B5563" : "#E5E7EB"} !important;
//       box-shadow: none !important;
//       outline: none !important;
//     }
//     .ant-picker-cell-disabled .ant-picker-cell-inner {
//       color: ${darkMode ? "#6B7280" : "#9CA3AF"} !important;
//       background: ${darkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.1)"} !important;
//       cursor: not-allowed;
//     }
//     .ant-picker:focus,
//     .ant-picker:focus-within,
//     .ant-picker.ant-picker-focused {
//       border-color: #D97706 !important;
//       box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2) !important;
//       outline: none !important;
//     }
//     .ant-picker-cell-in-view:hover {
//       background-color: ${darkMode ? "rgba(217, 119, 6, 0.2)" : "rgba(217, 119, 6, 0.1)"} !important;
//     }
//     .ant-picker-cell-selected,
//     .ant-picker-cell-range-start,
//     .ant-picker-cell-range-end,
//     .ant-picker-cell-range-hover-start,
//     .ant-picker-cell-range-hover-end {
//       background-color: ${darkMode ? "rgba(217, 119, 6, 0.3)" : "rgba(217, 119, 6, 0.2)"} !important;
//       color: ${darkMode ? "#FFFFFF" : "#111827"} !important;
//     }
//     .ant-picker-cell-disabled:hover {
//       background-color: transparent !important;
//       cursor: not-allowed;
//     }
//   `;

//   const iconStyles = `
//     .ant-picker .ant-picker-suffix svg {
//       color: ${darkMode ? "#D97706" : "#D97706"} !important;
//       fill: ${darkMode ? "#D97706" : "#D97706"} !important;
//     }
//     .ant-picker:hover .ant-picker-suffix svg {
//       color: ${darkMode ? "#F59E0B" : "#B45309"} !important;
//       fill: ${darkMode ? "#F59E0B" : "#B45309"} !important;
//     }
//   `;

//   const modalProps = useSelector((state) => state.ui?.modalProps) || {};

//   const [searchProduct, setSearchProduct] = useState("");
//   const [showProductDropdown, setShowProductDropdown] = useState(false);
//   const [searchWarehouse, setSearchWarehouse] = useState("");
//   const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
//   const [searchSupplier, setSearchSupplier] = useState("");
//   const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);

//   const { warehouses = [] } = useSelector((state) => state.warehouse) || {};
//   const { suppliers = [] } = useSelector((state) => state.supplierList) || {};
//   const inventoryProducts =
//     useSelector((state) => state.inventoryProducts.inventoryProducts) || [];
//   const { batches = [] } = useSelector((state) => state.batch) || {};

//   const datePickerRef = useRef(null);
//   const datePicker2Ref = useRef(null);
//   const datePickerRef2 = useRef(null);

//   const handleGRNDate = () => {
//     datePicker2Ref.current.setFocus();
//   };

//   const handleInvoiceDate = () => {
//     datePickerRef.current.setFocus();
//   };

//   const handleExpireDate = () => {
//     datePickerRef2.current.setFocus();
//   };

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(d.getDate()).padStart(2, "0")}`;
//   };

//   const today = formatDate(new Date());

//   const [formData, setFormData] = useState({
//     GRN_WHCode: "",
//     GRN_DOCType: "GRN",
//     GRN_DOCSupID: "",
//     GRN_DOCINNo: "",
//     GRN_DOCINDate: today,
//     GRN_PDate: today,
//   });

//   const [productData, setProductData] = useState({
//     P_PRCODE: "",
//     P_BLQTY: "",
//     P_QTY: "",
//     P_VALUE: "",
//     P_AVERATE: "",
//     P_PPRICE: "",
//     P_MPRICE: "",
//     P_SPRICE: "",
//     P_EXDATE: "",
//     P_MARKTYPE: "V",  
//     P_MARKVALUE: "",
//   });

//   const [products, setProducts] = useState([]);

//   const filteredBatches = productData.P_PRCODE
//     ? batches.filter((b) => b.PB_ProCode === productData.P_PRCODE)
//     : [];

//   useEffect(() => {
//     dispatch(listWarehouses());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(listSupplier());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(listProductDetails());
//     dispatch(listInventoryProductsByStatus("A"));
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(listBatches());
//   }, [dispatch]);

//   const handleHeaderChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };
 
// const calculatePrices = (purchasePrice, markType, markValue) => {
//   if (!purchasePrice || !markValue || markValue === "") 
//     return { salePrice: "", markPrice: "" };

//   const purchasePriceNum = parseFloat(purchasePrice);
//   const markValueNum = parseFloat(markValue);

//   console.log("Calculating prices:", { purchasePriceNum, markType, markValueNum });

//   if (markType === "V") {
//     // Value type: add fixed value (Rs.)
//     const calculatedPrice = purchasePriceNum + markValueNum;
//     return {
//       salePrice: calculatedPrice.toFixed(2),
//       markPrice: calculatedPrice.toFixed(2),
//     };
//   } else if (markType === "P") {
//     // Percentage type: add percentage (%)
//     const calculatedPrice = purchasePriceNum + (purchasePriceNum * markValueNum / 100);
//     return {
//       salePrice: calculatedPrice.toFixed(2),
//       markPrice: calculatedPrice.toFixed(2),
//     };
//   }
//   return { salePrice: "", markPrice: "" };
// };

//   const handleProductChange = (e) => {
//     const { name, value } = e.target;
//     let newValue = value;

//     const numericFields = [
//       "P_QTY",
//       "P_VALUE",
//       "P_AVERATE",
//       "P_PPRICE",
//       "P_MPRICE",
//       "P_SPRICE",
//       "P_MARKVALUE",
//     ];

//     if (numericFields.includes(name)) {
//       // Allow clearing with backspace
//       if (value === "" || value === null || value === undefined) {
//         newValue = "";
//       } else if (/^\d*\.?\d*$/.test(value)) {
//         newValue = value;
//       } else {
//         return;
//       }
//     }

//     // Update product data
//     let updatedProduct = {
//       ...productData,
//       [name]: newValue,
//     };

//     // Recalculate values based on changes
//     const qty = parseFloat(updatedProduct.P_QTY);
//     const pPrice = parseFloat(updatedProduct.P_PPRICE);

//     // Calculate average rate and value
//     updatedProduct.P_AVERATE = !isNaN(pPrice) ? pPrice.toFixed(2) : "";
//     updatedProduct.P_VALUE =
//       !isNaN(qty) && !isNaN(pPrice) ? (qty * pPrice).toFixed(2) : "";

//     // Calculate sale price and mark price when purchase price or markup changes
//     if (
//       (name === "P_PPRICE" || name === "P_MARKTYPE" || name === "P_MARKVALUE") &&
//       updatedProduct.P_PPRICE &&
//       updatedProduct.P_MARKVALUE
//     ) {
//       const { salePrice, markPrice } = calculatePrices(
//         updatedProduct.P_PPRICE,
//         updatedProduct.P_MARKTYPE,
//         updatedProduct.P_MARKVALUE
//       );
//       updatedProduct.P_SPRICE = salePrice;
//       updatedProduct.P_MPRICE = markPrice;
//     }

//     setProductData(updatedProduct);
//   };


//   const handleMarkupTypeChange = (e) => {
//   const markType = e.target.value;
 
//   const newMarkValue = '';
 
//   const priceCalculation =
//     productData.P_PPRICE
//       ? calculatePrices(productData.P_PPRICE, markType, newMarkValue)
//       : {};

//   setProductData({
//     ...productData,
//     P_MARKTYPE: markType,
//     P_MARKVALUE: newMarkValue,
//     P_SPRICE: '',         
//     P_MPRICE: '',
//     ...priceCalculation,
//   });
// };


//   const formatWithCommas = (value) => {
//     if (!value) return "";
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   const removeNonDigits = (value) => value.replace(/\D/g, "");

//   const handleAddProduct = () => {
//     const requiredFields = [
//       productData.P_PRCODE,
//       productData.P_BLQTY,
//       productData.P_QTY,
//       productData.P_VALUE,
//       productData.P_AVERATE,
//       productData.P_PPRICE,
//       productData.P_MPRICE,
//       productData.P_SPRICE,
//       productData.P_EXDATE,
//       productData.P_MARKTYPE,
//       productData.P_MARKVALUE,
//     ];

//     console.log("Required fields:", requiredFields);

//     const isInvalid = requiredFields.some(
//       (field) => field === "0.00" || field === null || field === ""
//     );

//     if (!productData.P_BLQTY && productData.P_BLQTY !== 0) {
//       alert("Balance quantity is required");
//       return;
//     }

//     if (isInvalid) {
//       alert("Please fill all fields");
//       return;
//     }

//     // Calculate total quantity (balance + new)
//     const totalQuantity = parseFloat(productData.P_BLQTY);

//     const newProduct = {
//       ...productData,
//       P_PRCODE: productData.P_PRCODE,
//       P_QTY: Number(productData.P_QTY),
//       P_BLQTY: Number(productData.P_BLQTY || 0).toFixed(2),
//       P_VALUE: Number(productData.P_VALUE || 0).toFixed(2),
//       P_AVERATE: Number(productData.P_AVERATE || 0).toFixed(2),
//       P_PPRICE: Number(productData.P_PPRICE || 0).toFixed(2),
//       P_MPRICE: Number(productData.P_MPRICE || 0).toFixed(2),
//       P_SPRICE: Number(productData.P_SPRICE || 0).toFixed(2),
//       P_EXDATE: productData.P_EXDATE || "",
//       P_MARKTYPE: productData.P_MARKTYPE,
//       P_MARKVALUE: Number(productData.P_MARKVALUE || 0).toFixed(2),
//     };

//     setProducts([...products, newProduct]);
 
//     setProductData({
//       P_PRCODE: "",
//       P_QTY: "",
//       P_VALUE: "",
//       P_BLQTY: "",
//       P_AVERATE: "",
//       P_PPRICE: "",
//       P_MPRICE: "",
//       P_SPRICE: "",
//       P_EXDATE: "",
//       P_MARKTYPE: "V",
//       P_MARKVALUE: "",
//     });
//     setSearchProduct("");
//   };

//   const handleRemoveProduct = (index) => {
//     setProducts(products.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.GRN_WHCode || !formData.GRN_DOCSupID || !formData.GRN_PDate) {
//       alert("Please fill all required header fields");
//       return;
//     }

//     if (products.length === 0) {
//       alert("Please add at least one Product");
//       return;
//     }

//     const grnPayload = [
//       {
//         P_WHCODE: formData.GRN_WHCode,
//         P_SUPCODE: Number(formData.GRN_DOCSupID),
//         P_INNO: Number(formData.GRN_DOCINNo) || 0,
//         P_INDATE: formData.GRN_DOCINDate,
//         P_PDATE: formData.GRN_PDate,
//         Items: products.map((prod) => ({
//           P_PRCODE: prod.P_PRCODE,
//           P_QTY: Number(prod.P_QTY),
//           P_VALUE: Number(prod.P_VALUE || 0),
//           P_AVERATE: prod.P_AVERATE || "",
//           P_BLQTY: Number(prod.P_BLQTY || 0).toFixed(2),
//           P_PPRICE: Number(prod.P_PPRICE || 0),
//           P_MPRICE: Number(prod.P_MPRICE || 0),
//           P_SPRICE: Number(prod.P_SPRICE || 0),
//           P_EXDATE: prod.P_EXDATE || "",
//           P_MARKTYPE: prod.P_MARKTYPE,
//           P_MARKVALUE: Number(prod.P_MARKVALUE || 0),
//         })),
//       },
//     ];

//     console.log("Submitting GRN payload:", JSON.stringify(grnPayload, null, 2));

//     dispatch(addGrn(grnPayload))
//       .then(() => {
//         showAlertMessage("GRN Added Successfully!", "success");
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("GRN added successfully!", "success");
//         }
//         setTimeout(() => { dispatch(closeModal()); }, 1000);
//       })
//       .catch(() => {
//         showAlertMessage("Failed to add GRN", "error");
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("Failed to add GRN", "error");
//         }
//       });
//   };

//   const showAlertMessage = (message, type = "success") => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);

//     setTimeout(() => {
//       setShowAlert(false);
//     }, 1000);
//   };

//   const fieldClass = `w-full px-3 py-2 rounded-lg border text-sm ${darkMode
//     ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
//     : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
//     }`;

//   const dropdownClass = `absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border shadow-lg text-sm ${darkMode
//     ? "bg-gray-700 border-gray-600 text-white"
//     : "bg-white border-gray-200 text-gray-900"
//     }`;

//   const dropdownItemClass = `px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${darkMode ? "hover:bg-blue-600" : "hover:bg-blue-100"
//     }`;

//   // Alert styling functions
//   const getAlertBgColor = () => {
//     switch (alertType) {
//       case "success":
//         return "bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700";
//       case "error":
//         return "bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700";
//       case "warning":
//         return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/70 dark:border-yellow-700";
//       case "info":
//         return "bg-blue-100 border-blue-300 dark:bg-blue-900/70 dark:border-blue-700";
//       default:
//         return "bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700";
//     }
//   };

//   const getAlertTextColor = () => {
//     switch (alertType) {
//       case "success":
//         return "text-green-800 dark:text-green-200";
//       case "error":
//         return "text-red-800 dark:text-red-200";
//       case "warning":
//         return "text-yellow-800 dark:text-yellow-200";
//       case "info":
//         return "text-blue-800 dark:text-blue-200";
//       default:
//         return "text-gray-800 dark:text-gray-200";
//     }
//   };

//   const getAlertIcon = () => {
//     switch (alertType) {
//       case "success":
//         return (
//           <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
//         );
//       case "error":
//         return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
//       case "warning":
//         return (
//           <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//         );
//       case "info":
//         return <FiTruck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
//       default:
//         return <FiTruck className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
//       <div
//         className={`rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
//           }`}
//       >
//         {showAlert && (
//           <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
//             <div
//               className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}
//             >
//               <div className="flex items-center gap-2 sm:gap-3">
//                 {getAlertIcon()}
//                 <p className="font-medium text-sm sm:text-base">
//                   {alertMessage}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowAlert(false)}
//                 className="hover:opacity-70 transition-opacity"
//               >
//                 <FiX className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//         {/* Modal Header */}
//         <div
//           className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
//             }`}
//         >
//           <div className="flex items-center gap-2">
//             <div
//               className={`p-2 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"
//                 }`}
//             >
//               <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white">
//               Add New GRN
//             </h2>
//           </div>
//           <button
//             onClick={() => dispatch(closeModal())}
//             className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//               }`}
//           >
//             <FiX className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           {/* Header Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {/* Warehouse */}
//             <div>
//               <label className="block text-xs font-medium">Warehouse</label>
//               <Select
//                 options={warehouses.map((w) => ({
//                   value: w.WH_Code,
//                   label: w.WH_Name,
//                 }))}
//                 value={
//                   formData.GRN_WHCode
//                     ? {
//                       value: formData.GRN_WHCode,
//                       label:
//                         warehouses.find(
//                           (w) => w.WH_Code === formData.GRN_WHCode
//                         )?.WH_Name || "",
//                     }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setFormData({ ...formData, GRN_WHCode: selected.value })
//                 }
//                 placeholder="-- Select Warehouse --"
//                 isSearchable
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     backgroundColor: darkMode ? "#1f2937" : "white",
//                     color: darkMode ? "#e5e7eb" : "#111827",
//                     borderColor: darkMode ? "#374151" : "#d1d5db",
//                   }),
//                   menu: (base) => ({
//                     ...base,
//                     backgroundColor: darkMode ? "#374151" : "white",
//                     color: darkMode ? "#e5e7eb" : "#111827",
//                   }),
//                   option: (base, state) => ({
//                     ...base,
//                     backgroundColor: state.isFocused
//                       ? darkMode
//                         ? "#4b5563"
//                         : "#f3f4f6"
//                       : darkMode
//                         ? "#374151"
//                         : "white",
//                     color: darkMode ? "#e5e7eb" : "#111827",
//                   }),
//                   singleValue: (base) => ({
//                     ...base,
//                     color: darkMode ? "#e5e7eb" : "#111827",
//                   }),
//                   placeholder: (base) => ({
//                     ...base,
//                     color: darkMode ? "#9ca3af" : "#6b7280",
//                   }),
//                 }}
//               />
//             </div>

//             {/* Supplier */}
//             <div>
//               <label className="block text-xs font-medium">Supplier</label>
//               <Select
//                 options={suppliers.map((s) => ({
//                   value: s.SUP_CODE,
//                   label: s.SUP_NAME,
//                 }))}
//                 value={
//                   formData.GRN_DOCSupID
//                     ? {
//                       value: formData.GRN_DOCSupID,
//                       label:
//                         suppliers.find(
//                           (s) => s.SUP_CODE === formData.GRN_DOCSupID
//                         )?.SUP_NAME || "",
//                     }
//                     : null
//                 }
//                 onChange={(selected) => {
//                   setFormData({ ...formData, GRN_DOCSupID: selected.value });
//                 }}
//                 placeholder="-- Select Supplier --"
//                 isSearchable
//                 className="text-sm"
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     backgroundColor: darkMode ? "#1f2937" : "#fff",
//                     color: darkMode ? "#f3f4f6" : "#111827",
//                     borderColor: darkMode ? "#374151" : "#d1d5db",
//                   }),
//                   menu: (base) => ({
//                     ...base,
//                     backgroundColor: darkMode ? "#1f2937" : "#fff",
//                     color: darkMode ? "#f3f4f6" : "#111827",
//                   }),
//                   singleValue: (base) => ({
//                     ...base,
//                     color: darkMode ? "#f3f4f6" : "#111827",
//                   }),
//                   option: (base, state) => ({
//                     ...base,
//                     backgroundColor: state.isFocused
//                       ? darkMode
//                         ? "#374151"
//                         : "#e5e7eb"
//                       : darkMode
//                         ? "#1f2937"
//                         : "#fff",
//                     color: darkMode ? "#f3f4f6" : "#111827",
//                   }),
//                   placeholder: (base) => ({
//                     ...base,
//                     color: darkMode ? "#9ca3af" : "#6b7280",
//                   }),
//                 }}
//               />
//             </div>

//             {/* Invoice No */}
//             <div>
//               <label className="block text-xs font-medium">Invoice No</label>
//               <input
//                 name="GRN_DOCINNo"
//                 value={formData.GRN_DOCINNo}
//                 onChange={handleHeaderChange}
//                 className={fieldClass}
//                 required
//               />
//             </div>

//             {/* Invoice Date */}
//             <div>
//               <label className="block text-xs font-medium">Invoice Date</label>
//               <style>{removeHoverStyles}</style>
//               <style>{iconStyles}</style>
//               <ConfigProvider theme={customTheme}>
//                 <DatePicker
//                   picker="date"
//                   format="YYYY-MM-DD"
//                   style={{ width: "100%" }}
//                   placeholder="Select date"
//                   value={
//                     formData.GRN_DOCINDate
//                       ? dayjs(formData.GRN_DOCINDate)
//                       : null
//                   }
//                   onChange={(date, dateString) =>
//                     setFormData({
//                       ...formData,
//                       GRN_DOCINDate: dateString,
//                     })
//                   }
//                   disabledDate={(current) => {
//                     return current && current > dayjs().endOf("day");
//                   }}
//                 />
//               </ConfigProvider>
//             </div>
//           </div>

//           {/* GRN Date */}
//           <div>
//             <label className="block text-xs font-medium">GRN Date</label>
//             <ConfigProvider theme={customTheme}>
//               <DatePicker
//                 picker="date"
//                 format="YYYY-MM-DD"
//                 style={{ width: "50%" }}
//                 placeholder="Select GRN Date"
//                 value={formData.GRN_PDate ? dayjs(formData.GRN_PDate) : null}
//                 onChange={(date, dateString) =>
//                   setFormData({ ...formData, GRN_PDate: dateString })
//                 }
//                 disabledDate={(current) =>
//                   current &&
//                   (current < dayjs().startOf("day") ||
//                     current > dayjs().endOf("day"))
//                 }
//               />
//             </ConfigProvider>
//           </div>

//           {/* Product Entry */}
//           <div className="border p-3 rounded-lg space-y-2">
//             <h3 className="font-semibold text-sm">Add Product</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               {/* Product Code */}
//               <div>
//                 <label
//                   className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
//                     }`}
//                 >
//                   Search or Select Product Code *
//                 </label>
//                 <Select
//                   options={inventoryProducts.map((p) => ({
//                     value: p.PC_Code,
//                     label: ` ${p.PC_DEC}`,
//                   }))}
//                   value={
//                     productData.P_PRCODE
//                       ? {
//                         value: productData.P_PRCODE,
//                         label: ` ${inventoryProducts.find(
//                           (ip) => ip.PC_Code === productData.P_PRCODE
//                         )?.PC_DEC || ""
//                           }`,
//                       }
//                       : null
//                   }
//                   onChange={async (selected) => {
//                     console.log("Selected product:", selected);

//                     try {
//                       const balanceQty = await purchaseService.getBalanceQty({
//                         P_WHCODE: formData.GRN_WHCode,
//                         P_PRCODE: selected.value,
//                       });

//                       console.log("Balance quantity fetched:", balanceQty);

//                       setProductData({
//                         ...productData,
//                         P_PRCODE: selected.value,
//                         P_BLQTY: balanceQty,
//                       });
//                     } catch (error) {
//                       console.error("Failed to fetch balance qty", error);
//                       setProductData({
//                         ...productData,
//                         P_PRCODE: selected.value,
//                         P_BLQTY: 0,
//                       });
//                     }
//                   }}
//                   placeholder="-- Select Product --"
//                   isSearchable
//                   className="text-sm"
//                   isDisabled={!formData.GRN_WHCode}
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       backgroundColor: darkMode ? "#1f2937" : "#fff",
//                       color: darkMode ? "#f3f4f6" : "#111827",
//                       borderColor: darkMode ? "#374151" : "#d1d5db",
//                     }),
//                     menu: (base) => ({
//                       ...base,
//                       backgroundColor: darkMode ? "#1f2937" : "#fff",
//                       color: darkMode ? "#f3f4f6" : "#111827",
//                     }),
//                     singleValue: (base) => ({
//                       ...base,
//                       color: darkMode ? "#f3f4f6" : "#111827",
//                     }),
//                     option: (base, state) => ({
//                       ...base,
//                       backgroundColor: state.isFocused
//                         ? darkMode
//                           ? "#374151"
//                           : "#e5e7eb"
//                         : darkMode
//                           ? "#1f2937"
//                           : "#fff",
//                       color: darkMode ? "#f3f4f6" : "#111827",
//                     }),
//                     placeholder: (base) => ({
//                       ...base,
//                       color: darkMode ? "#9ca3af" : "#6b7280",
//                     }),
//                   }}
//                 />
//               </div>

//               {/* Balance Quantity */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Balance Quantity
//                 </label>
//                 <input
//                   type="number"
//                   name="P_BLQTY"
//                   value={productData.P_BLQTY}
//                   className={fieldClass}
//                   readOnly
//                 />
//               </div>

//               {/* Quantity */}
//               <div>
//                 <label className="block text-xs font-medium">GRN Quantity</label>
//                 <input
//                   name="P_QTY"
//                   type="text"
//                   value={formatWithCommas(productData.P_QTY)}
//                   onChange={(e) => {
//                     const digitsOnly = removeNonDigits(e.target.value);
//                     setProductData({
//                       ...productData,
//                       P_QTY: digitsOnly,
//                     });
//                   }}
//                   className={fieldClass}
//                 />
//               </div>

//               {/* Purchase Price */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Purchase Price (Rs.)
//                 </label>
//                 <input
//                   name="P_PPRICE"
//                   type="number"
//                   value={productData.P_PPRICE}
//                   onChange={handleProductChange}
//                   className={fieldClass}
//                 />
//               </div>

//                {/* Ave Rate */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Unit Price (Rs.)
//                 </label>
//                 <input
//                   name="P_PPRICE"
//                   type="number"
//                   value={productData.P_PPRICE}
//                   onChange={handleProductChange}
//                   className={fieldClass}
//                 />
//               </div>

//               {/* Value */}
//               <div>
//                 <label className="block text-xs font-medium">Value (Rs.)</label>
//                 <input
//                   name="P_VALUE"
//                   type="number"
//                   value={productData.P_VALUE}
//                   readOnly
//                   className={fieldClass}
//                 /> 
//               </div>

//               {/* Markup Type */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Markup Type
//                 </label>
//                 <select
//                   name="P_MARKTYPE"
//                   value={productData.P_MARKTYPE}
//                   onChange={handleMarkupTypeChange}
//                   className={fieldClass}
//                 >
//                   <option value="V">Value</option>
//                   <option value="P">Percentage</option>
//                 </select>
//               </div>

//               {/* Markup Value */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Markup {productData.P_MARKTYPE === "V" ? "Value (Rs.)" : "Percentage (%)"}
//                 </label>
//                 <input
//                   name="P_MARKVALUE"
//                   type="number"
//                   value={productData.P_MARKVALUE}
//                   onChange={handleProductChange}
//                   className={fieldClass}
//                   placeholder={productData.P_MARKTYPE === "V" ? "Enter value" : "Enter percentage"}
//                 />
//               </div>

//               {/* Sale Price (Read-only) */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Sale Price (Rs.)
//                 </label>
//                 <input
//                   name="P_SPRICE"
//                   type="number"
//                   value={productData.P_SPRICE}
//                   readOnly
//                   className={`${fieldClass} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`}
//                 />
//               </div>

//               {/* Mark Price (Editable) */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Marked Price (Rs.)
//                 </label>
//                 <input
//                   name="P_MPRICE"
//                   type="number"
//                   value={productData.P_MPRICE}
//                   onChange={handleProductChange}
//                   className={fieldClass}
//                 />
//               </div>

//               {/* Product Expiry Date */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Expiry Date *
//                 </label>
//                 <ConfigProvider theme={customTheme}>
//                   <DatePicker
//                     picker="date"
//                     format="YYYY-MM-DD"
//                     style={{ width: "100%" }}
//                     placeholder="Select Expiry Date"
//                     value={
//                       productData.P_EXDATE ? dayjs(productData.P_EXDATE) : null
//                     }
//                     onChange={(date, dateString) =>
//                       setProductData({ ...productData, P_EXDATE: dateString })
//                     }
//                     disabledDate={(current) =>
//                       current && current < dayjs().startOf("day")
//                     }
//                   />
//                 </ConfigProvider>
//               </div>

//               {/* Add Button */}
//               <div className="md:col-span-3 flex justify-end mt-2">
//                 <button
//                   type="button"
//                   onClick={handleAddProduct}
//                   className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
//                 >
//                   <FiPlus className="w-4 h-4" />
//                   Add
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Information Note */}
//           <div
//             className={`md:col-span-2 rounded-lg p-3 border w-full ${darkMode
//               ? "bg-blue-900/20 border-blue-800"
//               : "bg-blue-50 border-blue-200"
//               }`}
//           >
//             <p
//               className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-800"
//                 }`}
//             >
//               <strong>Note:</strong> All Quantities, Prices and Values fields
//               must be filled using two decimal places, 10.00, 5.50, 3.75 etc.
//             </p>
//           </div>

//           {/* Preview Table */}
//           {products.length > 0 && (
//             <div
//               className={`rounded-xl border overflow-hidden mt-3 ${darkMode
//                 ? "bg-gray-700/30 border-gray-600"
//                 : "bg-gray-50 border-gray-200"
//                 }`}
//             >
//               <div className="overflow-x-auto">
//                 <div className="max-h-[250px] overflow-y-auto">
//                   <table className="w-full">
//                     <thead
//                       className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
//                         }`}
//                     >
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs font-semibold">
//                           Product
//                         </th>
//                         <th className="px-3 py-2 text-left text-xs font-semibold">
//                           Total Quantity
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           New Quantity
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Value
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Purchase Price
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Markup Type
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Markup Value
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Sale Price
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Marked Price
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Expire Date
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody
//                       className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
//                         }`}
//                     >
//                       {products.map((p, i) => (
//                         <tr
//                           key={i}
//                           className={`transition-colors ${darkMode
//                             ? "hover:bg-gray-700/50"
//                             : "hover:bg-gray-100"
//                             }`}
//                         >
//                           <td className="px-3 py-2 text-xs">{p.P_PRCODE}</td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_BLQTY)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_QTY)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_VALUE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_PPRICE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {p.P_MARKTYPE === "V" ? "Value" : "Percentage"}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_MARKVALUE)}
//                             {p.P_MARKTYPE === "P" ? "%" : ""}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_SPRICE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_MPRICE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {p.P_EXDATE}
//                           </td>
//                           <td className="px-3 py-2 text-center">
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveProduct(i)}
//                               className="px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs flex items-center gap-1 mx-auto"
//                             >
//                               <FiTrash2 className="w-3 h-3" />
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={() => dispatch(closeModal())}
//               className="px-3 py-2 border rounded-lg text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../actions/modalActions";
import { addGrn } from "../../../actions/Inventory/purchaseActions.js";
import { FiX, FiPackage, FiPlus, FiTrash2, FiCalendar, FiCheckCircle } from "react-icons/fi";
import dayjs from "dayjs";
import { DatePicker, ConfigProvider } from "antd";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { listWarehouses } from "../../../actions/Inventory/warehouseActions.js";
import { listSupplier } from "../../../actions/supplierAction.js";
import { listProductDetails } from "../../../actions/Inventory/inventoryProductDetailActions.js";
import { listInventoryProductsByStatus } from "../../../actions/Inventory/inventoryProductActions.js";
import { listBatches } from "../../../actions/Inventory/batchActions.js";
import purchaseService from "../../../services/Inventory/purchaseService.js";

export default function AddGRNModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);
  const customTheme = {
    token: {
      controlHeight: 40,
      paddingContentHorizontal: 12,
      borderRadius: 8,
      colorBgContainer: darkMode ? "#374151" : "#F9FAFB",
      colorBorder: darkMode ? "#4B5563" : "#E5E7EB",
      colorText: darkMode ? "#FFFFFF" : "#111827",
      colorTextPlaceholder: darkMode ? "#9CA3AF" : "#9CA3AF",
      colorPrimary: "#D97706",
      controlOutline: "rgba(217, 119, 6, 0.2)",
      controlOutlineWidth: 2,
      controlOutline: "transparent",
      controlOutlineWidth: 0,
      controlItemBgHover: "transparent",
      motionDurationMid: "0.2s",
      fontSize: 14,
      colorBgElevated: darkMode ? "#1F2937" : "#FFFFFF",
      colorBgLayout: darkMode ? "#111827" : "#F3F4F6",
      colorTextHeading: darkMode ? "#F3F4F6" : "#374151",
      colorSplit: darkMode ? "#374151" : "#E5E7EB",
      colorIcon: darkMode ? "#D97706" : "#D97706",
      colorIconHover: darkMode ? "#F59E0B" : "#B45309",
      colorText: darkMode ? "#FFFFFF" : "#111827",
      colorTextHeading: darkMode ? "#FFFFFF" : "#374151",
    },
    components: {
      DatePicker: {
        activeBorderColor: "#D97706",
        hoverBorderColor: "#F59E0B",
        activeShadow: "0 0 0 2px rgba(217, 119, 6, 0.2)",
        cellActiveWithRangeBg: darkMode
          ? "rgba(217, 119, 6, 0.3)"
          : "rgba(217, 119, 6, 0.1)",
        cellHoverWithRangeBg: darkMode
          ? "rgba(217, 119, 6, 0.2)"
          : "rgba(217, 119, 6, 0.05)",
        cellRangeBorderColor: "#D97706",
        colorBgContainerDisabled: darkMode ? "#374151" : "#F9FAFB",
        colorIcon: darkMode ? "#D97706" : "#D97706",
        colorIconHover: darkMode ? "#F59E0B" : "#B45309",
      },
      Calendar: {
        colorBgContainer: darkMode ? "#1F2937" : "#FFFFFF",
        colorBgLayout: darkMode ? "#111827" : "#F3F4F6",
        colorText: darkMode ? "#F3F4F6" : "#374151",
        colorTextHeading: darkMode ? "#F3F4F6" : "#374151",
        colorSplit: darkMode ? "#374151" : "#E5E7EB",
        colorPrimary: "#D97706",
        colorPrimaryHover: "#F59E0B",
        cellBg: darkMode ? "#1F2937" : "#FFFFFF",
        cellHoverBg: darkMode
          ? "rgba(217, 119, 6, 0.2)"
          : "rgba(217, 119, 6, 0.1)",
        cellActiveBg: darkMode
          ? "rgba(217, 119, 6, 0.3)"
          : "rgba(217, 119, 6, 0.2)",
        cellRangeBorderColor: "#D97706",
        colorBgContainer: darkMode ? "#1F2937" : "#FFFFFF",
        colorPrimary: "#D97706",
      },
    },
  };
  
  const removeHoverStyles = `
    .ant-picker {
      border-color: ${darkMode ? "#4B5563" : "#E5E7EB"} !important;
      box-shadow: none !important;
    }
    .ant-picker:hover {
      border-color: ${darkMode ? "#4B5563" : "#E5E7EB"} !important;
      box-shadow: none !important;
      outline: none !important;
    }
    .ant-picker-cell-disabled .ant-picker-cell-inner {
      color: ${darkMode ? "#6B7280" : "#9CA3AF"} !important;
      background: ${darkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.1)"} !important;
      cursor: not-allowed;
    }
    .ant-picker:focus,
    .ant-picker:focus-within,
    .ant-picker.ant-picker-focused {
      border-color: #D97706 !important;
      box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2) !important;
      outline: none !important;
    }
    .ant-picker-cell-in-view:hover {
      background-color: ${darkMode ? "rgba(217, 119, 6, 0.2)" : "rgba(217, 119, 6, 0.1)"} !important;
    }
    .ant-picker-cell-selected,
    .ant-picker-cell-range-start,
    .ant-picker-cell-range-end,
    .ant-picker-cell-range-hover-start,
    .ant-picker-cell-range-hover-end {
      background-color: ${darkMode ? "rgba(217, 119, 6, 0.3)" : "rgba(217, 119, 6, 0.2)"} !important;
      color: ${darkMode ? "#FFFFFF" : "#111827"} !important;
    }
    .ant-picker-cell-disabled:hover {
      background-color: transparent !important;
      cursor: not-allowed;
    }
  `;

  const iconStyles = `
    .ant-picker .ant-picker-suffix svg {
      color: ${darkMode ? "#D97706" : "#D97706"} !important;
      fill: ${darkMode ? "#D97706" : "#D97706"} !important;
    }
    .ant-picker:hover .ant-picker-suffix svg {
      color: ${darkMode ? "#F59E0B" : "#B45309"} !important;
      fill: ${darkMode ? "#F59E0B" : "#B45309"} !important;
    }
  `;

  const modalProps = useSelector((state) => state.ui?.modalProps) || {};

  const [searchProduct, setSearchProduct] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [searchWarehouse, setSearchWarehouse] = useState("");
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  const { warehouses = [] } = useSelector((state) => state.warehouse) || {};
  const { suppliers = [] } = useSelector((state) => state.supplierList) || {};
  const inventoryProducts =
    useSelector((state) => state.inventoryProducts.inventoryProducts) || [];
  const { batches = [] } = useSelector((state) => state.batch) || {};

  const datePickerRef = useRef(null);
  const datePicker2Ref = useRef(null);
  const datePickerRef2 = useRef(null);

  const handleGRNDate = () => {
    datePicker2Ref.current.setFocus();
  };

  const handleInvoiceDate = () => {
    datePickerRef.current.setFocus();
  };

  const handleExpireDate = () => {
    datePickerRef2.current.setFocus();
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

  const [formData, setFormData] = useState({
    GRN_WHCode: "",
    GRN_DOCType: "GRN",
    GRN_DOCSupID: "",
    GRN_DOCINNo: "",
    GRN_DOCINDate: today,
    GRN_PDate: today,
  });

  const [productData, setProductData] = useState({
    P_PRCODE: "",
    P_BLQTY: "",
    P_QTY: "",
    P_VALUE: "",
    P_AVERATE: "",
    P_PPRICE: "",
    P_MPRICE: "",
    P_SPRICE: "",
    P_EXDATE: "",
    P_MARKTYPE: "V",  
    P_MARKVALUE: "",
  });

  const [products, setProducts] = useState([]);
  const [hasProducts, setHasProducts] = useState(false);

  const filteredBatches = productData.P_PRCODE
    ? batches.filter((b) => b.PB_ProCode === productData.P_PRCODE)
    : [];

  useEffect(() => {
    dispatch(listWarehouses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listSupplier());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listProductDetails());
    dispatch(listInventoryProductsByStatus("A"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(listBatches());
  }, [dispatch]);
 
  useEffect(() => {
    setHasProducts(products.length > 0);
  }, [products]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
const calculatePrices = (purchasePrice, markType, markValue) => {
  if (!purchasePrice || !markValue || markValue === "") 
    return { salePrice: "", markPrice: "" };

  const purchasePriceNum = parseFloat(purchasePrice);
  const markValueNum = parseFloat(markValue);

  

  if (markType === "V") { 
    const calculatedPrice = purchasePriceNum + markValueNum;
    return {
      salePrice: calculatedPrice.toFixed(2),
      markPrice: calculatedPrice.toFixed(2),
    };
  } else if (markType === "P") { 
    const calculatedPrice = purchasePriceNum + (purchasePriceNum * markValueNum / 100);
    return {
      salePrice: calculatedPrice.toFixed(2),
      markPrice: calculatedPrice.toFixed(2),
    };
  }
  return { salePrice: "", markPrice: "" };
};

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    const numericFields = [
      "P_QTY",
      "P_VALUE",
      "P_AVERATE",
      "P_PPRICE",
      "P_MPRICE",
      "P_SPRICE",
      "P_MARKVALUE",
    ];

    if (numericFields.includes(name)) { 
      if (value === "" || value === null || value === undefined) {
        newValue = "";
      } else if (/^\d*\.?\d*$/.test(value)) {
        newValue = value;
      } else {
        return;
      }
    }
 
    let updatedProduct = {
      ...productData,
      [name]: newValue,
    };
 
    const qty = parseFloat(updatedProduct.P_QTY);
    const pPrice = parseFloat(updatedProduct.P_PPRICE);
 
    updatedProduct.P_AVERATE = !isNaN(pPrice) ? pPrice.toFixed(2) : "";
    updatedProduct.P_VALUE =
      !isNaN(qty) && !isNaN(pPrice) ? (qty * pPrice).toFixed(2) : "";
 
    if (
      (name === "P_PPRICE" || name === "P_MARKTYPE" || name === "P_MARKVALUE") &&
      updatedProduct.P_PPRICE &&
      updatedProduct.P_MARKVALUE
    ) {
      const { salePrice, markPrice } = calculatePrices(
        updatedProduct.P_PPRICE,
        updatedProduct.P_MARKTYPE,
        updatedProduct.P_MARKVALUE
      );
      updatedProduct.P_SPRICE = salePrice;
      updatedProduct.P_MPRICE = markPrice;
    }

    setProductData(updatedProduct);
  };


  const handleMarkupTypeChange = (e) => {
  const markType = e.target.value;
 
  const newMarkValue = '';
 
  const priceCalculation =
    productData.P_PPRICE
      ? calculatePrices(productData.P_PPRICE, markType, newMarkValue)
      : {};

  setProductData({
    ...productData,
    P_MARKTYPE: markType,
    P_MARKVALUE: newMarkValue,
    P_SPRICE: '',         
    P_MPRICE: '',
    ...priceCalculation,
  });
};


  const formatWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const removeNonDigits = (value) => value.replace(/\D/g, "");

  const handleAddProduct = () => {
    const requiredFields = [
      productData.P_PRCODE,
      productData.P_BLQTY,
      productData.P_QTY,
      productData.P_VALUE,
      productData.P_AVERATE,
      productData.P_PPRICE,
      productData.P_MPRICE,
      productData.P_SPRICE,
      productData.P_EXDATE,
      productData.P_MARKTYPE,
      productData.P_MARKVALUE,
    ];

 

    const isInvalid = requiredFields.some(
      (field) => field === "0.00" || field === null || field === ""
    );

    if (!productData.P_BLQTY && productData.P_BLQTY !== 0) {
      alert("Balance quantity is required");
      return;
    }

    if (isInvalid) {
      alert("Please fill all fields");
      return;
    }
 
    const totalQuantity = parseFloat(productData.P_BLQTY);

    const newProduct = {
      ...productData,
      P_PRCODE: productData.P_PRCODE,
      P_QTY: Number(productData.P_QTY),
      P_BLQTY: Number(productData.P_BLQTY || 0).toFixed(2),
      P_VALUE: Number(productData.P_VALUE || 0).toFixed(2),
      P_AVERATE: Number(productData.P_AVERATE || 0).toFixed(2),
      P_PPRICE: Number(productData.P_PPRICE || 0).toFixed(2),
      P_MPRICE: Number(productData.P_MPRICE || 0).toFixed(2),
      P_SPRICE: Number(productData.P_SPRICE || 0).toFixed(2),
      P_EXDATE: productData.P_EXDATE || "",
      P_MARKTYPE: productData.P_MARKTYPE,
      P_MARKVALUE: Number(productData.P_MARKVALUE || 0).toFixed(2),
    };

    setProducts([...products, newProduct]);
    setHasProducts(true);
 
    setProductData({
      P_PRCODE: "",
      P_QTY: "",
      P_VALUE: "",
      P_BLQTY: "",
      P_AVERATE: "",
      P_PPRICE: "",
      P_MPRICE: "",
      P_SPRICE: "",
      P_EXDATE: "",
      P_MARKTYPE: "V",
      P_MARKVALUE: "",
    });
    setSearchProduct("");
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    setHasProducts(updatedProducts.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.GRN_WHCode || !formData.GRN_DOCSupID || !formData.GRN_PDate) {
      alert("Please fill all required header fields");
      return;
    }
    

    if (products.length === 0) {
      alert("Please add at least one Product");
      return;
    }

    const grnPayload = [
      {
        P_WHCODE: formData.GRN_WHCode,
        P_SUPCODE: Number(formData.GRN_DOCSupID),
        P_INNO: Number(formData.GRN_DOCINNo) || 0,
        P_INDATE: formData.GRN_DOCINDate,
        P_PDATE: formData.GRN_PDate,
        Items: products.map((prod) => ({
          P_PRCODE: prod.P_PRCODE,
          P_QTY: Number(prod.P_QTY),
          P_VALUE: Number(prod.P_VALUE || 0),
          P_AVERATE: prod.P_AVERATE || "",
          P_BLQTY: Number(prod.P_BLQTY || 0).toFixed(2),
          P_PPRICE: Number(prod.P_PPRICE || 0),
          P_MPRICE: Number(prod.P_MPRICE || 0),
          P_SPRICE: Number(prod.P_SPRICE || 0),
          P_EXDATE: prod.P_EXDATE || "",
          P_MARKTYPE: prod.P_MARKTYPE,
          P_MARKVALUE: Number(prod.P_MARKVALUE || 0),
        })),
      },
    ];

 

    dispatch(addGrn(grnPayload))
      .then(() => {
        showAlertMessage("GRN Added Successfully!", "success");
        if (modalProps.onSuccess) {
          modalProps.onSuccess("GRN added successfully!", "success");
        }
        setTimeout(() => { dispatch(closeModal()); }, 1000);
      })
      .catch(() => {
        showAlertMessage("Failed to add GRN", "error");
        if (modalProps.onSuccess) {
          modalProps.onSuccess("Failed to add GRN", "error");
        }
      });
  };

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const fieldClass = `w-full px-3 py-2 rounded-lg border text-sm ${darkMode
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
    }`;

  const dropdownClass = `absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border shadow-lg text-sm ${darkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-200 text-gray-900"
    }`;

  const dropdownItemClass = `px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${darkMode ? "hover:bg-blue-600" : "hover:bg-blue-100"
    }`;

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
        className={`rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        {showAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
            <div
              className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {getAlertIcon()}
                <p className="font-medium text-sm sm:text-base">
                  {alertMessage}
                </p>
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
              Add New GRN
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
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Warehouse */}
            <div>
              <label className="block text-xs font-medium">Warehouse</label>
              <Select
                options={warehouses.map((w) => ({
                  value: w.WH_Code,
                  label: w.WH_Name,
                }))}
                value={
                  formData.GRN_WHCode
                    ? {
                      value: formData.GRN_WHCode,
                      label:
                        warehouses.find(
                          (w) => w.WH_Code === formData.GRN_WHCode
                        )?.WH_Name || "",
                    }
                    : null
                }
                onChange={(selected) =>
                  setFormData({ ...formData, GRN_WHCode: selected.value })
                }
                placeholder="-- Select Warehouse --"
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: darkMode ? "#1f2937" : "white",
                    color: darkMode ? "#e5e7eb" : "#111827",
                    borderColor: darkMode ? "#374151" : "#d1d5db",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: darkMode ? "#374151" : "white",
                    color: darkMode ? "#e5e7eb" : "#111827",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? darkMode
                        ? "#4b5563"
                        : "#f3f4f6"
                      : darkMode
                        ? "#374151"
                        : "white",
                    color: darkMode ? "#e5e7eb" : "#111827",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: darkMode ? "#e5e7eb" : "#111827",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  }),
                }}
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-xs font-medium">Supplier</label>
              <Select
                options={suppliers.map((s) => ({
                  value: s.SUP_CODE,
                  label: s.SUP_NAME,
                }))}
                value={
                  formData.GRN_DOCSupID
                    ? {
                      value: formData.GRN_DOCSupID,
                      label:
                        suppliers.find(
                          (s) => s.SUP_CODE === formData.GRN_DOCSupID
                        )?.SUP_NAME || "",
                    }
                    : null
                }
                onChange={(selected) => {
                  setFormData({ ...formData, GRN_DOCSupID: selected.value });
                }}
                placeholder="-- Select Supplier --"
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                    color: darkMode ? "#f3f4f6" : "#111827",
                    borderColor: darkMode ? "#374151" : "#d1d5db",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                    color: darkMode ? "#f3f4f6" : "#111827",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: darkMode ? "#f3f4f6" : "#111827",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? darkMode
                        ? "#374151"
                        : "#e5e7eb"
                      : darkMode
                        ? "#1f2937"
                        : "#fff",
                    color: darkMode ? "#f3f4f6" : "#111827",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: darkMode ? "#9ca3af" : "#6b7280",
                  }),
                }}
              />
            </div>

            {/* Invoice No */}
            <div>
              <label className="block text-xs font-medium">Invoice No</label>
              <input
                name="GRN_DOCINNo"
                value={formData.GRN_DOCINNo}
                onChange={handleHeaderChange}
                className={fieldClass}
                required
              />
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-xs font-medium">Invoice Date</label>
              <style>{removeHoverStyles}</style>
              <style>{iconStyles}</style>
              <ConfigProvider theme={customTheme}>
                <DatePicker
                  picker="date"
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Select date"
                  value={
                    formData.GRN_DOCINDate
                      ? dayjs(formData.GRN_DOCINDate)
                      : null
                  }
                  onChange={(date, dateString) =>
                    setFormData({
                      ...formData,
                      GRN_DOCINDate: dateString,
                    })
                  }
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf("day");
                  }}
                />
              </ConfigProvider>
            </div>
          </div>

          {/* GRN Date */}
          <div>
            <label className="block text-xs font-medium">GRN Date</label>
            <ConfigProvider theme={customTheme}>
              <DatePicker
                picker="date"
                format="YYYY-MM-DD"
                style={{ width: "50%" }}
                placeholder="Select GRN Date"
                value={formData.GRN_PDate ? dayjs(formData.GRN_PDate) : null}
                onChange={(date, dateString) =>
                  setFormData({ ...formData, GRN_PDate: dateString })
                }
                disabledDate={(current) =>
                  current &&
                  (current < dayjs().startOf("day") ||
                    current > dayjs().endOf("day"))
                }
              />
            </ConfigProvider>
          </div>

          {/* Product Entry */}
          <div className="border p-3 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Add Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Product Code */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Search or Select Product Code *
                </label>
                <Select
                  options={inventoryProducts.map((p) => ({
                    value: p.PC_Code,
                    label: ` ${p.PC_DEC}`,
                  }))}
                  value={
                    productData.P_PRCODE
                      ? {
                        value: productData.P_PRCODE,
                        label: ` ${inventoryProducts.find(
                          (ip) => ip.PC_Code === productData.P_PRCODE
                        )?.PC_DEC || ""
                          }`,
                      }
                      : null
                  }
                  onChange={async (selected) => {
 

                    try {
                      const balanceQty = await purchaseService.getBalanceQty({
                        P_WHCODE: formData.GRN_WHCode,
                        P_PRCODE: selected.value,
                      });

 

                      setProductData({
                        ...productData,
                        P_PRCODE: selected.value,
                        P_BLQTY: balanceQty,
                      });
                    } catch (error) {
 
                      setProductData({
                        ...productData,
                        P_PRCODE: selected.value,
                        P_BLQTY: 0,
                      });
                    }
                  }}
                  placeholder="-- Select Product --"
                  isSearchable
                  className="text-sm"
                  isDisabled={!formData.GRN_WHCode}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                      color: darkMode ? "#f3f4f6" : "#111827",
                      borderColor: darkMode ? "#374151" : "#d1d5db",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                      color: darkMode ? "#f3f4f6" : "#111827",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: darkMode ? "#f3f4f6" : "#111827",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? darkMode
                          ? "#374151"
                          : "#e5e7eb"
                        : darkMode
                          ? "#1f2937"
                          : "#fff",
                      color: darkMode ? "#f3f4f6" : "#111827",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: darkMode ? "#9ca3af" : "#6b7280",
                    }),
                  }}
                />
              </div>

              {/* Balance Quantity */}
              <div>
                <label className="block text-xs font-medium">
                  Balance Quantity
                </label>
                <input
                  type="number"
                  name="P_BLQTY"
                  value={productData.P_BLQTY}
                  className={fieldClass}
                  readOnly
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-medium">GRN Quantity</label>
                <input
                  name="P_QTY"
                  type="text"
                  value={formatWithCommas(productData.P_QTY)}
                  onChange={(e) => {
                    const digitsOnly = removeNonDigits(e.target.value);
                    setProductData({
                      ...productData,
                      P_QTY: digitsOnly,
                    });
                  }}
                  className={fieldClass}
                />
              </div>

              {/* Purchase Price */}
              <div>
                <label className="block text-xs font-medium">
                  Purchase Price (Rs.)
                </label>
                <input
                  name="P_PPRICE"
                  type="number"
                  value={productData.P_PPRICE}
                  onChange={handleProductChange}
                  className={fieldClass}
                />
              </div>

               {/* Ave Rate */}
              <div>
                <label className="block text-xs font-medium">
                  Unit Price (Rs.)
                </label>
                <input
                  name="P_PPRICE"
                  type="number"
                  value={productData.P_PPRICE}
                  onChange={handleProductChange}
                  className={fieldClass}
                />
              </div>

              {/* Value */}
              <div>
                <label className="block text-xs font-medium">Value (Rs.)</label>
                <input
                  name="P_VALUE"
                  type="number"
                  value={productData.P_VALUE}
                  readOnly
                  className={fieldClass}
                /> 
              </div> 
              {/* Markup Type */}
              <div>
                <label className="block text-xs font-medium">
                  Markup Type
                </label>
                <select
                  name="P_MARKTYPE"
                  value={productData.P_MARKTYPE}
                  onChange={handleMarkupTypeChange}
                  className={fieldClass}
                >
                  <option value="V">Value</option>
                  <option value="P">Percentage</option>
                </select>
              </div>

              {/* Markup Value */}
              <div>
                <label className="block text-xs font-medium">
                  Markup {productData.P_MARKTYPE === "V" ? "Value (Rs.)" : "Percentage (%)"}
                </label>
                <input
                  name="P_MARKVALUE"
                  type="number"
                  value={productData.P_MARKVALUE}
                  onChange={handleProductChange}
                  className={fieldClass}
                  placeholder={productData.P_MARKTYPE === "V" ? "Enter value" : "Enter percentage"}
                />
              </div>

              {/* Sale Price (Read-only) */}
              <div>
                <label className="block text-xs font-medium">
                  Sale Price (Rs.)
                </label>
                <input
                  name="P_SPRICE"
                  type="number"
                  value={productData.P_SPRICE}
                  readOnly
                  className={`${fieldClass} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`}
                />
              </div>

              {/* Mark Price (Editable) */}
              <div>
                <label className="block text-xs font-medium">
                  Marked Price (Rs.)
                </label>
                <input
                  name="P_MPRICE"
                  type="number"
                  value={productData.P_MPRICE}
                  onChange={handleProductChange}
                  className={fieldClass}
                />
              </div>

              {/* Product Expiry Date */}
              <div>
                <label className="block text-xs font-medium">
                  Expiry Date *
                </label>
                <ConfigProvider theme={customTheme}>
                  <DatePicker
                    picker="date"
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    placeholder="Select Expiry Date"
                    value={
                      productData.P_EXDATE ? dayjs(productData.P_EXDATE) : null
                    }
                    onChange={(date, dateString) =>
                      setProductData({ ...productData, P_EXDATE: dateString })
                    }
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                  />
                </ConfigProvider>
              </div>

              {/* Add Button */}
              <div className="md:col-span-3 flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Information Note */}
          <div
            className={`md:col-span-2 rounded-lg p-3 border w-full ${darkMode
              ? "bg-blue-900/20 border-blue-800"
              : "bg-blue-50 border-blue-200"
              }`}
          >
            <p
              className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-800"
                }`}
            >
              <strong>Note:</strong> All Quantities, Prices and Values fields
              must be filled using two decimal places, 10.00, 5.50, 3.75 etc.
            </p>
          </div>

          {/* Preview Table */}
          {products.length > 0 && (
            <div
              className={`rounded-xl border overflow-hidden mt-3 ${darkMode
                ? "bg-gray-700/30 border-gray-600"
                : "bg-gray-50 border-gray-200"
                }`}
            >
              <div className="overflow-x-auto">
                <div className="max-h-[250px] overflow-y-auto">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                    >
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold">
                          Product
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold">
                          Total Quantity
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          New Quantity
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Value
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Purchase Price
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Markup Type
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Markup Value
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Sale Price
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Marked Price
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Expire Date
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                        }`}
                    >
                      {products.map((p, i) => (
                        <tr
                          key={i}
                          className={`transition-colors ${darkMode
                            ? "hover:bg-gray-700/50"
                            : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-3 py-2 text-xs">{p.P_PRCODE}</td>
                          <td className="px-3 py-2 text-xs text-center">
                            {formatWithCommas(p.P_BLQTY)}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {formatWithCommas(p.P_QTY)}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {formatWithCommas(p.P_VALUE)}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {formatWithCommas(p.P_PPRICE)}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {p.P_MARKTYPE === "V" ? "Value" : "Percentage"}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {formatWithCommas(p.P_MARKVALUE)}
                            {p.P_MARKTYPE === "P" ? "%" : ""}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {formatWithCommas(p.P_SPRICE)}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {formatWithCommas(p.P_MPRICE)}
                          </td>
                          <td className="px-3 py-2 text-xs text-center">
                            {p.P_EXDATE}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(i)}
                              className="px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs flex items-center gap-1 mx-auto"
                            >
                              <FiTrash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
             {!hasProducts && (
              <span className="text-xs text-red-500 mr-2">
                {!formData.P_WHCODE || !formData.P_SUPCODE 
                  ? "Please fill all required and add Product" 
                  : products.length === 0 
                  ? "Please add at least one product" 
                  : "Please ensure all products have valid batches"
                }
              </span>
            )}
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-3 py-2 border rounded-lg text-sm ${
                darkMode 
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasProducts}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                hasProducts
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : `${
                      darkMode
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`
              }`}
            >
              Save GRN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}