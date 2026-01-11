// import React, { useState } from "react";
// import { FiX, FiCalendar, FiChevronDown, FiChevronUp } from "react-icons/fi";

// export default function FilterByMonth({ isOpen, onClose, onApply }) {
//   const [mode, setMode] = useState("single"); // "single" or "range"
//   const [singleMonth, setSingleMonth] = useState({ start: "", end: "" });
//   const [range, setRange] = useState({ start: "", end: "" });
//   const [showOptions, setShowOptions] = useState(false);

//   const getMonthRange = (yearMonth) => {
//     if (!yearMonth) return { start: "", end: "" };

//     const [year, month] = yearMonth.split("-").map(Number);

//     // First day
//     const start = `${yearMonth}-01`;

//     // Last day
//     const lastDay = new Date(year, month, 0).getDate();
//     const end = `${yearMonth}-${String(lastDay).padStart(2, "0")}`;

//     return { start, end };
//   };

//   if (!isOpen) return null;

//   const handleApply = () => {
//     if (mode === "single") {
//       onApply({ mode, value: singleMonth });
//     } else {
//       onApply({ mode, value: range });
//     }
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0  bg-black/85  flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
//         >
//           <FiX size={22} />
//         </button>

//         <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
//           <FiCalendar /> Filter by Month
//         </h2>

//         {/* Toggle Mode */}
//         <div className="mb-4">
//           <button
//             onClick={() => setShowOptions(!showOptions)}
//             className="w-full flex justify-between items-center border rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100"
//           >
//             {mode === "single" ? "Single Month" : "Month Range"}
//             {showOptions ? <FiChevronUp /> : <FiChevronDown />}
//           </button>
//           {showOptions && (
//             <div className="mt-2 border rounded-lg bg-white shadow-sm">
//               <button
//                 className="w-full text-left px-3 py-2 hover:bg-gray-100"
//                 onClick={() => {
//                   setMode("single");
//                   setShowOptions(false);
//                 }}
//               >
//                 Single Month
//               </button>
//               <button
//                 className="w-full text-left px-3 py-2 hover:bg-gray-100"
//                 onClick={() => {
//                   setMode("range");
//                   setShowOptions(false);
//                 }}
//               >
//                 Month Range
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Inputs */}
//         {mode === "single" ? (
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Pick a Month
//             </label>
//             <input
//               type="month"
//               value={singleMonth.start.slice(0, 7)}
//               onChange={(e) => {
//                 const range = getMonthRange(e.target.value);
//                 setSingleMonth(range);
//               }}
//               className="w-full border rounded-lg px-3 py-2"
//             />
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Start Month
//               </label>
//               <input
//                 type="month"
//                 value={range.start}
//                 onChange={(e) =>
//                   setRange({ ...range, start: e.target.value + "-01" })
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 End Month
//               </label>
//               <input
//                 type="month"
//                 value={range.end}
//                 onChange={(e) =>
//                   setRange({ ...range, end: e.target.value + "-01" })
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleApply}
//             className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { FiX, FiCalendar, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function FilterByMonth({ isOpen, onClose, onApply, darkMode }) {
  const [mode, setMode] = useState("single");
  const [singleMonth, setSingleMonth] = useState({ start: "", end: "" });
  const [range, setRange] = useState({ start: "", end: "" });
  const [showOptions, setShowOptions] = useState(false);

  const getMonthRange = (yearMonth) => {
    if (!yearMonth) return { start: "", end: "" };

    const [year, month] = yearMonth.split("-").map(Number);

    const start = `${yearMonth}-01`;

    const lastDay = new Date(year, month, 0).getDate();
    const end = `${yearMonth}-${String(lastDay).padStart(2, "0")}`;

    return { start, end };
  };

  if (!isOpen) return null;

  const handleApply = () => {
    if (mode === "single") {
      onApply({ mode, value: singleMonth });
    } else {
      onApply({ mode, value: range });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/85 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
            <FiCalendar className="w-5 h-5" /> Filter by Month
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-4 gap-2">
          <button
            className={`flex-1 px-3 py-2 rounded-lg ${mode === "single"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 dark:text-white"
              }`}
            onClick={() => setMode("single")}
          >
            Single Month
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg ${mode === "range"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 dark:text-white"
              }`}
            onClick={() => setMode("range")}
          >
            Month Range
          </button>
        </div>

        {/* Input Fields */}
        {mode === "single" ? (
          <div>
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              Pick a Month
            </label>
            <input
              type="month"
              value={singleMonth.start.slice(0, 7)}
              onChange={(e) => {
                const range = getMonthRange(e.target.value);
                setSingleMonth(range);
              }}
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                Start Month
              </label>
              <input
                type="month"
                value={range.start.slice(0, 7)}
                onChange={(e) =>
                  setRange({ ...range, start: e.target.value + "-01" })
                }
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                End Month
              </label>
              <input
                type="month"
                value={range.end.slice(0, 7)}
                onChange={(e) =>
                  setRange({ ...range, end: e.target.value + "-01" })
                }
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}