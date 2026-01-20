import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  FiShoppingCart, 
  FiTruck, 
  FiPackage, 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiArrowRight,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiHash,
  FiBox,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi';

const PurchaseOrder = () => {
  const { darkMode } = useSelector((state) => state.ui);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dummy purchase orders data
  const dummyPurchaseOrders = [
    { 
      id: 'PO-2026-001', 
      supplier: 'ABC Distributors', 
      items: 5, 
      totalAmount: 25000.00, 
      orderDate: '2026-01-18', 
      expectedDate: '2026-01-22',
      status: 'Pending',
      createdBy: 'Admin'
    },
    { 
      id: 'PO-2026-002', 
      supplier: 'XYZ Suppliers', 
      items: 12, 
      totalAmount: 48500.00, 
      orderDate: '2026-01-15', 
      expectedDate: '2026-01-20',
      status: 'Received',
      createdBy: 'Manager'
    },
    { 
      id: 'PO-2026-003', 
      supplier: 'Global Trading Co.', 
      items: 3, 
      totalAmount: 12000.00, 
      orderDate: '2026-01-10', 
      expectedDate: '2026-01-15',
      status: 'Cancelled',
      createdBy: 'Admin'
    },
    { 
      id: 'PO-2026-004', 
      supplier: 'Metro Wholesalers', 
      items: 8, 
      totalAmount: 35750.00, 
      orderDate: '2026-01-19', 
      expectedDate: '2026-01-25',
      status: 'Pending',
      createdBy: 'Admin'
    },
    { 
      id: 'PO-2026-005', 
      supplier: 'City Supplies Ltd.', 
      items: 15, 
      totalAmount: 62000.00, 
      orderDate: '2026-01-12', 
      expectedDate: '2026-01-18',
      status: 'Received',
      createdBy: 'Manager'
    },
  ];

  // Filter purchase orders
  const filteredOrders = dummyPurchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: dummyPurchaseOrders.length,
    pending: dummyPurchaseOrders.filter(o => o.status === 'Pending').length,
    received: dummyPurchaseOrders.filter(o => o.status === 'Received').length,
    cancelled: dummyPurchaseOrders.filter(o => o.status === 'Cancelled').length,
    totalValue: dummyPurchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Received': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock className="w-4 h-4" />;
      case 'Received': return <FiCheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <FiXCircle className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  // PO Flow Steps
  const flowSteps = [
    { icon: FiFileText, title: 'Create PO', description: 'Admin/Manager creates Purchase Order', color: 'bg-blue-500' },
    { icon: FiTruck, title: 'Send to Supplier', description: 'PO is sent to the supplier', color: 'bg-purple-500' },
    { icon: FiPackage, title: 'Receive Items', description: 'Supplier delivers the items', color: 'bg-orange-500' },
    { icon: FiBox, title: 'Update Stock', description: 'Inventory is updated', color: 'bg-teal-500' },
    { icon: FiCheckCircle, title: 'Complete', description: 'PO status changes to Received', color: 'bg-green-500' },
  ];

  return (
    <div className={`flex flex-col p-4 md:p-6 rounded-xl shadow-md min-h-screen ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <FiShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Purchase Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage supplier purchase orders and track deliveries</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md">
            <FiPlus className="w-4 h-4" />
            New Purchase Order
          </button>
          <button className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'orders', 'how-it-works'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'orders' ? 'All Orders' : 'How It Works'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} border ${darkMode ? 'border-gray-600' : 'border-indigo-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <FiFileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-yellow-50 to-orange-50'} border ${darkMode ? 'border-gray-600' : 'border-yellow-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <FiClock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-green-50 to-emerald-50'} border ${darkMode ? 'border-gray-600' : 'border-green-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Received</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.received}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-red-50 to-pink-50'} border ${darkMode ? 'border-gray-600' : 'border-red-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <FiXCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-teal-50 to-cyan-50'} border ${darkMode ? 'border-gray-600' : 'border-teal-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400">Rs.{stats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* What is a Purchase Order */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} border`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                <FiAlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 dark:text-white">What is a Purchase Order?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A Purchase Order (PO) is a commercial document issued by a buyer to a seller, indicating the types, quantities, and agreed prices for products or services. It's a formal request to purchase goods from a supplier.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <FiPackage className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">What items are purchased</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">List of products ordered</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiTruck className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">From which supplier</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Vendor information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiHash className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">How many</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantities ordered</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiDollarSign className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">At what cost</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Agreed prices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiCalendar className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">When ordered</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order date & expected delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FiRefreshCw className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium dark:text-white">Current status</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pending, Received, Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Purchase Orders are Important */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
              <FiCheckCircle className="text-green-500" />
              Why Purchase Orders are Important in POS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: FiBox, title: 'Manage Inventory', desc: 'Helps manage stock in and replenishment', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
                { icon: FiTruck, title: 'Track Purchases', desc: 'Tracks all supplier purchases in one place', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
                { icon: FiAlertCircle, title: 'Prevent Errors', desc: 'Prevents over-ordering or under-ordering', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
                { icon: FiFileText, title: 'Accounting & Audit', desc: 'Used for accounting & auditing purposes', color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30' },
                { icon: FiCheckCircle, title: 'Match Invoices', desc: 'Matches invoice vs received goods', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
                { icon: FiDollarSign, title: 'Budget Control', desc: 'Helps control spending and budgets', color: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30' },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} flex items-start gap-3`}>
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold dark:text-white">Recent Purchase Orders</h3>
              <button 
                onClick={() => setActiveTab('orders')}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1"
              >
                View All <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <th className="pb-3 font-medium">PO Number</th>
                    <th className="pb-3 font-medium">Supplier</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {dummyPurchaseOrders.slice(0, 3).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
                      <td className="py-3 font-medium dark:text-white">{order.id}</td>
                      <td className="py-3 dark:text-gray-300">{order.supplier}</td>
                      <td className="py-3 dark:text-gray-300">{order.items}</td>
                      <td className="py-3 font-medium dark:text-white">Rs.{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* All Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by PO number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr className={`text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <th className="px-4 py-3 font-medium">PO Number</th>
                    <th className="px-4 py-3 font-medium">Supplier</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Total Amount</th>
                    <th className="px-4 py-3 font-medium">Order Date</th>
                    <th className="px-4 py-3 font-medium">Expected</th>
                    <th className="px-4 py-3 font-medium">Created By</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">{order.id}</td>
                      <td className="px-4 py-3 dark:text-gray-300">{order.supplier}</td>
                      <td className="px-4 py-3 dark:text-gray-300">{order.items}</td>
                      <td className="px-4 py-3 font-medium dark:text-white">Rs.{order.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 dark:text-gray-300">{order.orderDate}</td>
                      <td className="px-4 py-3 dark:text-gray-300">{order.expectedDate}</td>
                      <td className="px-4 py-3 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <FiUser className="w-4 h-4" />
                          {order.createdBy}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="p-8 text-center">
                <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No purchase orders found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How It Works Tab */}
      {activeTab === 'how-it-works' && (
        <div className="space-y-6">
          {/* PO Flow Diagram */}
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
            <h3 className="text-lg font-bold mb-6 dark:text-white text-center">Purchase Order Flow in POS</h3>
            
            {/* Flow Steps - Desktop */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-8">
              {flowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={`p-4 ${step.color} rounded-xl shadow-lg mb-3`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold dark:text-white">{step.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
                  </div>
                  {idx < flowSteps.length - 1 && (
                    <FiArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Flow Steps - Mobile */}
            <div className="lg:hidden space-y-4">
              {flowSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 ${step.color} rounded-xl shadow-lg flex-shrink-0`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full ${step.color} text-white text-sm font-bold flex items-center justify-center`}>
                          {idx + 1}
                        </span>
                        <h4 className="font-bold dark:text-white">{step.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiFileText className="w-5 h-5 text-blue-500" />
                </div>
                Step 1: Create Purchase Order
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Admin or Manager logs into the system
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Selects products that need to be ordered
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Specifies quantities and selects supplier
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Sets expected delivery date
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Creates and saves the Purchase Order
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiTruck className="w-5 h-5 text-purple-500" />
                </div>
                Step 2: Send to Supplier
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  PO is generated with a unique number
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Can be printed or emailed to supplier
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Status remains as "Pending"
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Supplier confirms the order
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiPackage className="w-5 h-5 text-orange-500" />
                </div>
                Step 3: Receive Items
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Supplier delivers the ordered items
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Staff verifies items against the PO
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Checks quantities and quality
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Records any discrepancies
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-green-500" />
                </div>
                Step 4 & 5: Update & Complete
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Inventory is automatically updated
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Stock levels increase in the system
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  PO status changes to "Received"
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  GRN (Goods Received Note) is created
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  Ready for accounting & payment processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
