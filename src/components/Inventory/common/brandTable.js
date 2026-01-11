// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import {
//   FiCheckCircle,
//   FiX,
//   FiTag,
//   FiSearch,
//   FiPlus,
//   FiUserX,
//   FiUserCheck,
// } from "react-icons/fi";
// import { openModal } from "../../../actions/modalActions.js";
// import {
//   listBrands,
//   getBrandbyStatus,
//   updateBrand,
// } from "../../../actions/Inventory/brandActions.js";
// import Breadcrumb from '../../common/Breadcrumb.js'

// export default function BrandTable() {
//   const dispatch = useDispatch();
//   const { brands = [], loading, error } = useSelector((state) => state.brand);
//   const { darkMode } = useSelector((state) => state.ui);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("active");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);

//   useEffect(() => {
//     dispatch(getBrandbyStatus("A")); // Load active brands by default
//   }, [dispatch]);

//   // show alert
//   const showAlertMessage = (message, type = "success") => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };

//   // Filtered and searched brands
//   const filteredBrands = (brands || []).filter((brand) => {
//     const matchesSearch =
//       brand.B_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       brand.B_Id?.toString().includes(searchTerm);

//     if (activeFilter === "all") return matchesSearch;
//     if (activeFilter === "active")
//       return matchesSearch && brand.B_Status === "A";
//     if (activeFilter === "inactive")
//       return matchesSearch && brand.B_Status !== "A";

//     return matchesSearch;
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
//             className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200 mx-2`}
//           >
//             <div className="flex items-center gap-2 sm:gap-3">
//               <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
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


//        <Breadcrumb current="Inventory / Product / Brand Catalogue " />

//       {/* Header */}
//       <div className="mt-2 mb-3 md:mb-5">
//         <div className="flex items-center justify-between mb-1 md:mb-2">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
//               <FiTag className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900 dark:text-white">
//                 Brand Catalogue
//               </h1>
//               <p className="text-xs text-gray-600 dark:text-gray-400">
//                 Manage product brands
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => dispatch(openModal("ADD_BRAND"))}
//             className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
//           >
//             <FiPlus className="w-4 h-4" />
//             Add Brand
//           </button>
//         </div>

//         {/* Search and Filters */}
//         <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="relative flex-1">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search brands by name or code..."
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
//             <button
//               onClick={() => {
//                 dispatch(getBrandbyStatus("A"));
//                 setActiveFilter("active");
//               }}
//               className={`px-2 py-1.5 text-xs rounded-lg font-medium ${
//                 activeFilter === "active"
//                   ? "bg-green-600 text-white"
//                   : darkMode
//                   ? "bg-gray-700 text-gray-300"
//                   : "bg-gray-100 text-gray-700"
//               }`}
//             >
//               Active
//             </button>
//             <button
//               onClick={() => {
//                 dispatch(getBrandbyStatus("I"));
//                 setActiveFilter("inactive");
//               }}
//               className={`px-2 py-1.5 text-xs rounded-lg font-medium ${
//                 activeFilter === "inactive"
//                   ? "bg-red-600 text-white"
//                   : darkMode
//                   ? "bg-gray-700 text-gray-300"
//                   : "bg-gray-100 text-gray-700"
//               }`}
//             >
//               Inactive
//             </button>
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
//           {loading ? (
//             <p className="text-center py-4">Loading...</p>
//           ) : error ? (
//             <p className="text-center text-red-500">{error}</p>
//           ) : (
//             <div
//               className={`rounded-xl border overflow-hidden h-full ${
//                 darkMode
//                   ? "bg-gray-700/30 border-gray-600"
//                   : "bg-gray-50 border-gray-200"
//               }`}
//             >
//               <div className="overflow-x-auto h-full">
//                 <table className="w-full">
//                   <thead
//                     className={`sticky top-0 ${
//                       darkMode ? "bg-gray-700" : "bg-gray-100"
//                     }`}
//                   >
//                     <tr>
//                       <th className="px-2 py-2 text-left text-xs">Code</th>
//                       <th className="px-2 py-2 text-left text-xs">Brand Name</th>
//                       <th className="px-2 py-2 text-center text-xs">Status</th>
//                       <th className="px-2 py-2 text-center text-xs">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredBrands.map((brand) => (
//                       <tr key={brand.B_Id}>
//                         <td className="px-2 py-2 text-xs">{brand.B_Id}</td>
//                         <td className="px-2 py-2 text-xs">{brand.B_Name}</td>
//                         <td className="px-2 py-2 text-center">
//                           {getStatusBadge(brand.B_Status)}
//                         </td>
//                         <td className="px-2 py-2 text-center">
//                           <button
//                             onClick={() => {
//                               const newStatus =
//                                 brand.B_Status === "A" ? "I" : "A";
//                               dispatch(updateBrand(brand.B_Id, newStatus, activeFilter));
//                               showAlertMessage(
//                                 `Brand ${newStatus === "A" ? "activated" : "deactivated"} successfully`
//                               );
//                             }}
//                             className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                               brand.B_Status === "A"
//                                 ? "bg-red-100 text-red-700 hover:bg-red-200"
//                                 : "bg-green-100 text-green-700 hover:bg-green-200"
//                             }`}
//                           >
//                             {brand.B_Status === "A" ? "Deactivate" : "Activate"}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {filteredBrands.length === 0 && (
//                   <p className="text-center py-4 text-sm">No brands found</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiX,
  FiTag,
  FiSearch,
  FiPlus,
  FiUserX,
  FiUserCheck,
} from "react-icons/fi";
import { openModal } from "../../../actions/modalActions.js";
import {
  listBrands,
  getBrandbyStatus,
  updateBrand,
} from "../../../actions/Inventory/brandActions.js";
import Breadcrumb from "../../common/Breadcrumb.js";

export default function BrandTable() {
  const dispatch = useDispatch();
  const { brands = [], loading, error } = useSelector((state) => state.brand);
  const { darkMode } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("active");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // NEW: state for confirmation modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [brandToUpdate, setBrandToUpdate] = useState(null);

  useEffect(() => {
    dispatch(getBrandbyStatus("A")); // Load active brands by default
  }, [dispatch]);

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Filtered and searched brands
  const filteredBrands = (brands || []).filter((brand) => {
    const matchesSearch =
      brand.B_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.B_Id?.toString().includes(searchTerm);

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "active")
      return matchesSearch && brand.B_Status === "A";
    if (activeFilter === "inactive")
      return matchesSearch && brand.B_Status !== "A";

    return matchesSearch;
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

  // handle modal actions
  const openStatusModal = (brand) => {
    setBrandToUpdate(brand);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setBrandToUpdate(null);
    setIsStatusModalOpen(false);
  };

  const handleStatusChange = () => {
    if (!brandToUpdate) return;

    const newStatus = brandToUpdate.B_Status === "A" ? "I" : "A";
    dispatch(updateBrand(brandToUpdate.B_Id, newStatus, activeFilter));
    showAlertMessage(
      `Brand ${newStatus === "A" ? "activated" : "deactivated"} successfully`
    );
    closeStatusModal();
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
            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200 mx-2`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
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

      <Breadcrumb current="Inventory / Product / Brand Catalogue " />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiTag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Brand Catalogue
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage product brands
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(openModal("ADD_BRAND"))}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Brand
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search brands by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                dispatch(getBrandbyStatus("A"));
                setActiveFilter("active");
              }}
              className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === "active"
                  ? "bg-green-600 text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                dispatch(getBrandbyStatus("I"));
                setActiveFilter("inactive");
              }}
              className={`px-2 py-1.5 text-xs rounded-lg font-medium ${activeFilter === "inactive"
                  ? "bg-red-600 text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div
          className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
            }`}
        >
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div
              className={`rounded-xl border overflow-hidden h-full ${darkMode
                  ? "bg-gray-700/30 border-gray-600"
                  : "bg-gray-50 border-gray-200"
                }`}
            >
              <div className="overflow-x-auto h-full">
                <table className="w-full">
                  <thead
                    className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                  >
                    <tr>
                      <th className="px-2 py-2 text-left text-xs">Code</th>
                      <th className="px-2 py-2 text-left text-xs">Brand Name</th>
                      <th className="px-2 py-2 text-center text-xs">Status</th>
                      <th className="px-2 py-2 text-center text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrands.map((brand) => (
                      <tr key={brand.B_Id}>
                        <td className="px-2 py-2 text-xs">{brand.B_Id}</td>
                        <td className="px-2 py-2 text-xs">{brand.B_Name}</td>
                        <td className="px-2 py-2 text-center">
                          {getStatusBadge(brand.B_Status)}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            onClick={() => openStatusModal(brand)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${brand.B_Status === "A"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                          >
                            {brand.B_Status === "A" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBrands.length === 0 && (
                  <p className="text-center py-4 text-sm">No brands found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {isStatusModalOpen && brandToUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="p-4">
              <div className="text-center">
                <div
                  className={`mx-auto flex items-center justify-center h-10 w-10 rounded-full ${brandToUpdate.B_Status === "A"
                      ? darkMode
                        ? "bg-red-900/30"
                        : "bg-red-100"
                      : darkMode
                        ? "bg-green-900/30"
                        : "bg-green-100"
                    }`}
                >
                  {brandToUpdate.B_Status === "A" ? (
                    <FiUserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FiUserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">
                  {brandToUpdate.B_Status === "A"
                    ? "Deactivate Brand"
                    : "Activate Brand"}
                </h3>
                <p className="mt-1 text-xs">
                  Are you sure you want to{" "}
                  {brandToUpdate.B_Status === "A" ? "deactivate" : "activate"}{" "}
                  brand <strong>{brandToUpdate.B_Name}</strong>?
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
                  className={`px-3 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200 text-sm ${brandToUpdate.B_Status === "A"
                      ? "bg-red-600"
                      : "bg-green-600"
                    }`}
                >
                  {brandToUpdate.B_Status === "A" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
