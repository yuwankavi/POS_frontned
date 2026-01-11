import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPackage, FiSearch } from "react-icons/fi";
import {
  listGetMaxLine,
  listGetByLine,
  listGetTransaction,
} from "../../actions/Inventory/binCardAction.js";
import Breadcrumb from "../../components/common/Breadcrumb";

export default function BinCard() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  const { loading, error, maxLine, transactions, byLine } = useSelector(
    (state) => state.binCard || {}
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingByLine, setLoadingByLine] = useState(false);
  const [loadingMaxLine, setLoadingMaxLine] = useState(true);


  const [selectedBin, setSelectedBin] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);



  useEffect(() => {
    dispatch(listGetMaxLine()).finally(() => setLoadingMaxLine(false));
  }, [dispatch]);


  useEffect(() => {
    if (Array.isArray(maxLine) && maxLine.length > 0) {
      const firstBin = maxLine[0];
      setSelectedBin(firstBin);
      dispatch(listGetTransaction(firstBin.BIN_WHCode, firstBin.BIN_PrCode));
    }
  }, [dispatch, maxLine]);



  const filteredMaxLine = (Array.isArray(maxLine) ? maxLine : []).filter((bin) => {
    const term = searchTerm.toLowerCase();
    return (
      bin.BIN_WHCode?.toLowerCase().includes(term) ||
      bin.BIN_PrName?.toLowerCase().includes(term) ||
      bin.BIN_BatchId?.toLowerCase().includes(term)
    );
  });


  useEffect(() => {
    if (selectedBin) {
      setLoadingTransactions(true);
      dispatch(listGetTransaction(selectedBin.BIN_WHCode, selectedBin.BIN_PrCode))
        .finally(() => setLoadingTransactions(false));
      setSelectedTransaction(null);
    }
  }, [dispatch, selectedBin]);


  useEffect(() => {
    if (selectedTransaction) {
      setLoadingByLine(true);
      dispatch(
        listGetByLine(
          selectedTransaction.BIN_WHCode,
          selectedTransaction.BIN_PrCode,
          selectedTransaction.DOCNo,
          selectedTransaction.BIN_DOCType,
        )
      ).finally(() => setLoadingByLine(false));
    }
  }, [dispatch, selectedTransaction]);


  useEffect(() => {

  }, [byLine]);

  return (
    <div
      className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}

    >
      <Breadcrumb current="Inventory / Bin Card Management" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5 flex items-center gap-2">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
          <FiPackage className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Bin Card Management
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Manage warehouses and storage locations
          </p>
        </div>
      </div>

      {/* Search */}
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search BIN cards"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
          />
        </div>
      </div>

      {/* --- First Table (MaxLine) --- */}
      {Array.isArray(maxLine) && (
        <div
          className={`rounded-xl border overflow-hidden ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
        >
          <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
            <table className="w-full">
              <thead className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Product code</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Product Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Warehouse name</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold">Unit of Measure</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Balance Quantity</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Line No</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Batch No</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold">Reorder level</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Main Category</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Sub Category</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold">Warehouse code</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
              >
                {loadingMaxLine && loading ? (
                  <tr>
                    <td colSpan="11" className="px-3 py-4 text-left text-gray-500">
                      Loading bins...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="11" className="px-3 py-4 text-left text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredMaxLine.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-3 py-4 text-left text-gray-500">
                      No bins found
                    </td>
                  </tr>
                ) : (
                  filteredMaxLine.map((bin, i) => (
                    <tr
                      key={i}
                      className={`cursor-pointer transition-colors duration-150 ${selectedBin?.BIN_WHCode === bin.BIN_WHCode &&
                        selectedBin?.BIN_PrCode === bin.BIN_PrCode
                        ? darkMode
                          ? "bg-blue-900"
                          : "bg-blue-100"
                        : darkMode
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-gray-100"
                        }`}
                      onClick={() => setSelectedBin(bin)}
                    >
                      <td className="px-3 py-2 text-xs">{bin.BIN_PrCode}</td>
                      <td className="px-3 py-2 text-xs">{bin.BIN_PrName}</td>
                      <td className="px-3 py-2 text-xs">{bin.BIN_WHName || "-"}</td>
                      <td className="px-3 py-2 text-xs text-center">{bin.BIN_Unit || "-"}</td>
                      <td className="px-3 py-2 text-xs text-right">{bin.BALQUANTITY}</td>
                      <td className="px-3 py-2 text-xs text-right">{bin.BIN_Line}</td>
                      <td className="px-3 py-2 text-xs text-right">{bin.BIN_BatchId || "-"}</td>
                      <td className="px-3 py-2 text-xs text-center">{bin.RECLEVEL || "-"}</td>
                      <td className="px-3 py-2 text-xs">{bin.MainCategoryName || "-"}</td>
                      <td className="px-3 py-2 text-xs">{bin.SubCategoryName || "-"}</td>
                      <td className="px-3 py-2 text-xs">{bin.BIN_WHCode}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Second Table (Transactions) --- */}
      {(loadingTransactions || (Array.isArray(transactions) && transactions.length > 0)) && (
        <div
          className={`rounded-xl border overflow-hidden mt-4 ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
        >
          <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
            <table className="w-full">
              <thead className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Doc Type</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Doc No</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Batch No</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold">Invoice Date</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Quantity</th>
                  <th className="px-3 py-2 text-right  text-xs font-semibold">Balance Quantity</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Line No</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold">Ref Type</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Ref No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                  } text-xs`}
              >{loadingTransactions ? (
                <tr>
                  <td colSpan="10" className="px-3 py-4 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : (
                transactions.map((tx, i) => (
                  <tr
                    key={i}
                    className={`cursor-pointer ${selectedTransaction?.BIN_Line === tx.BIN_Line
                      ? darkMode
                        ? "bg-blue-900"
                        : "bg-blue-100"
                      : darkMode
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-100"
                      }`}
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <td className="px-3 py-2">{tx.BIN_DOCType}</td>
                    <td className="px-3 py-2">{tx.DOCNo}</td>
                    <td className="px-3 py-2 text-right">{tx.BIN_BatchId || "-"}</td>
                    <td className="px-3 py-2 text-center">{tx.BIN_DATE || "-"}</td>
                    <td className="px-3 py-2 text-right">{tx.BIN_Qty || "-"}</td>
                    <td className="px-3 py-2 text-right">{tx.BIN_BLQty || "-"}</td>
                    <td className="px-3 py-2 text-right">{tx.BIN_Line}</td>
                    <td className="px-3 py-2 text-center">{tx.BIN_REFDOCTYPE || "-"}</td>
                    <td className="px-3 py-2  text-right">{tx.BIN_REFDOCNO || "-"}</td>
                    <td className="px-3 py-2">{tx.BIN_REMARKS || "-"}</td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* --- Third Table (ByLine) --- */}
      {(loadingByLine || (Array.isArray(byLine) && byLine.length > 0)) && (
        <div
          className={`rounded-xl border overflow-hidden mt-4 ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
        >
          <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
            <table className="w-full">
              <thead className={`sticky top-0 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Warehouse Code</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold">Doc No</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold">Doc Type</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Product Code</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Line No</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Batch No</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold"> Quantity</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Value</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                  } text-xs`}
              >
                {loadingByLine ? (
                  <tr>
                    <td colSpan="9" className="px-3 py-4 text-center text-gray-500">
                      Loading details...
                    </td>
                  </tr>
                ) : (
                  byLine.map((bin, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{bin.BIN_WHCode || "-"}</td>
                      <td className="px-3 py-2 text-center">{bin.BIN_DOCNo || "-"}</td>
                      <td className="px-3 py-2 text-center">{bin.BIN_DOCType || "-"}</td>
                      <td className="px-3 py-2 text-right">{bin.BIN_PrCode || "-"}</td>
                      <td className="px-3 py-2 text-right">{bin.BIN_Line || "-"}</td>
                      <td className="px-3 py-2 text-right">{bin.BIN_BatchId || "-"}</td>
                      <td className="px-3 py-2 text-right">{bin.BIN_Qty || "-"}</td>
                      <td className="px-3 py-2 text-right">{bin.BIN_Val || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

