import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../../../actions/admin/mainCategoryActions";
import { listSubCategories } from "../../../actions/admin/subCategoryActions";
import CategoryEditModal from "../modal/CategoryEditModal";
import SubCategoryEditModal from "../modal/SubCategoryEditModal";

export default function CategoryPage() {
  const dispatch = useDispatch();

  // Main categories state
  const { categories = [], loading: catLoading, error: catError } = useSelector(
    (state) => state.categoryList
  );

  // Subcategories state
  const {
    subCategories = [],
    loading: subLoading,
    error: subError,
  } = useSelector((state) => state.subCategoryList);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch data
  useEffect(() => {
    dispatch(listCategories());
    dispatch(listSubCategories());
  }, [dispatch]);

  // Filter subcategories by selected category
  const filteredSubCategories = selectedCategoryId
    ? subCategories.filter(
      (cat) => String(cat.Sub_MainCatID) === String(selectedCategoryId)
    )
    : [];

  // Debug filtered list
  useEffect(() => {
    if (selectedCategoryId) {

    }
  }, [selectedCategoryId, filteredSubCategories]);


  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(catId);
  };

  const handleCatEdit = (cat) => {
    setSelectedItem(cat);
    setIsCatModalOpen(true);
  };

  const handleSubCatEdit = (subCat) => {
    setSelectedItem(subCat);
    setIsSubCatModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Main Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Category List</h2>
          <button
            onClick={() => handleCatEdit(null)}
            className="px-3 py-1.5 rounded-md bg-[#22C55E] text-white text-sm font-medium hover:bg-[#15803D] transition"
          >
            + Add New
          </button>
        </div>

        {catLoading ? (
          <p>Loading...</p>
        ) : catError ? (
          <p className="text-red-500">{catError}</p>
        ) : Array.isArray(categories) && categories.length > 0 ? (
          <table className="table-auto border-collapse w-full text-sm rounded-lg">
            <thead className="bg-[#1F2937] text-white">
              <tr>
                <th className="border border-[#374151] px-4 py-2">MainCat ID</th>
                <th className="border border-[#374151] px-4 py-2">Name</th>
                <th className="border border-[#374151] px-4 py-2">Description</th>
                <th className="border border-[#374151] px-4 py-2">Status</th>
                <th className="border border-[#374151] px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.Main_CatID}
                  className={`cursor-pointer hover:bg-gray-100 transition ${selectedCategoryId === cat.Main_CatID ? "bg-[#E0F2FE]" : ""
                    }`}
                  onClick={() => handleCategoryClick(cat.Main_CatID)}
                >
                  <td className="border px-4 py-2">{cat.Main_CatID}</td>
                  <td className="border px-4 py-2">{cat.Main_CatName}</td>
                  <td className="border px-4 py-2">{cat.Main_CatDes}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${cat.Main_CatStatus === "A"
                          ? "bg-[#DCFCE7] text-[#15803D]"
                          : "bg-[#FEE2E2] text-[#B91C1C]"
                        }`}
                    >
                      {cat.Main_CatStatus === "A" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCatEdit(cat);
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
        ) : (
          <p>No categories found</p>
        )}
      </div>

      {/* Sub Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2">
          Sub Category List{" "}
          {selectedCategoryId && `(MainCat: ${selectedCategoryId})`}
        </h2>

        {!selectedCategoryId ? (
          <p className="text-gray-500 text-center">
            Select a main category to see its subcategories
          </p>
        ) : subLoading ? (
          <p>Loading...</p>
        ) : subError ? (
          <p className="text-red-500">{subError}</p>
        ) : filteredSubCategories.length === 0 ? (
          <p className="text-gray-500 italic p-3">No subcategories found.</p>
        ) : (
          <div className="overflow-auto rounded-lg shadow-md">
            <button
              onClick={() => handleSubCatEdit(null)}
              className="mb-2 px-3 py-1.5 rounded-md bg-[#22C55E] text-white text-sm font-medium hover:bg-[#15803D] transition"
            >
              + Add New
            </button>
            <table className="table-auto border-collapse w-full text-sm rounded-lg">
              <thead className="bg-[#1F2937] text-white">
                <tr>
                  <th className="border px-4 py-2">SubCat ID</th>
                  <th className="border px-4 py-2">MainCat ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Created By</th>
                  <th className="border px-4 py-2">Updated Date</th>
                  <th className="border px-4 py-2">Updated By</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubCategories.map((sub) => (
                  <tr
                    key={sub.Sub_CatID}
                    className="bg-[#F3F4F6] hover:bg-[#DCFCE7] transition cursor-pointer"
                  >
                    <td className="border px-4 py-2">{sub.Sub_CatID}</td>
                    <td className="border px-4 py-2 text-[#3B82F6]">
                      {sub.Sub_MainCatID}
                    </td>
                    <td className="border px-4 py-2">{sub.Sub_CatName}</td>
                    <td className="border px-4 py-2">{sub.Sub_CatDes}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${sub.Sub_CatStatus === "A"
                            ? "bg-[#DCFCE7] text-[#15803D]"
                            : "bg-[#FEE2E2] text-[#B91C1C]"
                          }`}
                      >
                        {sub.Sub_CatStatus === "A" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="border px-4 py-2">{sub.createdBy}</td>
                    <td className="border px-4 py-2">{sub.updatedDate}</td>
                    <td className="border px-4 py-2">{sub.updatedBy}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleSubCatEdit(sub)}
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
      </div>

      {/* Modals */}
      <CategoryEditModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        category={selectedItem}
        onSave={() => setIsCatModalOpen(false)}
      />
      <SubCategoryEditModal
        isOpen={isSubCatModalOpen}
        onClose={() => setIsSubCatModalOpen(false)}
        category={selectedItem}
        onSave={() => setIsSubCatModalOpen(false)}
      />
    </div>
  );
}
