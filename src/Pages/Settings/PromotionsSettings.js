import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createPromotion,
  listPromotions,
  updatePromotionStatus,
  getProductsForPromotion
} from '../../actions/POS/promotionActions';
import {
  listWarehouses,
  listProductsByWarehouse,
  listBatchesByProduct,
  resetProducts,
  resetBatches
} from '../../actions/Inventory/commonDropdownAction';
import { PROMOTION_TYPE_OPTIONS, DISCOUNT_TYPE_OPTIONS } from '../../constants/POS/promotionConstants';
import { FiPlus, FiTag, FiCalendar, FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiClock, FiUser, FiToggleLeft, FiToggleRight, FiShoppingBag, FiSearch, FiDollarSign, FiPercent, FiPackage, FiLayers } from 'react-icons/fi';

const PromotionsSettings = ({ darkMode }) => {
  const dispatch = useDispatch();
  const { promotions, products, loading, error, success, statusLoading } = useSelector(state => state.promotion);
  const { warehouses } = useSelector(state => state.warehouseList);
  const { products: warehouseProducts, loading: productsLoading } = useSelector(state => state.productList);
  const { batches, loading: batchesLoading } = useSelector(state => state.batchList);

  const [showForm, setShowForm] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showAlert, setShowAlert] = useState(false);
  const [visiblePromotions, setVisiblePromotions] = useState(3);
  const [formLoading, setFormLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);


  const [promotionForm, setPromotionForm] = useState({
    P_PROMODES: '',
    P_PROMOTYPE: 'S',
    P_SDATE: '',
    P_EDATE: '',
    Details: [{
      P_PROCODE: '',
      P_DISCOUNTTYPE: 'P',
      P_BATCHID: '',
      P_DISPERCENTAGE: '',
      P_DISVALUE: '',
      P_PROMOPRICE: '',
      P_WHCODE: ''
    }]
  });

  useEffect(() => {
    dispatch(listPromotions());
    dispatch(getProductsForPromotion());
    dispatch(listWarehouses());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      showAlertMessage('Promotion created successfully!', 'success');
      resetForm();
      dispatch(listPromotions());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      showAlertMessage(error, 'error');
    }
  }, [error]);

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };


  const safeProducts = Array.isArray(products) ? products : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safeWarehouseProducts = Array.isArray(warehouseProducts) ? warehouseProducts : [];
  const safeBatches = Array.isArray(batches) ? batches : [];


  const handleOpenForm = () => {
    console.log('Opening promotion form...');
    setShowForm(true);


    dispatch(getProductsForPromotion());
    dispatch(listWarehouses());
  };

  const handleFormChange = (field, value) => {
    setPromotionForm(prev => ({
      ...prev,
      [field]: value
    }));
    setLocalError(null);
  };

  const handleDetailChange = (index, field, value) => {
    setPromotionForm(prev => {
      const updatedDetails = [...prev.Details];
      const updatedDetail = { ...updatedDetails[index] };


      updatedDetail[field] = value;


      if (field === 'P_DISCOUNTTYPE') {

        updatedDetail.P_DISPERCENTAGE = '';
        updatedDetail.P_DISVALUE = '';
        updatedDetail.P_PROMOPRICE = '';
      } else if (field === 'P_WHCODE') {

        updatedDetail.P_PROCODE = '';
        updatedDetail.P_BATCHID = '';


        if (value) {
          console.log('Loading products for warehouse:', value);
          dispatch(listProductsByWarehouse(value));
        } else {
          dispatch(resetProducts());
        }
        dispatch(resetBatches());
      } else if (field === 'P_PROCODE') {

        updatedDetail.P_BATCHID = '';


        const warehouse = updatedDetail.P_WHCODE;
        if (value && warehouse) {
          console.log('Loading batches for product:', value, 'and warehouse:', warehouse);
          dispatch(listBatchesByProduct(value, warehouse));
        } else {
          dispatch(resetBatches());
        }
      }

      updatedDetails[index] = updatedDetail;

      return {
        ...prev,
        Details: updatedDetails
      };
    });
    setLocalError(null);
  };

  const addProductDetail = () => {
    setPromotionForm(prev => ({
      ...prev,
      Details: [
        ...prev.Details,
        {
          P_PROCODE: '',
          P_DISCOUNTTYPE: 'P',
          P_BATCHID: '',
          P_DISPERCENTAGE: '',
          P_DISVALUE: '',
          P_PROMOPRICE: '',
          P_WHCODE: ''
        }
      ]
    }));
  };

  const removeProductDetail = (index) => {
    if (promotionForm.Details.length > 1) {
      const updatedDetails = promotionForm.Details.filter((_, i) => i !== index);
      setPromotionForm(prev => ({
        ...prev,
        Details: updatedDetails
      }));
    }
  };


  const getWarehouseName = (warehouseCode) => {
    if (!warehouseCode) return '';
    const warehouse = safeWarehouses.find(w => w.WH_Code === warehouseCode.toString());
    return warehouse ? `${warehouse.WH_Description} (${warehouse.WH_Code})` : '';
  };

  const getProductName = (productCode) => {
    if (!productCode) return '';
    const product = safeWarehouseProducts.find(p => p.PPROCODE === productCode.toString()) ||
      safeProducts.find(p => p.PPROCODE === productCode.toString());
    return product ? `${product.PPDES} (${product.PPROCODE})` : '';
  };

  const getBatchName = (batchId) => {
    if (!batchId) return '';
    const batch = safeBatches.find(b => b.PB_BId === batchId.toString());
    return batch ? `${batch.PB_BId}` : '';
  };

  const validateForm = () => {

    setLocalError(null);


    if (!promotionForm.P_PROMODES.trim()) {
      setLocalError('Please enter promotion description');
      return false;
    }
    if (!promotionForm.P_SDATE || !promotionForm.P_EDATE) {
      setLocalError('Please select start and end dates');
      return false;
    }

    const startDate = new Date(promotionForm.P_SDATE);
    const endDate = new Date(promotionForm.P_EDATE);

    if (startDate >= endDate) {
      setLocalError('End date must be after start date');
      return false;
    }


    for (let i = 0; i < promotionForm.Details.length; i++) {
      const detail = promotionForm.Details[i];

      if (!detail.P_WHCODE) {
        setLocalError(`Please select a warehouse for item ${i + 1}`);
        return false;
      }
      if (!detail.P_PROCODE) {
        setLocalError(`Please select a product for item ${i + 1}`);
        return false;
      }


      switch (detail.P_DISCOUNTTYPE) {
        case 'P':
          if (!detail.P_DISPERCENTAGE || parseFloat(detail.P_DISPERCENTAGE) <= 0) {
            setLocalError(`Please enter a valid percentage discount for item ${i + 1}`);
            return false;
          }
          if (parseFloat(detail.P_DISPERCENTAGE) > 100) {
            setLocalError(`Discount percentage cannot exceed 100% for item ${i + 1}`);
            return false;
          }
          break;
        case 'V':
          if (!detail.P_DISVALUE || parseFloat(detail.P_DISVALUE) <= 0) {
            setLocalError(`Please enter a valid discount value for item ${i + 1}`);
            return false;
          }
          break;
        case 'F':
          if (!detail.P_PROMOPRICE || parseFloat(detail.P_PROMOPRICE) <= 0) {
            setLocalError(`Please enter a valid promotion price for item ${i + 1}`);
            return false;
          }
          break;
        default:
          setLocalError(`Please select a valid discount type for item ${i + 1}`);
          return false;
      }
    }

    return true;
  };

  const handleSavePromotion = async () => {
    console.log('Starting promotion save process...');

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      setSaveLoading(true);
      setLocalError(null);


      const formattedData = [{
        P_PROMODES: promotionForm.P_PROMODES.trim(),
        P_PROMOTYPE: promotionForm.P_PROMOTYPE,
        P_SDATE: promotionForm.P_SDATE,
        P_EDATE: promotionForm.P_EDATE,
        Details: promotionForm.Details.map(detail => {
          const formattedDetail = {
            P_PROCODE: parseInt(detail.P_PROCODE),
            P_WHCODE: detail.P_WHCODE,
            P_DISCOUNTTYPE: detail.P_DISCOUNTTYPE
          };


          if (detail.P_BATCHID && detail.P_BATCHID.trim() !== '') {
            formattedDetail.P_BATCHID = parseInt(detail.P_BATCHID);
          } else {
            formattedDetail.P_BATCHID = null;
          }


          switch (detail.P_DISCOUNTTYPE) {
            case 'P':
              formattedDetail.P_DISPERCENTAGE = detail.P_DISPERCENTAGE ? parseFloat(detail.P_DISPERCENTAGE).toString() : "";
              formattedDetail.P_DISVALUE = "";
              formattedDetail.P_PROMOPRICE = "";
              break;
            case 'V':
              formattedDetail.P_DISPERCENTAGE = "";
              formattedDetail.P_DISVALUE = detail.P_DISVALUE ? parseFloat(detail.P_DISVALUE).toString() : "";
              formattedDetail.P_PROMOPRICE = "";
              break;
            case 'F':
              formattedDetail.P_DISPERCENTAGE = "";
              formattedDetail.P_DISVALUE = "";
              formattedDetail.P_PROMOPRICE = detail.P_PROMOPRICE ? parseFloat(detail.P_PROMOPRICE).toString() : "";
              break;
            default:
              formattedDetail.P_DISPERCENTAGE = "";
              formattedDetail.P_DISVALUE = "";
              formattedDetail.P_PROMOPRICE = "";
          }

          return formattedDetail;
        })
      }];

      console.log('Formatted promotion data for API:', JSON.stringify(formattedData, null, 2));


      const result = await dispatch(createPromotion(formattedData));

      console.log('Promotion creation result:', result);


      if (result) {

        const isSuccess = result.success ||
          result.Success ||
          result.status === 'success' ||
          result.Status === 'success' ||
          (typeof result === 'object' && Object.keys(result).length > 0);

        if (isSuccess) {
          showAlertMessage('Promotion created successfully!', 'success');
          resetForm();
          dispatch(listPromotions());
          return;
        }
      }


      throw new Error('Failed to create promotion - invalid response from server');

    } catch (error) {
      console.error('Error saving promotion:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message ||
        'Failed to save promotion. Please try again.';
      setLocalError(errorMessage);
      showAlertMessage(errorMessage, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const resetForm = () => {
    setPromotionForm({
      P_PROMODES: '',
      P_PROMOTYPE: 'S',
      P_SDATE: '',
      P_EDATE: '',
      Details: [{
        P_PROCODE: '',
        P_DISCOUNTTYPE: 'P',
        P_BATCHID: '',
        P_DISPERCENTAGE: '',
        P_DISVALUE: '',
        P_PROMOPRICE: '',
        P_WHCODE: ''
      }]
    });
    setShowForm(false);
    setLocalError(null);
    setFormLoading(false);
    setSaveLoading(false);
    dispatch(resetProducts());
    dispatch(resetBatches());
  };

  const handleStatusToggle = async (promotionId, currentStatus) => {
    if (currentStatus === 'A') {
      if (window.confirm('Are you sure you want to deactivate this promotion?')) {
        try {
          await dispatch(updatePromotionStatus(promotionId));
          showAlertMessage('Promotion deactivated successfully!', 'success');
        } catch (error) {
          console.error('Error updating promotion status:', error);
          showAlertMessage('Failed to update promotion status. Please try again.', 'error');
        }
      }
    }
  };

  const getPromotionTypeLabel = (type) => {
    const option = PROMOTION_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const getDiscountTypeLabel = (type) => {
    const option = DISCOUNT_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusInfo = (promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.P_SDATE || promotion.Promo_HSdate);
    const endDate = new Date(promotion.P_EDATE || promotion.Promo_HEdate);
    const status = promotion.P_STATUS || promotion.Promo_HStatus;

    if (status === 'I') {
      return {
        status: 'Inactive',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        darkBgColor: 'bg-gray-800',
        darkTextColor: 'text-gray-200'
      };
    }

    if (now < startDate) {
      return {
        status: 'Upcoming',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        darkBgColor: 'bg-blue-800',
        darkTextColor: 'text-blue-200'
      };
    } else if (now > endDate) {
      return {
        status: 'Expired',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        darkBgColor: 'bg-red-800',
        darkTextColor: 'text-red-200'
      };
    } else {
      return {
        status: 'Active',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        darkBgColor: 'bg-green-800',
        darkTextColor: 'text-green-200'
      };
    }
  };

  const getDiscountDisplay = (detail) => {
    switch (detail.P_DISCOUNTTYPE || detail.discountType) {
      case 'P':
        return `${detail.P_DISPERCENTAGE || detail.discountPercentage}% OFF`;
      case 'V':
        return `${detail.P_DISVALUE || detail.discountValue} OFF`;
      case 'F':
        return `${detail.P_PROMOPRICE || detail.discountPrice} Fixed Price`;
      default:
        return 'No Discount';
    }
  };

  const getAlertBgColor = () => {
    switch (alertType) {
      case 'success': return 'bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700';
      case 'error': return 'bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700';
      case 'warning': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/70 dark:border-yellow-700';
      case 'info': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/70 dark:border-blue-700';
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700';
    }
  };

  const getAlertTextColor = () => {
    switch (alertType) {
      case 'success': return 'text-green-800 dark:text-green-200';
      case 'error': return 'text-red-800 dark:text-red-200';
      case 'warning': return 'text-yellow-800 dark:text-yellow-200';
      case 'info': return 'text-blue-800 dark:text-blue-200';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getAlertIcon = () => {
    switch (alertType) {
      case 'success': return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error': return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning': return <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <FiInfo className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };


  const safePromotions = Array.isArray(promotions) ? promotions : [];


  const displayedPromotions = safePromotions.slice(0, visiblePromotions);
  const hasMorePromotions = safePromotions.length > visiblePromotions;

  const loadMorePromotions = () => {
    setVisiblePromotions(prev => prev + 3);
  };


  useEffect(() => {
    console.log('Form visibility:', showForm);
    console.log('Products loaded:', safeProducts.length);
    console.log('Warehouses loaded:', safeWarehouses.length);
  }, [showForm, safeProducts.length, safeWarehouses.length]);

  return (
    <div className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border`}>
      {/* Alert Message */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
          <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {getAlertIcon()}
              <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
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

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow">
              <FiTag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Promotions & Discounts</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Manage product discounts and promotional offers</p>
            </div>
          </div>
          <button
            onClick={handleOpenForm}
            className="flex items-center gap-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 rounded-lg text-sm"
            disabled={loading}
          >
            <FiPlus className="w-4 h-4" /> Add Promotion
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {(error || localError) && (
        <div className={`p-3 rounded-lg border ${darkMode ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          <div className="flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4" />
            <span className="text-sm">{localError || error}</span>
          </div>
        </div>
      )}

      {/* Promotion Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="relative">
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                    <FiTag className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Promotion</h2>
                </div>
                <button
                  onClick={resetForm}
                  className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Loading State for Products */}
                {formLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-blue-500">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Loading products...</span>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div>
                  <h2 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">Promotion Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Promotion Description *</label>
                      <input
                        type="text"
                        value={promotionForm.P_PROMODES}
                        onChange={(e) => handleFormChange('P_PROMODES', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        placeholder="e.g., Summer Sale, Christmas Discount"
                        disabled={saveLoading}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Promotion Type</label>
                      <select
                        value={promotionForm.P_PROMOTYPE}
                        onChange={(e) => handleFormChange('P_PROMOTYPE', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        disabled={saveLoading}
                      >
                        {PROMOTION_TYPE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
                      <input
                        type="date"
                        value={promotionForm.P_SDATE}
                        onChange={(e) => handleFormChange('P_SDATE', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        disabled={saveLoading}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">End Date *</label>
                      <input
                        type="date"
                        value={promotionForm.P_EDATE}
                        onChange={(e) => handleFormChange('P_EDATE', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        disabled={saveLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Product Details</h2>
                    <button
                      type="button"
                      onClick={addProductDetail}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={saveLoading}
                    >
                      <FiPlus className="w-3 h-3" /> Add Product
                    </button>
                  </div>

                  {safeWarehouses.length === 0 && !formLoading ? (
                    <div className={`p-4 rounded-lg border text-center ${darkMode ? 'border-yellow-600 bg-yellow-900/20 text-yellow-200' : 'border-yellow-300 bg-yellow-50 text-yellow-700'
                      }`}>
                      <FiAlertCircle className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-sm">No warehouses available. Please check if warehouses are loaded.</p>
                    </div>
                  ) : (
                    promotionForm.Details.map((detail, index) => (
                      <div key={index} className={`border rounded-lg p-4 mb-3 ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                          {/* Warehouse Selection */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Warehouse *</label>
                            <select
                              value={detail.P_WHCODE}
                              onChange={(e) => {
                                const warehouseCode = e.target.value;
                                console.log('Warehouse selected:', warehouseCode);
                                handleDetailChange(index, 'P_WHCODE', warehouseCode);
                              }}
                              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                              disabled={saveLoading}
                            >
                              <option value="">Select Warehouse</option>
                              {safeWarehouses.map(warehouse => (
                                <option key={warehouse.WH_Code} value={warehouse.WH_Code}>
                                  {warehouse.WH_Description} ({warehouse.WH_Code})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Product Selection */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Product *</label>
                            <select
                              value={detail.P_PROCODE}
                              onChange={(e) => {
                                const productCode = e.target.value;
                                console.log('Product selected:', productCode);
                                handleDetailChange(index, 'P_PROCODE', productCode);
                              }}
                              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                              disabled={saveLoading || !detail.P_WHCODE || productsLoading}
                            >
                              <option value="">{productsLoading ? 'Loading products...' : 'Select Product'}</option>
                              {!productsLoading && safeWarehouseProducts.map(product => (
                                <option key={product.PPROCODE} value={product.PPROCODE}>
                                  {product.PPDES} ({product.PPROCODE})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Batch Selection */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Batch (Optional)</label>
                            <select
                              value={detail.P_BATCHID}
                              onChange={(e) => {
                                const batchId = e.target.value;
                                console.log('Batch selected:', batchId);
                                handleDetailChange(index, 'P_BATCHID', batchId);
                              }}
                              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                              disabled={saveLoading || !detail.P_PROCODE || !detail.P_WHCODE || batchesLoading}
                            >
                              <option value="">{batchesLoading ? 'Loading batches...' : 'Select Batch'}</option>
                              {!batchesLoading && safeBatches.map(batch => (
                                <option key={batch.PB_BId} value={batch.PB_BId}>
                                  {batch.PB_BId}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Discount Type */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Discount Type</label>
                            <select
                              value={detail.P_DISCOUNTTYPE}
                              onChange={(e) => handleDetailChange(index, 'P_DISCOUNTTYPE', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                              disabled={saveLoading}
                            >
                              {DISCOUNT_TYPE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Dynamic Fields based on Discount Type */}
                          {detail.P_DISCOUNTTYPE === 'P' && (
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Discount Percentage *</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={detail.P_DISPERCENTAGE}
                                  onChange={(e) => handleDetailChange(index, 'P_DISPERCENTAGE', e.target.value)}
                                  className={`w-full pl-8 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-gray-50 border-gray-200 text-gray-900'
                                    }`}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  placeholder="e.g., 15.5"
                                  disabled={saveLoading}
                                />
                                <FiPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </div>
                          )}

                          {detail.P_DISCOUNTTYPE === 'V' && (
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Discount Value *</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={detail.P_DISVALUE}
                                  onChange={(e) => handleDetailChange(index, 'P_DISVALUE', e.target.value)}
                                  className={`w-full pl-8 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-gray-50 border-gray-200 text-gray-900'
                                    }`}
                                  min="0"
                                  step="0.01"
                                  placeholder="e.g., 25.00"
                                  disabled={saveLoading}
                                />
                                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </div>
                          )}

                          {detail.P_DISCOUNTTYPE === 'F' && (
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Promotion Price *</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={detail.P_PROMOPRICE}
                                  onChange={(e) => handleDetailChange(index, 'P_PROMOPRICE', e.target.value)}
                                  className={`w-full pl-8 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-gray-50 border-gray-200 text-gray-900'
                                    }`}
                                  min="0"
                                  step="0.01"
                                  placeholder="e.g., 99.99"
                                  disabled={saveLoading}
                                />
                                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </div>
                          )}

                          {/* Remove Button */}
                          {promotionForm.Details.length > 1 && (
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeProductDetail(index)}
                                className="flex items-center gap-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                disabled={saveLoading}
                              >
                                <FiX className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Info Note */}
                <div className={`rounded-lg p-3 border ${darkMode
                    ? "bg-blue-900/20 border-blue-800"
                    : "bg-blue-50 border-blue-200"
                  }`}>
                  <p className={`text-xs ${darkMode ? "text-blue-300" : "text-blue-800"}`}>
                    <strong>Note:</strong> Fields marked with * are required. Select warehouse first to load available products, then select product to load available batches.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-end gap-2 p-4 rounded-b-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <button
                  onClick={resetForm}
                  className={`px-4 py-2 rounded-lg font-medium text-sm border transition-all duration-200 ${darkMode
                      ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  disabled={saveLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePromotion}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 text-sm disabled:opacity-50"
                  disabled={saveLoading || safeWarehouses.length === 0}
                >
                  {saveLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Promotion'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotions List */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"}`}>
          <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Promotions</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {displayedPromotions.length} of {safePromotions.length} promotions
                  </p>
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-blue-500 text-sm">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              {safePromotions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FiTag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No promotions created yet</p>
                  <p className="text-xs mt-1">Get started by creating your first promotion</p>
                  <button
                    onClick={handleOpenForm}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Create Your First Promotion
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {displayedPromotions.map((promotion, index) => {
                      const statusInfo = getStatusInfo(promotion);
                      const isActive = (promotion.P_STATUS || promotion.Promo_HStatus) === 'A';

                      return (
                        <div
                          key={promotion.id || promotion.Promo_HID || index}
                          className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-200 bg-white'
                            }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-base text-gray-900 dark:text-white">
                                  {promotion.P_PROMODES || promotion.Promo_HIDesc}
                                </h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                  {getPromotionTypeLabel(promotion.P_PROMOTYPE || promotion.Promo_HIType)}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? statusInfo.darkBgColor + ' ' + statusInfo.darkTextColor : statusInfo.bgColor + ' ' + statusInfo.textColor
                                  }`}>
                                  {statusInfo.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3 text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <FiCalendar className="w-3 h-3 opacity-70" />
                                  <span className="font-medium">Period:</span>
                                  <span>
                                    {formatDate(promotion.P_SDATE || promotion.Promo_HSdate)} - {formatDate(promotion.P_EDATE || promotion.Promo_HEdate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiClock className="w-3 h-3 opacity-70" />
                                  <span className="font-medium">Created:</span>
                                  <span>{formatDate(promotion.createdDate || promotion.Promo_HCreatedDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiUser className="w-3 h-3 opacity-70" />
                                  <span className="font-medium">By:</span>
                                  <span>User {promotion.createdBy || promotion.Promo_HCreatedBy}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Promo ID:</span>
                                  <span className="ml-1 font-mono text-xs">
                                    {promotion.id || promotion.Promo_HID}
                                  </span>
                                </div>
                              </div>

                              {/* Product Details */}
                              {promotion.Details && promotion.Details.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="font-medium mb-2 text-sm flex items-center gap-1 text-gray-900 dark:text-white">
                                    <FiShoppingBag className="w-3 h-3" />
                                    Included Products ({promotion.Details.length})
                                  </h5>
                                  <div className="space-y-2">
                                    {promotion.Details.map((detail, detailIndex) => (
                                      <div key={detailIndex} className={`text-sm p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                        }`}>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Product:</span>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{detail.productName}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Discount:</span>
                                            <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                                              {getDiscountDisplay(detail)}
                                            </p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Product Code:</span>
                                            <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{detail.productCode}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Batch:</span>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{detail.batchId || 'All Batches'}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Status Toggle Button */}
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <button
                                onClick={() => handleStatusToggle(promotion.id || promotion.Promo_HID, promotion.P_STATUS || promotion.Promo_HStatus)}
                                disabled={statusLoading || !isActive}
                                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${isActive
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                  }`}
                                title={isActive ? 'Deactivate Promotion' : 'Promotion is inactive'}
                              >
                                {statusLoading ? (
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : isActive ? (
                                  <FiToggleLeft className="w-3 h-3" />
                                ) : (
                                  <FiToggleRight className="w-3 h-3" />
                                )}
                                {isActive ? 'Deactivate' : 'Inactive'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Load More Button */}
                  {hasMorePromotions && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={loadMorePromotions}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Load More Promotions
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsSettings;