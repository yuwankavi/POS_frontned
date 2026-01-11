import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const InvoiceReturn = () => {
  const { darkMode } = useSelector(state => state.ui);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockInvoices = [
        { 
          id: 1, 
          invoiceNo: 'INV-2024-001', 
          date: '2024-01-15', 
          customer: 'John Doe', 
          customerId: 'CUST001',
          total: 150.00, 
          status: 'Pending',
          items: [
            { id: 1, product: 'Product A', quantity: 2, price: 25.00, returnQty: 0 },
            { id: 2, product: 'Product B', quantity: 1, price: 30.00, returnQty: 0 },
          ]
        },
        { 
          id: 2, 
          invoiceNo: 'INV-2024-002', 
          date: '2024-01-16', 
          customer: 'Jane Smith', 
          customerId: 'CUST002',
          total: 230.50, 
          status: 'Completed',
          items: [
            { id: 1, product: 'Product C', quantity: 3, price: 45.00, returnQty: 0 },
            { id: 2, product: 'Product D', quantity: 2, price: 22.75, returnQty: 0 },
          ]
        },
        { 
          id: 3, 
          invoiceNo: 'INV-2024-003', 
          date: '2024-01-17', 
          customer: 'Bob Johnson', 
          customerId: 'CUST003',
          total: 89.99, 
          status: 'Pending',
          items: [
            { id: 1, product: 'Product E', quantity: 1, price: 45.00, returnQty: 0 },
            { id: 2, product: 'Product F', quantity: 2, price: 22.50, returnQty: 0 },
          ]
        },
        { 
          id: 4, 
          invoiceNo: 'INV-2024-004', 
          date: '2024-01-18', 
          customer: 'Alice Brown', 
          customerId: 'CUST004',
          total: 420.75, 
          status: 'Completed',
          items: [
            { id: 1, product: 'Product G', quantity: 5, price: 65.00, returnQty: 0 },
            { id: 2, product: 'Product H', quantity: 3, price: 28.58, returnQty: 0 },
          ]
        },
      ];
      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    // Initialize return quantities as 0
    const itemsWithReturnQty = invoice.items.map(item => ({
      ...item,
      returnQty: 0,
      reason: ''
    }));
    setReturnItems(itemsWithReturnQty);
    setReason('');
  };

  const handleReturnQtyChange = (itemId, value) => {
    setReturnItems(prev => prev.map(item => 
      item.id === itemId ? { 
        ...item, 
        returnQty: Math.min(Math.max(0, parseInt(value) || 0), item.quantity) 
      } : item
    ));
  };

  const handleItemReasonChange = (itemId, value) => {
    setReturnItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, reason: value } : item
    ));
  };

  const handleReturnSubmit = () => {
    const itemsToReturn = returnItems.filter(item => item.returnQty > 0);
    
    if (itemsToReturn.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    if (!reason.trim()) {
      alert('Please enter a reason for the return');
      return;
    }

    const totalReturnAmount = returnItems.reduce((sum, item) => sum + (item.returnQty * item.price), 0);
    
    // Here you would typically make an API call to process the return
    console.log('Processing return:', {
      invoiceId: selectedInvoice.id,
      invoiceNo: selectedInvoice.invoiceNo,
      returnItems: itemsToReturn,
      reason: reason,
      totalReturnAmount: totalReturnAmount
    });

    // Show success message
    alert(`Return processed successfully!\n\nInvoice: ${selectedInvoice.invoiceNo}\nTotal Return Amount: $${totalReturnAmount.toFixed(2)}\nReturn ID: RTN-${Date.now()}`);
    
    // Reset form
    setSelectedInvoice(null);
    setReturnItems([]);
    setReason('');
  };

  const calculateTotalReturn = () => {
    return returnItems.reduce((sum, item) => sum + (item.returnQty * item.price), 0);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return matchesSearch && matchesStatus && invoice.date === today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && matchesStatus && new Date(invoice.date) >= weekAgo;
    }
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className={darkMode ? 'text-white' : 'text-gray-700'}>Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <i className="fas fa-undo mr-3 text-red-500"></i>
                Invoice Returns Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Process returns for previously issued invoices
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button className={`px-4 py-2 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}>
                <i className="fas fa-history mr-2"></i>
                Return History
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center">
                <i className="fas fa-print mr-2"></i>
                Print
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Invoices</p>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                </div>
                <i className="fas fa-file-invoice text-2xl text-blue-500"></i>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Returns</p>
                  <p className="text-2xl font-bold">{invoices.filter(i => i.status === 'Pending').length}</p>
                </div>
                <i className="fas fa-clock text-2xl text-yellow-500"></i>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completed Returns</p>
                  <p className="text-2xl font-bold">{invoices.filter(i => i.status === 'Completed').length}</p>
                </div>
                <i className="fas fa-check-circle text-2xl text-green-500"></i>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold">${invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}</p>
                </div>
                <i className="fas fa-dollar-sign text-2xl text-green-500"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Invoice List */}
          <div className={`lg:col-span-1 rounded-xl shadow-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-file-invoice mr-2"></i>
                Available Invoices
              </h2>
              
              {/* Filters */}
              <div className="space-y-3 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search invoices or customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className={`p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Invoice List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-search text-3xl text-gray-400 mb-3"></i>
                  <p className="text-gray-500 dark:text-gray-400">No invoices found</p>
                </div>
              ) : (
                filteredInvoices.map(invoice => (
                  <div
                    key={invoice.id}
                    onClick={() => handleInvoiceSelect(invoice)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedInvoice?.id === invoice.id
                        ? darkMode 
                          ? 'bg-red-900 border-2 border-red-700' 
                          : 'bg-red-50 border-2 border-red-300'
                        : darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{invoice.invoiceNo}</h3>
                        <p className="text-sm opacity-75">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${invoice.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          invoice.status === 'Completed'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-black'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm">
                        <i className="fas fa-user mr-1"></i>
                        {invoice.customer}
                      </p>
                      <p className="text-xs opacity-75">
                        {invoice.items.length} items
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Return Form */}
          <div className={`lg:col-span-2 rounded-xl shadow-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {selectedInvoice ? (
              <>
                {/* Invoice Header */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        Process Return for: <span className="text-red-500">{selectedInvoice.invoiceNo}</span>
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Customer: {selectedInvoice.customer} • Date: {selectedInvoice.date}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedInvoice(null);
                        setReturnItems([]);
                        setReason('');
                      }}
                      className={`mt-2 md:mt-0 px-3 py-1 rounded-lg flex items-center ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <i className="fas fa-times mr-1"></i>
                      Clear Selection
                    </button>
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Total</p>
                      <p className="text-xl font-bold">${selectedInvoice.total.toFixed(2)}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID</p>
                      <p className="text-lg font-semibold">{selectedInvoice.customerId}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className={`text-lg font-semibold ${
                        selectedInvoice.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'
                      }`}>
                        {selectedInvoice.status}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Items Count</p>
                      <p className="text-xl font-bold">{selectedInvoice.items.length}</p>
                    </div>
                  </div>
                </div>

                {/* Return Items Table */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <i className="fas fa-boxes mr-2"></i>
                    Select Items to Return
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                          <th className="text-left p-3 font-medium">Product</th>
                          <th className="text-left p-3 font-medium">Original Qty</th>
                          <th className="text-left p-3 font-medium">Price</th>
                          <th className="text-left p-3 font-medium">Return Qty</th>
                          <th className="text-left p-3 font-medium">Return Amount</th>
                          <th className="text-left p-3 font-medium">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnItems.map(item => {
                          const returnAmount = item.returnQty * item.price;
                          return (
                            <tr key={item.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                              <td className="p-3">
                                <div className="font-medium">{item.product}</div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="p-3 font-semibold">${item.price.toFixed(2)}</td>
                              <td className="p-3">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.quantity}
                                    value={item.returnQty}
                                    onChange={(e) => handleReturnQtyChange(item.id, e.target.value)}
                                    className={`w-20 p-2 rounded border ${
                                      darkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                        : 'bg-gray-100 border-gray-300 text-gray-900'
                                    }`}
                                  />
                                  <span className="text-xs text-gray-500">
                                    Max: {item.quantity}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className={`font-bold ${
                                  returnAmount > 0 ? 'text-red-500' : 'text-gray-500'
                                }`}>
                                  ${returnAmount.toFixed(2)}
                                </div>
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={item.reason}
                                  onChange={(e) => handleItemReasonChange(item.id, e.target.value)}
                                  placeholder="Item reason..."
                                  className={`w-full p-2 rounded border text-sm ${
                                    darkMode 
                                      ? 'bg-gray-700 border-gray-600 text-white' 
                                      : 'bg-gray-100 border-gray-300 text-gray-900'
                                  }`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Return Reason */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <i className="fas fa-comment-alt mr-2"></i>
                    General Return Reason (Required)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="3"
                    placeholder="Enter the main reason for this return..."
                    className={`w-full p-3 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 focus:border-red-500 text-white' 
                        : 'bg-gray-100 border-gray-300 focus:border-red-400 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors`}
                  />
                </div>

                {/* Summary and Actions */}
                <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Return Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${calculateTotalReturn().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total Return:</span>
                          <span className="text-red-500">${calculateTotalReturn().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Return Details</h4>
                      <div className="space-y-1 text-sm">
                        <p>Items to Return: {returnItems.filter(item => item.returnQty > 0).length}</p>
                        <p>Invoice: {selectedInvoice.invoiceNo}</p>
                        <p>Customer: {selectedInvoice.customer}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-3">
                    <button
                      onClick={() => {
                        setSelectedInvoice(null);
                        setReturnItems([]);
                        setReason('');
                      }}
                      className={`px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center ${
                        darkMode 
                          ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                      }`}
                    >
                      <i className="fas fa-times mr-2"></i>
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Save as draft functionality
                        alert('Return saved as draft');
                      }}
                      className={`px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <i className="fas fa-save mr-2"></i>
                      Save as Draft
                    </button>
                    <button
                      onClick={handleReturnSubmit}
                      disabled={!returnItems.some(item => item.returnQty > 0) || !reason.trim()}
                      className={`px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center ${
                        returnItems.some(item => item.returnQty > 0) && reason.trim()
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gray-400 cursor-not-allowed text-gray-600'
                      }`}
                    >
                      <i className="fas fa-check-circle mr-2"></i>
                      Process Return
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-file-invoice text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <h3 className="text-xl font-medium mb-2">No Invoice Selected</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Select an invoice from the list on the left to begin processing a return.
                </p>
                <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  <i className="fas fa-info-circle mr-2"></i>
                  <span>Tip: Click on any invoice to view and process returns</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${darkMode ? 'rgba(156, 163, 175, 0.6)' : 'rgba(156, 163, 175, 0.6)'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${darkMode ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 0.8)'};
          }
        `}
      </style>
    </div>
  );
};

export default InvoiceReturn;