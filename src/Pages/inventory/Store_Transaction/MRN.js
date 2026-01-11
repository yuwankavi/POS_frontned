import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { listSalesReturns } from "../../../actions/Inventory/salesReturnActions.js";
import Breadcrumb from "../../../components/common/Breadcrumb.js";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function SalesReturnTable() {




  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [focusedField, setFocusedField] = useState(null);


  const dispatch = useDispatch();
  const { salesReturns, loading, error } = useSelector((state) => state.salesReturn);
  const { darkMode } = useSelector((state) => state.ui);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(listSalesReturns());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  const filteredReturns = salesReturns.filter((item) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      item.P_RETURNNO?.toLowerCase().includes(search) ||
      item.P_CUSNANE?.toLowerCase().includes(search) ||
      item.P_PRCODE?.toLowerCase().includes(search) ||
      item.P_PRDESVC?.toLowerCase().includes(search);

    let matchesDate = true;
    if (startDate) {
      matchesDate =
        matchesDate && new Date(item.P_RETURDATE) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate =
        matchesDate && new Date(item.P_RETURDATE) <= new Date(endDate);
    }

    return matchesSearch && matchesDate;
  });



  return (
    <div
      className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}
    >
      {/* <Breadcrumb current="Inventory / Sales Returns" /> */}

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        {/* <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
            <FiPackage className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Sales Return Management
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 md:mb-4">
              Track returned items from customers
            </p>
          </div>
        </div> */}

        {/* Search + Date Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by return no, customer, product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>

          {/* Start Date */}
          <div className="relative w-full md:w-40">
            <label
              className={`absolute left-2 transition-all duration-200 pointer-events-none px-1 z-10
        ${startDate || focusedField === "start"
                  ? "-top-2 text-xs bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  : "top-3 text-gray-400"
                }`}
            >
              Start Date
            </label>

            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(date) =>
                setStartDate(date ? date.toISOString().split("T")[0] : "")
              }
              onFocus={() => setFocusedField("start")}
              onBlur={() => setFocusedField(null)}
              dateFormat="yyyy-MM-dd"
              className={`w-full px-2 pr-8 py-2 text-sm rounded-lg border focus:outline-none
        ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />

            {startDate && (
              <button
                onClick={() => setStartDate("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                type="button"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* End Date */}
          <div className="relative w-full md:w-40">
            <label
              className={`absolute left-2 transition-all duration-200 pointer-events-none px-1 z-10
        ${endDate || focusedField === "end"
                  ? "-top-2 text-xs bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  : "top-3 text-gray-400"
                }`}
            >
              End Date
            </label>

            <DatePicker
              selected={endDate ? new Date(endDate) : null}
              onChange={(date) =>
                setEndDate(date ? date.toISOString().split("T")[0] : "")
              }
              onFocus={() => setFocusedField("end")}
              onBlur={() => setFocusedField(null)}
              dateFormat="yyyy-MM-dd"
              className={`w-full px-2 pr-8 py-2 text-sm rounded-lg border focus:outline-none
        ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />

            {endDate && (
              <button
                onClick={() => setEndDate("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                type="button"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
          <div
            className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center py-8 h-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-green-800" : "border-green-200"
                        }`}
                    ></div>
                    <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p
                    className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Loading sales returns...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div
                className={`rounded-xl p-4 text-center h-full flex items-center justify-center border ${darkMode
                    ? "bg-red-900/20 border-red-800"
                    : "bg-red-50 border-red-200"
                  }`}
              >
                <div>
                  <div
                    className={`font-medium text-sm ${darkMode ? "text-red-400" : "text-red-600"
                      }`}
                  >
                    ⚠️ Error
                  </div>
                  <p
                    className={`mt-1 text-xs ${darkMode ? "text-red-400" : "text-red-600"
                      }`}
                  >
                    {error}
                  </p>
                </div>
              </div>
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
                        <th className="px-2 py-2 text-left text-xs font-semibold">
                          Return No
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold">
                          Date
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold">
                          Warehouse
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold">
                          Customer
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold">
                          Product
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-semibold">
                          Batch
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-semibold">
                          SRM Quantity
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-semibold">
                          Unit Price
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-semibold">
                          Value
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold">
                          Cashier
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-semibold">
                          Returned On
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                        }`}
                    >
                      {filteredReturns.map((r) => (
                        <tr
                          key={r.P_RETURNNO}
                          className={`${darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          <td className="px-2 py-2 text-xs">{r.P_RETURNNO}</td>
                          <td className="px-2 py-2 text-xs text-ceneter">
                            {formatDate(r.P_RETURDATE)}
                          </td>
                          <td className="px-2 py-2 text-xs text-center">{r.P_WHCODE}</td>
                          <td className="px-2 py-2 text-xs">
                            {r.P_CUSNANE || "-"}
                          </td>
                          <td className="px-2 py-2 text-xs">
                            {r.P_PRCODE} - {r.P_PRDESVC}
                          </td>
                          <td className="px-2 py-2 text-xs text-center">{r.P_BATCHID}</td>
                          <td className="px-2 py-2 text-xs text-right">{r.P_RETURNQTY}</td>
                          <td className="px-2 py-2 text-xs text-right">{r.P_UNITPRICE}</td>
                          <td className="px-2 py-2 text-xs text-right">{r.P_RETUNVAL}</td>
                          <td className="px-2 py-2 text-xs">
                            {r.P_CARSHIERNAME}
                          </td>
                          <td className="px-2 py-2 text-xs">
                            {formatDate(r.P_RETUNEDON)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredReturns.length === 0 && (
                    <div className="text-center py-8 h-full flex items-center justify-center">
                      <div>
                        <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p
                          className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          No sales returns found
                        </p>
                        <p
                          className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                          Try adjusting your search
                        </p>
                      </div>
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