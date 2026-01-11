import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TotalPur = () => {
  const [purchases, setPurchases] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, THIS_MONTH, LAST_MONTH, THIS_QUARTER, THIS_YEAR
  const [selectedSupplier, setSelectedSupplier] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useSelector(state => state.ui);

  // Mock data for purchase orders
  const mockPurchaseData = [
    {
      id: 1,
      purchaseOrder: 'PO-2024-001',
      supplier: 'Premium Spirits Ltd',
      category: 'WHISKY',
      productName: 'Johnnie Walker Black Label',
      quantity: 50,
      unitCost: 1850,
      totalCost: 92500,
      purchaseDate: '2024-11-15',
      deliveryDate: '2024-11-20',
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      invoiceNo: 'INV-001',
      taxAmount: 16650,
      grandTotal: 109150
    },
    {
      id: 2,
      purchaseOrder: 'PO-2024-002',
      supplier: 'Vodka Imports',
      category: 'VODKA',
      productName: 'Smirnoff Red Vodka',
      quantity: 100,
      unitCost: 850,
      totalCost: 85000,
      purchaseDate: '2024-11-10',
      deliveryDate: '2024-11-15',
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      invoiceNo: 'INV-002',
      taxAmount: 15300,
      grandTotal: 100300
    },
    {
      id: 3,
      purchaseOrder: 'PO-2024-003',
      supplier: 'Caribbean Spirits',
      category: 'RUM',
      productName: 'Bacardi White Rum',
      quantity: 80,
      unitCost: 720,
      totalCost: 57600,
      purchaseDate: '2024-11-05',
      deliveryDate: '2024-11-12',
      status: 'DELIVERED',
      paymentStatus: 'PENDING',
      invoiceNo: 'INV-003',
      taxAmount: 10368,
      grandTotal: 67968
    },
    {
      id: 4,
      purchaseOrder: 'PO-2024-004',
      supplier: 'American Whisky Co',
      category: 'WHISKY',
      productName: 'Jack Daniels Tennessee',
      quantity: 40,
      unitCost: 2100,
      totalCost: 84000,
      purchaseDate: '2024-10-28',
      deliveryDate: '2024-11-10',
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      invoiceNo: 'INV-004',
      taxAmount: 15120,
      grandTotal: 99120
    },
    {
      id: 5,
      purchaseOrder: 'PO-2024-005',
      supplier: 'Swedish Imports',
      category: 'VODKA',
      productName: 'Absolut Vodka',
      quantity: 60,
      unitCost: 1200,
      totalCost: 72000,
      purchaseDate: '2024-10-20',
      deliveryDate: '2024-10-27',
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      invoiceNo: 'INV-005',
      taxAmount: 12960,
      grandTotal: 84960
    },
    {
      id: 6,
      purchaseOrder: 'PO-2024-006',
      supplier: 'Gin Specialists',
      category: 'GIN',
      productName: 'Bombay Sapphire Gin',
      quantity: 45,
      unitCost: 1350,
      totalCost: 60750,
      purchaseDate: '2024-10-15',
      deliveryDate: '2024-10-22',
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      invoiceNo: 'INV-006',
      taxAmount: 10935,
      grandTotal: 71685
    },
    {
      id: 7,
      purchaseOrder: 'PO-2024-007',
      supplier: 'Beverage Distributors',
      category: 'BEER',
      productName: 'Heineken Beer (Case)',
      quantity: 30,
      unitCost: 1800,
      totalCost: 54000,
      purchaseDate: '2024-10-10',
      deliveryDate: '2024-10-13',
      status: 'DELIVERED',
      paymentStatus: 'PENDING',
      invoiceNo: 'INV-007',
      taxAmount: 9720,
      grandTotal: 63720
    },
    {
      id: 8,
      purchaseOrder: 'PO-2024-008',
      supplier: 'Wine Merchants',
      category: 'WINE',
      productName: 'Jacob\'s Creek Shiraz',
      quantity: 70,
      unitCost: 650,
      totalCost: 45500,
      purchaseDate: '2024-10-05',
      deliveryDate: '2024-10-12',
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      invoiceNo: 'INV-008',
      taxAmount: 8190,
      grandTotal: 53690
    },
    {
      id: 9,
      purchaseOrder: 'PO-2024-009',
      supplier: 'Premium Spirits Ltd',
      category: 'BRANDY',
      productName: 'Hennessy VS',
      quantity: 25,
      unitCost: 2800,
      totalCost: 70000,
      purchaseDate: '2024-11-18',
      deliveryDate: '2024-11-25',
      status: 'IN_TRANSIT',
      paymentStatus: 'PENDING',
      invoiceNo: 'INV-009',
      taxAmount: 12600,
      grandTotal: 82600
    },
    {
      id: 10,
      purchaseOrder: 'PO-2024-010',
      supplier: 'Caribbean Spirits',
      category: 'RUM',
      productName: 'Captain Morgan Spiced Rum',
      quantity: 55,
      unitCost: 680,
      totalCost: 37400,
      purchaseDate: '2024-11-20',
      deliveryDate: '2024-11-27',
      status: 'ORDERED',
      paymentStatus: 'PENDING',
      invoiceNo: 'INV-010',
      taxAmount: 6732,
      grandTotal: 44132
    }
  ];

  const suppliers = ['ALL', 'Premium Spirits Ltd', 'Vodka Imports', 'Caribbean Spirits', 'American Whisky Co', 'Swedish Imports', 'Gin Specialists', 'Beverage Distributors', 'Wine Merchants'];
  const categories = ['ALL', 'WHISKY', 'VODKA', 'RUM', 'GIN', 'BEER', 'WINE', 'BRANDY'];
  const statusOptions = ['ALL', 'ORDERED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
  const paymentStatusOptions = ['ALL', 'PAID', 'PENDING', 'OVERDUE'];

  useEffect(() => {
    // Simulate API call
    setPurchases(mockPurchaseData);
  }, []);

  const filteredPurchases = purchases.filter(purchase => {
    const matchesFilter = filter === 'ALL' || getDateFilter(purchase.purchaseDate, filter);
    const matchesSupplier = selectedSupplier === 'ALL' || purchase.supplier === selectedSupplier;
    const matchesCategory = selectedCategory === 'ALL' || purchase.category === selectedCategory;
    const matchesDateRange = (!dateRange.start || purchase.purchaseDate >= dateRange.start) && 
                            (!dateRange.end || purchase.purchaseDate <= dateRange.end);
    const matchesSearch = purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.purchaseOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSupplier && matchesCategory && matchesDateRange && matchesSearch;
  });

  const getDateFilter = (purchaseDate, filterType) => {
    const date = new Date(purchaseDate);
    const now = new Date();
    
    switch (filterType) {
      case 'THIS_MONTH':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'LAST_MONTH':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
      case 'THIS_QUARTER':
        const quarter = Math.floor(now.getMonth() / 3);
        return date.getMonth() >= quarter * 3 && date.getMonth() < (quarter + 1) * 3 && date.getFullYear() === now.getFullYear();
      case 'THIS_YEAR':
        return date.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ORDERED: { color: 'bg-blue-500', text: 'Ordered', icon: 'fa-shopping-cart' },
      IN_TRANSIT: { color: 'bg-yellow-500', text: 'In Transit', icon: 'fa-truck' },
      DELIVERED: { color: 'bg-green-500', text: 'Delivered', icon: 'fa-check-circle' },
      CANCELLED: { color: 'bg-red-500', text: 'Cancelled', icon: 'fa-times-circle' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        <i className={`fas ${config.icon} mr-1`}></i>
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PAID: { color: 'bg-green-500', text: 'Paid', icon: 'fa-check' },
      PENDING: { color: 'bg-yellow-500', text: 'Pending', icon: 'fa-clock' },
      OVERDUE: { color: 'bg-red-500', text: 'Overdue', icon: 'fa-exclamation-triangle' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        <i className={`fas ${config.icon} mr-1`}></i>
        {config.text}
      </span>
    );
  };

  const calculateTotals = () => {
    return filteredPurchases.reduce((acc, purchase) => {
      acc.totalQuantity += purchase.quantity;
      acc.totalCost += purchase.totalCost;
      acc.totalTax += purchase.taxAmount;
      acc.grandTotal += purchase.grandTotal;
      return acc;
    }, { totalQuantity: 0, totalCost: 0, totalTax: 0, grandTotal: 0 });
  };

  const handleGenerateReport = () => {
    const totals = calculateTotals();
    const reportData = {
      period: filter,
      totalPurchases: filteredPurchases.length,
      ...totals,
      generatedAt: new Date().toLocaleString()
    };
    
    alert(`Purchase Report Generated!\nTotal Purchases: ${reportData.totalPurchases}\nGrand Total: Rs.${reportData.grandTotal.toLocaleString()}`);
    console.log('Purchase Report:', reportData);
  };

  const handleExportExcel = () => {
    alert('Exporting purchase data to Excel...');
    // Implement Excel export logic here
  };

  const handleViewInvoice = (purchase) => {
    alert(`Viewing Invoice: ${purchase.invoiceNo}\nSupplier: ${purchase.supplier}\nAmount: Rs.${purchase.grandTotal.toLocaleString()}`);
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full overflow-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Total Purchasing Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and analyze all purchase orders</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button 
            onClick={handleGenerateReport}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-chart-bar mr-2"></i>
            Generate Report
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-file-excel mr-2"></i>
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Total Purchases</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                {filteredPurchases.length}
              </p>
            </div>
            <i className="fas fa-shopping-cart text-blue-500 text-xl"></i>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Total Quantity</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                {totals.totalQuantity}
              </p>
            </div>
            <i className="fas fa-boxes text-green-500 text-xl"></i>
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Total Cost</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
               Rs.{totals.totalCost.toLocaleString()}
              </p>
            </div>
            <i className="fas fa-rupee-sign text-purple-500 text-xl"></i>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">Grand Total</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
                Rs.{totals.grandTotal.toLocaleString()}
              </p>
            </div>
            <i className="fas fa-receipt text-orange-500 text-xl"></i>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Time Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Period
            </label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              <option value="ALL">All Time</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="LAST_MONTH">Last Month</option>
              <option value="THIS_QUARTER">This Quarter</option>
              <option value="THIS_YEAR">This Year</option>
            </select>
          </div>

          {/* Supplier Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supplier
            </label>
            <select 
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search PO, product, invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setDateRange({ start: '', end: '' })}
              className="w-full p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear Dates
            </button>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Purchase Orders ({filteredPurchases.length} records)
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Grand Total: <span className="font-bold text-green-600 dark:text-green-400">Rs.{totals.grandTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Purchase Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity & Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {purchase.purchaseOrder}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {purchase.supplier}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        Inv: {purchase.invoiceNo}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {purchase.productName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {purchase.category}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div>Qty: <span className="font-semibold">{purchase.quantity}</span></div>
                      <div>Unit: <span className="font-semibold">Rs.{purchase.unitCost.toLocaleString()}</span></div>
                      <div>Total: <span className="font-semibold text-green-600 dark:text-green-400">Rs.{purchase.totalCost.toLocaleString()}</span></div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div>Order: {new Date(purchase.purchaseDate).toLocaleDateString()}</div>
                      <div>Delivery: {new Date(purchase.deliveryDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(purchase.status)}
                      {getPaymentStatusBadge(purchase.paymentStatus)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewInvoice(purchase)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Invoice"
                      >
                        <i className="fas fa-file-invoice"></i>
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Download PDF"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button 
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPurchases.length === 0 && (
          <div className="text-center py-8">
            <i className="fas fa-shopping-cart text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
            <p className="text-gray-500 dark:text-gray-400">No purchase records found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category-wise Summary */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Purchase by Category</h3>
          <div className="space-y-3">
            {categories.filter(cat => cat !== 'ALL').map(category => {
              const categoryPurchases = filteredPurchases.filter(p => p.category === category);
              const categoryTotal = categoryPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
              const percentage = totals.grandTotal > 0 ? (categoryTotal / totals.grandTotal * 100) : 0;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right">
                      Rs.{categoryTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Supplier-wise Summary */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Suppliers</h3>
          <div className="space-y-3">
            {suppliers.filter(sup => sup !== 'ALL').slice(0, 5).map(supplier => {
              const supplierPurchases = filteredPurchases.filter(p => p.supplier === supplier);
              const supplierTotal = supplierPurchases.reduce((sum, p) => sum + p.grandTotal, 0);
              
              return (
                <div key={supplier} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">{supplier}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                    Rs.{supplierTotal.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalPur;