// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FiPlus,
//   FiSearch,
//   FiPackage,
//   FiCheckCircle,
//   FiX,
//   FiEdit3,
//   FiArchive,
// } from "react-icons/fi";
// import { listMainCategories } from "../../../actions/admin/mainCatActions.js";
// import { listSubCategories } from "../../../actions/admin/subCatActions.js";
// import Breadcrumb from "../../../components/common/Breadcrumb.js";

// export default function CategoryManagement() {
//   const dispatch = useDispatch();

//   // === Main Categories ===
//   const { mainCategories = [], loading: mainLoading, error: mainError } = useSelector(
//     (state) => state.mainCategory
//   );
//   const [mainSearchTerm, setMainSearchTerm] = useState("");
//   const [mainFilter, setMainFilter] = useState("all");

//   // === Sub Categories ===
//   const { subCategories = [], loading: subLoading, error: subError } = useSelector(
//     (state) => state.subCategory
//   );
//   const [subSearchTerm, setSubSearchTerm] = useState("");
//   const [subFilter, setSubFilter] = useState("all");

//   // === Selected Main Category ===
//   const [selectedMainCat, setSelectedMainCat] = useState(null);

//   useEffect(() => {
//     dispatch(listMainCategories());
//     dispatch(listSubCategories());
//   }, [dispatch]);

//   // === Status Badge ===
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

//   // === Filtered Main Categories ===
//   const filteredMainCategories = mainCategories.filter((c) => {
//     const matchesSearch =
//       c.Main_CatName.toLowerCase().includes(mainSearchTerm.toLowerCase()) ||
//       c.Main_CatID.toLowerCase().includes(mainSearchTerm.toLowerCase());

//     if (mainFilter === "all") return matchesSearch;
//     if (mainFilter === "active") return matchesSearch && c.Main_CatStatus === "A";
//     if (mainFilter === "inactive") return matchesSearch && c.Main_CatStatus !== "A";
//     return matchesSearch;
//   });

//   // === Filtered Sub Categories ===
//   const filteredSubCategories = subCategories
//     .filter((s) => !selectedMainCat || s.Sub_MainCatID === selectedMainCat.Main_CatID)
//     .filter((s) => {
//       const matchesSearch =
//         s.Sub_CatName?.toLowerCase().includes(subSearchTerm.toLowerCase()) ||
//         s.Sub_CatID?.toLowerCase().includes(subSearchTerm.toLowerCase());

//       if (subFilter === "all") return matchesSearch;
//       if (subFilter === "active") return matchesSearch && s.Sub_CatStatus === "A";
//       if (subFilter === "inactive") return matchesSearch && s.Sub_CatStatus !== "A";
//       return matchesSearch;
//     });

//   return (
//     <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-[90vh] overflow-y-auto">
//       <div className="max-w-7xl mx-auto">
//         <Breadcrumb current="Category Management" />

//         {/* ==================== Main Categories ==================== */}
//         <div className="mb-8">
//           <h2 className="text-xl font-bold mb-4">Main Categories</h2>

//           {/* Search */}
//           <div className="flex flex-col md:flex-row gap-4 mb-4">
//             <div className="relative flex-1">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search main categories..."
//                 value={mainSearchTerm}
//                 onChange={(e) => setMainSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
//               />
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {["all", "active", "inactive"].map((f) => (
//                 <button
//                   key={f}
//                   onClick={() => setMainFilter(f)}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium ${
//                     mainFilter === f
//                       ? "bg-green-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   {f.charAt(0).toUpperCase() + f.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Table */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//             {mainLoading ? (
//               <div className="flex items-center justify-center py-16 text-gray-600 dark:text-gray-400">
//                 Loading main categories...
//               </div>
//             ) : mainError ? (
//               <div className="p-6 text-center text-red-600 dark:text-red-400">{mainError}</div>
//             ) : filteredMainCategories.length === 0 ? (
//               <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//                 No main categories found.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Main Cat ID
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Name
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {filteredMainCategories.map((mainCategory) => (
//                       <tr
//                         key={mainCategory.Main_CatID}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer"
//                         onClick={() => setSelectedMainCat(mainCategory)}
//                       >
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
//                           {mainCategory.Main_CatID}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {mainCategory.Main_CatName}
//                         </td>
//                         <td className="px-6 py-4">{getStatusBadge(mainCategory.Main_CatStatus)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ==================== Sub Categories ==================== */}
//         {selectedMainCat && (
//           <div className="mt-12">
//             <h2 className="text-xl font-bold mb-4">
//               Sub Categories of {selectedMainCat.Main_CatName}
//             </h2>

//             {/* Search */}
//             <div className="flex flex-col md:flex-row gap-4 mb-4">
//               <div className="relative flex-1">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search sub categories..."
//                   value={subSearchTerm}
//                   onChange={(e) => setSubSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
//                 />
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {["all", "active", "inactive"].map((f) => (
//                   <button
//                     key={f}
//                     onClick={() => setSubFilter(f)}
//                     className={`px-4 py-2 rounded-xl text-sm font-medium ${
//                       subFilter === f
//                         ? "bg-green-600 text-white"
//                         : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                     }`}
//                   >
//                     {f.charAt(0).toUpperCase() + f.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
//               {subLoading ? (
//                 <div className="flex items-center justify-center py-16 text-gray-600 dark:text-gray-400">
//                   Loading sub categories...
//                 </div>
//               ) : subError ? (
//                 <div className="p-6 text-center text-red-600 dark:text-red-400">{subError}</div>
//               ) : filteredSubCategories.length === 0 ? (
//                 <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//                   No sub categories found.
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                           Sub Cat ID
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                           Sub Main Cat ID
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                           Sub Cat Name
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                           Description
//                         </th>
//                         <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                           Status
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {filteredSubCategories.map((subCategory) => (
//                         <tr
//                           key={subCategory.Sub_CatID}
//                           className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                         >
//                           <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
//                             {subCategory.Sub_CatID}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                             {subCategory.Sub_MainCatID}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                             {subCategory.Sub_CatName}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                             {subCategory.Sub_CatDes}
//                           </td>
//                           <td className="px-6 py-4">{getStatusBadge(subCategory.Sub_CatStatus)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
