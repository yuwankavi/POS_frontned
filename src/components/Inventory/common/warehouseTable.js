import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiPlus,
  FiSearch,
  FiHome,
  FiChevronRight,
  FiEdit3,
  FiArchive,
  FiPackage,
  FiCheckCircle,
  FiX,
  FiBarChart2,
  FiMapPin,
  FiTruck,
} from "react-icons/fi";
import { listWarehouses } from "../../../actions/warehouseActions.js";
import { openModal } from "../../../actions/modalActions.js";
import Breadcrumb from "../../common/Breadcrumb";

export default function WarehouseTable() {
  const dispatch = useDispatch();
  const { warehouses, loading, error } = useSelector(
    (state) => state.warehouse
  );


  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    dispatch(listWarehouses());
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const filteredWarehouses = warehouses.filter((w) => {
    const matchesSearch =
      w.WH_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.WH_Code.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "active")
      return matchesSearch && w.WH_Status === "A";
    if (activeFilter === "inactive")
      return matchesSearch && w.WH_Status !== "A";

    return matchesSearch;
  });

  const getStatusBadge = (status) =>
    status === "A" ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <FiCheckCircle className="w-3 h-3" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
        <FiX className="w-3 h-3" />
        Inactive
      </span>
    );

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
        return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "error":
        return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case "info":
        return <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <FiPackage className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Alert Message - Top Center */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md">
          <div
            className={`flex items-center justify-between p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-4`}
          >
            <div className="flex items-center gap-3">
              {getAlertIcon()}
              <p className="font-medium">{alertMessage}</p>
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

      <div className="max-w-7xl mx-auto">
        <Breadcrumb current="Warehouse Management" />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <FiPackage className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Warehouse Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                    Manage warehouses and storage locations
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(openModal("ADD_WAREHOUSE"))}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm md:text-base"
              >
                <FiPlus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Warehouses</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{warehouses.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Active Warehouses</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {warehouses.filter((w) => w.WH_Status === "A").length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search warehouses by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  All Warehouses
                </button>
                <button
                  onClick={() => setActiveFilter("active")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === "active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter("inactive")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === "inactive"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-green-200 dark:border-green-800 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Loading warehouses...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <div className="text-red-600 dark:text-red-400 font-medium text-lg">⚠️ Error</div>
                <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                  <div className="max-h-[260px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                            Warehouse
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredWarehouses.map((warehouse) => (
                          <tr
                            key={warehouse.WH_Code}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                  {warehouse.WH_Name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {warehouse.WH_Name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Storage Facility
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                <FiBarChart2 className="w-3 h-3" />
                                {warehouse.WH_Code}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(warehouse.WH_Status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() =>
                                    dispatch(
                                      openModal("UPDATE_WAREHOUSE", { warehouse })
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/50"
                                >
                                  <FiEdit3 className="w-3 h-3 inline mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    showAlertMessage("Archive functionality coming soon!", "info")
                                  }
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/50"
                                >
                                  <FiArchive className="w-3 h-3 inline mr-1" />
                                  Archive
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredWarehouses.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No warehouses found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { openModal } from "../../../actions/modalActions.js";
// import { listWarehouses } from "../../../actions/warehouseActions.js";
// import { FiEdit3, FiArchive } from "react-icons/fi";

// export default function WarehouseTable() {
//   const dispatch = useDispatch();
//   const { warehouses, loading, error } = useSelector((state) => state.warehouse);

//   useEffect(() => {
//     dispatch(listWarehouses());
//   }, [dispatch]);

//   const getStatusBadge = (status) => {
//     return status === "A" ? (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
//         Active
//       </span>
//     ) : (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
//         Inactive
//       </span>
//     );
//   };

//   return (
//     <div className="p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//             Warehouse Management
//           </h2>
//           <button
//             onClick={() => dispatch(openModal("ADD_WAREHOUSE"))}
//             className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
//           >
//             + Add New
//           </button>
//         </div>

//         {/* Table Container */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
//           {loading ? (
//             <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
//               Loading warehouses...
//             </div>
//           ) : error ? (
//             <div className="p-6 text-center text-red-600 dark:text-red-400">
//               {error}
//             </div>
//           ) : warehouses.length === 0 ? (
//             <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//               No warehouses found.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <div className="max-h-[505px] overflow-y-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Code
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Name
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Start Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         End Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Created By
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Updated By
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {warehouses.map((w) => (
//                       <tr
//                         key={w.WH_Code}
//                         className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                       >
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
//                           {w.WH_Code}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
//                           {w.WH_Name}
//                         </td>
//                         <td className="px-6 py-4">{getStatusBadge(w.WH_Status)}</td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {w.WH_SDate
//                             ? new Date(w.WH_SDate).toISOString().split("T")[0]
//                             : "-"}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {w.WH_EDate
//                             ? new Date(w.WH_EDate).toISOString().split("T")[0]
//                             : "-"}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {w.pwd_created_by || "-"}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
//                           {w.pwd_updated_by || "-"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 dispatch(openModal("UPDATE_WAREHOUSE", { warehouse: w }));
//                               }}
//                               className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors"
//                               title="Update"
//                             >
//                               <FiEdit3 className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 alert("Archive feature coming soon!");
//                               }}
//                               className="p-2 bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors"
//                               title="Archive"
//                             >
//                               <FiArchive className="w-4 h-4" />
//                             </button>
//                           </div>
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


/////////////////////////////////////////////////////////////////////////////


// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { openModal } from "../../../actions/modalActions.js";
// import { listWarehouses } from "../../../actions/warehouseActions.js";

// export default function WarehouseTable() {
//   const dispatch = useDispatch();

//   const { warehouses, loading, error } = useSelector(
//     (state) => state.warehouse
//   );

//   useEffect(() => {
//     dispatch(listWarehouses());
//   }, [dispatch]);

//   return (
//     <div className="p-4">
//       <div className="mb-6">
//         <div className="overflow-auto rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-lg font-semibold">Warehouse Table</h2>
//             <button
//               onClick={() => dispatch(openModal("ADD_WAREHOUSE"))}
//               className="px-3 py-1.5 rounded-md bg-[#22C55E] text-white text-sm font-medium hover:bg-[#15803D] transition"
//             >
//               + Add New
//             </button>
//           </div>

//           {loading ? (
//             <p className="text-gray-500">Loading...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : (
//             <table className="table-auto border-collapse w-full text-sm rounded-lg">
//               <thead className="bg-[#1F2937] text-[#FFFFFF]">
//                 <tr>
//                   <th className="border border-[#374151] px-4 py-2">Warehouse Code</th>
//                   <th className="border border-[#374151] px-4 py-2">Warehouse Name</th>
//                   <th className="border border-[#374151] px-4 py-2">Status</th>
//                   <th className="border border-[#374151] px-4 py-2">Start Date</th>
//                   <th className="border border-[#374151] px-4 py-2">End Date</th>
//                   <th className="border border-[#374151] px-4 py-2">Created Date</th>
//                   <th className="border border-[#374151] px-4 py-2">Created By</th>
//                   <th className="border border-[#374151] px-4 py-2">Updated Date</th>
//                   <th className="border border-[#374151] px-4 py-2">Updated By</th>
//                   <th className="border border-[#374151] px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {warehouses.map((warehouse) => (
//                   <tr
//                     key={warehouse.WH_Code}
//                     className="bg-[#F3F4F6] hover:bg-[#DCFCE7] transition cursor-pointer"
//                   >
//                     <td className="border border-[#D1D5DB] px-4 py-2">{warehouse.WH_Code}</td>
//                     <td className="border border-[#D1D5DB] px-4 py-2 text-[#3B82F6]">{warehouse.WH_Name}</td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">
//                       <span
//                         className={`px-2 py-1 text-xs font-semibold rounded ${
//                           warehouse.WH_Status  === "A"
//                             ? "bg-[#DCFCE7] text-[#15803D]"
//                             : "bg-[#FEE2E2] text-[#B91C1C]"
//                         }`}
//                       >
//                         {warehouse.WH_Status  === "A" ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">
//                       {warehouse.WH_SDate
//                         ? new Date(warehouse.WH_SDate ).toISOString().split("T")[0]
//                         : "-"}
//                     </td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">
//                       {warehouse.WH_EDate
//                         ? new Date(warehouse.WH_EDate ).toISOString().split("T")[0]
//                         : "-"}
//                     </td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">
//                       {warehouse.pwd_created_date
//                         ? new Date(warehouse.pwd_created_date).toISOString().split("T")[0]
//                         : "-"}
//                     </td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">{warehouse.pwd_created_by || "-"}</td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">
//                       {warehouse.pwd_updated_date
//                         ? new Date(warehouse.pwd_updated_date).toISOString().split("T")[0]
//                         : "-"}
//                     </td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">{warehouse.pwd_updated_by || "-"}</td>
//                     <td className="border border-[#D1D5DB] px-4 py-2">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           dispatch(openModal("UPDATE_WAREHOUSE", { warehouse }));
//                         }}
//                         className="px-2.5 py-1 rounded-md bg-[#F97316] text-white text-xs font-medium hover:bg-[#EA580C] transition"
//                       >
//                         Update
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
