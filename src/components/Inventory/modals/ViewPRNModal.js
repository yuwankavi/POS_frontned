// components/modals/ViewPRNModal.js
import React from "react";
import { useDispatch } from "react-redux";
import { FiX } from "react-icons/fi";
import { closeModal } from "../../../actions/modalActions";

export default function ViewPRNModal({ data }) {
  const dispatch = useDispatch();
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative">
        
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          <FiX className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#1F2937]">Purchase Return Details</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Warehouse Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <input value={data.PRN_WHCode} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Document No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document No</label>
            <input value={data.DOCNo} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Product Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
            <input value={data.PRN_PrCode} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input value={data.ProductName || "-"} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* GRN No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GRN No</label>
            <input value={data.GRN_No || "-"} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <input value={data.PRN_DOCPrintStatus || "PENDING"} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input value={formatDate(data.PRN_PDate)} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Batch ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
            <input value={data.PRN_BatchId} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input value={data.PRN_Qty} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input value={data.PRN_Val} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Avg Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avg Rate</label>
            <input value={data.AVERate} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Balance Qty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balance Qty</label>
            <input value={data.PRN_BLQty} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Invoice No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
            <input value={data.PRN_DOCINNo} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
            <input value={formatDate(data.PRN_DOCINDate)} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input value={data.PRN_DOCSupID} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <input value={data.PRN_DOCCusID} readOnly className="border p-2 rounded w-full bg-gray-100" />
          </div>
        </div>

        {/* Close Button Bottom */}
        <div className="col-span-2 flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
