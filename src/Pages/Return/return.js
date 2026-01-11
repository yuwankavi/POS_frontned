import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiX, FiSearch, FiRefreshCw, FiShoppingCart, FiCheckCircle, FiPackage, FiAlertCircle, FiEye, FiArrowLeft, FiUser, FiHome, FiDollarSign } from 'react-icons/fi';
import {
  createSalesReturn,
  scanInvoice,
  updateReturnItem,
  resetReturnForm,
  resetReturnCreation,
  setInvoiceForReturn,
  resetPreviewInvoice,
  fetchProductQuantity
} from '../../actions/returnActions';
import MRN from '../../Pages/inventory/Store_Transaction/MRN';
import Breadcrumb from '../../components/common/Breadcrumb';
import { listSalesReturns } from '../../actions/Inventory/salesReturnActions';

const ReturnPage = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);
  const {
    loading,
    success,
    error,
    scanLoading,
    currentInvoice,
    previewInvoice,
    formData,
    productQuantities,
    quantityLoading
  } = useSelector(state => state.return);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [scannedInvoice, setScannedInvoice] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (error) {
      showAlertMessage(error, 'error');
    }
  }, [error, dispatch]);


  useEffect(() => {
    if (currentInvoice && currentInvoice.items && isReturnModalOpen) {
      const invoiceNumber = currentInvoice.invoiceNumber;
      currentInvoice.items.forEach(item => {
        dispatch(fetchProductQuantity(item.PRODUCT_CODE, invoiceNumber, item.BATCH_ID));
      });
    }
  }, [currentInvoice, isReturnModalOpen, dispatch]);


  useEffect(() => {
    if (currentInvoice && currentInvoice.items && Object.keys(productQuantities).length > 0) {
      const invoiceNumber = currentInvoice.invoiceNumber;
      const updatedReturnLines = currentInvoice.items.map((item, index) => {
        const existingLine = formData.ReturnLines[index] || {};
        const quantityKey = `${item.PRODUCT_CODE}_${invoiceNumber}_${item.BATCH_ID}`;
        const maxQty = productQuantities[quantityKey] || 0;

        return {
          PRODUCT_CODE: item.PRODUCT_CODE,
          BATCH_ID: item.BATCH_ID,
          QUANTITY: existingLine.QUANTITY || 0,
          UNIT_PRICE: item.price,
          REASON: existingLine.REASON || '',
          maxQuantity: maxQty
        };
      });


      dispatch({
        type: 'RETURN_UPDATE_MAX_QUANTITIES',
        payload: updatedReturnLines
      });
    }
  }, [productQuantities, currentInvoice, dispatch]);

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setScannedInvoice('');
  };

  const openPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    dispatch(resetPreviewInvoice());
  };

  const openReturnModal = () => {
    setIsReturnModalOpen(true);
  };

  const closeReturnModal = () => {
    setIsReturnModalOpen(false);
    dispatch(resetReturnForm());
  };

  const handleScanInvoice = async () => {
    if (!scannedInvoice.trim()) {
      showAlertMessage('Please enter or scan an invoice number', 'error');
      return;
    }

    try {
      await dispatch(scanInvoice(scannedInvoice));
      closeModal();
      openPreviewModal();
      showAlertMessage(`Invoice ${scannedInvoice} loaded successfully!`, 'success');
    } catch (error) {
      showAlertMessage(error.message || 'Failed to load invoice', 'error');
    }
  };

  const handleAddReturn = async () => {
    if (!previewInvoice || !previewInvoice.items) {
      showAlertMessage('No invoice items found', 'error');
      return;
    }

    try {
      dispatch(setInvoiceForReturn(previewInvoice));
      closePreviewModal();
      openReturnModal();

      const invoiceNumber = previewInvoice.invoiceNumber;
      previewInvoice.items.forEach(item => {
        dispatch(fetchProductQuantity(item.PRODUCT_CODE, invoiceNumber, item.BATCH_ID));
      });

    } catch (error) {
      showAlertMessage('Error processing return request', 'error');
    }
  };

  const handleProcessReturn = async () => {
    if (!formData.P_ORIGINALDOCNO) {
      showAlertMessage('Please select an invoice first', 'error');
      return;
    }

    const validReturnItems = formData.ReturnLines.filter((line, index) => {
      if (line.QUANTITY > 0) {
        const item = currentInvoice.items[index];
        if (item) {
          const invoiceNumber = currentInvoice.invoiceNumber;
          const quantityKey = `${item.PRODUCT_CODE}_${invoiceNumber}_${item.BATCH_ID}`;
          const availableQty = productQuantities[quantityKey] || 0;
          return line.QUANTITY <= availableQty && availableQty > 0;
        }
      }
      return false;
    });

    if (validReturnItems.length === 0) {
      showAlertMessage('No valid items available for return', 'error');
      return;
    }

    const allReasonsFilled = validReturnItems.every(line => line.REASON.trim() !== '');

    if (!allReasonsFilled) {
      showAlertMessage('Please provide reason for all returned items', 'error');
      return;
    }

    const invoiceNumber = currentInvoice.invoiceNumber;
    const invalidQuantities = formData.ReturnLines.filter((line, index) => {
      if (line.QUANTITY > 0) {
        const item = currentInvoice.items[index];
        if (item) {
          const quantityKey = `${item.PRODUCT_CODE}_${invoiceNumber}_${item.BATCH_ID}`;
          const availableQty = productQuantities[quantityKey] || 0;
          return line.QUANTITY > availableQty;
        }
      }
      return false;
    });

    if (invalidQuantities.length > 0) {
      showAlertMessage('Some quantities exceed available stock. Please adjust quantities.', 'error');
      return;
    }

    const filteredReturnLines = formData.ReturnLines.filter(line => line.QUANTITY > 0);

    const finalReturnData = [{
      ...formData,
      ReturnLines: filteredReturnLines
    }];

    try {
      const result = await dispatch(createSalesReturn(finalReturnData));
      if (result && result.success) {
        const successMessage = `Return processed successfully! Refund amount: ${result.amount.toFixed(2)}`;
        showAlertMessage(successMessage, 'success');
        closeReturnModal();
        dispatch(listSalesReturns());
      }
    } catch (error) {
      showAlertMessage('Failed to process return', 'error');
    }
  };


  const handleQuantityChange = (itemId, quantity) => {
    const item = currentInvoice.items.find(item => item.id === itemId);
    if (!item) return;

    const invoiceNumber = currentInvoice.invoiceNumber;
    const quantityKey = `${item.PRODUCT_CODE}_${invoiceNumber}_${item.BATCH_ID}`;
    const maxQuantity = productQuantities[quantityKey] || 0;

    const validQuantity = Math.min(Math.max(0, quantity), maxQuantity);
    dispatch(updateReturnItem(itemId, 'QUANTITY', validQuantity));
  };

  const handleReasonChange = (itemId, reason) => {
    dispatch(updateReturnItem(itemId, 'REASON', reason));
  };

  const getAlertBgColor = () => {
    switch (alertType) {
      case 'success': return 'bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700';
      case 'error': return 'bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700';
      case 'warning': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/70 dark:border-yellow-700';
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700';
    }
  };

  const getAlertTextColor = () => {
    switch (alertType) {
      case 'success': return 'text-green-800 dark:text-green-200';
      case 'error': return 'text-red-800 dark:text-red-200';
      case 'warning': return 'text-yellow-800 dark:text-yellow-200';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getAlertIcon = () => {
    switch (alertType) {
      case 'success': return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error': return <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning': return <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      default: return <FiCheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const renderItemQuantityInfo = (item) => {
    if (!currentInvoice) return null;

    const invoiceNumber = currentInvoice.invoiceNumber;
    const quantityKey = `${item.PRODUCT_CODE}_${invoiceNumber}_${item.BATCH_ID}`;
    const availableQty = productQuantities[quantityKey];

    if (quantityLoading && availableQty === undefined) {
      return (
        <div className="flex items-center gap-1">
          <FiRefreshCw className="w-3 h-3 animate-spin" />
          <span className="text-xs">Loading quantity...</span>
        </div>
      );
    }

    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Price: {item.price.toFixed(2)} • Available: {availableQty !== undefined ? availableQty : 'N/A'}
      </div>
    );
  };

  const handleBackToScan = () => {
  closePreviewModal(); // Preview modal වසා දමයි
  openModal(); // Scan modal නැවත විවෘත කරයි
};

  const totalReturnAmount = currentInvoice ? formData.ReturnLines.reduce((total, line, index) => {
    const item = currentInvoice.items[index];
    return total + (item ? item.price * line.QUANTITY : 0);
  }, 0) : 0;


  const allItemsZeroQuantity = currentInvoice && currentInvoice.items &&
    currentInvoice.items.every((item, index) => {
      const invoiceNumber = currentInvoice.invoiceNumber;
      const quantityKey = `${item.PRODUCT_CODE}_${invoiceNumber}_${item.BATCH_ID}`;
      const maxQuantity = productQuantities[quantityKey] || 0;
      return maxQuantity === 0;
    });

  return (
    <div className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>

      {/* Alert Message - Fixed at top with higher z-index */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-down w-full max-w-md px-2 sm:px-0">
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

      <Breadcrumb current="Sales Return" />

      {/* Header with New Return button on right corner */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow">
              <FiRefreshCw className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Sales Return Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Process product returns and refunds</p>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            <FiPlus className="w-4 h-4" /> New Return
          </button>
        </div>
      </div>

      <MRN />

      {/* Scan Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="relative">
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-100'
                    }`}>
                    <FiShoppingCart className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-lg font-bold">Scan Invoice</h2>
                </div>
                <button
                  onClick={closeModal}
                  className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium">
                    Invoice Number (INNO)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter invoice number (e.g., 1, 2, 3...)"
                    value={scannedInvoice}
                    onChange={e => setScannedInvoice(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        handleScanInvoice();
                      }
                    }}
                    className={`w-full px-3 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm ${darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter the invoice number to preview and add returns
                  </p>
                </div>

                {/* Invoice Format Display */}
                <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiPackage className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium">Invoice Information</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• Enter the numeric invoice number (INNO)</p>
                    <p>• Example: 1, 2, 3, etc.</p>
                    <p>• System will fetch and preview invoice details</p>
                  </div>
                </div>

                {/* Loading State */}
                {scanLoading && (
                  <div className="flex items-center justify-center py-4">
                    <FiRefreshCw className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Loading invoice details...</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-end gap-2 p-4 rounded-b-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                }`}>
                <button
                  onClick={closeModal}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300'
                    } border`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleScanInvoice}
                  disabled={scanLoading || !scannedInvoice.trim()}
                  className="px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scanLoading ? 'Loading...' : 'Preview Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {isPreviewModalOpen && previewInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="relative">
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                    <FiEye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Invoice Preview</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Review invoice details before adding returns
                    </p>
                  </div>
                </div>
                <button
                  onClick={closePreviewModal}
                  className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body - Invoice Preview */}
              <div className="p-4">
                {/* Invoice Header */}
                <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiShoppingCart className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">Invoice Number:</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{previewInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiUser className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">Customer:</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{previewInvoice.customerName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {previewInvoice.customerId}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiHome className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold">Warehouse:</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{previewInvoice.whCode}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiDollarSign className="w-4 h-4 text-red-500" />
                        <span className="font-semibold">Total Amount:</span>
                      </div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {previewInvoice.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs">
                    <div>
                      <span className="font-medium">Invoice Date:</span>
                      <p className="text-gray-600 dark:text-gray-400">{previewInvoice.invoiceDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Cashier:</span>
                      <p className="text-gray-600 dark:text-gray-400">{previewInvoice.cashierName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Invoiced On:</span>
                      <p className="text-gray-600 dark:text-gray-400">{previewInvoice.invoicedOn}</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Invoice Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                        <tr>
                          <th className="px-3 py-2 text-left">Product Description</th>
                          <th className="px-3 py-2 text-center">SKU</th>
                          <th className="px-3 py-2 text-center">Product Code</th>
                          <th className="px-3 py-2 text-center">Batch ID</th>
                          <th className="px-3 py-2 text-right">MRP</th> 
                          <th className="px-3 py-2 text-right">Unit Price</th>
                          <th className="px-3 py-2 text-right">Sold Qty</th>
                          <th className="px-3 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'
                        }`}>
                        {previewInvoice.items.map((item) => (
                          <tr key={item.id} className={
                            darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                          }>
                            <td className="px-3 py-2">
                              <div className="font-medium">{item.name}</div>
                            </td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                              {item.sku}
                            </td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                              {item.PRODUCT_CODE}
                            </td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                              {item.BATCH_ID}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {item.MRP.toFixed(2)}
                            </td>  
                            <td className="px-3 py-2 text-right">
                              {item.price.toFixed(2)}
                            </td>
                             <td className="px-3 py-2 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-2 text-right font-semibold">
                              {(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        } font-semibold`}>
                        <tr>
                          <td colSpan="7" className="px-3 py-2 text-right">
                            Total Amount:
                          </td>
                          <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">
                            {previewInvoice.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold">Ready to Process Return</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {previewInvoice.items.length} items available for return
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {previewInvoice.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total invoice amount
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-between gap-2 p-4 rounded-b-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                }`}>
                <button
                  onClick={handleBackToScan}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300'
                    } border`}
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to Scan
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={closePreviewModal}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                        ? 'bg-gray-700 text-gray-200 border-gray-600'
                        : 'bg-white text-gray-700 border-gray-300'
                      } border`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddReturn}
                    className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                  >
                    Add Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Return Modal */}
      {isReturnModalOpen && currentInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="relative">
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'
                    }`}>
                    <FiRefreshCw className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Process Return</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Invoice: {currentInvoice.invoiceNumber} • Customer: {currentInvoice.customerName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Amount: {currentInvoice.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeReturnModal}
                  className={`p-1 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Select Items to Return</h3>

                  {/* Show warning if all items have 0 quantity */}
                  {allItemsZeroQuantity && (
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            No items available for return
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                            All items in this invoice have 0 available quantity for return.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items List - Loaded from API */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {currentInvoice.items && currentInvoice.items.length > 0 ? (
                      currentInvoice.items.map((item, index) => {
                        const returnLine = formData.ReturnLines[index] || {};
                        const invoiceNumber = currentInvoice.invoiceNumber;
                        const quantityKey = `${item.PRODUCT_CODE}_${invoiceNumber}_${item.BATCH_ID}`;
                        const maxQuantity = productQuantities[quantityKey] || 0;


                        if (maxQuantity === 0 && (!returnLine.QUANTITY || returnLine.QUANTITY === 0)) {
                          return null;
                        }

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                              } ${maxQuantity === 0 ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-sm font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  SKU: {item.sku} • Product Code: {item.PRODUCT_CODE} • Batch: {item.BATCH_ID}
                                </div>
                                {renderItemQuantityInfo(item)}
                                {maxQuantity === 0 && (
                                  <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                                    This item is not available for return
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  {(item.mrp * (returnLine.QUANTITY || 0)).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {returnLine.QUANTITY || 0} of {maxQuantity}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Return Quantity {maxQuantity === 0 && '(Unavailable)'}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max={maxQuantity}
                                  value={returnLine.QUANTITY || 0}
                                  onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                  className={`w-full px-2 py-1 rounded border text-sm ${darkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-white border-gray-300 text-gray-900'
                                    } ${maxQuantity === 0 ? 'cursor-not-allowed' : ''}`}
                                  disabled={quantityLoading || maxQuantity === 0}
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Return Reason {maxQuantity === 0 && '(Unavailable)'}
                                </label>
                                <select
                                  value={returnLine.REASON || ''}
                                  onChange={e => handleReasonChange(item.id, e.target.value)}
                                  className={`w-full px-2 py-1 rounded border text-sm ${darkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-white border-gray-300 text-gray-900'
                                    } ${maxQuantity === 0 ? 'cursor-not-allowed' : ''}`}
                                  disabled={quantityLoading || maxQuantity === 0}
                                >
                                  <option value="">Select reason</option>
                                  <option value="Item is Broken">Item is Broken</option>
                                  <option value="Defective Product">Defective Product</option>
                                  <option value="Wrong Item Received">Wrong Item Received</option>
                                  <option value="Changed Mind">Changed Mind</option>
                                  <option value="Duplicate Order">Duplicate Order</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <FiPackage className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No items found in this invoice</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold">Total Return Amount</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.ReturnLines.filter(line => line.QUANTITY > 0).length} items selected
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {totalReturnAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                        Original: {currentInvoice.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-end gap-2 p-4 rounded-b-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
                }`}>
                <button
                  onClick={closeReturnModal}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${darkMode
                      ? 'bg-gray-700 text-gray-200 border-gray-600'
                      : 'bg-white text-gray-700 border-gray-300'
                    } border`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessReturn}
                  disabled={loading || totalReturnAmount === 0 || quantityLoading || allItemsZeroQuantity}
                  className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Process Return'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnPage;