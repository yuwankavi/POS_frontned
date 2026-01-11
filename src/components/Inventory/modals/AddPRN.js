
//////------------------------------------------------------------------


// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiX,
//   FiPackage,
//   FiPlus,
//   FiTrash2,
//   FiCalendar,
//   FiCheckCircle,
//   FiTruck,
// } from "react-icons/fi";
// import { closeModal } from "../../../actions/modalActions";
// import { addPrn } from "../../../actions/Inventory/purchaseReturnActions";
// import DatePicker from "react-datepicker";
// import Select from "react-select";
// import "react-datepicker/dist/react-datepicker.css";
// import { listWarehouses } from "../../../actions/Inventory/warehouseActions.js";
// import { listProductDetails } from "../../../actions/Inventory/inventoryProductDetailActions.js";
// import { listBatches } from "../../../actions/Inventory/batchActions.js";
// import { listPurchaseOrders } from "../../../actions/Inventory/purchaseActions";
// import { listSupplier } from "../../../actions/supplierAction.js";
// import purchaseReturnService from "../../../services/Inventory/purchaseReturnService.js";

// export default function AddPRNModal() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);
//   const modalProps = useSelector((state) => state.ui?.modalProps) || {};
//   const [searchProduct, setSearchProduct] = useState("");
//   const [showProductDropdown, setShowProductDropdown] = useState(false);
//   const [selectedGrn, setSelectedGrn] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchWarehouse, setSearchWarehouse] = useState("");
//   const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
//   const [searchSupplier, setSearchSupplier] = useState("");
//   const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
 
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);

//   const [maxReturnQty, setMaxReturnQty] = useState(0);
//   const [batchProducts, setBatchProducts] = useState([]); 
//   const [selectedBatchRows, setSelectedBatchRows] = useState([]); 
//   const [availableProducts, setAvailableProducts] = useState([]); 
 
//   const reasonLabels = {
//     E: "Expired",
//     D: "Damaged",
//     N: "Non-Moving",
//     X: "Exchange",
//   };


//   const { warehouses = [] } = useSelector((state) => state.warehouse) || {};
//   useEffect(() => {
//     dispatch(listWarehouses());
//   }, [dispatch]);


//   const { details = [] } = useSelector((state) => state.productDetails) || {};
//   useEffect(() => {
//     dispatch(listProductDetails());
//   }, [dispatch]);


//   const { suppliers = [] } = useSelector((state) => state.supplierList) || {};
//   useEffect(() => {
//     dispatch(listSupplier());
//   }, [dispatch]);


//   const { batches = [] } = useSelector((state) => state.batch) || {};
//   useEffect(() => {
//     dispatch(listBatches());
//   }, [dispatch]);

//   const { orders: grns = [] } =
//     useSelector((state) => state.purchaseOrders) || {};

//   useEffect(() => {
//     dispatch(listPurchaseOrders());
//   }, []);

//   const datePickerRef = useRef(null);
//   const datePicker2Ref = useRef(null);
//   const datePickerRef2 = useRef(null);

//   const handleExpireDate = () => {
//     datePickerRef2.current.setFocus();
//   };

  
//   const inventoryProducts =
//     useSelector((state) => state.inventoryProducts.inventoryProducts) || [];

 
//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(d.getDate()).padStart(2, "0")}`;
//   };

  
//   const formatApiDate = (dateString) => {
//     if (!dateString) return "";
//     try {
      
//       const date = new Date(dateString);
//       return formatDate(date);
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateString;
//     }
//   };

//   const today = formatDate(new Date());

  
//   const [formData, setFormData] = useState({
//     P_REFDOCNO: "",
//     P_WHCODE: "",
//     P_SUPCODE: "",
//     P_INNO: "",
//     P_INDATE: "",
//     P_PDATE: "",
//   });

 
//   const [productData, setProductData] = useState({
//     P_PRCODE: "",
//     P_BATCHID: "",
//     P_QTY: "",
//     P_RTQTY: "",
//     P_VALUE: "",
//     P_AVERATE: "",
//     P_BLQTY: "",
//     P_EXDATE: "",
//     P_PPRICE: "",
//     P_MPRICE: "",
//     P_SPRICE: "",
//     P_REASON: "",
//     P_REMARKS: "",
//   });

 
//   const [products, setProducts] = useState([]);

  
//   useEffect(() => {
//     if (formData.P_WHCODE) {
      
//       const warehouseProducts = [
//         ...new Map(
//           grns
//             .filter(grn => grn.GRN_WHCode === formData.P_WHCODE)
//             .map(grn => [grn.GRN_PrCode, {
//               value: grn.GRN_PrCode,
//               label: `${grn.GRN_PrCode} - ${grn.GRN_Proname}`,
//               product: grn
//             }])
//         ).values()
//       ];
//       setAvailableProducts(warehouseProducts);
//     } else {
//       setAvailableProducts([]);
//     }
//   }, [formData.P_WHCODE, grns]);


//   const handleHeaderChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const formatWithCommas = (value) => {
//     if (!value) return "";
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };
//   const removeNonDigits = (value) => value.replace(/\D/g, "");

   
//   const fetchMaxReturnQty = async (productCode, refCode) => {
//     try {
//       const response = await purchaseReturnService.getSumQty(productCode, refCode);
//       if (response.ResultSet && response.ResultSet.length > 0) {
//         const sumQty = parseFloat(response.ResultSet[0].SUMQTY) || 0;
//         setMaxReturnQty(sumQty);
//         return sumQty;
//       }
//       setMaxReturnQty(0);
//       return 0;
//     } catch (error) {
//       console.error("Error fetching max return quantity:", error);
//       setMaxReturnQty(0);
//       return 0;
//     }
//   };

  
//   const loadBatchProducts = async (productCode, warehouseCode) => {
//     try {
      
//       const filteredBatches = batches.filter(batch => 
//         batch.PB_ProCode === productCode && 
//         batch.PB_WHCode === warehouseCode &&
//         parseFloat(batch.PB_BLQty) > 0 
//       );

//       if (filteredBatches.length === 0) {
//         setBatchProducts([]);
//         setSelectedBatchRows([]);
//         alert("No batches found for this product in the selected warehouse");
//         return;
//       }

//       const batchData = filteredBatches.map(batch => ({
//         productCode: batch.PB_ProCode,
//         productDescription: batch.PB_ProDes,
//         batch: batch.PB_BId,
//         pinQty: Math.abs(parseFloat(batch.PB_BLQty)),
//         balanceQty: Math.abs(parseFloat(batch.PB_BLQty)),
//         expireDate: formatApiDate(batch.PB_EXDate),
//         purchasePrice: batch.PB_PPrice,
//         supplierCode: batch.PB_SupCode,
//         supplierName: batch.PB_SupName
//       }));

//       setBatchProducts(batchData);
      
     
//       const initialSelectedRows = batchData.map(batch => ({
//         ...batch,
//         returnQty: "",
//         reason: "",
//         selected: false
//       }));
//       setSelectedBatchRows(initialSelectedRows);
      
//     } catch (error) {
//       console.error("Error loading batch products:", error);
//       setBatchProducts([]);
//       setSelectedBatchRows([]);
//       alert("Error loading batch data");
//     }
//   };

 
//   const handleBatchRowChange = (index, field, value) => {
//     const updatedRows = [...selectedBatchRows];
    
//     if (field === 'returnQty') {
      
//       const balanceQty = updatedRows[index].balanceQty;
//       const returnQty = parseFloat(value) || 0;
      
//       if (returnQty > balanceQty) {
//         alert(`Return quantity cannot exceed balance quantity (${balanceQty})!`);
//         return;
//       }
//     }
    
//     updatedRows[index][field] = value;
//     setSelectedBatchRows(updatedRows);
//   };

  
//   const handleAddBatchesToProducts = () => {
//     const selectedBatches = selectedBatchRows.filter(row => 
//       row.returnQty && parseFloat(row.returnQty) > 0 && row.reason
//     );

//     if (selectedBatches.length === 0) {
//       alert("Please select at least one batch with return quantity and reason");
//       return;
//     }

//     const newProducts = selectedBatches.map(batch => {
//       const returnQty = parseFloat(batch.returnQty);
//       const value = returnQty * parseFloat(productData.P_AVERATE || 0);

//       return {
//         P_PRCODE: productData.P_PRCODE,
//         P_BATCHID: batch.batch,
//         P_QTY: batch.pinQty,
//         P_RTQTY: -Math.abs(returnQty), 
//         P_VALUE: -Math.abs(value), 
//         P_AVERATE: productData.P_AVERATE || "0.00",
//         P_BLQTY: batch.balanceQty,
//         P_EXDATE: batch.expireDate,
//         P_PPRICE: batch.purchasePrice || "0.00",
//         P_MPRICE: productData.P_MPRICE || "0.00",
//         P_SPRICE: productData.P_SPRICE || "0.00",
//         P_REASON: batch.reason,
//         P_REMARKS: productData.P_REMARKS || "",
//       };
//     });

//     setProducts([...products, ...newProducts]);

    
//     setProductData({
//       P_PRCODE: "",
//       P_BATCHID: "",
//       P_QTY: "",
//       P_RTQTY: "",
//       P_VALUE: "",
//       P_BLQTY: "",
//       P_AVERATE: "",
//       P_PPRICE: "",
//       P_MPRICE: "",
//       P_SPRICE: "",
//       P_EXDATE: "",
//       P_REASON: "",
//       P_REMARKS: "",
//     });
//     setSearchProduct("");
//     setMaxReturnQty(0);
//     setBatchProducts([]);
//     setSelectedBatchRows([]);
//   };

   
//   const handleProductChange = (e) => {
//     const { name, value } = e.target;
//     let newValue = value;

//     const numericFields = [
//       "P_QTY",
//       "P_VALUE",
//       "P_AVERATE",
//       "P_BLQTY",
//       "P_PPRICE",
//       "P_MPRICE",
//       "P_SPRICE",
//       "P_RTQTY",
//     ];

//     if (numericFields.includes(name)) {
//       if (value === "" || value === null) {
//         newValue = "";
//       } else {
//         const parsed = parseFloat(value);
//         if (isNaN(parsed) || parsed < 0) {
//           newValue = "";
//         } else {
//           newValue = value;
//         }
//       }
//     }

//     if (name === "P_RTQTY") {
//       const returnQty = parseFloat(value) || 0;
      
//       if (returnQty > maxReturnQty) {
//         alert(`Return Quantity cannot be greater than maximum available quantity (${maxReturnQty})!`);
//         newValue = maxReturnQty > 0 ? maxReturnQty.toFixed(2) : "";
//       }
//     }

//     setProductData({ ...productData, [name]: newValue });
//   };

//   const handleAddProduct = () => {
//     const requiredFields = [
//       productData.P_PRCODE,
//       productData.P_BATCHID,
//       productData.P_VALUE,
//       productData.P_QTY,
//       productData.P_BLQTY,
//       productData.P_AVERATE,
//       productData.P_PPRICE,
//       productData.P_MPRICE,
//       productData.P_SPRICE,
//       productData.P_EXDATE,
//       productData.P_REASON,
//       productData.P_RTQTY,
//     ];

//     const isInvalid = requiredFields.some(
//       (field) => field === "" || field === null || field === undefined
//     );

//     if (!productData.P_BLQTY && productData.P_BLQTY !== 0) {
//       alert("Balance quantity is required. Please Choose Product");
//       return;
//     }

//     if (isInvalid) {
//       alert("Please fill all fields");
//       return;
//     }

//     const returnQty = parseFloat(productData.P_RTQTY) || 0;
//     if (returnQty > maxReturnQty) {
//       alert(`Return Quantity cannot be greater than maximum available quantity (${maxReturnQty})!`);
//       return;
//     }


//     if (returnQty <= 0) {
//       alert("Return Quantity must be greater than 0!");
//       return;
//     }

//     const newProduct = {
//       ...productData,
//       P_PRCODE: productData.P_PRCODE,
//       P_BATCHID: productData.P_BATCHID,
//       P_QTY: Number(productData.P_QTY), 
//       P_RTQTY: -Math.abs(Number(productData.P_RTQTY)),  
//       P_BLQTY:
//         productData.P_BLQTY == null || productData.P_BLQTY === ""
//           ? "0.00"
//           : Number(productData.P_BLQTY).toFixed(2),
//       P_VALUE: -Math.abs(Number(productData.P_VALUE || 0).toFixed(2)),  
//       P_AVERATE: Number(productData.P_AVERATE || 0).toFixed(2),
//       P_PPRICE: Number(productData.P_PPRICE || 0).toFixed(2),
//       P_MPRICE: Number(productData.P_MPRICE || 0).toFixed(2),
//       P_SPRICE: Number(productData.P_SPRICE || 0).toFixed(2),
//       P_EXDATE: productData.P_EXDATE || "",
//       P_REASON: productData.P_REASON || "",
//     };

//     setProducts([...products, newProduct]); 
//     setProductData({
//       P_PRCODE: "",
//       P_BATCHID: "",
//       P_QTY: "",
//       P_RTQTY: "",
//       P_VALUE: "",
//       P_BLQTY: "",
//       P_AVERATE: "",
//       P_PPRICE: "",
//       P_MPRICE: "",
//       P_SPRICE: "",
//       P_EXDATE: "",
//       P_REASON: "",
//       P_REMARKS: "",
//     });
//     setSearchProduct("");
//     setMaxReturnQty(0);
//     setBatchProducts([]);
//     setSelectedBatchRows([]);
//   };

//   const handleRemoveProduct = (index) => {
//     setProducts(products.filter((_, i) => i !== index));
//   };
 
//   const handleSubmit = (e) => {
//     e.preventDefault();
 
//     if (!formData.P_WHCODE || !formData.P_SUPCODE || !formData.P_PDATE) {
//       alert("Please fill all required header fields");
//       return;
//     }

//     if (products.length === 0) {
//       alert("Please add at least one Product");
//       return;
//     }

//     const prnPayload = [
//       {
//         P_REFDOCNO: formData.P_REFDOCNO,
//         P_WHCODE: formData.P_WHCODE,
//         P_SUPCODE: Number(formData.P_SUPCODE),
//         P_INNO: Number(formData.P_INNO) || 0,
//         P_INDATE: formData.P_INDATE,
//         P_PDATE: formData.P_PDATE,
//         Items: products.map((prod) => ({
//           P_PRCODE: prod.P_PRCODE,
//           P_BATCHID: prod.P_BATCHID || "", 
//           P_QTY: -Math.abs(Number(prod.P_RTQTY || 0)).toFixed(2),  
//           P_VALUE: -Math.abs(Number(prod.P_VALUE || 0)).toFixed(2),  
//           P_AVERATE: prod.P_AVERATE || "",
//           P_BLQTY:
//             prod.P_BLQTY == null || prod.P_BLQTY === ""
//               ? "0.00"
//               : Number(prod.P_BLQTY).toFixed(2),
//           P_PPRICE: Number(prod.P_PPRICE || 0).toFixed(2),
//           P_MPRICE: Number(prod.P_MPRICE || 0).toFixed(2),
//           P_SPRICE: Number(prod.P_SPRICE || 0).toFixed(2),
//           P_EXDATE: prod.P_EXDATE || "",
//           P_REASON: prod.P_REASON || "",
//         })),
//       },
//     ];

//     console.log("Submitting PRN payload:", JSON.stringify(prnPayload, null, 2));

//     dispatch(addPrn(prnPayload))
//       .then(() => {
//         showAlertMessage(`PRN Added Successfully!`, "success");
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("PRN added successfully!", "success");
//         }
//         setTimeout(() => {
//           dispatch(closeModal());
//         }, 1000);
//       })
//       .catch((error) => {
//         showAlertMessage("Failed to add PRN", "error");
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("Failed to add PRN", "error");
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

//   const fieldClass = `w-full px-3 py-2 rounded-lg border text-sm ${
//     darkMode
//       ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
//       : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
//   }`;

//   const dropdownClass = `absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border shadow-lg text-sm ${
//     darkMode
//       ? "bg-gray-700 border-gray-600 text-white"
//       : "bg-white border-gray-200 text-gray-900"
//   }`;

//   const dropdownItemClass = `px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
//     darkMode ? "hover:bg-blue-600" : "hover:bg-blue-100"
//   }`;
   
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
//         className={`rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         }`}
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
//         {/* Header */}
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
//               Add Purchase Return (PRN)
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

//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           {/* Header Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             {/* Warehouse */}
//             <div>
//               <label className="block text-xs font-medium">Warehouse *</label>
//               <Select
//                 options={warehouses.map((w) => ({
//                   value: w.WH_Code,
//                   label: w.WH_Name,
//                 }))}
//                 value={
//                   formData.P_WHCODE
//                     ? {
//                         value: formData.P_WHCODE,
//                         label:
//                           warehouses.find(
//                             (w) => w.WH_Code === formData.P_WHCODE
//                           )?.WH_Name || "",
//                       }
//                     : null
//                 }
//                 onChange={(selected) => {
//                   setFormData({ 
//                     ...formData, 
//                     P_WHCODE: selected.value,
//                     P_SUPCODE: "", 
//                     P_REFDOCNO: ""  
//                   });

//                   setSelectedGrn("");
//                   setSearchSupplier("");
//                   setBatchProducts([]);
//                   setSelectedBatchRows([]);
//                   setAvailableProducts([]);  
//                 }}
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
//                       ? "#374151"
//                       : "white",
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
//               <label className="block text-xs font-medium">Supplier *</label>
//               <Select
//                 options={suppliers
//                   .filter(supplier =>  
//                     grns.some(grn => 
//                       grn.GRN_WHCode === formData.P_WHCODE && 
//                       grn.GRN_DOCSupID === supplier.SUP_CODE
//                     )
//                   )
//                   .map((s) => ({
//                     value: s.SUP_CODE,
//                     label: s.SUP_NAME,
//                   }))}
//                 value={
//                   formData.P_SUPCODE
//                     ? {
//                         value: formData.P_SUPCODE,
//                         label:
//                           suppliers.find(
//                             (s) => s.SUP_CODE === formData.P_SUPCODE
//                           )?.SUP_NAME || "",
//                       }
//                     : null
//                 }
//                 onChange={(selected) => {
//                   setFormData({ 
//                     ...formData, 
//                     P_SUPCODE: selected.value,
//                     P_REFDOCNO: ""
                    
//                   });
//                   setSelectedGrn("");
//                   setBatchProducts([]);
//                   setSelectedBatchRows([]);
//                 }}
//                 placeholder="-- Select Supplier --"
//                 isSearchable
//                 isDisabled={!formData.P_WHCODE}
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
//                       ? "#1f2937"
//                       : "#fff",
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
//                 name="P_INNO"
//                 type="text"
//                 value={formData.P_INNO || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, P_INNO: e.target.value })
//                 }
//                 className={fieldClass}
//                 readOnly
//               />
//             </div>

//             {/* Invoice Date */}
//             <div>
//               <label className="block text-xs font-medium">Invoice Date</label>
//               <DatePicker
//                 selected={
//                   formData.P_INDATE ? new Date(formData.P_INDATE) : null
//                 }
//                 onChange={(date) =>
//                   setFormData({
//                     ...formData,
//                     P_INDATE: date ? formatDate(date) : "",
//                   })
//                 }
//                 dateFormat="yyyy-MM-dd"
//                 placeholderText="YYYY-MM-DD"
//                 className={fieldClass}
//                 readOnly
//               />
//             </div>

//             {/* PRN Date */}
            // <div>
            //   <label className="block text-xs font-medium">PRN Date *</label>
            //   <DatePicker
            //     selected={
            //       formData.P_PDATE ? new Date(formData.P_PDATE) : new Date()
            //     }
            //     onChange={(date) =>
            //       setFormData({
            //         ...formData,
            //         P_PDATE: date ? formatDate(date) : "",
            //       })
            //     }
            //     dateFormat="yyyy-MM-dd"
            //     placeholderText="YYYY-MM-DD"
            //     className={fieldClass}
            //   />
            // </div>
//           </div>
          
//           {/* Remarks */}
//           <div>
//             <label className="block text-xs font-medium">Remarks</label>
//             <textarea
//               name="P_REMARKS"
//               value={productData.P_REMARKS}
//               onChange={handleProductChange}
//               className={fieldClass}
//               rows="2"
//             />
//           </div>

//           {/* Product Entry */}
//           <div className="border p-3 rounded-lg space-y-2">
//             <h3 className="font-semibold text-sm">Add Return Product</h3>
            
//             {/* Max Return Quantity Info */}
//             {maxReturnQty > 0 && (
//               <div className={`p-2 rounded-lg text-sm ${
//                 darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
//               }`}>
//                 Maximum available quantity for return: <strong>{maxReturnQty}</strong>
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               {/* Product Code - NOW DEPENDS ON WAREHOUSE SELECTION */}
//               <div>
//                 <label
//                   className={`block text-xs font-medium mb-1 ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Search or Select Product Code *
//                 </label> 

//                 <Select
//                   isDisabled={!formData.P_WHCODE}  
//                   options={availableProducts}
//                   value={
//                     searchProduct
//                       ? { value: productData.P_PRCODE, label: searchProduct }
//                       : null
//                   }
//                   onChange={async (selected) => {
//                     const p = selected.product;
 
//                     await loadBatchProducts(p.GRN_PrCode, formData.P_WHCODE);
 
//                     const maxQty = await fetchMaxReturnQty(p.GRN_PrCode, formData.P_REFDOCNO);
 
//                     setProductData({
//                       ...productData,
//                       P_PRCODE: p.GRN_PrCode || "",
//                       P_QTY: (parseFloat(p.GRN_Qty) || 0).toFixed(2),
//                       P_VALUE: (
//                         parseFloat(p.GRN_Val.replace(/,/g, "")) || 0
//                       ).toFixed(2),
//                       P_EXDATE: p.GRN_EXPDate || "",
//                       P_AVERATE: (parseFloat(p.AVERate) || 0).toFixed(2),
//                       P_PPRICE: (parseFloat(p.GRN_PURPrice) || 0).toFixed(2),
//                       P_MPRICE: (parseFloat(p.GRN_MARKPrice) || 0).toFixed(2),
//                       P_SPRICE: (parseFloat(p.GRN_SELLPrice) || 0).toFixed(2),
//                       P_BATCHID: p.GRN_BatchId || "",
//                       P_BLQTY: 0, 
//                       P_RTQTY: maxQty > 0 ? maxQty.toFixed(2) : "",  
//                     });

//                     setSearchProduct(`${p.GRN_PrCode} - ${p.GRN_Proname}`);

//                     try {
//                       const balanceQty =
//                         await purchaseReturnService.getBalanceQty({
//                           P_WHCODE: formData.P_WHCODE, 
//                           P_PRCODE: p.GRN_PrCode,
//                         });

//                       setProductData((prev) => ({
//                         ...prev,
//                         P_BLQTY: Number(balanceQty).toFixed(2),
//                       }));
//                     } catch (err) {
//                       console.error("Balance qty fetch failed:", err);
//                     }
//                   }}
//                   placeholder={!formData.P_WHCODE ? "Please select warehouse first" : "-- Search or Select Product Code --"}
//                   isSearchable
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       backgroundColor: darkMode ? "#1f2937" : "white",
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                       borderColor: darkMode ? "#374151" : "#d1d5db",
//                     }),
//                     menu: (base) => ({
//                       ...base,
//                       backgroundColor: darkMode ? "#374151" : "white",
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                     }),
//                     option: (base, state) => ({
//                       ...base,
//                       backgroundColor: state.isFocused
//                         ? darkMode
//                           ? "#4b5563"
//                           : "#f3f4f6"
//                         : darkMode
//                         ? "#374151"
//                         : "white",
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                     }),
//                     singleValue: (base) => ({
//                       ...base,
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                     }),
//                     placeholder: (base) => ({
//                       ...base,
//                       color: darkMode ? "#9ca3af" : "#6b7280",
//                     }),
//                   }}
//                 />
//                 {!formData.P_WHCODE && (
//                   <p className="text-xs text-red-500 mt-1">Please select a warehouse first</p>
//                 )}
//               </div> 
//               {/* Average Rate */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Average Rate
//                 </label>
//                 <input
//                   name="P_AVERATE"
//                   type="number"
//                   value={productData.P_AVERATE}
//                   onChange={handleProductChange}
//                   className={fieldClass}
//                 />
//               </div>

//               {/* Purchase Price */}
//               <div>
//                 <label className="block text-xs font-medium">
//                   Purchase Price
//                 </label>
//                 <input
//                   name="P_PPRICE"
//                   type="number"
//                   value={productData.P_PPRICE}
//                   onChange={handleProductChange}
//                   className={fieldClass}
//                   readOnly
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Batch Products Grid - Using Actual API Data */}
//           {batchProducts.length > 0 && (
//             <div className="border p-3 rounded-lg space-y-2">
//               <h3 className="font-semibold text-sm">Batch Details - {productData.P_PRCODE}</h3>
              
//               <div
//                 className={`rounded-xl border overflow-hidden ${
//                   darkMode
//                     ? "bg-gray-700/30 border-gray-600"
//                     : "bg-gray-50 border-gray-200"
//                 }`}
//               >
//                 <div className="overflow-x-auto">
//                   <div className="max-h-[300px] overflow-y-auto">
//                     <table className="w-full">
//                       <thead
//                         className={`sticky top-0 ${
//                           darkMode ? "bg-gray-700" : "bg-gray-100"
//                         }`}
//                       >
//                         <tr>
//                           <th className="px-3 py-2 text-left text-xs font-semibold">
//                             Product Code
//                           </th>
//                           <th className="px-3 py-2 text-left text-xs font-semibold">
//                             Product Description
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Batch
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             PIN Qty
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Balance Qty
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Expire Date
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Purchase Price
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Return Qty
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Reason
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody
//                         className={`divide-y ${
//                           darkMode ? "divide-gray-700" : "divide-gray-200"
//                         }`}
//                       >
//                         {selectedBatchRows.map((batch, i) => (
//                           <tr
//                             key={i}
//                             className={`transition-colors ${
//                               darkMode
//                                 ? "hover:bg-gray-700/50"
//                                 : "hover:bg-gray-100"
//                             }`}
                            
//                           >
//                             <td className="px-3 py-2 text-xs">{batch.productCode}</td>
//                             <td className="px-3 py-2 text-xs">{batch.productDescription}</td>
//                             <td className="px-3 py-2 text-xs text-center">{batch.batch}</td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               <input
//                                 type="number"
//                                 value={batch.pinQty}
//                                 readOnly
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               <input
//                                 type="number"
//                                 value={batch.balanceQty}
//                                 readOnly
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               <input
//                                 type="text"
//                                 value={batch.expireDate}
//                                 readOnly
//                                 className={`w-24 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               <input
//                                 type="number"
//                                 value={batch.purchasePrice}
//                                 readOnly
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <input
//                                 type="number"
//                                 value={batch.returnQty}
//                                 onChange={(e) => handleBatchRowChange(i, 'returnQty', e.target.value)}
//                                 min="0"
//                                 max={batch.balanceQty}
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-700 border-gray-600 text-white" 
//                                     : "bg-white border-gray-300"
//                                 }`}
//                                 placeholder="0"
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <select
//                                 value={batch.reason}
//                                 onChange={(e) => handleBatchRowChange(i, 'reason', e.target.value)}
//                                 className={`w-28 px-2 py-1 text-center border rounded text-xs ${
//                                   darkMode 
//                                     ? "bg-gray-700 border-gray-600 text-white" 
//                                     : "bg-white border-gray-300"
//                                 }`}
//                               >
//                                 <option value="">Select</option>
//                                 <option value="E">Expired</option>
//                                 <option value="D">Damaged</option>
//                                 <option value="N">Non-Moving</option>
//                                 <option value="X">Exchange</option>
//                               </select>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               {/* Add Batches Button */}
//               <div className="flex justify-end mt-2">
//                 <button
//                   type="button"
//                   onClick={handleAddBatchesToProducts}
//                   className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
//                 >
//                   <FiPlus className="w-4 h-4" /> Add Selected Batches
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Preview Table */}
//           {products.length > 0 && (
//             <div
//               className={`rounded-xl border overflow-hidden mt-3 ${
//                 darkMode
//                   ? "bg-gray-700/30 border-gray-600"
//                   : "bg-gray-50 border-gray-200"
//               }`}
//             >
//               <div className="overflow-x-auto">
//                 <div className="max-h-[250px] overflow-y-auto">
//                   <table className="w-full">
//                     <thead
//                       className={`sticky top-0 ${
//                         darkMode ? "bg-gray-700" : "bg-gray-100"
//                       }`}
//                     >
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs font-semibold">
//                           Product Code
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Batch ID
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           GRN Qty
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Return Qty
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Value
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Avg Rate
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Balance Qty
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Expire Date
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Purchase Price
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Mark Price
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Sale Price
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Return Type
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody
//                       className={`divide-y ${
//                         darkMode ? "divide-gray-700" : "divide-gray-200"
//                       }`}
//                     >
//                       {products.map((p, i) => (
//                         <tr
//                           key={i}
//                           className={`transition-colors ${
//                             darkMode
//                               ? "hover:bg-gray-700/50"
//                               : "hover:bg-gray-100"
//                           }`}
//                         >
//                           <td className="px-3 py-2 text-xs">{p.P_PRCODE}</td>
//                           <td className="px-3 py-2 text-xs">{p.P_BATCHID}</td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_QTY)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(Math.abs(p.P_RTQTY))}  
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(Math.abs(p.P_VALUE))}  
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_AVERATE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_BLQTY)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {p.P_EXDATE}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_PPRICE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_MPRICE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {formatWithCommas(p.P_SPRICE)}
//                           </td>
//                           <td className="px-3 py-2 text-xs text-center">
//                             {reasonLabels[p.P_REASON]}
//                           </td>
//                           <td className="px-3 py-2 text-center">
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveProduct(i)}
//                               className="px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs flex items-center gap-1 mx-auto"
//                             >
//                               <FiTrash2 className="w-3 h-3" /> Delete
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
//               className={`px-3 py-2 border rounded-lg text-sm ${
//                 darkMode ? "border-gray-600 text-white" : ""
//               }`}
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












///----------------------------------------------------------2025/10/30-------------------------------

// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiX,
//   FiPackage,
//   FiPlus,
//   FiTrash2,
//   FiCalendar,
//   FiCheckCircle,
//   FiTruck,
// } from "react-icons/fi";
// import { closeModal } from "../../../actions/modalActions";
// import { addPrn } from "../../../actions/Inventory/purchaseReturnActions";
// import DatePicker from "react-datepicker";
// import Select from "react-select";
// import "react-datepicker/dist/react-datepicker.css";
// import purchaseReturnService from "../../../services/Inventory/purchaseReturnService.js";
// import dropdownService from "../../../services/Inventory/prnDropdownService.js";  

// export default function AddPRNModal() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);
//   const modalProps = useSelector((state) => state.ui?.modalProps) || {};

//   const [suppliers, setSuppliers] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);
//   const [availableProducts, setAvailableProducts] = useState([]);
//   const [batchProducts, setBatchProducts] = useState([]);
  
//   const [selectedBatchRows, setSelectedBatchRows] = useState([]); 
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);
//   const [maxReturnQty, setMaxReturnQty] = useState(0);
//   const [loading, setLoading] = useState({
//     suppliers: false,
//     warehouses: false,
//     products: false,
//     batches: false
//   });

//   const [selectedProductInfo, setSelectedProductInfo] = useState(null);

//   const [productData, setProductData] = useState({
//     P_PRCODE: "",
//     P_REASON: "",
//     P_REMARKS: "",
//     P_TOTQTY: 0,
//     P_TOTVAL: 0
//   });

//   const [products, setProducts] = useState([]);

//   const reasonLabels = {
//     E: "Expired",
//     D: "Damaged",
//     N: "Non-Moving",
//     X: "Exchange",
//   };
 
//   useEffect(() => {
//     loadSuppliers();
//   }, []);

//   const loadSuppliers = async () => {
//     setLoading(prev => ({ ...prev, suppliers: true }));
//     try {
//       const response = await dropdownService.loadSuppliers();
//       setSuppliers(response.ResultSet || []);
//     } catch (error) {
//       console.error("Error loading suppliers:", error);
//       setSuppliers([]);
//     } finally {
//       setLoading(prev => ({ ...prev, suppliers: false }));
//     }
//   };
 
//   const loadWarehouses = async (supplierCode) => {
//     if (!supplierCode) {
//       setWarehouses([]);
//       return;
//     }
    
//     setLoading(prev => ({ ...prev, warehouses: true }));
//     try {
//       const response = await dropdownService.loadWarehouses(supplierCode);
//       setWarehouses(response.ResultSet || []);
//     } catch (error) {
//       console.error("Error loading warehouses:", error);
//       setWarehouses([]);
//     } finally {
//       setLoading(prev => ({ ...prev, warehouses: false }));
//     }
//   };
 
//   const loadProducts = async (supplierCode, warehouseCode) => {
//     if (!supplierCode || !warehouseCode) {
//       setAvailableProducts([]);
//       return;
//     }
    
//     setLoading(prev => ({ ...prev, products: true }));
//     try {
//       const response = await dropdownService.loadProducts(supplierCode, warehouseCode);
//       setAvailableProducts(response.ResultSet || []);
//     } catch (error) {
//       console.error("Error loading products:", error);
//       setAvailableProducts([]);
//     } finally {
//       setLoading(prev => ({ ...prev, products: false }));
//     }
//   };

//   const loadBatches = async (supplierCode, warehouseCode, productCode) => {
//     if (!supplierCode || !warehouseCode || !productCode) {
//       setBatchProducts([]);
//       setSelectedBatchRows([]);
//       return;
//     }
    
//     setLoading(prev => ({ ...prev, batches: true }));
//     try {
//       const response = await dropdownService.loadBatches(supplierCode, warehouseCode, productCode);
      
//       const selectedProduct = availableProducts.find(p => p.PRODUCT_CODE === productCode);
//       const productDescription = selectedProduct ? selectedProduct.PRODUCT_NAME : productCode;
      
//       const batchData = (response.ResultSet || []).map(batch => ({
//         productCode: batch.PB_ProCode,
//         productDescription: productDescription,
//         batch: batch.PB_BId,
//         pinQty: Math.abs(parseFloat(batch.PB_BLQty)),
//         balanceQty: Math.abs(parseFloat(batch.PB_BLQty)),
//         expireDate: formatApiDate(batch.PB_EXDate),
//         purchasePrice: batch.PB_PPrice,
//         supplierCode: batch.PB_SupCode,
//         supplierName: batch.PB_SupName,
//         returnQty: "",
//         selected: false
//       }));

//       setBatchProducts(batchData);
//       setSelectedBatchRows(batchData);
      
//       calculateProductTotals(batchData);
      
//     } catch (error) {
//       console.error("Error loading batches:", error);
//       setBatchProducts([]);
//       setSelectedBatchRows([]);
//     } finally {
//       setLoading(prev => ({ ...prev, batches: false }));
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
//       2,
//       "0"
//     )}-${String(d.getDate()).padStart(2, "0")}`;
//   };

//   const formatApiDate = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return formatDate(date);
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateString;
//     }
//   };

//   const today = formatDate(new Date());

//   const [formData, setFormData] = useState({
//     P_REFDOCNO: "",
//     P_WHCODE: "",
//     P_SUPCODE: "",
//     P_INNO: "",
//     P_INDATE: "",
//     P_PDATE: today,
//   });

//   const handleHeaderChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const formatWithCommas = (value) => {
//     if (!value) return "";
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   const fetchMaxReturnQty = async (productCode, refCode) => {
//     try {
//       const response = await purchaseReturnService.getSumQty(productCode, refCode);
//       if (response.ResultSet && response.ResultSet.length > 0) {
//         const sumQty = parseFloat(response.ResultSet[0].SUMQTY) || 0;
//         setMaxReturnQty(sumQty);
//         return sumQty;
//       }
//       setMaxReturnQty(0);
//       return 0;
//     } catch (error) {
//       console.error("Error fetching max return quantity:", error);
//       setMaxReturnQty(0);
//       return 0;
//     }
//   };

//   const handleBatchRowChange = (index, field, value) => {
//     const updatedRows = [...selectedBatchRows];
    
//     if (field === 'returnQty') {
//       const balanceQty = updatedRows[index].balanceQty;
//       const returnQty = parseFloat(value) || 0;
      
//       if (returnQty > balanceQty) {
//         alert(`Return quantity cannot exceed balance quantity (${balanceQty})!`);
//         return;
//       }
      
//       updatedRows[index][field] = value;
//     } else {
//       updatedRows[index][field] = value;
//     }
    
//     setSelectedBatchRows(updatedRows);
    
//     calculateProductTotals(updatedRows);
//   };

//   const calculateProductTotals = (batchRows) => {
//     const totalReturnQty = batchRows.reduce((sum, batch) => 
//       sum + parseFloat(batch.returnQty || 0), 0
//     );

//     const totalValue = batchRows.reduce((sum, batch) => {
//       const returnQty = parseFloat(batch.returnQty || 0);
//       const purchasePrice = parseFloat(batch.purchasePrice || 0);
//       return sum + (returnQty * purchasePrice);
//     }, 0);

//     setProductData(prev => ({
//       ...prev,
//       P_TOTQTY: totalReturnQty, 
//       P_TOTVAL: totalValue      
//     }));

//     return { totalReturnQty, totalValue };
//   };

//   // Calculate balance quantity after PRN
//   const calculateBalanceQty = (batch) => {
//     const stockQty = parseFloat(batch.balanceQty || 0);
//     const returnQty = parseFloat(batch.returnQty || 0);
//     return stockQty - returnQty;
//   };

//   const handleAddProductWithBatches = () => {
//     const selectedBatches = selectedBatchRows.filter(row => 
//       row.returnQty && parseFloat(row.returnQty) > 0
//     );

//     if (selectedBatches.length === 0) {
//       alert("Please select at least one batch with return quantity");
//       return;
//     }

//     if (!productData.P_REASON) {
//       alert("Please select a return reason");
//       return;
//     }

//     if (!productData.P_PRCODE) {
//       alert("Please select a product");
//       return;
//     }

//     const totalReturnQty = selectedBatches.reduce((sum, batch) => 
//       sum + parseFloat(batch.returnQty || 0), 0
//     );

//     const totalValue = selectedBatches.reduce((sum, batch) => {
//       const returnQty = parseFloat(batch.returnQty || 0);
//       const purchasePrice = parseFloat(batch.purchasePrice || 0);
//       return sum + (returnQty * purchasePrice);
//     }, 0);

//     const batches = selectedBatches.map(batch => ({
//       P_PRCODE: productData.P_PRCODE,
//       B_BATCHID: batch.batch,
//       B_QTY: Math.abs(parseFloat(batch.returnQty)),
//       B_AVERATE: parseFloat(batch.purchasePrice || 0).toFixed(2)
//     }));

//     const newProduct = {
//       P_PRCODE: productData.P_PRCODE,
//       P_TOTQTY: Math.abs(totalReturnQty), 
//       P_TOTVAL: Math.abs(totalValue),    
//       P_REASON: productData.P_REASON,
//       P_REMARKS: productData.P_REMARKS || "",
//       Batches: batches
//     };

//     const existingProductIndex = products.findIndex(p => p.P_PRCODE === productData.P_PRCODE);
    
//     if (existingProductIndex > -1) { 
//       const updatedProducts = [...products];
//       updatedProducts[existingProductIndex] = newProduct;
//       setProducts(updatedProducts);
//     } else {
//       setProducts([...products, newProduct]);
//     }

//     setProductData({
//       P_PRCODE: "",
//       P_REASON: "",
//       P_REMARKS: "",
//       P_TOTQTY: 0,
//       P_TOTVAL: 0
//     });
//     setMaxReturnQty(0);
//     setBatchProducts([]);
//     setSelectedBatchRows([]);
//     setSelectedProductInfo(null);
//   };

//   const handleRemoveProduct = (productCode) => {
//     setProducts(products.filter(p => p.P_PRCODE !== productCode));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
 
//     if (!formData.P_WHCODE || !formData.P_SUPCODE  ) {
//       alert("Please fill all required header fields");
//       return;
//     }

//     if (products.length === 0) {
//       alert("Please add at least one Product");
//       return;
//     }

//     const prnPayload = [
//       {
//         P_REFDOCNO: formData.P_REFDOCNO,
//         P_WHCODE: formData.P_WHCODE,
//         P_SUPCODE: Number(formData.P_SUPCODE),
//         P_INNO: formData.P_INNO,
//         P_INDATE: formData.P_INDATE,
//         P_PDATE: formData.P_PDATE,
//         Items: products
//       },
//     ];

//     console.log("Submitting PRN payload:", JSON.stringify(prnPayload, null, 2));

//     dispatch(addPrn(prnPayload))
//       .then(() => {
//         showAlertMessage(`PRN Added Successfully!`, "success");
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("PRN added successfully!", "success");
//         }
//         setTimeout(() => {
//           dispatch(closeModal());
//         }, 1000);
//       })
//       .catch((error) => {
//         showAlertMessage("Failed to add PRN", "error");
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("Failed to add PRN", "error");
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

//   const fieldClass = `w-full px-3 py-2 rounded-lg border text-sm ${
//     darkMode
//       ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
//       : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
//   }`;

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
//         className={`rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         }`}
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
        
//         {/* Header */}
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
//               Add Purchase Return (PRN)
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

//         <form onSubmit={handleSubmit} className="p-4 space-y-4">
//           {/* Header Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//             {/* Supplier */}
//             <div>
//               <label className="block text-xs font-medium">Supplier *</label>
//               <Select
//                 options={suppliers.map((s) => ({
//                   value: s.SUP_CODE,
//                   label: s.SUP_NAME,
//                 }))}
//                 value={
//                   formData.P_SUPCODE
//                     ? {
//                         value: formData.P_SUPCODE,
//                         label:
//                           suppliers.find(
//                             (s) => s.SUP_CODE === formData.P_SUPCODE
//                           )?.SUP_NAME || "",
//                       }
//                     : null
//                 }
//                 onChange={async (selected) => {
//                   const supplierCode = selected.value;
                  
//                   // Reset dependent fields
//                   setFormData({ 
//                     ...formData, 
//                     P_SUPCODE: supplierCode,
//                     P_WHCODE: "", 
//                     P_REFDOCNO: "",
//                     P_INNO: "",
//                     P_INDATE: ""
//                   });

//                   setProductData({
//                     P_PRCODE: "",
//                     P_REASON: "",
//                     P_REMARKS: "",
//                     P_TOTQTY: 0,
//                     P_TOTVAL: 0
//                   });

//                   // Load warehouses for this supplier
//                   await loadWarehouses(supplierCode);
                  
//                   // Reset products and batches
//                   setAvailableProducts([]);
//                   setBatchProducts([]);
//                   setSelectedBatchRows([]);
//                   setSelectedProductInfo(null);
//                   setProducts([]);
//                 }}
//                 placeholder={loading.suppliers ? "Loading suppliers..." : "-- Select Supplier --"}
//                 isSearchable
//                 isLoading={loading.suppliers}
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
//                       ? "#1f2937"
//                       : "#fff",
//                     color: darkMode ? "#f3f4f6" : "#111827",
//                   }),
//                   placeholder: (base) => ({
//                     ...base,
//                     color: darkMode ? "#9ca3af" : "#6b7280",
//                   }),
//                 }}
//               />
//             </div>

//             {/* Warehouse */}
//             <div>
//               <label className="block text-xs font-medium">Warehouse *</label>
//               <Select
//                 options={warehouses.map((w) => ({
//                   value: w.WH_CODE,
//                   label: w.WH_NAME,
//                 }))}
//                 value={
//                   formData.P_WHCODE
//                     ? {
//                         value: formData.P_WHCODE,
//                         label:
//                           warehouses.find(
//                             (w) => w.WH_CODE === formData.P_WHCODE
//                           )?.WH_NAME || "",
//                       }
//                     : null
//                 }
//                 onChange={async (selected) => {
//                   const warehouseCode = selected.value;
                  
//                   setFormData({ 
//                     ...formData, 
//                     P_WHCODE: warehouseCode,
//                     P_REFDOCNO: ""  
//                   });

//                   setProductData({
//                     P_PRCODE: "",
//                     P_REASON: "",
//                     P_REMARKS: "",
//                     P_TOTQTY: 0,
//                     P_TOTVAL: 0
//                   });

//                   // Load products for this supplier and warehouse
//                   await loadProducts(formData.P_SUPCODE, warehouseCode);
                  
//                   // Reset batches and products
//                   setBatchProducts([]);
//                   setSelectedBatchRows([]);
//                   setSelectedProductInfo(null);
//                   setProducts([]);
//                 }}
//                 placeholder={!formData.P_SUPCODE ? "Select supplier first" : (loading.warehouses ? "Loading warehouses..." : "-- Select Warehouse --")}
//                 isSearchable
//                 isDisabled={!formData.P_SUPCODE || loading.warehouses}
//                 isLoading={loading.warehouses}
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
//                       ? "#374151"
//                       : "white",
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
//               {!formData.P_SUPCODE && (
//                 <p className="text-xs text-red-500 mt-1">Please select a supplier first</p>
//               )}
//             </div>

//             {/* Invoice No */}
//             <div>
//               <label className="block text-xs font-medium">Invoice No</label>
//               <input
//                 name="P_INNO"
//                 type="text"
//                 value={formData.P_INNO || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, P_INNO: e.target.value })
//                 }
//                 className={fieldClass} 
//               />
//             </div>

//             {/* Invoice Date */}
//             <div>
//               <label className="block text-xs font-medium">Invoice Date</label>
//               <DatePicker
//                 selected={
//                   formData.P_INDATE ? new Date(formData.P_INDATE) : null
//                 }
//                 onChange={(date) =>
//                   setFormData({
//                     ...formData,
//                     P_INDATE: date ? formatDate(date) : "",
//                   })
//                 }
//                 dateFormat="yyyy-MM-dd"
//                 placeholderText="YYYY-MM-DD"
//                 className={fieldClass} 
//               />
//             </div>

//             {/* PRN Date */}
//             <div>
//               <label className="block text-xs font-medium">PRN Date *</label>
//               <DatePicker
//                 selected={
//                   formData.P_PDATE ? new Date(formData.P_PDATE) : new Date()
//                 }
//                 onChange={(date) =>
//                   setFormData({
//                     ...formData,
//                     P_PDATE: date ? formatDate(date) : "",
//                   })
//                 }
//                 dateFormat="yyyy-MM-dd"
//                 placeholderText="YYYY-MM-DD"
//                 className={fieldClass}
//                 readOnly
//               />
//             </div>
//           </div>
          
//           {/* Product Entry */}
//           <div className="border p-3 rounded-lg space-y-2">
//             <h3 className="font-semibold text-sm">Add Return Product</h3>

//             {/* Max Return Quantity Info */}
//             {maxReturnQty > 0 && (
//               <div className={`p-2 rounded-lg text-sm ${
//                 darkMode ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-800"
//               }`}>
//                 Maximum available quantity for return: <strong>{maxReturnQty}</strong>
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               {/* Product Code */}
//               <div>
//                 <label
//                   className={`block text-xs font-medium mb-1 ${
//                     darkMode ? "text-gray-300" : "text-gray-700"
//                   }`}
//                 >
//                   Search or Select Product Code *
//                 </label> 

//                 <Select
//                   isDisabled={!formData.P_SUPCODE || !formData.P_WHCODE}
//                   options={availableProducts.map(product => ({
//                     value: product.PRODUCT_CODE,
//                     label: ` ${product.PRODUCT_NAME}`,
//                     product: product
//                   }))}
//                   value={
//                     productData.P_PRCODE
//                       ? { 
//                           value: productData.P_PRCODE, 
//                           label: ` ${availableProducts.find(p => p.PRODUCT_CODE === productData.P_PRCODE)?.PRODUCT_NAME || ''}`
//                         }
//                       : null
//                   }
//                   onChange={async (selected) => {
//                     const product = selected.product;
                    
//                     // Store selected product info for batch description
//                     setSelectedProductInfo({
//                       code: product.PRODUCT_CODE,
//                       name: product.PRODUCT_NAME
//                     });

//                     // Load batches for this product
//                     await loadBatches(formData.P_SUPCODE, formData.P_WHCODE, product.PRODUCT_CODE);

//                     const maxQty = await fetchMaxReturnQty(product.PRODUCT_CODE, formData.P_REFDOCNO);

//                     setProductData({
//                       ...productData,
//                       P_PRCODE: product.PRODUCT_CODE || "",
//                     });
//                   }}
//                   placeholder={
//                     !formData.P_SUPCODE || !formData.P_WHCODE 
//                       ? "Please select supplier and warehouse first" 
//                       : loading.products 
//                       ? "Loading products..." 
//                       : "-- Search or Select Product Code --"
//                   }
//                   isSearchable
//                   isLoading={loading.products}
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       backgroundColor: darkMode ? "#1f2937" : "white",
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                       borderColor: darkMode ? "#374151" : "#d1d5db",
//                     }),
//                     menu: (base) => ({
//                       ...base,
//                       backgroundColor: darkMode ? "#374151" : "white",
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                     }),
//                     option: (base, state) => ({
//                       ...base,
//                       backgroundColor: state.isFocused
//                         ? darkMode
//                           ? "#4b5563"
//                           : "#f3f4f6"
//                         : darkMode
//                         ? "#374151"
//                         : "white",
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                     }),
//                     singleValue: (base) => ({
//                       ...base,
//                       color: darkMode ? "#e5e7eb" : "#111827",
//                     }),
//                     placeholder: (base) => ({
//                       ...base,
//                       color: darkMode ? "#9ca3af" : "#6b7280",
//                     }),
//                   }}
//                 />
//                 {(!formData.P_SUPCODE || !formData.P_WHCODE) && (
//                   <p className="text-xs text-red-500 mt-1">Please select supplier and warehouse first</p>
//                 )}
//               </div>

//               {/* Return Reason */}
//               <div>
//                 <label className="block text-xs font-medium">Return Reason *</label>
//                 <select
//                   name="P_REASON"
//                   value={productData.P_REASON}
//                   onChange={(e) => setProductData({...productData, P_REASON: e.target.value})}
//                   className={fieldClass}
//                 >
//                   <option value="">-- Select Reason --</option>
//                   <option value="E">Expired</option>
//                   <option value="D">Damaged</option>
//                   <option value="N">Non-Moving</option>
//                   <option value="X">Exchange</option>
//                 </select>
//               </div>

             
//             </div>

//             {productData.P_PRCODE && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
//                 <div className={`p-2 rounded-lg text-sm ${
//                   darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
//                 }`}>
//                   Total Available Stock: <strong>{productData.P_TOTQTY.toFixed(2)}</strong>
//                 </div>
//                 <div className={`p-2 rounded-lg text-sm ${
//                   darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"
//                 }`}>
//                   Total Return Value: <strong>{productData.P_TOTVAL.toFixed(2)}</strong>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Batch Products Grid */}
//           {batchProducts.length > 0 && (
//             <div className="border p-3 rounded-lg space-y-2">
//               <h3 className="font-semibold text-sm">
//                 Batch Details
//                 {loading.batches && <span className="text-blue-500 ml-2">Loading batches...</span>}
//               </h3>
              
//               <div
//                 className={`rounded-xl border overflow-hidden ${
//                   darkMode
//                     ? "bg-gray-700/30 border-gray-600"
//                     : "bg-gray-50 border-gray-200"
//                 }`}
//               >
//                 <div className="overflow-x-auto">
//                   <div className="max-h-[300px] overflow-y-auto">
//                     <table className="w-full">
//                       <thead
//                         className={`sticky top-0 ${
//                           darkMode ? "bg-gray-700" : "bg-gray-100"
//                         }`}
//                       >
//                         <tr>
//                           <th className="px-3 py-2 text-left text-xs font-semibold">
//                             Product Code
//                           </th>
//                           <th className="px-3 py-2 text-left text-xs font-semibold">
//                             Product Description
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Batch
//                           </th>
                          
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Expire Date
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Purchase Price
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Stock Qty
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             PRN Qty
//                           </th>
//                           <th className="px-3 py-2 text-center text-xs font-semibold">
//                             Balance Qty
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody
//                         className={`divide-y ${
//                           darkMode ? "divide-gray-700" : "divide-gray-200"
//                         }`}
//                       >
//                         {selectedBatchRows.map((batch, i) => (
//                           <tr
//                             key={i}
//                             className={`transition-colors ${
//                               darkMode
//                                 ? "hover:bg-gray-700/50"
//                                 : "hover:bg-gray-100"
//                             }`}
//                           >
//                             <td className="px-3 py-2 text-xs">{batch.productCode}</td>
//                             <td className="px-3 py-2 text-xs">{batch.productDescription}</td>
//                             <td className="px-3 py-2 text-xs text-center">{batch.batch}</td>
                           
//                             <td className="px-3 py-2 text-xs text-center">
//                               <input
//                                 type="text"
//                                 value={batch.expireDate}
//                                 readOnly
//                                 className={`w-24 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               <input
//                                 type="number"
//                                 value={batch.purchasePrice}
//                                 readOnly
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               <input
//                                 type="number"
//                                 value={batch.balanceQty}
//                                 readOnly
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <input
//                                 type="number"
//                                 value={batch.returnQty}
//                                 onChange={(e) => {
//                                   handleBatchRowChange(i, 'returnQty', e.target.value);
//                                 }}
//                                 min="0"
//                                 max={batch.balanceQty}
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-700 border-gray-600 text-white" 
//                                     : "bg-white border-gray-300"
//                                 }`}
//                                 placeholder="0"
//                               />
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <input
//                                 type="number"
//                                 value={calculateBalanceQty(batch)}
//                                 readOnly
//                                 className={`w-20 px-2 py-1 text-center border rounded ${
//                                   darkMode 
//                                     ? "bg-gray-600 border-gray-500 text-white" 
//                                     : "bg-gray-100 border-gray-300"
//                                 }`}
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               {/* Add Product with Batches Button */}
//               <div className="flex justify-end mt-2">
//                 <button
//                   type="button"
//                   onClick={handleAddProductWithBatches}
//                   className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
//                 >
//                   <FiPlus className="w-4 h-4" /> 
//                   {products.find(p => p.P_PRCODE === productData.P_PRCODE) 
//                     ? "Update Product with Batches" 
//                     : "Add Product with Batches"
//                   }
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Preview Table with new structure */}
//           {products.length > 0 && (
//             <div
//               className={`rounded-xl border overflow-hidden mt-3 ${
//                 darkMode
//                   ? "bg-gray-700/30 border-gray-600"
//                   : "bg-gray-50 border-gray-200"
//               }`}
//             >
//               <div className="overflow-x-auto">
//                 <div className="max-h-[250px] overflow-y-auto">
//                   <table className="w-full">
//                     <thead
//                       className={`sticky top-0 ${
//                         darkMode ? "bg-gray-700" : "bg-gray-100"
//                       }`}
//                     >
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs font-semibold">
//                           Product Code
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Total Qty
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Total Value
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Return Reason
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Batches Count
//                         </th>
//                         <th className="px-3 py-2 text-center text-xs font-semibold">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody
//                       className={`divide-y ${
//                         darkMode ? "divide-gray-700" : "divide-gray-200"
//                       }`}
//                     >
//                       {products.map((product, i) => (
//                         <React.Fragment key={product.P_PRCODE}>
//                           <tr
//                             className={`transition-colors ${
//                               darkMode
//                                 ? "hover:bg-gray-700/50"
//                                 : "hover:bg-gray-100"
//                             }`}
//                           >
//                             <td className="px-3 py-2 text-xs font-medium">
//                               {product.P_PRCODE}
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               {formatWithCommas(Math.abs(product.P_TOTQTY))}
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               {formatWithCommas(Math.abs(product.P_TOTVAL))}
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               {reasonLabels[product.P_REASON]}
//                             </td>
//                             <td className="px-3 py-2 text-xs text-center">
//                               {product.Batches.length} batch(es)
//                             </td>
//                             <td className="px-3 py-2 text-center">
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveProduct(product.P_PRCODE)}
//                                 className="px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs flex items-center gap-1 mx-auto"
//                               >
//                                 <FiTrash2 className="w-3 h-3" /> Remove
//                               </button>
//                             </td>
//                           </tr>
//                           {/* Batch details expandable row */}
//                           <tr className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
//                             <td colSpan="7" className="px-3 py-2">
//                               <div className="text-xs">
//                                 <strong>Batch Details:</strong>
//                                 <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
//                                   {product.Batches.map((batch, batchIndex) => (
//                                     <div key={batchIndex} className={`p-2 rounded ${
//                                       darkMode ? "bg-gray-700" : "bg-gray-200"
//                                     }`}>
//                                       Batch: {batch.B_BATCHID} | 
//                                       Qty: {formatWithCommas(Math.abs(batch.B_QTY))} | 
//                                       Rate: {formatWithCommas(batch.B_AVERATE)}
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         </React.Fragment>
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
//               className={`px-3 py-2 border rounded-lg text-sm ${
//                 darkMode ? "border-gray-600 text-white" : ""
//               }`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
//             >
//               Save PRN
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }










import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiX,
  FiPackage,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiCheckCircle,
  FiTruck,
} from "react-icons/fi";
import { closeModal } from "../../../actions/modalActions";
import { addPrn } from "../../../actions/Inventory/purchaseReturnActions";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import purchaseReturnService from "../../../services/Inventory/purchaseReturnService.js";
import dropdownService from "../../../services/Inventory/prnDropdownService.js";  

export default function AddPRNModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);
  const modalProps = useSelector((state) => state.ui?.modalProps) || {};

  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [batchProducts, setBatchProducts] = useState([]);
  
  const [selectedBatchRows, setSelectedBatchRows] = useState([]); 
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [maxReturnQty, setMaxReturnQty] = useState(0);
  const [loading, setLoading] = useState({
    suppliers: false,
    warehouses: false,
    products: false,
    batches: false
  });

  const [selectedProductInfo, setSelectedProductInfo] = useState(null);

  const [productData, setProductData] = useState({
    P_PRCODE: "",
    P_REASON: "",
    P_REMARKS: "",
    P_TOTQTY: 0,
    P_TOTVAL: 0
  });

  const [products, setProducts] = useState([]);

  const reasonLabels = {
    E: "Expired",
    D: "Damaged",
    N: "Non-Moving",
    X: "Exchange",
  };

  // Validation function to check if form can be submitted
  const isFormValid = () => {
    // Check required header fields
    if (!formData.P_WHCODE || !formData.P_SUPCODE) {
      return false;
    }

    // Check if at least one product is added
    if (products.length === 0) {
      return false;
    }

    // Additional validation: ensure all added products have valid batches with quantities
    const hasValidProducts = products.every(product => 
      product.Batches && 
      product.Batches.length > 0 &&
      product.Batches.every(batch => batch.B_QTY > 0)
    );

    return hasValidProducts;
  };
 
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(prev => ({ ...prev, suppliers: true }));
    try {
      const response = await dropdownService.loadSuppliers();
      setSuppliers(response.ResultSet || []);
    } catch (error) {
 
      setSuppliers([]);
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };
 
  const loadWarehouses = async (supplierCode) => {
    if (!supplierCode) {
      setWarehouses([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, warehouses: true }));
    try {
      const response = await dropdownService.loadWarehouses(supplierCode);
      setWarehouses(response.ResultSet || []);
    } catch (error) {
 
      setWarehouses([]);
    } finally {
      setLoading(prev => ({ ...prev, warehouses: false }));
    }
  };
 
  const loadProducts = async (supplierCode, warehouseCode) => {
    if (!supplierCode || !warehouseCode) {
      setAvailableProducts([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const response = await dropdownService.loadProducts(supplierCode, warehouseCode);
      setAvailableProducts(response.ResultSet || []);
    } catch (error) {
 
      setAvailableProducts([]);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const loadBatches = async (supplierCode, warehouseCode, productCode) => {
    if (!supplierCode || !warehouseCode || !productCode) {
      setBatchProducts([]);
      setSelectedBatchRows([]);
      return;
    }
    
    setLoading(prev => ({ ...prev, batches: true }));
    try {
      const response = await dropdownService.loadBatches(supplierCode, warehouseCode, productCode);
      
      const selectedProduct = availableProducts.find(p => p.PRODUCT_CODE === productCode);
      const productDescription = selectedProduct ? selectedProduct.PRODUCT_NAME : productCode;
      
      const batchData = (response.ResultSet || []).map(batch => ({
        productCode: batch.PB_ProCode,
        productDescription: productDescription,
        batch: batch.PB_BId,
        pinQty: Math.abs(parseFloat(batch.PB_BLQty)),
        balanceQty: Math.abs(parseFloat(batch.PB_BLQty)),
        expireDate: formatApiDate(batch.PB_EXDate),
        purchasePrice: batch.PB_PPrice,
        supplierCode: batch.PB_SupCode,
        supplierName: batch.PB_SupName,
        returnQty: "",
        selected: false
      }));

      setBatchProducts(batchData);
      setSelectedBatchRows(batchData);
      
      calculateProductTotals(batchData);
      
    } catch (error) {
 
      setBatchProducts([]);
      setSelectedBatchRows([]);
    } finally {
      setLoading(prev => ({ ...prev, batches: false }));
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatApiDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return formatDate(date);
    } catch (error) {
 
      return dateString;
    }
  };

  const today = formatDate(new Date());

  const [formData, setFormData] = useState({
    P_REFDOCNO: "",
    P_WHCODE: "",
    P_SUPCODE: "",
    P_INNO: "",
    P_INDATE: "",
    P_PDATE: today,
  });

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatWithCommas = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const fetchMaxReturnQty = async (productCode, refCode) => {
    try {
      const response = await purchaseReturnService.getSumQty(productCode, refCode);
      if (response.ResultSet && response.ResultSet.length > 0) {
        const sumQty = parseFloat(response.ResultSet[0].SUMQTY) || 0;
        setMaxReturnQty(sumQty);
        return sumQty;
      }
      setMaxReturnQty(0);
      return 0;
    } catch (error) {
 
      setMaxReturnQty(0);
      return 0;
    }
  };

  const handleBatchRowChange = (index, field, value) => {
    const updatedRows = [...selectedBatchRows];
    
    if (field === 'returnQty') {
      const balanceQty = updatedRows[index].balanceQty;
      const returnQty = parseFloat(value) || 0;
      
      if (returnQty > balanceQty) {
        alert(`Return quantity cannot exceed balance quantity (${balanceQty})!`);
        return;
      }
      
      updatedRows[index][field] = value;
    } else {
      updatedRows[index][field] = value;
    }
    
    setSelectedBatchRows(updatedRows);
    
    calculateProductTotals(updatedRows);
  };

  const calculateProductTotals = (batchRows) => {
    const totalReturnQty = batchRows.reduce((sum, batch) => 
      sum + parseFloat(batch.returnQty || 0), 0
    );

    const totalValue = batchRows.reduce((sum, batch) => {
      const returnQty = parseFloat(batch.returnQty || 0);
      const purchasePrice = parseFloat(batch.purchasePrice || 0);
      return sum + (returnQty * purchasePrice);
    }, 0);

    setProductData(prev => ({
      ...prev,
      P_TOTQTY: totalReturnQty, 
      P_TOTVAL: totalValue      
    }));

    return { totalReturnQty, totalValue };
  };

  // Calculate balance quantity after PRN
  const calculateBalanceQty = (batch) => {
    const stockQty = parseFloat(batch.balanceQty || 0);
    const returnQty = parseFloat(batch.returnQty || 0);
    return stockQty - returnQty;
  };

  const handleAddProductWithBatches = () => {
    const selectedBatches = selectedBatchRows.filter(row => 
      row.returnQty && parseFloat(row.returnQty) > 0
    );

    if (selectedBatches.length === 0) {
      alert("Please select at least one batch with return quantity");
      return;
    }

    if (!productData.P_REASON) {
      alert("Please select a return reason");
      return;
    }

    if (!productData.P_PRCODE) {
      alert("Please select a product");
      return;
    }

    const totalReturnQty = selectedBatches.reduce((sum, batch) => 
      sum + parseFloat(batch.returnQty || 0), 0
    );

    const totalValue = selectedBatches.reduce((sum, batch) => {
      const returnQty = parseFloat(batch.returnQty || 0);
      const purchasePrice = parseFloat(batch.purchasePrice || 0);
      return sum + (returnQty * purchasePrice);
    }, 0);

    const batches = selectedBatches.map(batch => ({
      P_PRCODE: productData.P_PRCODE,
      B_BATCHID: batch.batch,
      B_QTY: Math.abs(parseFloat(batch.returnQty)),
      B_AVERATE: parseFloat(batch.purchasePrice || 0).toFixed(2)
    }));

    const newProduct = {
      P_PRCODE: productData.P_PRCODE,
      P_TOTQTY: Math.abs(totalReturnQty), 
      P_TOTVAL: Math.abs(totalValue),    
      P_REASON: productData.P_REASON,
      P_REMARKS: productData.P_REMARKS || "",
      Batches: batches
    };

    const existingProductIndex = products.findIndex(p => p.P_PRCODE === productData.P_PRCODE);
    
    if (existingProductIndex > -1) { 
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = newProduct;
      setProducts(updatedProducts);
    } else {
      setProducts([...products, newProduct]);
    }

    setProductData({
      P_PRCODE: "",
      P_REASON: "",
      P_REMARKS: "",
      P_TOTQTY: 0,
      P_TOTVAL: 0
    });
    setMaxReturnQty(0);
    setBatchProducts([]);
    setSelectedBatchRows([]);
    setSelectedProductInfo(null);
  };

  const handleRemoveProduct = (productCode) => {
    setProducts(products.filter(p => p.P_PRCODE !== productCode));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (!formData.P_WHCODE || !formData.P_SUPCODE  ) {
      alert("Please fill all required header fields");
      return;
    }

    if (products.length === 0) {
      alert("Please add at least one Product");
      return;
    }

    const prnPayload = [
      {
        P_REFDOCNO: formData.P_REFDOCNO,
        P_WHCODE: formData.P_WHCODE,
        P_SUPCODE: Number(formData.P_SUPCODE),
        P_INNO: formData.P_INNO,
        P_INDATE: formData.P_INDATE,
        P_PDATE: formData.P_PDATE,
        Items: products
      },
    ];
 

    dispatch(addPrn(prnPayload))
      .then(() => {
        showAlertMessage(`PRN Added Successfully!`, "success");
        if (modalProps.onSuccess) {
          modalProps.onSuccess("PRN added successfully!", "success");
        }
        setTimeout(() => {
          dispatch(closeModal());
        }, 1000);
      })
      .catch((error) => {
        showAlertMessage("Failed to add PRN", "error");
        if (modalProps.onSuccess) {
          modalProps.onSuccess("Failed to add PRN", "error");
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

  const fieldClass = `w-full px-3 py-2 rounded-lg border text-sm ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  }`;

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
        className={`rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto ${
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
              Add Purchase Return (PRN)
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Supplier */}
            <div>
              <label className="block text-xs font-medium">Supplier *</label>
              <Select
                options={suppliers.map((s) => ({
                  value: s.SUP_CODE,
                  label: s.SUP_NAME,
                }))}
                value={
                  formData.P_SUPCODE
                    ? {
                        value: formData.P_SUPCODE,
                        label:
                          suppliers.find(
                            (s) => s.SUP_CODE === formData.P_SUPCODE
                          )?.SUP_NAME || "",
                      }
                    : null
                }
                onChange={async (selected) => {
                  const supplierCode = selected.value;
                  
                  // Reset dependent fields
                  setFormData({ 
                    ...formData, 
                    P_SUPCODE: supplierCode,
                    P_WHCODE: "", 
                    P_REFDOCNO: "",
                    P_INNO: "",
                    P_INDATE: ""
                  });

                  setProductData({
                    P_PRCODE: "",
                    P_REASON: "",
                    P_REMARKS: "",
                    P_TOTQTY: 0,
                    P_TOTVAL: 0
                  });

                  // Load warehouses for this supplier
                  await loadWarehouses(supplierCode);
                  
                  // Reset products and batches
                  setAvailableProducts([]);
                  setBatchProducts([]);
                  setSelectedBatchRows([]);
                  setSelectedProductInfo(null);
                  setProducts([]);
                }}
                placeholder={loading.suppliers ? "Loading suppliers..." : "-- Select Supplier --"}
                isSearchable
                isLoading={loading.suppliers}
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

            {/* Warehouse */}
            <div>
              <label className="block text-xs font-medium">Warehouse *</label>
              <Select
                options={warehouses.map((w) => ({
                  value: w.WH_CODE,
                  label: w.WH_NAME,
                }))}
                value={
                  formData.P_WHCODE
                    ? {
                        value: formData.P_WHCODE,
                        label:
                          warehouses.find(
                            (w) => w.WH_CODE === formData.P_WHCODE
                          )?.WH_NAME || "",
                      }
                    : null
                }
                onChange={async (selected) => {
                  const warehouseCode = selected.value;
                  
                  setFormData({ 
                    ...formData, 
                    P_WHCODE: warehouseCode,
                    P_REFDOCNO: ""  
                  });

                  setProductData({
                    P_PRCODE: "",
                    P_REASON: "",
                    P_REMARKS: "",
                    P_TOTQTY: 0,
                    P_TOTVAL: 0
                  });

                  // Load products for this supplier and warehouse
                  await loadProducts(formData.P_SUPCODE, warehouseCode);
                  
                  // Reset batches and products
                  setBatchProducts([]);
                  setSelectedBatchRows([]);
                  setSelectedProductInfo(null);
                  setProducts([]);
                }}
                placeholder={!formData.P_SUPCODE ? "Select supplier first" : (loading.warehouses ? "Loading warehouses..." : "-- Select Warehouse --")}
                isSearchable
                isDisabled={!formData.P_SUPCODE || loading.warehouses}
                isLoading={loading.warehouses}
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
              {!formData.P_SUPCODE && (
                <p className="text-xs text-red-500 mt-1">Please select a supplier first</p>
              )}
            </div>

            {/* Invoice No */}
            <div>
              <label className="block text-xs font-medium">Invoice No</label>
              <input
                name="P_INNO"
                type="text"
                value={formData.P_INNO || ""}
                onChange={(e) =>
                  setFormData({ ...formData, P_INNO: e.target.value })
                }
                className={fieldClass} 
              />
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-xs font-medium">Invoice Date</label>
              <DatePicker
                selected={
                  formData.P_INDATE ? new Date(formData.P_INDATE) : null
                }
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    P_INDATE: date ? formatDate(date) : "",
                  })
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                className={fieldClass} 
              />
            </div>

            {/* PRN Date */}
            <div>
              <label className="block text-xs font-medium">PRN Date *</label>
              <DatePicker
                selected={
                  formData.P_PDATE ? new Date(formData.P_PDATE) : new Date()
                }
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    P_PDATE: date ? formatDate(date) : "",
                  })
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                className={fieldClass}
                readOnly
              />
            </div>
          </div>
          
          {/* Product Entry */}
          <div className="border p-3 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Add Return Product</h3>

            {/* Max Return Quantity Info */}
            {maxReturnQty > 0 && (
              <div className={`p-2 rounded-lg text-sm ${
                darkMode ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-800"
              }`}>
                Maximum available quantity for return: <strong>{maxReturnQty}</strong>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Product Code */}
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Search or Select Product Code *
                </label> 

                <Select
                  isDisabled={!formData.P_SUPCODE || !formData.P_WHCODE}
                  options={availableProducts.map(product => ({
                    value: product.PRODUCT_CODE,
                    label: ` ${product.PRODUCT_NAME}`,
                    product: product
                  }))}
                  value={
                    productData.P_PRCODE
                      ? { 
                          value: productData.P_PRCODE, 
                          label: ` ${availableProducts.find(p => p.PRODUCT_CODE === productData.P_PRCODE)?.PRODUCT_NAME || ''}`
                        }
                      : null
                  }
                  onChange={async (selected) => {
                    const product = selected.product;
                    
                    // Store selected product info for batch description
                    setSelectedProductInfo({
                      code: product.PRODUCT_CODE,
                      name: product.PRODUCT_NAME
                    });

                    // Load batches for this product
                    await loadBatches(formData.P_SUPCODE, formData.P_WHCODE, product.PRODUCT_CODE);

                    const maxQty = await fetchMaxReturnQty(product.PRODUCT_CODE, formData.P_REFDOCNO);

                    setProductData({
                      ...productData,
                      P_PRCODE: product.PRODUCT_CODE || "",
                    });
                  }}
                  placeholder={
                    !formData.P_SUPCODE || !formData.P_WHCODE 
                      ? "Please select supplier and warehouse first" 
                      : loading.products 
                      ? "Loading products..." 
                      : "-- Search or Select Product Code --"
                  }
                  isSearchable
                  isLoading={loading.products}
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
                {(!formData.P_SUPCODE || !formData.P_WHCODE) && (
                  <p className="text-xs text-red-500 mt-1">Please select supplier and warehouse first</p>
                )}
              </div>

              {/* Return Reason */}
              <div>
                <label className="block text-xs font-medium">Return Reason *</label>
                <select
                  name="P_REASON"
                  value={productData.P_REASON}
                  onChange={(e) => setProductData({...productData, P_REASON: e.target.value})}
                  className={fieldClass}
                >
                  <option value="">-- Select Reason --</option>
                  <option value="E">Expired</option>
                  <option value="D">Damaged</option>
                  <option value="N">Non-Moving</option>
                  <option value="X">Exchange</option>
                </select>
              </div>

             
            </div>

            {productData.P_PRCODE && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className={`p-2 rounded-lg text-sm ${
                  darkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
                }`}>
                  Total Available Stock: <strong>{productData.P_TOTQTY.toFixed(2)}</strong>
                </div>
                <div className={`p-2 rounded-lg text-sm ${
                  darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"
                }`}>
                  Total Return Value: <strong>{productData.P_TOTVAL.toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Batch Products Grid */}
          {batchProducts.length > 0 && (
            <div className="border p-3 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm">
                Batch Details
                {loading.batches && <span className="text-blue-500 ml-2">Loading batches...</span>}
              </h3>
              
              <div
                className={`rounded-xl border overflow-hidden ${
                  darkMode
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="overflow-x-auto">
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full">
                      <thead
                        className={`sticky top-0 ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold">
                            Product Code
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold">
                            Product Description
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-semibold">
                            Batch
                          </th>
                          
                          <th className="px-3 py-2 text-center text-xs font-semibold">
                            Expire Date
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-semibold">
                            Purchase Price
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-semibold">
                            Stock Qty
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-semibold">
                            PRN Qty
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-semibold">
                            Balance Qty
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y ${
                          darkMode ? "divide-gray-700" : "divide-gray-200"
                        }`}
                      >
                        {selectedBatchRows.map((batch, i) => (
                          <tr
                            key={i}
                            className={`transition-colors ${
                              darkMode
                                ? "hover:bg-gray-700/50"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <td className="px-3 py-2 text-xs">{batch.productCode}</td>
                            <td className="px-3 py-2 text-xs">{batch.productDescription}</td>
                            <td className="px-3 py-2 text-xs text-center">{batch.batch}</td>
                           
                            <td className="px-3 py-2 text-xs text-center">
                              <input
                                type="text"
                                value={batch.expireDate}
                                readOnly
                                className={`w-24 px-2 py-1 text-center border rounded ${
                                  darkMode 
                                    ? "bg-gray-600 border-gray-500 text-white" 
                                    : "bg-gray-100 border-gray-300"
                                }`}
                              />
                            </td>
                            <td className="px-3 py-2 text-xs text-center">
                              <input
                                type="number"
                                value={batch.purchasePrice}
                                readOnly
                                className={`w-20 px-2 py-1 text-center border rounded ${
                                  darkMode 
                                    ? "bg-gray-600 border-gray-500 text-white" 
                                    : "bg-gray-100 border-gray-300"
                                }`}
                              />
                            </td>
                            <td className="px-3 py-2 text-xs text-center">
                              <input
                                type="number"
                                value={batch.balanceQty}
                                readOnly
                                className={`w-20 px-2 py-1 text-center border rounded ${
                                  darkMode 
                                    ? "bg-gray-600 border-gray-500 text-white" 
                                    : "bg-gray-100 border-gray-300"
                                }`}
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="number"
                                value={batch.returnQty}
                                onChange={(e) => {
                                  handleBatchRowChange(i, 'returnQty', e.target.value);
                                }}
                                min="0"
                                max={batch.balanceQty}
                                className={`w-20 px-2 py-1 text-center border rounded ${
                                  darkMode 
                                    ? "bg-gray-700 border-gray-600 text-white" 
                                    : "bg-white border-gray-300"
                                }`}
                                placeholder="0"
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="number"
                                value={calculateBalanceQty(batch)}
                                readOnly
                                className={`w-20 px-2 py-1 text-center border rounded ${
                                  darkMode 
                                    ? "bg-gray-600 border-gray-500 text-white" 
                                    : "bg-gray-100 border-gray-300"
                                }`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Add Product with Batches Button */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddProductWithBatches}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  <FiPlus className="w-4 h-4" /> 
                  {products.find(p => p.P_PRCODE === productData.P_PRCODE) 
                    ? "Update Product with Batches" 
                    : "Add Product with Batches"
                  }
                </button>
              </div>
            </div>
          )}

          {/* Preview Table with new structure */}
          {products.length > 0 && (
            <div
              className={`rounded-xl border overflow-hidden mt-3 ${
                darkMode
                  ? "bg-gray-700/30 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="overflow-x-auto">
                <div className="max-h-[250px] overflow-y-auto">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold">
                          Product Code
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Total Qty
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Total Value
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Return Reason
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Batches Count
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        darkMode ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {products.map((product, i) => (
                        <React.Fragment key={product.P_PRCODE}>
                          <tr
                            className={`transition-colors ${
                              darkMode
                                ? "hover:bg-gray-700/50"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <td className="px-3 py-2 text-xs font-medium">
                              {product.P_PRCODE}
                            </td>
                            <td className="px-3 py-2 text-xs text-center">
                              {formatWithCommas(Math.abs(product.P_TOTQTY))}
                            </td>
                            <td className="px-3 py-2 text-xs text-center">
                              {formatWithCommas(Math.abs(product.P_TOTVAL))}
                            </td>
                            <td className="px-3 py-2 text-xs text-center">
                              {reasonLabels[product.P_REASON]}
                            </td>
                            <td className="px-3 py-2 text-xs text-center">
                              {product.Batches.length} batch(es)
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(product.P_PRCODE)}
                                className="px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs flex items-center gap-1 mx-auto"
                              >
                                <FiTrash2 className="w-3 h-3" /> Remove
                              </button>
                            </td>
                          </tr>
                          {/* Batch details expandable row */}
                          <tr className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
                            <td colSpan="7" className="px-3 py-2">
                              <div className="text-xs">
                                <strong>Batch Details:</strong>
                                <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                  {product.Batches.map((batch, batchIndex) => (
                                    <div key={batchIndex} className={`p-2 rounded ${
                                      darkMode ? "bg-gray-700" : "bg-gray-200"
                                    }`}>
                                      Batch: {batch.B_BATCHID} | 
                                      Qty: {formatWithCommas(Math.abs(batch.B_QTY))} | 
                                      Rate: {formatWithCommas(batch.B_AVERATE)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 items-center">
            {!isFormValid() && (
              <span className="text-xs text-red-500 mr-2">
                {!formData.P_WHCODE || !formData.P_SUPCODE 
                  ? "Please fill all required header fields" 
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
                darkMode ? "border-gray-600 text-white" : ""
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isFormValid() 
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" 
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Save PRN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}