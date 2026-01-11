 
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../../actions/modalActions";

export default function UpdateWarehouseModal({ warehouse }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    pwd_wh_code: "",
    pwd_wh_name: "",
    pwd_status: "A",
    pwd_start_date: "",
    pwd_end_date: "",
    pwd_created_date: "",
    pwd_created_by: "",
    pwd_updated_date: "",
    pwd_updated_by: "",
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        ...warehouse,
        pwd_start_date: warehouse.pwd_start_date
          ? warehouse.pwd_start_date.split("T")[0]
          : "",
        pwd_end_date: warehouse.pwd_end_date
          ? warehouse.pwd_end_date.split("T")[0]
          : "",
        pwd_created_date: warehouse.pwd_created_date
          ? warehouse.pwd_created_date.split("T")[0]
          : "",
        pwd_updated_date: warehouse.pwd_updated_date
          ? warehouse.pwd_updated_date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [warehouse]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedWarehouse = {
      ...formData,
      pwd_updated_date: new Date().toISOString().split("T")[0],
      pwd_updated_by: 1, // TODO: replace with logged in user
    };

    // TODO: API call here
    dispatch(closeModal());
  };

  if (!warehouse) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-[#F97316]">
          Update Warehouse
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Warehouse Code (read only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse Code
            </label>
            <input
              name="pwd_wh_code"
              value={formData.pwd_wh_code}
              readOnly
              className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Warehouse Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warehouse Name *
            </label>
            <input
              name="pwd_wh_name"
              value={formData.pwd_wh_name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="pwd_status"
              value={formData.pwd_status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              name="pwd_start_date"
              type="date"
              value={formData.pwd_start_date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* End Date */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              name="pwd_end_date"
              type="date"
              value={formData.pwd_end_date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <small className="text-gray-500">
              Leave empty if still active
            </small>
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
              Update Warehouse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
