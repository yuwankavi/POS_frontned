
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX, FiPackage, FiCheckCircle } from "react-icons/fi";
import { updateProduct } from "../../../../actions/Inventory/inventoryProductActions";
import { closeModal } from "../../../../actions/modalActions";
import { PRODUCT_UPDATE_RESET } from "../../../../constants/Inventory/InventoryProductConstant";
import { getProductCatById } from "../../../../actions/Inventory/inventoryProductActions";
import { PRODUCT_CAT_RESET } from "../../../../constants/Inventory/InventoryProductConstant";
import { listMainCategories } from "../../../../actions/Inventory/mainCatActions";
import { listSubCategories } from "../../../../actions/Inventory/subCatActions";
import { getBrandbyStatus } from "../../../../actions/Inventory/brandActions";
import { listUnitsActive } from "../../../../actions/Inventory/unitActions";

export default function UpdateProductModal() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);

  
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  const { activeModal, modalProps } = useSelector((state) => state.ui || {});
  const { product } = modalProps || {};
  const { loading, success, error } = useSelector(
    (state) => state.productUpdate || {}
  );
  const { cat, loading: catLoading } = useSelector(
    (state) => state.productCat || {}
  );

  const {
    mainCategories = [],
    loading: mainLoading,
    error: mainError,
  } = useSelector((state) => state.mainCategory);

  useEffect(() => {
    dispatch(listMainCategories());
  }, [dispatch]);

  
  const {
    subCategories = [],
    loading: subLoading,
    error: subError,
  } = useSelector((state) => state.subCategory);

  useEffect(() => {
    dispatch(listSubCategories());
  }, [dispatch]);

  

  
  const {
    brands = [],
    loading: brandLoading,
    error: brandError,
  } = useSelector((state) => state.brand);

  useEffect(() => {
    dispatch(getBrandbyStatus("A"));
  }, [dispatch]);

  
  const {
    units,
    loading: unitLoading,
    error: unitError,
  } = useSelector((state) => state.unitActiveList);

  useEffect(() => {
    dispatch(listUnitsActive());
  }, [dispatch]);

  const [selectedMainCat, setSelectedMainCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  
  useEffect(() => {
    if (product && subCategories.length && selectedMainCat) {
      const subCat = subCategories.find(
        (sc) =>
          sc.Sub_CatName === product.PC_SCNAME &&
          sc.Sub_MainCatID === selectedMainCat.Main_CatID
      );
      if (subCat) setSelectedSubCat(subCat);
    }
  }, [product, subCategories, selectedMainCat]);

  
  useEffect(() => {
    if (product && brands.length) {
      const brand = brands.find((b) => b.B_Name === product.PC_BRNAME);
      if (brand) setSelectedBrand(brand);
    }
  }, [product, brands]);

  useEffect(() => {
    if (product?.PC_Code) {
      dispatch(getProductCatById(product.PC_Code));
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (cat) {
      setForm((prev) => ({
        ...prev,
        PC_MCNAME: cat?.mainCategory || "",
        PC_SCNAME: cat?.subCategory || "",
        PC_BRNAME: cat?.brand || "",
      }));
    }
  }, [cat]);

  const [form, setForm] = useState({
    PC_SKU: "",
    PC_Code: "",
    PC_DEC: "",
    PC_BARCODE: "",
    PC_MCNAME: "",
    PC_SCNAME: "",
    PC_BRNAME: "",
    PC_UNIT: "",
    PC_MSPEC: "",
    file: null,
  });

  useEffect(() => {
    if (product) {
      setForm({
        PC_SKU: product.PC_SKU || "",
        PC_Code: product.PC_Code || "",
        PC_DEC: product.PC_DEC || "",
        PC_MCNAME: product.PC_MCNAME || "",
        PC_SCNAME: product.PC_SCNAME || "",
        PC_BRNAME: product.PC_BRNAME || "",
        PC_UNIT: product.PC_UNIT || "",
        PC_MSPEC: product.PC_MSPEC || "",
        PC_Status: product.PC_Status || "A",
        file: null,
      });
    }
  }, [product]);

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      
    }
  }, [success, dispatch]);

  if (activeModal !== "UPDATE_PRODUCT") return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setForm({ ...form, file: e.target.files[0] });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form?.PC_Code) {
      
      const payload = {
        P_PROCODE: form.PC_Code, 
        P_SKU: form.PC_SKU, 
        P_BARCODE: form.PC_BARCODE, 
        P_MCID: selectedMainCat?.Main_CatID, 
        P_SCID: selectedSubCat?.Sub_CatID, 
        P_BRID: selectedBrand?.B_Id, 
        P_DES: form.PC_DEC, 
        P_UNIT: form.PC_UNIT, 
        P_MSPEC: form.PC_MSPEC, 
      };
      dispatch(updateProduct(form.PC_Code, payload, form.file));

      showAlertMessage(`Product Updated Successfully!`, "success");
      setTimeout(() => {
        dispatch(closeModal());
      }, 1000);
    }

  };


  

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };


  
  const getAlertBgColor = () => {
    switch (alertType) {
      case "success":
        return "bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700";
      case "error":
        return "bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/70 dark:border-yellow-700";
      case "info":
        return "bg-blue-100 border-blue-300 dark:bg-blue-900/70 dark:border-blue-700";
      default:
        return "bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700";
    }
  };

  const getAlertTextColor = () => {
    switch (alertType) {
      case "success":
        return "text-green-800 dark:text-green-200";
      case "error":
        return "text-red-800 dark:text-red-200";
      case "warning":
        return "text-yellow-800 dark:text-yellow-200";
      case "info":
        return "text-blue-800 dark:text-blue-200";
      default:
        return "text-gray-800 dark:text-gray-200";
    }
  };

  const getAlertIcon = () => {
    switch (alertType) {
      case "success":
        return (
          <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case "error":
        return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return (
          <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      case "info":
        return <FiTruck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <FiTruck className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  
  const fieldClass = `w-full px-3 py-2 rounded-lg border text-sm ${darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
    }`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
      <div
        className={`rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        {showAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
            <div
              className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {getAlertIcon()}
                <p className="font-medium text-sm sm:text-base">
                  {alertMessage}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="hover:opacity-70 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"
                }`}
            >
              <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Update Product
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
          >
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
              Product Catalogue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* File Upload */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
              </div>
              {/* SKU */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  SKU
                </label>
                <input
                  name="PC_SKU"
                  value={form.PC_SKU}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  className={fieldClass}
                />
              </div>
              {/* Barcode */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Barcode
                </label>
                <input
                  name="PC_BARCODE"
                  value={form.PC_BARCODE}
                  onChange={handleChange}
                  placeholder="Enter Barcode"
                  className={fieldClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  name="PC_DEC"
                  value={form.PC_DEC}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className={fieldClass}
                />
              </div>
              {/* Main Category */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Main Category
                </label>
                <select
                  name="PC_MCNAME"
                  value={selectedMainCat?.Main_CatID || ""}
                  onChange={(e) => {
                    const selected = mainCategories.find(
                      (cat) => cat.Main_CatID === e.target.value
                    );
                    setSelectedMainCat(selected || null);
                    setForm((prev) => ({
                      ...prev,
                      PC_MCNAME: selected?.Main_CatName || "",
                    }));
                  }}
                  className={fieldClass}
                >
                  <option value="">Select Main Category</option>
                  {mainCategories.map((mc) => (
                    <option key={mc.Main_CatID} value={mc.Main_CatID}>
                      {mc.Main_CatName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Sub Category
                </label>
                <select
                  name="PC_SCNAME"
                  value={selectedSubCat?.Sub_CatID || ""}
                  onChange={(e) => {
                    const selected = subCategories.find(
                      (sc) => sc.Sub_CatID === e.target.value
                    );
                    setSelectedSubCat(selected || null);
                    setForm((prev) => ({
                      ...prev,
                      PC_SCNAME: selected?.Sub_CatName || "",
                    }));
                  }}
                  className={fieldClass}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories
                    .filter(
                      (sc) => sc.Sub_MainCatID === selectedMainCat?.Main_CatID
                    )
                    .map((sc) => (
                      <option key={sc.Sub_CatID} value={sc.Sub_CatID}>
                        {sc.Sub_CatName}
                      </option>
                    ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Brand
                </label>
                <select
                  value={selectedBrand?.B_Id || ""}
                  onChange={(e) => {
                    const brand = brands.find((b) => b.B_Id === e.target.value);
                    setSelectedBrand(brand || null);
                    setForm((prev) => ({
                      ...prev,
                      PC_BRNAME: brand?.B_Name || "",
                    }));
                  }}
                  className={fieldClass}
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.B_Id} value={b.B_Id}>
                      {b.B_Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Unit
                </label>
                <select
                  value={selectedUnit?.P_UNCODE || form.PC_UNIT || ""}
                  onChange={(e) => {
                    const unit = units.find(
                      (u) => u.P_UNCODE === e.target.value
                    );
                    setSelectedUnit(unit || null);
                    setForm((prev) => ({
                      ...prev,
                      PC_UNIT: unit?.P_UNCODE || "",
                    }));
                  }}
                  className={fieldClass}
                >
                  <option value="">Select Unit</option>
                  {units.map((u) => (
                    <option key={u.P_UNCODE} value={u.P_UNCODE}>
                      {u.P_UNDESC}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specification */}
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Specification
                </label>
                <input
                  type="text"
                  name="PC_MSPEC"
                  value={form.PC_MSPEC || ""}
                  onChange={handleChange}
                  placeholder="Enter Specification"
                  className={fieldClass}
                />
              </div>

              
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-sm text-red-500">⚠ {error}</div>}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              className={`px-3 py-2 rounded-lg font-medium text-sm border transition-all duration-200 ${darkMode
                  ? "bg-gray-700 text-gray-200 border-gray-600"
                  : "bg-white text-gray-700 border-gray-300"
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}

              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}