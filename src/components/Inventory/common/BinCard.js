// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FiSearch, FiPackage, FiCheckCircle, FiX, FiBarChart2 } from "react-icons/fi";
// import { listBinCards } from "../../../actions/admin/binCardAction.js";
// import Breadcrumb from "../../../components/common/Breadcrumb.js";

// export default function BinCard() {
//   const dispatch = useDispatch();
//   const { loading, error, binCards = [] } = useSelector((state) => state.binCard);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");

//   useEffect(() => {
//     dispatch(listBinCards());
//   }, [dispatch]);

//   const filteredBinCards = binCards.filter((bin) => {
//     const matchesSearch =
//       bin.BIN_WHCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       bin.BIN_PrCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       bin.BIN_BatchId?.toLowerCase().includes(searchTerm.toLowerCase());

//     if (activeFilter === "all") return matchesSearch;
//     if (activeFilter === "active") return matchesSearch && bin.BIN_STATUS === "A";
//     if (activeFilter === "inactive") return matchesSearch && bin.BIN_STATUS !== "A";

//     return matchesSearch;
//   });

//   const getStatusBadge = (status) =>
//     status === "A" ? (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
//         <FiCheckCircle className="w-3 h-3" />
//         Active
//       </span>
//     ) : (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
//         <FiX className="w-3 h-3" />
//         Inactive
//       </span>
//     );

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[90vh] overflow-y-auto">
//       <div className="max-w-7xl mx-auto">
//         <Breadcrumb current="Inventory / Bin Card" />

//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//           {/* Header */}
//           <div className="p-3 border-b border-gray-200 dark:border-gray-700">
//             <div className="flex items-center gap-2">
//               <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//                 <FiPackage className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                   Bin Card Management
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
//                   Track inventory movements and batch details
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm">Total Bin Cards</p>
//                     <p className="text-2xl font-bold text-gray-800 dark:text-white">
//                       {binCards.length}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                     <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm">Active Records</p>
//                     <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                       {binCards.filter((bin) => bin.BIN_STATUS === "A").length}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                     <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Search + Filters */}
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="relative flex-1">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by WH Code, Product Code, or Batch..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
//                 />
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={() => setActiveFilter("all")}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     activeFilter === "all"
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   All
//                 </button>
//                 <button
//                   onClick={() => setActiveFilter("active")}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     activeFilter === "active"
//                       ? "bg-green-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   Active
//                 </button>
//                 <button
//                   onClick={() => setActiveFilter("inactive")}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     activeFilter === "inactive"
//                       ? "bg-gray-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   Inactive
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="p-6">
//             {loading ? (
//               <div className="flex items-center justify-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="relative">
//                     <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
//                     <div className="absolute inset-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                   </div>
//                   <p className="text-gray-600 dark:text-gray-400 font-medium">
//                     Loading bin card records...
//                   </p>
//                 </div>
//               </div>
//             ) : error ? (
//               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
//                 <div className="text-red-600 dark:text-red-400 font-medium text-lg">⚠️ Error</div>
//                 <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
//               </div>
//             ) : (
//               <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <div className="max-h-[260px] overflow-y-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
//                         <tr>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             WH Code
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Doc Type
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Doc No
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Product Code
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Batch ID
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Line
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Production Date
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Qty
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
//                             Status
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {filteredBinCards.map((bin, index) => (
//                           <tr
//                             key={index}
//                             className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                           >
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
//                                 <FiBarChart2 className="w-3 h-3" />
//                                 {bin.BIN_WHCode}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">{bin.BIN_DOCType}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">{bin.DOCNo}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">{bin.BIN_PrCode}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">{bin.BIN_BatchId}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">{bin.BIN_Line}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {bin.BIN_PDate ? new Date(bin.BIN_PDate).toLocaleDateString() : "-"}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">{bin.BIN_Qty}</td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {getStatusBadge(bin.BIN_STATUS)}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {filteredBinCards.length === 0 && (
//                     <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//                       <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                       <p className="text-lg font-medium">No bin cards found</p>
//                       <p className="text-sm">Try adjusting your search or filters</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
