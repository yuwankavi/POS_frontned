import React, { useState } from "react";

export default function SearchableSelect({
  name,
  value,
  items = [],
  placeholder,
  keyField,
  textField,
  onChange,
  darkMode,
}) {
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setFilter("");
    setOpen(false);
  };

  const filteredItems = items?.filter((item) =>
    (item[textField] || "")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)} // delay so click works
        onChange={(e) => {
          setFilter(e.target.value);
          onChange(e);
        }}
        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 text-sm ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-gray-50 border-gray-200 text-gray-900"
          }`}
      />

      {open && filteredItems?.length > 0 && (
        <div
          className={`absolute mt-1 w-full rounded-lg border shadow-lg z-50 max-h-40 overflow-y-auto ${darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-200 text-gray-900"
            }`}
        >
          {filteredItems.map((item) => (
            <div
              key={item[keyField]}
              onMouseDown={() => handleSelect(item[keyField])} // use onMouseDown so blur doesn’t cancel
              className="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white text-sm"
            >
              {item[keyField]} - {item[textField]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
