// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiPlus,
//   FiSearch,
//   FiPackage,
//   FiCheckCircle,
//   FiX,
//   FiBarChart2,
//   FiEdit3,
//   FiArchive,
// } from "react-icons/fi";
// import { listSubCategories } from "../../../actions/admin/subCatActions.js";
// import Breadcrumb from "../../../components/common/Breadcrumb.js";

// export default function SubCatTable() {
//   const dispatch = useDispatch();
//   const { subCategories = [], loading, error } = useSelector(
//     (state) => state.subCategory
//   );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);

//   useEffect(() => {
//     dispatch(listSubCategories());
//   }, [dispatch]);

//   const showAlertMessage = (message, type = "success") => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };

//   const filteredSubCategories = subCategories.filter((s) => {
//     const matchesSearch =
//       s.Sub_CatName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       s.Sub_CatID?.toLowerCase().includes(searchTerm.toLowerCase());

//     if (activeFilter === "all") return matchesSearch;
//     if (activeFilter === "active") return matchesSearch && s.Sub_CatStatus === "A";
//     if (activeFilter === "inactive") return matchesSearch && s.Sub_CatStatus !== "A";
//     return matchesSearch;
//   });

//   const getStatusBadge = (status) =>
//     status === "A" ? (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
//         <FiCheckCircle className="w-3 h-3" />
//         Active
//       </span>
//     ) : (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400">
//         <FiX className="w-3 h-3" />
//         Inactive
//       </span>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <Breadcrumb current="Category Management" />

//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-2">
//             <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
//               <FiPackage className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//                 Category Management
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
//                 Manage categories and subcategories
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => showAlertMessage("Add Category modal coming soon!", "info")}
//             className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm md:text-base"
//           >
//             <FiPlus className="w-4 h-4" /> Add Category
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">Total Categories</p>
//                 <p className="text-2xl font-bold text-gray-800 dark:text-white">
//                   {subCategories.length}
//                 </p>
//               </div>
//               <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
//                 <FiPackage className="w-6 h-6 text-gray-600 dark:text-gray-400" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">Active Subcategories</p>
//                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {subCategories.filter((s) => s.Sub_CatStatus === "A").length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                 <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search & Filters */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="relative flex-1">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search categories by name or code..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
//             />
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {["all", "active", "inactive"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f)}
//                 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                   activeFilter === f
//                     ? "bg-green-600 text-white"
//                     : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {f.charAt(0).toUpperCase() + f.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//           {loading ? (
//             <div className="flex items-center justify-center py-16">
//               <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
//             </div>
//           ) : error ? (
//             <div className="p-6 text-center text-red-600 dark:text-red-400">{error}</div>
//           ) : filteredSubCategories.length === 0 ? (
//             <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//               No sub categories found.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <div className="max-h-[500px] overflow-y-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Sub Cat ID
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Sub Main Cat ID
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Sub Cat Name
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Description
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {filteredSubCategories.map((subCategory) => (
//                       <tr
//                         key={subCategory.Sub_CatID}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
//                           {subCategory.Sub_CatID}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {subCategory.Sub_MainCatID}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {subCategory.Sub_CatName}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {subCategory.Sub_CatDes}
//                         </td>
//                         <td className="px-6 py-4">{getStatusBadge(subCategory.Sub_CatStatus)}</td>
//                         <td className="px-6 py-4 flex gap-2">
//                           <button
//                             onClick={() =>
//                               showAlertMessage("Update modal coming soon!", "info")
//                             }
//                             className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/50"
//                           >
//                             <FiEdit3 className="w-3 h-3 inline mr-1" /> Edit
//                           </button>
//                           <button
//                             onClick={() =>
//                               showAlertMessage("Archive functionality coming soon!", "info")
//                             }
//                             className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/50"
//                           >
//                             <FiArchive className="w-3 h-3 inline mr-1" /> Archive
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
