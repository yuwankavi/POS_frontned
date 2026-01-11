import * as React from "react";
import MainCatDataTable from "../common/MainCatDataTable";
import SubCatDataTable from "../common/SubCatDataTable";

export default function MainCategory() {
  const [selectedMainCatId, setSelectedMainCatId] = React.useState(null);

  return (
    <div className="p-4 space-y-6">
      {/* Main Category List */}
      <MainCatDataTable onCategoryClick={setSelectedMainCatId} />

      {/* Sub Category List (only show if a category is selected) */}
      {selectedMainCatId && (
        <div>
          <h3 className="text-md font-semibold mb-2">
            Subcategories for Category ID: {selectedMainCatId}
          </h3>
          <SubCatDataTable selectedCategoryId={selectedMainCatId} />
        </div>
      )}
    </div>
  );
}
