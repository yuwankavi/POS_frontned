import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../../actions/modalActions";
import { useState, useEffect } from "react";

export function UpdateProductDetailModal() {
  const dispatch = useDispatch();
  const { activeModal, modalProps } = useSelector((state) => state.ui); // important

  const [form, setForm] = useState(modalProps || {});

  useEffect(() => {
    setForm(modalProps || {});
  }, [modalProps]);

  if (activeModal !== "UPDATE_PRODUCT_DETAIL") return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Update Product Detail</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="ppd_wh_code" value={form.ppd_wh_code || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Warehouse Code" />
          <input name="ppd_bin_location" value={form.ppd_bin_location || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Bin Location" />
          <input name="ppd_reorder_level" type="number" value={form.ppd_reorder_level || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Reorder Level" />
          <input name="ppd_min_stock" type="number" value={form.ppd_min_stock || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Min Stock" />
          <input name="ppd_type" value={form.ppd_type || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Type" />
          <input name="ppd_balance_qty" type="number" value={form.ppd_balance_qty || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Balance Qty" />
          <input name="ppd_balance_value" type="number" value={form.ppd_balance_value || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Balance Value" />
          <input name="ppd_selling_price" type="number" value={form.ppd_selling_price || ""} onChange={handleChange} className="border p-2 rounded" placeholder="Selling Price" />
          <select name="ppd_status" value={form.ppd_status || "A"} onChange={handleChange} className="border p-2 rounded col-span-2">
            <option value="A">Active</option>
            <option value="I">Inactive</option>
          </select>
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => dispatch(closeModal())} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-400">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
