// components/modals/DeleteProductModal.js
import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../actions/modalActions";

export default function DeleteProductModal({ productId }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
 
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-[#EF4444]">Delete Product</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this product{" "}
          <span className="font-semibold text-[#B91C1C]">#{productId}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => dispatch(closeModal())} className="px-4 py-2 rounded bg-gray-400 text-white">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 rounded bg-[#EF4444] text-white font-semibold hover:bg-[#B91C1C]">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
