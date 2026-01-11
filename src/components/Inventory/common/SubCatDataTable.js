import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubCategoryEditModal from "../modal/SubCategoryEditModal";
import { listSubCategories } from "../../../actions/admin/subCategoryActions";

export default function SubCatDataTable({ selectedCategoryId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const dispatch = useDispatch();
  const { subCategories = [], loading, error } = useSelector(
    (state) => state.subCategoryList
  );

  useEffect(() => {
    dispatch(listSubCategories());
  }, [dispatch]);

  const handleEdit = (subCategory) => {
    setSelectedCategory(subCategory);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    dispatch(listSubCategories()); // refresh list after save
  };

  // Filter subcategories by selected main category (string comparison)
  const filteredSubCategories = selectedCategoryId
    ? subCategories.filter(
      (cat) => String(cat.Sub_MainCatID) === String(selectedCategoryId)
    )
    : subCategories;

  if (loading) return <p className="p-3">Loading subcategories...</p>;
  if (error) return <p className="p-3 text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
        Sub Category List {selectedCategoryId && `(MainCat: ${selectedCategoryId})`}
      </h2>

      {filteredSubCategories.length === 0 ? (
        <p className="text-gray-500 italic p-3">No subcategories found.</p>
      ) : (
        <div className="overflow-auto rounded-lg shadow-md">
          <button
            onClick={() => handleEdit(null)}
            className="px-3 py-1.5 rounded-md bg-[#22C55E] text-white text-sm font-medium hover:bg-[#15803D] transition"
          >
            + Add New
          </button>
          <table className="table-auto border-collapse w-full text-sm rounded-lg">
            <thead className="bg-[#1F2937] text-white">
              <tr>
                <th className="border border-[#374151] px-4 py-2">SubCat ID</th>
                <th className="border border-[#374151] px-4 py-2">MainCat ID</th>
                <th className="border border-[#374151] px-4 py-2">Name</th>
                <th className="border border-[#374151] px-4 py-2">Description</th>
                <th className="border border-[#374151] px-4 py-2">Status</th>
                <th className="border border-[#374151] px-4 py-2">Created By</th>
                <th className="border border-[#374151] px-4 py-2">Updated Date</th>
                <th className="border border-[#374151] px-4 py-2">Updated By</th>
                <th className="border border-[#374151] px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubCategories.map((cat, index) => (
                <tr
                  key={`${cat.Sub_CatID}-${index}`}
                  className="bg-[#F3F4F6] hover:bg-[#DCFCE7] transition cursor-pointer"
                >
                  <td className="border border-[#D1D5DB] px-4 py-2">{cat.Sub_CatID}</td>
                  <td className="border border-[#D1D5DB] px-4 py-2 text-[#3B82F6]">{cat.Sub_MainCatID}</td>
                  <td className="border border-[#D1D5DB] px-4 py-2">{cat.Sub_CatName}</td>
                  <td className="border border-[#D1D5DB] px-4 py-2">{cat.Sub_CatDes}</td>
                  <td className="border border-[#D1D5DB] px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${cat.Sub_CatStatus === "A"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : "bg-[#FEE2E2] text-[#B91C1C]"
                        }`}
                    >
                      {cat.Sub_CatStatus === "A" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border border-[#D1D5DB] px-4 py-2">{cat.createdBy}</td>
                  <td className="border border-[#D1D5DB] px-4 py-2">{cat.updatedDate}</td>
                  <td className="border border-[#D1D5DB] px-4 py-2">{cat.updatedBy}</td>
                  <td className="border border-[#D1D5DB] px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row click
                        handleEdit(cat);
                      }}
                      className="px-2.5 py-1 rounded-md bg-[#F97316] text-white text-xs font-medium hover:bg-[#EA580C] transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SubCategoryEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSave={handleSave}
      />
    </div>
  );
}
