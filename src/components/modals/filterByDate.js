
import React, { useState } from "react";
import { FiX, FiCalendar } from "react-icons/fi";

export default function FilterByDate({ isOpen, onClose, onApply }) {
  const [mode, setMode] = useState("single");
  const [singleDate, setSingleDate] = useState("");
  const [range, setRange] = useState({ start: "", end: "" });

  if (!isOpen) return null;

  const handleApply = () => {
    if (mode === "single" && singleDate) {
      onApply({ mode: "single", value: singleDate });
    } else if (mode === "range" && range.start && range.end) {
      onApply({ mode: "range", value: range });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/85  z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiCalendar className="w-5 h-5" /> Filter by Date
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-4 gap-2">
          <button
            className={`flex-1 px-3 py-2 rounded-lg ${mode === "single"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700"
              }`}
            onClick={() => setMode("single")}
          >
            Single Date
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg ${mode === "range"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700"
              }`}
            onClick={() => setMode("range")}
          >
            Date Range
          </button>
        </div>

        {/* Input Fields */}
        {mode === "single" ? (
          <div>
            <label className="block mb-2 text-sm font-medium">Pick a Date</label>
            <input
              type="date"
              value={singleDate}
              onChange={(e) => setSingleDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={range.start}
                onChange={(e) => setRange({ ...range, start: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">End Date</label>
              <input
                type="date"
                value={range.end}
                onChange={(e) => setRange({ ...range, end: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}