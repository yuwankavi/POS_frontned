import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiHome } from "react-icons/fi";
import { closeModal } from "../../../actions/modalActions";
import { addWarehouse } from "../../../actions/Inventory/warehouseActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddWarehouseModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);


  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  
  const getFirstDayOfMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };
const getLastDayOfMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
};
  const [formData, setFormData] = useState({
    pwd_wh_code: "",
    pwd_wh_name: "",
    pwd_status: "A",
    pwd_start_date: getFirstDayOfMonth(),  
    pwd_end_date: getLastDayOfMonth(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleStartDateChange = (date) => {
    setFormData({ ...formData, pwd_start_date: date });
  };

  const handleEndDateChange = (date) => {
    setFormData({ ...formData, pwd_end_date: date });
  };

  const modalProps = useSelector((state) => state.ui?.modalProps) || {};

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const newWarehouse = {
      ...formData,
      pwd_start_date: formData.pwd_start_date
        ? formatDate(formData.pwd_start_date)
        : "",
      pwd_end_date: formData.pwd_end_date
        ? formatDate(formData.pwd_end_date)
        : "",
    };

    dispatch(addWarehouse(newWarehouse))
      .then(() => {
        if (modalProps.onSuccess) {
          modalProps.onSuccess("Warehouse added successfully!", "success");
        }
 
        dispatch(closeModal());
      })
      .catch(() => {
        if (modalProps.onSuccess) {
          modalProps.onSuccess("Failed to add warehouse", "error");
        }
      });
  };

  
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className={`w-full px-3 py-2 rounded-lg border text-left ${
        darkMode
          ? "bg-gray-700 border-gray-600 text-white"
          : "bg-gray-50 border-gray-200 text-gray-900"
      }`}
    >
      {value || "Select date"}
    </button>
  ));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div
        className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                darkMode ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            >
              <FiHome className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add New Warehouse
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <FiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {/* Warehouse Code */}
          <div className="space-y-1">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Warehouse Code *
            </label>
            <input
              name="pwd_wh_code"
              placeholder="e.g., WH1, WH2"
              value={formData.pwd_wh_code}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              maxLength="3"
              required
            />
            <small
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Max 3 characters
            </small>
          </div>
          {/* Warehouse Name */}
          <div className="space-y-1">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Warehouse Name *
            </label>
            <input
              name="pwd_wh_name"
              placeholder="e.g., Main Warehouse"
              value={formData.pwd_wh_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
              maxLength="255"
              required
            />
          </div>
          {/* Start Date */}
          <div className="space-y-1">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Start Date *
            </label>
            <DatePicker
              selected={formData.pwd_start_date}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              customInput={<CustomInput />}
              readOnly
              required
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              End Date
            </label>
            <DatePicker
              selected={formData.pwd_end_date}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              minDate={formData.pwd_start_date}  
              customInput={<CustomInput />}
              readOnly
            />
          </div>
          
          {/* Information Note */}
          <div
            className={`md:col-span-2 rounded-lg p-3 border ${
              darkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-blue-300" : "text-blue-800"
              }`}
            >
              <strong>Note:</strong> Created Date, Created By, Updated Date, and
              Updated By will be automatically set when the warehouse is saved.
            </p>
          </div>
          {/* Action Buttons */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-600"
                  : "bg-white text-gray-700 border-gray-300"
              } border`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}












// // components/modals/AddWarehouseModal.js
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { FiX, FiHome } from "react-icons/fi";
// import { closeModal } from "../../../actions/modalActions";
// import { addWarehouse } from "../../../actions/Inventory/warehouseActions";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function AddWarehouseModal() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);

//   // Function to format date as yyyy-mm-dd
//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   // Get today's date in yyyy-mm-dd format
//   const today = new Date();

//   const [formData, setFormData] = useState({
//     pwd_wh_code: "",
//     pwd_wh_name: "",
//     pwd_status: "A",
//     pwd_start_date: today,
//     pwd_end_date: null,
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Add new handler functions for the date pickers
//   const handleStartDateChange = (date) => {
//     setFormData({ ...formData, pwd_start_date: date });
//   };

//   const handleEndDateChange = (date) => {
//     setFormData({ ...formData, pwd_end_date: date });
//   };
//   //sucess message on save
//   const modalProps = useSelector((state) => state.ui?.modalProps) || {};

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Format the data for API submission
//     const newWarehouse = {
//       ...formData,
//       pwd_start_date: formData.pwd_start_date
//         ? formatDate(formData.pwd_start_date)
//         : "",
//       pwd_end_date: formData.pwd_end_date
//         ? formatDate(formData.pwd_end_date)
//         : "",
//     };

//     dispatch(addWarehouse(newWarehouse))
//       .then(() => {
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("Warehouse added successfully!", "success");
//         }
//         console.log("Add Warehouse:", newWarehouse);
//         dispatch(closeModal());
//       })
//       .catch(() => {
//         if (modalProps.onSuccess) {
//           modalProps.onSuccess("Failed to add warehouse", "error");
//         }
//       });
//   };

//   // define inputs for start date picker
//   const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
//     <button
//       type="button"
//       onClick={onClick}
//       ref={ref}
//       className={`w-full px-3 py-2 rounded-lg border text-left ${
//         darkMode
//           ? "bg-gray-700 border-gray-600 text-white"
//           : "bg-gray-50 border-gray-200 text-gray-900"
//       }`}
//     >
//       {value || "Select date"}
//     </button>
//   ));

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
//       <div
//         className={`rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         }`}
//       >
//         {/* Modal Header */}
//         <div
//           className={`flex items-center justify-between p-4 border-b ${
//             darkMode ? "border-gray-700" : "border-gray-200"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <div
//               className={`p-2 rounded-lg ${
//                 darkMode ? "bg-blue-900/30" : "bg-blue-100"
//               }`}
//             >
//               <FiHome className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//               Add New Warehouse
//             </h2>
//           </div>
//           <button
//             onClick={() => dispatch(closeModal())}
//             className={`p-2 rounded-lg transition-colors duration-200 ${
//               darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <FiX className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
//         >
//           {/* Warehouse Code */}
//           <div className="space-y-1">
//             <label
//               className={`block text-sm font-medium ${
//                 darkMode ? "text-gray-300" : "text-gray-700"
//               }`}
//             >
//               Warehouse Code *
//             </label>
//             <input
//               name="pwd_wh_code"
//               placeholder="e.g., WH1, WH2"
//               value={formData.pwd_wh_code}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                 darkMode
//                   ? "bg-gray-700 border-gray-600 text-white"
//                   : "bg-gray-50 border-gray-200 text-gray-900"
//               }`}
//               maxLength="3"
//               required
//             />
//             <small
//               className={`text-xs ${
//                 darkMode ? "text-gray-400" : "text-gray-500"
//               }`}
//             >
//               Max 3 characters
//             </small>
//           </div>
//           {/* Warehouse Name */}
//           <div className="space-y-1">
//             <label
//               className={`block text-sm font-medium ${
//                 darkMode ? "text-gray-300" : "text-gray-700"
//               }`}
//             >
//               Warehouse Name *
//             </label>
//             <input
//               name="pwd_wh_name"
//               placeholder="e.g., Main Warehouse"
//               value={formData.pwd_wh_name}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
//                 darkMode
//                   ? "bg-gray-700 border-gray-600 text-white"
//                   : "bg-gray-50 border-gray-200 text-gray-900"
//               }`}
//               maxLength="255"
//               required
//             />
//           </div>
//           {/* Start Date */}
//           <div className="space-y-1">
//             <label
//               className={`block text-sm font-medium ${
//                 darkMode ? "text-gray-300" : "text-gray-700"
//               }`}
//             >
//               Start Date *
//               Start Date *
//             </label>
//             <DatePicker
//               selected={formData.pwd_start_date}
//               onChange={handleStartDateChange}
//               dateFormat="yyyy-MM-dd"
//               customInput={<CustomInput />} // 👈 disables typing, calendar works
//               customInput={<CustomInput />} // 👈 disables typing, calendar works
//               required
//             />
//           </div>

//           {/* End Date */}
//           <div className="space-y-1">
//             <label
//               className={`block text-sm font-medium ${
//                 darkMode ? "text-gray-300" : "text-gray-700"
//               }`}
//             >
//               End Date
//             </label>
//             <DatePicker
//               selected={formData.pwd_end_date}
//               onChange={handleEndDateChange}
//               dateFormat="yyyy-MM-dd"
//               minDate={formData.pwd_start_date} // Prevents earlier dates
//               customInput={<CustomInput />} // 👈 disables typing
//               minDate={formData.pwd_start_date} // Prevents earlier dates
//               customInput={<CustomInput />} // 👈 disables typing
//               required
//             />
//           </div>
          
//           {/* Information Note */}
//           <div
//             className={`md:col-span-2 rounded-lg p-3 border ${
//               darkMode
//                 ? "bg-blue-900/20 border-blue-800"
//                 : "bg-blue-50 border-blue-200"
//             }`}
//           >
//             <p
//               className={`text-sm ${
//                 darkMode ? "text-blue-300" : "text-blue-800"
//               }`}
//             >
//               <strong>Note:</strong> Created Date, Created By, Updated Date, and
//               Updated By will be automatically set when the warehouse is saved.
//             </p>
//           </div>
//           {/* Action Buttons */}
//           <div className="md:col-span-2 flex justify-end gap-2 pt-3">
//             <button
//               type="button"
//               onClick={() => dispatch(closeModal())}
//               className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                 darkMode
//                   ? "bg-gray-700 text-gray-200 border-gray-600"
//                   : "bg-white text-gray-700 border-gray-300"
//               } border`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
