// // src/components/common/UnitAddModal.js
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FiX, FiPackage, FiCheckCircle } from "react-icons/fi";
// import { addUnit } from "../../../actions/Inventory/unitActions";
// import { closeModal } from "../../../actions/modalActions";

// export default function UnitAddModal() {
//   const dispatch = useDispatch();

//   // Redux
//   const { darkMode } = useSelector((state) => state.ui);
//   const { loading } = useSelector((state) => state.unitActiveList || { loading: false });
//   const modalProps = useSelector((state) => state.ui?.modalProps) || {};

//   const onSuccess = modalProps?.onSuccess;

//   // Local state
//   const [formData, setFormData] = useState({
//     P_UNCODE: "",
//     P_UNDESC: "",
//     P_STATUS: "A",
//   });

//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);

//   const unitOptions = [
//   { value: "KG", label: "Kilogram (Kg)" },
//   { value: "G", label: "Gram (g)" },
//   { value: "L", label: "Litre (L)" },
//   { value: "ML", label: "Millilitre (ml)" },
//   { value: "PCS", label: "Pieces (pcs)" },
//   { value: "M", label: "Meter (m)" },
//   { value: "CM", label: "Centimeter (cm)" },
// ];


//   useEffect(() => {
//     setFormData({ P_UNCODE: "", P_UNDESC: "", P_STATUS: "A" });
//     setShowAlert(false);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     console.log(`Form Change: ${name} = ${value}`);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(addUnit(formData))
//       .then(() => {
//         if (onSuccess) onSuccess("Unit added successfully!", "success");
//         dispatch(closeModal());
//       })
//       .catch((error) => {
//         console.error("Failed to add unit:", error);
//         if (onSuccess) onSuccess("Failed to add unit", "error");
//       });
//   };

//   const showAlertMessage = (message, type = "success") => {
//     console.log(`Alert: ${message} (${type})`);
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };



//   const getAlertBgColor = () => {
//     switch (alertType) {
//       case "success":
//         return "bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700";
//       case "error":
//         return "bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700";
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
//       default:
//         return "text-gray-800 dark:text-gray-200";
//     }
//   };

//   const getAlertIcon = () => {
//     switch (alertType) {
//       case "success":
//         return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
//       case "error":
//         return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
//       <div className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        
//         {/* Alert */}
//         {showAlert && (
//           <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
//             <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}>
//               <div className="flex items-center gap-2 sm:gap-3">
//                 {getAlertIcon()}
//                 <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
//               </div>
//               <button onClick={() => setShowAlert(false)} className="hover:opacity-70 transition-opacity">
//                 <FiX className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
//           <div className="flex items-center gap-2">
//             <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
//               <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Unit</h2>
//           </div>
//           <button onClick={() => dispatch(closeModal())} className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
//             <FiX className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">

//           {/* Unit Code */}
//           <div className="space-y-1 md:col-span-2">
//             <label className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Unit Code</label>
//             <input
//               type="text"
//               name="P_UNCODE"
//               value={formData.P_UNCODE}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
//               }`}
//               required
//             />
//           </div>

//           {/* Unit Description */}
//           <div className="space-y-1 md:col-span-2">
//             <label className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Unit Description</label>
//             <textarea
//               name="P_UNDESC"
//               value={formData.P_UNDESC}
//               onChange={handleChange}
//               rows="3"
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
//                 darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
//               }`}
//               required
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="md:col-span-2 flex justify-end gap-2 pt-3">
//             <button
//               type="button"
//               onClick={() => dispatch(closeModal())}
//               className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
//                 darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-white text-gray-700 border-gray-300"
//               } border`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// src/components/common/UnitAddModal.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiPackage, FiCheckCircle } from "react-icons/fi";
import { addUnit } from "../../../actions/Inventory/unitActions";
import { closeModal } from "../../../actions/modalActions";

export default function UnitAddModal() {
  const dispatch = useDispatch();

  // Redux
  const { darkMode } = useSelector((state) => state.ui);
  const { loading } = useSelector((state) => state.unitActiveList || { loading: false });
  const modalProps = useSelector((state) => state.ui?.modalProps) || {};

  const onSuccess = modalProps?.onSuccess;

  // Local state
  const [formData, setFormData] = useState({
    P_UNCODE: "",
    P_UNDESC: "",
    P_STATUS: "A",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  const unitOptions = [
  { value: "KG", label: "Kilogram (Kg)" },
  { value: "G", label: "Gram (g)" },
  { value: "L", label: "Litre (L)" },
  { value: "ML", label: "Millilitre (ml)" },
  { value: "PCS", label: "Pieces (pcs)" },
  { value: "M", label: "Meter (m)" },
  { value: "CM", label: "Centimeter (cm)" },
];


  useEffect(() => {
    setFormData({ P_UNCODE: "", P_UNDESC: "", P_STATUS: "A" });
    setShowAlert(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUnit(formData))
      .then(() => {
        if (onSuccess) onSuccess("Unit added successfully!", "success");
        dispatch(closeModal());
      })
      .catch((error) => {

        if (onSuccess) onSuccess("Failed to add unit", "error");
      });
  };

  const showAlertMessage = (message, type = "success") => {

    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };



  const getAlertBgColor = () => {
    switch (alertType) {
      case "success":
        return "bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700";
      case "error":
        return "bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700";
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
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        
        {/* Alert */}
        {showAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
            <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {getAlertIcon()}
                <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
              </div>
              <button onClick={() => setShowAlert(false)} className="hover:opacity-70 transition-opacity">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
              <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Unit</h2>
          </div>
          <button onClick={() => dispatch(closeModal())} className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Unit Code */}
          <div className="space-y-1 md:col-span-2">
            <label className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Unit Code</label>
            <input
              type="text"
              name="P_UNCODE"
              value={formData.P_UNCODE}
              onChange={handleChange}
              maxLength={3}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              required
            />
          </div>

          {/* Unit Description */}
          <div className="space-y-1 md:col-span-2">
            <label className={`block text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Unit Description</label>
            <textarea
              name="P_UNDESC"
              value={formData.P_UNDESC}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-white text-gray-700 border-gray-300"
              } border`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}