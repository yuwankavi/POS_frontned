// components/modals/UpdateWarehouseModal.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../../actions/modalActions";

export default function UpdateBrandModal({ brand }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    P_BNAME: "",
    P_STATUS: "A",
  });


  useEffect(() => {
    if (brand) {
      setFormData({
        ...brand,
        P_BNAME: brand.P_BNAME,
        P_STATUS: brand.P_STATUS,
      });
    }
  }, [brand]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedBrand = {
      ...formData,
      P_BNAME: formData.P_BNAME,
      P_STATUS: formData.P_STATUS,
    };

    // TODO: API call here
    dispatch(closeModal());
  };

  if (!brand) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-[#F97316]">
          Update Brand
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Brand Name (read only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand ID
            </label>
            <input
              name="P_BID"
              value={formData.P_BID}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="P_STATUS"
              value={formData.P_STATUS}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>





          {/* Created Fields (read only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created Date
            </label>
            <input
              name="pwd_created_date"
              type="date"
              value={formData.pwd_created_date}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created By
            </label>
            <input
              name="pwd_created_by"
              value={formData.pwd_created_by}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Updated Fields (auto managed) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Updated Date
            </label>
            <input
              name="pwd_updated_date"
              type="date"
              value={formData.pwd_updated_date}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Updated By
            </label>
            <input
              name="pwd_updated_by"
              value={formData.pwd_updated_by || "Current User"}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Info Note */}
          <div className="col-span-2 bg-orange-50 border border-orange-200 rounded p-3">
            <p className="text-sm text-orange-800">
              <strong>Note:</strong> Updated Date and Updated By will be set
              automatically when the warehouse is saved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#F97316] text-white font-semibold hover:bg-[#EA580C] transition"
            >
              Update Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
