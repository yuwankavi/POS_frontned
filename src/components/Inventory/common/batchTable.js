// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiPlus,
//   FiSearch,
//   FiCheckCircle,
//   FiX,
//   FiPackage,
//   FiBox,
//   FiUserCheck,
//   FiUserX,
// } from "react-icons/fi";
// import { openModal } from "../../../actions/modalActions.js";
// import {
//   listBatches,
//   toggleBatchStatus,
//   listActiveBatches,
//   listInactiveBatches,
// } from "../../../actions/Inventory/batchActions.js";
// import Breadcrumb from "../../common/Breadcrumb";

// export default function BatchTable() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("active");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);



//   const { batches, loading, error } =
//     useSelector((state) => state.batch);

//   const {activeBatches=[], activeloadding, activeerror} = useSelector((state)=>state.activeBatches )
//   const {inactiveBatches=[], inactiveloading, inactiveerror} = useSelector((state)=>state.inactiveBatches )


//   useEffect(() => {
//     dispatch(listActiveBatches());
//     dispatch(listInactiveBatches());
//   }, []);

//   const showAlertMessage = (message, type = "success") => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     try {
//       return new Date(dateString).toISOString().split("T")[0];
//     } catch {
//       return "-";
//     }
//   };


//   let filteredBatches = [];
//   if (activeFilter === "all") {
//     filteredBatches = [activeBatches, inactiveBatches];
//   } else if (activeFilter === "active") {
//     filteredBatches = activeBatches;
//   } else if (activeFilter === "inactive") {
//     filteredBatches = inactiveBatches;
//   }

//   filteredBatches = filteredBatches.filter((b) => {
//     return (
//       b.PB_WHCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.PB_ProCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.PB_PBNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.PB_WHName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.PB_ProDes?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   const getStatusBadge = (status) =>
//     status === "A" ? (
//       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
//         <FiUserCheck className="w-3 h-3" />
//         <span className="hidden xs:inline">Active</span>
//       </span>
//     ) : (
//       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
//         <FiUserX className="w-3 h-3" />
//         <span className="hidden xs:inline">Inactive</span>
//       </span>
//     );

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
//         return (
//           <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//         );
//       default:
//         return (
//           <FiPackage className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//         );
//     }
//   };

//   // Stats
//   // const totalBatches = batch.length;
//   // const activeBatches = batch.filter((b) => b.PB_Status === "A").length;
//   // const inactiveBatches = batch.filter((b) => b.PB_Status !== "A").length;
//   const totalBatches = activeBatches.length + inactiveBatches.length;
//   const activeCount = activeBatches.length;
//   const inactiveCount = inactiveBatches.length;

//   return (
//     <div
//       className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${
//         darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//       } border`}
//     >
//       {/* Alert Message */}
//       {showAlert && (
//         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
//           <div
//             className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}
//           >
//             <div className="flex items-center gap-2 sm:gap-3">
//               {getAlertIcon()}
//               <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
//             </div>
//             <button
//               onClick={() => setShowAlert(false)}
//               className="hover:opacity-70 transition-opacity"
//             >
//               <FiX className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       <Breadcrumb current="Inventory / Product / Batch Details " />

//       {/* Header */}
//       <div className="mt-2 mb-3 md:mb-5">
//         <div className="flex items-center justify-between mb-1 md:mb-2">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
//               <FiBox className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900 dark:text-white">
//                 Batch Details
//               </h1>
//               <p className="text-xs text-gray-600 dark:text-gray-400">
//                 Manage your batch details
//               </p>
//             </div>
//           </div>
//           {/* <button
//             onClick={() => dispatch(openModal("ADD_BATCH"))}
//             className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
//           >
//             <FiPlus className="w-4 h-4" />
//             Add Batch
//           </button> */}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-1 md:mb-2">
//           <div
//             className={`rounded-lg p-2 shadow border ${
//               darkMode
//                 ? "bg-gray-700/50 border-gray-600"
//                 : "bg-gray-50 border-gray-100"
//             }`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Total Batches
//                 </p>
//                 <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
//                   {totalBatches}
//                 </p>
//               </div>
//               <FiBox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             </div>
//           </div>
//           <div
//             className={`rounded-lg p-2 shadow border ${
//               darkMode
//                 ? "bg-gray-700/50 border-gray-600"
//                 : "bg-gray-50 border-gray-100"
//             }`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Active
//                 </p>
//                 <p className="text-sm font-bold text-green-600 dark:text-green-400">
//                   {activeCount}
//                 </p>
//               </div>
//               <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
//             </div>
//           </div>
//           <div
//             className={`rounded-lg p-2 shadow border ${
//               darkMode
//                 ? "bg-gray-700/50 border-gray-600"
//                 : "bg-gray-50 border-gray-100"
//             }`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Inactive
//                 </p>
//                 <p className="text-sm font-bold text-red-600 dark:text-red-400">
//                   {inactiveCount}
//                 </p>
//               </div>
//               <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="relative flex-1">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search by WH Code, Product Code, Batch No..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${
//                 darkMode
//                   ? "bg-gray-700 border-gray-600 text-white"
//                   : "bg-gray-50 border-gray-200 text-gray-900"
//               }`}
//             />
//           </div>
//           <div className="flex flex-wrap gap-1">
//             {[ "active", "inactive"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f)}
//                 className={`px-2 py-1.5 text-xs rounded-lg font-medium ${
//                   activeFilter === f
//                     ? "bg-blue-600 text-white"
//                     : darkMode
//                     ? "bg-gray-700 text-gray-300"
//                     : "bg-gray-100 text-gray-700"
//                 }`}
//               >
//                 {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
//         <div
//           className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${
//             darkMode ? "bg-gray-700/30" : "bg-gray-100"
//           }`}
//         >
//           {(activeFilter==="active" ? activeloadding : inactiveloading) ? (
//             <div className="flex items-center justify-center py-8 rounded-xl h-full">
//               <div className="flex flex-col items-center gap-2">
//                 <div className="relative">
//                   <div
//                     className={`w-8 h-8 border-4 rounded-full animate-spin ${
//                       darkMode ? "border-blue-800" : "border-blue-200"
//                     }`}
//                   ></div>
//                   <div className="absolute inset-0 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//                 <p
//                   className={`text-sm font-medium ${
//                     darkMode ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 >
//                   Loading batches...
//                 </p>
//               </div>
//             </div>
//           ) : (activeFilter ==="active" ? activeerror : inactiveerror) ? (
//             <div
//               className={`rounded-xl p-4 text-center h-full flex items-center justify-center border ${
//                 darkMode
//                   ? "bg-red-900/20 border-red-800"
//                   : "bg-red-50 border-red-200"
//               }`}
//             >
//               <div>
//                 <div
//                   className={`font-medium text-sm ${
//                     darkMode ? "text-red-400" : "text-red-600"
//                   }`}
//                 >
//                   ⚠️ Error
//                 </div>
//                 <p
//                   className={`mt-1 text-xs ${
//                     darkMode ? "text-red-400" : "text-red-600"
//                   }`}
//                 >
//                   {activeFilter ==="active" ? activeerror : inactiveerror}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div
//               className={`rounded-xl border overflow-hidden h-full ${
//                 darkMode
//                   ? "bg-gray-700/30 border-gray-600"
//                   : "bg-gray-50 border-gray-200"
//               }`}
//             >
//               {/* Table */}
//               <div className="overflow-x-auto h-full">
//                 <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
//                   <table className="w-full">
//                     <thead
//                       className={`sticky top-0 ${
//                         darkMode ? "bg-gray-700" : "bg-gray-100"
//                       }`}
//                     >
//                       <tr>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
//                           ID
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
//                           WH Code
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden sm:table-cell">
//                           WH Name
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
//                           Product Code
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">
//                           Product Desc
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
//                           Batch No
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">
//                           Expiry Date
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden xl:table-cell">
//                           Supplier
//                         </th>
//                         <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">
//                           Qty
//                         </th>
//                         <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody
//                       className={`divide-y ${
//                         darkMode ? "divide-gray-700" : "divide-gray-200"
//                       }`}
//                     >
//                       {filteredBatches.map((batch) => (
//                         <tr
//                           key={batch.PB_BId}
//                           className={`transition-colors duration-150 ${
//                             darkMode
//                               ? "hover:bg-gray-700/50"
//                               : "hover:bg-gray-100"
//                           }`}
//                         >
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">
//                             {batch.PB_BId}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
//                             {batch.PB_WHCode}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden sm:table-cell">
//                             {batch.PB_WHName}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium text-blue-600 dark:text-blue-400">
//                             {batch.PB_ProCode}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">
//                             {batch.PB_ProDes}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
//                             {batch.PB_PBNo}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden lg:table-cell">
//                             {formatDate(batch.PB_EXDate)}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden xl:table-cell">
//                             {batch.PB_SupCode}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-left text-xs">
//                             {batch.PB_BLQty}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-center">
//                             {getStatusBadge(batch.PB_Status)}
//                           </td>
//                           <td className="px-2 py-2 whitespace-nowrap text-center">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 dispatch(
//                                   toggleBatchStatus(
//                                     batch.PB_BId,
//                                     batch.PB_Status === "A" ? "I" : "A"
//                                   )
//                                 ).then(() =>
//                                   showAlertMessage(
//                                     `Batch ${batch.PB_BId} ${
//                                       batch.PB_Status === "A"
//                                         ? "deactivated"
//                                         : "activated"
//                                     } successfully`,
//                                     "success"
//                                   )
//                                 );
//                               }}
//                               className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
//                                 batch.PB_Status === "A"
//                                   ? darkMode
//                                     ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
//                                     : "bg-red-100 text-red-700 hover:bg-red-200"
//                                   : darkMode
//                                   ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
//                                   : "bg-green-100 text-green-700 hover:bg-green-200"
//                               }`}
//                             >
//                               {batch.PB_Status === "A"
//                                 ? "Deactivate"
//                                 : "Activate"}
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 {filteredBatches.length === 0 && (
//                   <div className="text-center py-8 h-full flex items-center justify-center">
//                     <div>
//                       <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                       <p
//                         className={`text-sm font-medium ${
//                           darkMode ? "text-gray-400" : "text-gray-500"
//                         }`}
//                       >
//                         No batches found
//                       </p>
//                       <p
//                         className={`text-xs ${
//                           darkMode ? "text-gray-500" : "text-gray-400"
//                         }`}
//                       >
//                         Try adjusting your search or filters
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiSearch,
  FiCheckCircle,
  FiX,
  FiPackage,
  FiBox,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import { openModal } from "../../../actions/modalActions.js";
import {
  listBatches,
  toggleBatchStatus,
  listActiveBatches,
  listInactiveBatches,
} from "../../../actions/Inventory/batchActions.js";
import Breadcrumb from "../../common/Breadcrumb";

export default function BatchTable() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // Confirmation Modal States
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [batchToUpdate, setBatchToUpdate] = useState(null);

  const { batches, loading, error } = useSelector((state) => state.batch);
  const {
    activeBatches = [],
    activeloadding,
    activeerror,
  } = useSelector((state) => state.activeBatches);
  const {
    inactiveBatches = [],
    inactiveloading,
    inactiveerror,
  } = useSelector((state) => state.inactiveBatches);

  useEffect(() => {
    dispatch(listActiveBatches());
    dispatch(listInactiveBatches());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  // Filtered Batches
  let filteredBatches = [];
  if (activeFilter === "all") {
    filteredBatches = [...activeBatches, ...inactiveBatches];
  } else if (activeFilter === "active") {
    filteredBatches = activeBatches;
  } else if (activeFilter === "inactive") {
    filteredBatches = inactiveBatches;
  }

  filteredBatches = filteredBatches.filter((b) => {
    return (
      b.PB_WHCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.PB_ProCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.PB_PBNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.PB_WHName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.PB_ProDes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  const totalBatches = activeBatches.length + inactiveBatches.length;
  const activeCount = activeBatches.length;
  const inactiveCount = inactiveBatches.length;

  // Modal Handlers
  const openStatusModal = (batch) => {
    setBatchToUpdate(batch);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setBatchToUpdate(null);
    setIsStatusModalOpen(false);
  };

  const handleStatusChange = () => {
    if (!batchToUpdate) return;
    dispatch(
      toggleBatchStatus(
        batchToUpdate.PB_BId,
        batchToUpdate.PB_Status === "A" ? "I" : "A"
      )
    ).then(() => {
      showAlertMessage(
        `Batch ${batchToUpdate.PB_BId} ${batchToUpdate.PB_Status === "A" ? "deactivated" : "activated"
        } successfully`,
        "success"
      );
      closeStatusModal();
    });
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
            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${alertType === "success"
                ? "bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700"
                : "bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700"
              } text-black`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {alertType === "success" ? (
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
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

      {/* Breadcrumb */}
      <Breadcrumb current="Inventory / Product / Batch Details " />

      {/* Header & Stats */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiBox className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Batch Details
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage your batch details
              </p>
            </div>
          </div>
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
                  Total Batches
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {totalBatches}
                </p>
              </div>
              <FiBox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                  {activeCount}
                </p>
              </div>
              <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                  {inactiveCount}
                </p>
              </div>
              <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by WH Code, Product Code, Batch No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {["active", "inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === f
                    ? "bg-blue-600 text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
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
          {(activeFilter === "active" ? activeloadding : inactiveloading) ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-blue-800" : "border-blue-200"
                      }`}
                  ></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Loading batches...
                </p>
              </div>
            </div>
          ) : (activeFilter === "active" ? activeerror : inactiveerror) ? (
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
                  {activeFilter === "active" ? activeerror : inactiveerror}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-xl border overflow-hidden h-full ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
            >
              <div className="overflow-x-auto h-full">
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <table className="w-full">
                    <thead
                      className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                    >
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">Batch No</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">WH Code</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden sm:table-cell">WH Name</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">Product Code</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden md:table-cell">Product Desc</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden lg:table-cell">Expiry Date</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider hidden xl:table-cell">Supplier</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider">Balance Qty</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">Status</th>
                        <th className="px-2 py-2 text-center text-xs font-semibold tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
                    >
                      {filteredBatches.map((batch) => (
                        <tr
                          key={batch.PB_BId}
                          className={`transition-colors duration-150 ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium">{batch.PB_BId}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs">{batch.PB_WHCode}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden sm:table-cell">{batch.PB_WHName}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs font-medium text-blue-600 dark:text-blue-400">{batch.PB_ProCode}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden md:table-cell">{batch.PB_ProDes}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden lg:table-cell">{formatDate(batch.PB_EXDate)}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs hidden xl:table-cell">{batch.PB_SupCode}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-left text-xs">{batch.PB_BLQty}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">{getStatusBadge(batch.PB_Status)}</td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openStatusModal(batch);
                              }}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${batch.PB_Status === "A"
                                  ? darkMode
                                    ? "bg-red-900/30 text-red-400 hover:bg-red-800/50"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                  : darkMode
                                    ? "bg-green-900/30 text-green-400 hover:bg-green-800/50"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                            >
                              {batch.PB_Status === "A" ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredBatches.length === 0 && (
                  <div className="text-center py-8 h-full flex items-center justify-center">
                    <div>
                      <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No batches found</p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Try adjusting your search or filters</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {isStatusModalOpen && batchToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${batchToUpdate.PB_Status === "A"
                      ? darkMode
                        ? "bg-red-900/30"
                        : "bg-red-100"
                      : darkMode
                        ? "bg-green-900/30"
                        : "bg-green-100"
                    }`}
                >
                  {batchToUpdate.PB_Status === "A" ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {batchToUpdate.PB_Status === "A"
                    ? "Deactivate Batch"
                    : "Activate Batch"}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to{" "}
                  {batchToUpdate.PB_Status === "A" ? "deactivate" : "activate"}{" "}
                  batch <strong>{batchToUpdate.PB_BId}</strong>?
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
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${batchToUpdate.PB_Status === "A"
                      ? "bg-red-600"
                      : "bg-green-600"
                    }`}
                >
                  {batchToUpdate.PB_Status === "A"
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
}
