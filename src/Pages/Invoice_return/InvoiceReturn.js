// src/pages/Invoice/InvoiceReturn.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSearch,
  FiPrinter,
  FiRefreshCw,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiShoppingBag,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiHome,
  FiArrowLeft,
  FiCreditCard,
  FiFileText,
  FiList,
  FiPackage,
  FiTag,
  FiShoppingCart,
  FiPercent,
  FiDownload,
  FiCopy,
  FiInfo,
  FiBox
} from 'react-icons/fi';
import {
  loadSalesReturns,
  fetchInvoiceDetails,
  printInvoiceForReturn,
  resetInvoiceReturn,
  clearInvoiceReturnErrors
} from '../../actions/invoiceReturnActions';
import Breadcrumb from '../../components/common/Breadcrumb';
import Barcode from 'react-barcode';

const InvoiceReturn = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux store with safe defaults
  const uiState = useSelector(state => state.ui) || {};
  const invoiceReturnState = useSelector(state => state.invoiceReturn) || {};
  
  const { darkMode = false } = uiState;
  const {
    loading = false,
    error = null,
    printLoading = false,
    printSuccess = false,
    invoiceData = null,
    isInvoiceLoaded = false,
    salesReturns = [],
    returnsLoading = false,
    returnsError = null
  } = invoiceReturnState;

  const [invoiceInput, setInvoiceInput] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [showReturnsList, setShowReturnsList] = useState(false);
  const barcodeInputRef = useRef(null);

  // Load sales returns on component mount
  useEffect(() => {
    dispatch(loadSalesReturns());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error || returnsError) {
      showAlertMessage(error || returnsError, 'error');
      dispatch(clearInvoiceReturnErrors());
    }
  }, [error, returnsError, dispatch]);

  // Handle print success
  useEffect(() => {
    if (printSuccess) {
      showAlertMessage('Invoice printed successfully!', 'success');
    }
  }, [printSuccess]);

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleLoadInvoice = async () => {
    if (!invoiceInput.trim()) {
      showAlertMessage('Please enter invoice number (INNO)', 'error');
      return;
    }

    try {
      await dispatch(fetchInvoiceDetails(invoiceInput));
      showAlertMessage(`Invoice ${invoiceInput} loaded successfully!`, 'success');
    } catch (error) {
      showAlertMessage('Failed to load invoice', 'error');
    }
  };

  const handlePrintInvoice = async () => {
    if (!invoiceData) {
      showAlertMessage('No invoice data available to print', 'error');
      return;
    }

    try {
      await dispatch(printInvoiceForReturn(invoiceData));
      setIsPrintModalOpen(false);
    } catch (error) {
      showAlertMessage('Print failed', 'error');
    }
  };

  const handleReset = () => {
    setInvoiceInput('');
    dispatch(resetInvoiceReturn());
    barcodeInputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLoadInvoice();
    }
  };

  const handleLoadFromReturns = (returnItem) => {
    const invoiceNumber = returnItem.INNO || returnItem.INVOICENO;
    setInvoiceInput(invoiceNumber);
    
    // Auto-load the invoice
    setTimeout(() => {
      handleLoadInvoice();
    }, 100);
    
    setShowReturnsList(false);
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
      default: return <FiAlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '0.00';
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Calculate invoice totals
  const calculateInvoiceTotals = () => {
    if (!invoiceData?.items || !Array.isArray(invoiceData.items)) {
      return { subtotal: 0, tax: 0, discount: 0, total: 0 };
    }

    const subtotal = invoiceData.items.reduce((sum, item) => 
      sum + (parseFloat(item.SALESVALUE) || 0), 0);
    
    const tax = parseFloat(invoiceData.header?.TAX) || 0;
    const discount = parseFloat(invoiceData.header?.DISCOUNT) || 0;
    const total = subtotal - discount + tax;
    
    return { subtotal, tax, discount, total };
  };

  const totals = calculateInvoiceTotals();

  // Get invoice header data
  const getInvoiceHeader = () => {
    if (!invoiceData?.header) return {};
    
    const header = invoiceData.header;
    const firstItem = invoiceData.items?.[0];
    
    return {
      invoiceNumber: invoiceData.invoiceNumber,
      invoiceDate: header.INDATE || firstItem?.INDATE || new Date().toISOString(),
      customerName: header.CUSNAME || firstItem?.CUSNAME || 'Walk-in Customer',
      customerId: header.CUSID || firstItem?.CUSID || '',
      warehouse: header.WHCODE || firstItem?.WHCODE || 'A01',
      cashierName: header.CAHIERNAME || firstItem?.CAHIERNAME || 'Admin',
      invoicedOn: header.INNOVICED_ON || firstItem?.INNOVICED_ON || new Date().toISOString(),
      paymentMethod: invoiceData.payment?.PAYMENT_METHOD || 'Cash',
      paidAmount: parseFloat(invoiceData.payment?.PAID_AMOUNT) || totals.total,
      changeAmount: parseFloat(invoiceData.payment?.CHANGE_AMOUNT) || 0
    };
  };

  const invoiceHeader = getInvoiceHeader();

  return (
    <div className={`flex flex-col p-4 md:p-6 rounded-xl shadow-md min-h-screen ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
      
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

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', link: '/' },
          { label: 'Sales', link: '/sales' },
          { label: 'Invoice Return', link: '#' }
        ]}
        current="Invoice Return"
      />

      {/* Header */}
      <div className="mt-2 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FiFileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Invoice Return & Reprint
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Load invoice details and print invoice copies
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReturnsList(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              disabled={returnsLoading}
            >
              {returnsLoading ? (
                <FiRefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FiList className="w-4 h-4" />
              )}
              <span>Returns ({salesReturns.length})</span>
            </button>
            {isInvoiceLoaded && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
                New Invoice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sales Returns List Modal */}
      {showReturnsList && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className={`rounded-xl shadow-xl w-full max-w-6xl max-h-[80vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiList className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold">Sales Returns List</h2>
                  <span className="text-sm text-gray-500">({salesReturns.length} records)</span>
                </div>
                <button
                  onClick={() => setShowReturnsList(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              {returnsLoading ? (
                <div className="flex justify-center py-8">
                  <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2">Loading returns...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <tr>
                        <th className="px-4 py-2 text-left">Invoice No</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Items</th>
                        <th className="px-4 py-2 text-left">Cashier</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {salesReturns.length > 0 ? (
                        salesReturns.map((item, index) => (
                          <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${index % 2 === 0 ? (darkMode ? 'bg-gray-800/50' : 'bg-gray-50') : ''}`}>
                            <td className="px-4 py-2 font-medium">{item.INNO || item.INVOICENO || 'N/A'}</td>
                            <td className="px-4 py-2">{item.CUSTOMERNAME || item.CUSNAME || 'Walk-in'}</td>
                            <td className="px-4 py-2">{formatDate(item.INDATE || item.INVDATE)}</td>
                            <td className="px-4 py-2 font-semibold">${formatCurrency(item.TOTALAMOUNT)}</td>
                            <td className="px-4 py-2">{item.ITEM_COUNT || '1'}</td>
                            <td className="px-4 py-2">{item.CASHIER || item.CAHIERNAME || 'Admin'}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleLoadFromReturns(item)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center gap-1"
                              >
                                <FiSearch className="w-3 h-3" />
                                Load
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                            No sales returns found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Similar to Invoice Modal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Scan Section */}
        <div className={`lg:col-span-1 rounded-xl p-5 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
            <FiSearch className="text-blue-500" />
            Load Invoice
          </h2>

          {/* Input Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Enter Invoice Number (INNO)
            </label>
            <input
              ref={barcodeInputRef}
              type="text"
              value={invoiceInput}
              onChange={(e) => setInvoiceInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter invoice number (e.g., 13)"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter the invoice number to load details
            </p>
          </div>

          {/* Quick Stats */}
          <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-gray-600/50' : 'bg-blue-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium dark:text-gray-300">Available Returns:</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {returnsLoading ? 'Loading...' : salesReturns.length}
              </span>
            </div>
            <button
              onClick={() => setShowReturnsList(true)}
              className="w-full mt-2 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center gap-2"
              disabled={returnsLoading}
            >
              {returnsLoading ? (
                <FiRefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <FiList className="w-3 h-3" />
              )}
              Browse Returns List
            </button>
          </div>

          {/* Load Button */}
          <button
            onClick={handleLoadInvoice}
            disabled={loading || !invoiceInput.trim()}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } text-white`}
          >
            {loading ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <FiSearch className="w-4 h-4" />
                Load Invoice
              </>
            )}
          </button>

          {/* Instructions */}
          <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-600/30' : 'bg-gray-100'}`}>
            <p className="font-medium mb-1 dark:text-gray-300">Instructions:</p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Enter invoice number (INNO)</li>
              <li>• Press Enter or click Load</li>
              <li>• Preview invoice on the right</li>
              <li>• Click Print to reprint</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Invoice Preview (3 columns wide) */}
        <div className="lg:col-span-3">
          {!isInvoiceLoaded ? (
            // Empty State
            <div className={`h-full flex flex-col items-center justify-center rounded-xl p-8 ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FiFileText className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Invoice Preview</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Enter an invoice number to view complete details
                </p>
                <div className="text-sm text-gray-400 dark:text-gray-500 space-y-1">
                  <p>• Enter invoice number in the left panel</p>
                  <p>• Browse from returns list if needed</p>
                  <p>• Complete invoice details will appear here</p>
                  <p>• Print option available after loading</p>
                </div>
              </div>
            </div>
          ) : (
            // Invoice Preview - Like Invoice Modal
            <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              {/* Invoice Header - Like Receipt Header */}
              <div className={`p-5 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold dark:text-white">INVOICE COPY</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">For Return/Reprint Purpose</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FiShoppingBag className="text-blue-500" />
                      <span className="font-semibold dark:text-white">Invoice #</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{invoiceHeader.invoiceNumber}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FiCalendar className="text-green-500" />
                      <span className="font-semibold dark:text-white">Date</span>
                    </div>
                    <p className="dark:text-white">{formatDateTime(invoiceHeader.invoiceDate)}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FiUser className="text-purple-500" />
                      <span className="font-semibold dark:text-white">Customer</span>
                    </div>
                    <p className="dark:text-white">{invoiceHeader.customerName}</p>
                    {invoiceHeader.customerId && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {invoiceHeader.customerId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Body */}
              <div className="p-5">
                {/* Store & Cashier Info */}
                <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-600/30' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiHome className="text-blue-500" />
                        <h3 className="font-semibold dark:text-white">Store Information</h3>
                      </div>
                      <div className="text-sm dark:text-gray-300">
                        <p><span className="font-medium">Warehouse:</span> {invoiceHeader.warehouse}</p>
                        <p><span className="font-medium">Invoiced On:</span> {formatDate(invoiceHeader.invoicedOn)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiCreditCard className="text-green-500" />
                        <h3 className="font-semibold dark:text-white">Payment Information</h3>
                      </div>
                      <div className="text-sm dark:text-gray-300">
                        <p><span className="font-medium">Method:</span> {invoiceHeader.paymentMethod}</p>
                        <p><span className="font-medium">Cashier:</span> {invoiceHeader.cashierName}</p>
                        <p><span className="font-medium">Paid:</span> ${formatCurrency(invoiceHeader.paidAmount)}</p>
                        {invoiceHeader.changeAmount > 0 && (
                          <p><span className="font-medium">Change:</span> ${formatCurrency(invoiceHeader.changeAmount)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table - Like Receipt Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
                    <FiPackage className="text-blue-500" />
                    Items Purchased ({invoiceData?.items?.length || 0})
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        <tr>
                          <th className="px-4 py-3 text-left dark:text-gray-200">#</th>
                          <th className="px-4 py-3 text-left dark:text-gray-200">Product Description</th>
                          <th className="px-4 py-3 text-center dark:text-gray-200">SKU</th>
                          <th className="px-4 py-3 text-center dark:text-gray-200">Batch</th>
                          <th className="px-4 py-3 text-center dark:text-gray-200">Qty</th>
                          <th className="px-4 py-3 text-right dark:text-gray-200">Unit Price</th>
                          <th className="px-4 py-3 text-right dark:text-gray-200">MRP</th>
                          <th className="px-4 py-3 text-right dark:text-gray-200">Amount</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                        {invoiceData?.items?.map((item, index) => (
                          <tr key={index} className={darkMode ? 'hover:bg-gray-600/50' : 'hover:bg-gray-50'}>
                            <td className="px-4 py-3 dark:text-white">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium dark:text-white">{item.PRDESC}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Code: {item.PRCODE}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center dark:text-white">
                              <code className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                {item.SKU}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-center dark:text-white">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                                {item.BATCHID}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center dark:text-white font-semibold">
                              {item.SOLDQTY}
                            </td>
                            <td className="px-4 py-3 text-right dark:text-white">
                              ${formatCurrency(item.UNITPRICE)}
                            </td>
                            <td className="px-4 py-3 text-right dark:text-white">
                              ${formatCurrency(item.MRP)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold dark:text-white">
                              ${formatCurrency(item.SALESVALUE)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals Section - Like Receipt Footer */}
                <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-600/30' : 'bg-gray-100'}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="dark:text-white">Subtotal:</span>
                      <span className="dark:text-white">${formatCurrency(totals.subtotal)}</span>
                    </div>
                    
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-red-600 dark:text-red-400">
                        <span>Discount:</span>
                        <span>-${formatCurrency(totals.discount)}</span>
                      </div>
                    )}
                    
                    {totals.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="dark:text-white">Tax:</span>
                        <span className="dark:text-white">${formatCurrency(totals.tax)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                      <span className="text-lg font-bold dark:text-white">TOTAL:</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${formatCurrency(totals.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profit Summary */}
                {invoiceData?.items?.some(item => parseFloat(item.PROFIT_PER_UNIT) > 0) && (
                  <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'} border`}>
                    <h3 className="font-semibold mb-2 dark:text-white flex items-center gap-2">
                      <FiDollarSign className="text-green-500" />
                      Profit Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {invoiceData.items
                        .filter(item => parseFloat(item.PROFIT_PER_UNIT) > 0)
                        .map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium dark:text-white">{item.PRDESC}</div>
                            <div className="text-gray-600 dark:text-gray-400">
                              Profit: ${formatCurrency(item.PROFIT_PER_UNIT)}/unit
                            </div>
                            <div className="text-green-600 dark:text-green-400 font-semibold">
                              Total: ${formatCurrency(item.TOTAL_PROFIT)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Barcode Section */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
                    <FiTag className="text-blue-500" />
                    Invoice Barcode
                  </h3>
                  <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-600">
                    <Barcode
                      value={invoiceHeader.invoiceNumber?.toString() || 'INVOICE'}
                      format="CODE128"
                      width={2}
                      height={50}
                      displayValue={true}
                      background={darkMode ? "#1F2937" : "#FFFFFF"}
                      lineColor={darkMode ? "#FFFFFF" : "#000000"}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Scan this barcode for quick invoice lookup
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleReset}
                    className={`px-5 py-2 rounded-lg font-medium ${darkMode
                        ? 'bg-gray-600 hover:bg-gray-700 text-gray-200'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      } transition-colors flex items-center gap-2`}
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Load Another
                  </button>
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    disabled={printLoading}
                    className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {printLoading ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        Printing...
                      </>
                    ) : (
                      <>
                        <FiPrinter className="w-4 h-4" />
                        Print Invoice
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Confirmation Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className={`rounded-xl shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiPrinter className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold dark:text-white">Print Invoice</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Invoice #{invoiceHeader.invoiceNumber}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg mb-5 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <p className="mb-2 dark:text-gray-300">Print this invoice for customer copy or return purposes?</p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Invoice Number:</span>
                    <span className="font-semibold">{invoiceHeader.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold text-green-600">${formatCurrency(totals.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{invoiceHeader.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{formatDate(invoiceHeader.invoiceDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{invoiceData?.items?.length || 0} products</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium ${darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrintInvoice}
                  disabled={printLoading}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {printLoading ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Printing...
                    </>
                  ) : (
                    <>
                      <FiPrinter className="w-4 h-4" />
                      Confirm Print
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceReturn;