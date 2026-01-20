// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { 
//   FiShoppingCart, 
//   FiTruck, 
//   FiPackage, 
//   FiFileText, 
//   FiCheckCircle, 
//   FiClock, 
//   FiXCircle,
//   FiPlus,
//   FiSearch,
//   FiFilter,
//   FiDownload,
//   FiArrowRight,
//   FiDollarSign,
//   FiCalendar,
//   FiUser,
//   FiHash,
//   FiBox,
//   FiAlertCircle,
//   FiRefreshCw
// } from 'react-icons/fi';

// const PurchaseOrder = () => {
//   const { darkMode } = useSelector((state) => state.ui);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Dummy purchase orders data
//   const dummyPurchaseOrders = [
//     { 
//       id: 'PO-2026-001', 
//       supplier: 'ABC Distributors', 
//       items: 5, 
//       totalAmount: 25000.00, 
//       orderDate: '2026-01-18', 
//       expectedDate: '2026-01-22',
//       status: 'Pending',
//       createdBy: 'Admin'
//     },
//     { 
//       id: 'PO-2026-002', 
//       supplier: 'XYZ Suppliers', 
//       items: 12, 
//       totalAmount: 48500.00, 
//       orderDate: '2026-01-15', 
//       expectedDate: '2026-01-20',
//       status: 'Received',
//       createdBy: 'Manager'
//     },
//     { 
//       id: 'PO-2026-003', 
//       supplier: 'Global Trading Co.', 
//       items: 3, 
//       totalAmount: 12000.00, 
//       orderDate: '2026-01-10', 
//       expectedDate: '2026-01-15',
//       status: 'Cancelled',
//       createdBy: 'Admin'
//     },
//     { 
//       id: 'PO-2026-004', 
//       supplier: 'Metro Wholesalers', 
//       items: 8, 
//       totalAmount: 35750.00, 
//       orderDate: '2026-01-19', 
//       expectedDate: '2026-01-25',
//       status: 'Pending',
//       createdBy: 'Admin'
//     },
//     { 
//       id: 'PO-2026-005', 
//       supplier: 'City Supplies Ltd.', 
//       items: 15, 
//       totalAmount: 62000.00, 
//       orderDate: '2026-01-12', 
//       expectedDate: '2026-01-18',
//       status: 'Received',
//       createdBy: 'Manager'
//     },
//   ];

//   // Filter purchase orders
//   const filteredOrders = dummyPurchaseOrders.filter(order => {
//     const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
//     return matchesSearch && matchesStatus;
//   });

//   // Statistics
//   const stats = {
//     total: dummyPurchaseOrders.length,
//     pending: dummyPurchaseOrders.filter(o => o.status === 'Pending').length,
//     received: dummyPurchaseOrders.filter(o => o.status === 'Received').length,
//     cancelled: dummyPurchaseOrders.filter(o => o.status === 'Cancelled').length,
//     totalValue: dummyPurchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0)
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
//       case 'Received': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
//       case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Pending': return <FiClock className="w-4 h-4" />;
//       case 'Received': return <FiCheckCircle className="w-4 h-4" />;
//       case 'Cancelled': return <FiXCircle className="w-4 h-4" />;
//       default: return <FiFileText className="w-4 h-4" />;
//     }
//   };

//   // PO Flow Steps
//   const flowSteps = [
//     { icon: FiFileText, title: 'Create PO', description: 'Admin/Manager creates Purchase Order', color: 'bg-blue-500' },
//     { icon: FiTruck, title: 'Send to Supplier', description: 'PO is sent to the supplier', color: 'bg-purple-500' },
//     { icon: FiPackage, title: 'Receive Items', description: 'Supplier delivers the items', color: 'bg-orange-500' },
//     { icon: FiBox, title: 'Update Stock', description: 'Inventory is updated', color: 'bg-teal-500' },
//     { icon: FiCheckCircle, title: 'Complete', description: 'PO status changes to Received', color: 'bg-green-500' },
//   ];

//   return (
//     <div className={`flex flex-col p-4 md:p-6 rounded-xl shadow-md min-h-screen ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
      
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
//             <FiShoppingCart className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold dark:text-white">Purchase Orders</h1>
//             <p className="text-gray-500 dark:text-gray-400 text-sm">Manage supplier purchase orders and track deliveries</p>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap gap-2">
//           <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md">
//             <FiPlus className="w-4 h-4" />
//             New Purchase Order
//           </button>
//           <button className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
//             <FiDownload className="w-4 h-4" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
//         {['overview', 'orders', 'how-it-works'].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 font-medium transition-all border-b-2 -mb-px ${
//               activeTab === tab
//                 ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
//             }`}
//           >
//             {tab === 'overview' ? 'Overview' : tab === 'orders' ? 'All Orders' : 'How It Works'}
//           </button>
//         ))}
//       </div>

//       {/* Overview Tab */}
//       {activeTab === 'overview' && (
//         <div className="space-y-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
//             <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} border ${darkMode ? 'border-gray-600' : 'border-indigo-100'}`}>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-indigo-500 rounded-lg">
//                   <FiFileText className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
//                   <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
//                 </div>
//               </div>
//             </div>

//             <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-yellow-50 to-orange-50'} border ${darkMode ? 'border-gray-600' : 'border-yellow-100'}`}>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-yellow-500 rounded-lg">
//                   <FiClock className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
//                 </div>
//               </div>
//             </div>

//             <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-green-50 to-emerald-50'} border ${darkMode ? 'border-gray-600' : 'border-green-100'}`}>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-500 rounded-lg">
//                   <FiCheckCircle className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Received</p>
//                   <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.received}</p>
//                 </div>
//               </div>
//             </div>

//             <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-red-50 to-pink-50'} border ${darkMode ? 'border-gray-600' : 'border-red-100'}`}>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-red-500 rounded-lg">
//                   <FiXCircle className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
//                   <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
//                 </div>
//               </div>
//             </div>

//             <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-teal-50 to-cyan-50'} border ${darkMode ? 'border-gray-600' : 'border-teal-100'}`}>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-teal-500 rounded-lg">
//                   <FiDollarSign className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
//                   <p className="text-xl font-bold text-teal-600 dark:text-teal-400">Rs.{stats.totalValue.toLocaleString()}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* What is a Purchase Order */}
//           <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} border`}>
//             <div className="flex items-start gap-4">
//               <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
//                 <FiAlertCircle className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold mb-2 dark:text-white">What is a Purchase Order?</h3>
//                 <p className="text-gray-600 dark:text-gray-300 mb-4">
//                   A Purchase Order (PO) is a commercial document issued by a buyer to a seller, indicating the types, quantities, and agreed prices for products or services. It's a formal request to purchase goods from a supplier.
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <div className="flex items-start gap-2">
//                     <FiPackage className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium dark:text-white">What items are purchased</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">List of products ordered</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <FiTruck className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium dark:text-white">From which supplier</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Vendor information</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <FiHash className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium dark:text-white">How many</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Quantities ordered</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <FiDollarSign className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium dark:text-white">At what cost</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Agreed prices</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <FiCalendar className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium dark:text-white">When ordered</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Order date & expected delivery</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <FiRefreshCw className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium dark:text-white">Current status</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Pending, Received, Cancelled</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Why Purchase Orders are Important */}
//           <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
//             <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
//               <FiCheckCircle className="text-green-500" />
//               Why Purchase Orders are Important in POS
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[
//                 { icon: FiBox, title: 'Manage Inventory', desc: 'Helps manage stock in and replenishment', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
//                 { icon: FiTruck, title: 'Track Purchases', desc: 'Tracks all supplier purchases in one place', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
//                 { icon: FiAlertCircle, title: 'Prevent Errors', desc: 'Prevents over-ordering or under-ordering', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
//                 { icon: FiFileText, title: 'Accounting & Audit', desc: 'Used for accounting & auditing purposes', color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30' },
//                 { icon: FiCheckCircle, title: 'Match Invoices', desc: 'Matches invoice vs received goods', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
//                 { icon: FiDollarSign, title: 'Budget Control', desc: 'Helps control spending and budgets', color: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30' },
//               ].map((item, idx) => (
//                 <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'} flex items-start gap-3`}>
//                   <div className={`p-2 rounded-lg ${item.color}`}>
//                     <item.icon className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="font-medium dark:text-white">{item.title}</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Recent Orders */}
//           <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold dark:text-white">Recent Purchase Orders</h3>
//               <button 
//                 onClick={() => setActiveTab('orders')}
//                 className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1"
//               >
//                 View All <FiArrowRight className="w-4 h-4" />
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className={`text-left text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                     <th className="pb-3 font-medium">PO Number</th>
//                     <th className="pb-3 font-medium">Supplier</th>
//                     <th className="pb-3 font-medium">Items</th>
//                     <th className="pb-3 font-medium">Amount</th>
//                     <th className="pb-3 font-medium">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
//                   {dummyPurchaseOrders.slice(0, 3).map((order) => (
//                     <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
//                       <td className="py-3 font-medium dark:text-white">{order.id}</td>
//                       <td className="py-3 dark:text-gray-300">{order.supplier}</td>
//                       <td className="py-3 dark:text-gray-300">{order.items}</td>
//                       <td className="py-3 font-medium dark:text-white">Rs.{order.totalAmount.toLocaleString()}</td>
//                       <td className="py-3">
//                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                           {getStatusIcon(order.status)}
//                           {order.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* All Orders Tab */}
//       {activeTab === 'orders' && (
//         <div className="space-y-4">
//           {/* Search and Filter */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by PO number or supplier..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <FiFilter className="text-gray-400" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="received">Received</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>

//           {/* Orders Table */}
//           <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                   <tr className={`text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <th className="px-4 py-3 font-medium">PO Number</th>
//                     <th className="px-4 py-3 font-medium">Supplier</th>
//                     <th className="px-4 py-3 font-medium">Items</th>
//                     <th className="px-4 py-3 font-medium">Total Amount</th>
//                     <th className="px-4 py-3 font-medium">Order Date</th>
//                     <th className="px-4 py-3 font-medium">Expected</th>
//                     <th className="px-4 py-3 font-medium">Created By</th>
//                     <th className="px-4 py-3 font-medium">Status</th>
//                     <th className="px-4 py-3 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className={`divide-y ${darkMode ? 'divide-gray-600 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
//                   {filteredOrders.map((order) => (
//                     <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
//                       <td className="px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">{order.id}</td>
//                       <td className="px-4 py-3 dark:text-gray-300">{order.supplier}</td>
//                       <td className="px-4 py-3 dark:text-gray-300">{order.items}</td>
//                       <td className="px-4 py-3 font-medium dark:text-white">Rs.{order.totalAmount.toLocaleString()}</td>
//                       <td className="px-4 py-3 dark:text-gray-300">{order.orderDate}</td>
//                       <td className="px-4 py-3 dark:text-gray-300">{order.expectedDate}</td>
//                       <td className="px-4 py-3 dark:text-gray-300">
//                         <span className="flex items-center gap-1">
//                           <FiUser className="w-4 h-4" />
//                           {order.createdBy}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                           {getStatusIcon(order.status)}
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {filteredOrders.length === 0 && (
//               <div className="p-8 text-center">
//                 <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500 dark:text-gray-400">No purchase orders found</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* How It Works Tab */}
//       {activeTab === 'how-it-works' && (
//         <div className="space-y-6">
//           {/* PO Flow Diagram */}
//           <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
//             <h3 className="text-lg font-bold mb-6 dark:text-white text-center">Purchase Order Flow in POS</h3>
            
//             {/* Flow Steps - Desktop */}
//             <div className="hidden lg:flex items-center justify-between gap-4 mb-8">
//               {flowSteps.map((step, idx) => (
//                 <React.Fragment key={idx}>
//                   <div className="flex flex-col items-center text-center flex-1">
//                     <div className={`p-4 ${step.color} rounded-xl shadow-lg mb-3`}>
//                       <step.icon className="w-8 h-8 text-white" />
//                     </div>
//                     <h4 className="font-bold dark:text-white">{step.title}</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
//                   </div>
//                   {idx < flowSteps.length - 1 && (
//                     <FiArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>

//             {/* Flow Steps - Mobile */}
//             <div className="lg:hidden space-y-4">
//               {flowSteps.map((step, idx) => (
//                 <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-gray-50'}`}>
//                   <div className="flex items-center gap-4 flex-1">
//                     <div className={`p-3 ${step.color} rounded-xl shadow-lg flex-shrink-0`}>
//                       <step.icon className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className={`w-6 h-6 rounded-full ${step.color} text-white text-sm font-bold flex items-center justify-center`}>
//                           {idx + 1}
//                         </span>
//                         <h4 className="font-bold dark:text-white">{step.title}</h4>
//                       </div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Detailed Explanation */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
//               <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
//                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                   <FiFileText className="w-5 h-5 text-blue-500" />
//                 </div>
//                 Step 1: Create Purchase Order
//               </h3>
//               <ul className="space-y-2 text-gray-600 dark:text-gray-300">
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Admin or Manager logs into the system
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Selects products that need to be ordered
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Specifies quantities and selects supplier
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Sets expected delivery date
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Creates and saves the Purchase Order
//                 </li>
//               </ul>
//             </div>

//             <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
//               <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
//                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                   <FiTruck className="w-5 h-5 text-purple-500" />
//                 </div>
//                 Step 2: Send to Supplier
//               </h3>
//               <ul className="space-y-2 text-gray-600 dark:text-gray-300">
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   PO is generated with a unique number
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Can be printed or emailed to supplier
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Status remains as "Pending"
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Supplier confirms the order
//                 </li>
//               </ul>
//             </div>

//             <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
//               <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
//                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
//                   <FiPackage className="w-5 h-5 text-orange-500" />
//                 </div>
//                 Step 3: Receive Items
//               </h3>
//               <ul className="space-y-2 text-gray-600 dark:text-gray-300">
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Supplier delivers the ordered items
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Staff verifies items against the PO
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Checks quantities and quality
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Records any discrepancies
//                 </li>
//               </ul>
//             </div>

//             <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}>
//               <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
//                 <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                   <FiCheckCircle className="w-5 h-5 text-green-500" />
//                 </div>
//                 Step 4 & 5: Update & Complete
//               </h3>
//               <ul className="space-y-2 text-gray-600 dark:text-gray-300">
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Inventory is automatically updated
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Stock levels increase in the system
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   PO status changes to "Received"
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   GRN (Goods Received Note) is created
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
//                   Ready for accounting & payment processing
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseOrder;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  FiRefreshCw,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiPercent,
  FiTag
} from 'react-icons/fi';
import { listSupplier } from '../../actions/supplierAction';

const PurchaseOrder = () => {
  const { darkMode } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  // Get suppliers from Redux
  const { suppliers = [] } = useSelector((state) => state.supplierList);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [newItem, setNewItem] = useState({ product: '', quantity: 1, price: 0 });
  const [currentPO, setCurrentPO] = useState({
    supplier: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    paymentTerms: 'Net 30',
    shippingAddress: '',
    notes: '',
    discount: 0,
    tax: 0
  });

  // Load suppliers on component mount
  useEffect(() => {
    dispatch(listSupplier());
  }, [dispatch]);

  // Dummy product data
  const dummyProducts = [
    { id: 1, name: 'Laptop', sku: 'LP-001', price: 120000, stock: 25 },
    { id: 2, name: 'Mouse', sku: 'MS-002', price: 2500, stock: 100 },
    { id: 3, name: 'Keyboard', sku: 'KB-003', price: 4500, stock: 50 },
    { id: 4, name: 'Monitor', sku: 'MN-004', price: 35000, stock: 30 },
    { id: 5, name: 'Printer', sku: 'PR-005', price: 28000, stock: 15 },
    { id: 6, name: 'Scanner', sku: 'SC-006', price: 32000, stock: 10 },
    { id: 7, name: 'Router', sku: 'RT-007', price: 12000, stock: 40 },
    { id: 8, name: 'External HDD', sku: 'HD-008', price: 15000, stock: 60 },
  ];

  // Dummy purchase orders data
  const dummyPurchaseOrders = [
    { 
      id: 'PO-2026-001', 
      supplier: 'ABC Distributors', 
      supplierCode: 'SUP001',
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
      supplierCode: 'SUP002',
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
      supplierCode: 'SUP003',
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
      supplierCode: 'SUP004',
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
      supplierCode: 'SUP005',
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
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplierCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Filter active suppliers
  const activeSuppliers = suppliers.filter(s => s.SUP_STATUS === 'A');

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

  // Calculate order totals
  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discountAmount = (subtotal * currentPO.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * currentPO.tax) / 100;
    const total = subtotal - discountAmount + taxAmount;
    
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  };

  // Add item to order
  const addItemToOrder = () => {
    if (!newItem.product || newItem.quantity <= 0 || newItem.price <= 0) {
      return;
    }
    
    const product = dummyProducts.find(p => p.name === newItem.product);
    if (product) {
      setOrderItems([...orderItems, {
        ...newItem,
        id: Date.now(),
        sku: product.sku,
        total: newItem.quantity * newItem.price
      }]);
      setNewItem({ product: '', quantity: 1, price: 0 });
    }
  };

  // Remove item from order
  const removeItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setCurrentPO({
      ...currentPO,
      supplier: supplier.SUP_NAME,
      shippingAddress: supplier.SUP_ADDRESS
    });
    setShowSupplierDropdown(false);
  };

  // Handle new PO creation
  const handleCreatePO = () => {
    if (!selectedSupplier || orderItems.length === 0) {
      alert('Please select a supplier and add items to create a purchase order');
      return;
    }
    
    const totals = calculateTotals();
    
    // Here you would typically dispatch an action to save the PO
    console.log('Creating PO:', {
      ...currentPO,
      supplierCode: selectedSupplier.SUP_CODE,
      items: orderItems,
      totals
    });
    
    // Reset form
    setSelectedSupplier(null);
    setOrderItems([]);
    setCurrentPO({
      supplier: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: '',
      paymentTerms: 'Net 30',
      shippingAddress: '',
      notes: '',
      discount: 0,
      tax: 0
    });
    setIsNewPOModalOpen(false);
    
    // Show success message
    alert('Purchase Order created successfully!');
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
          <button 
            onClick={() => setIsNewPOModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md"
          >
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
          {/* Stats Cards - Compact like Customer Management */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-2 mb-1 md:mb-2">
            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
                </div>
                <FiFileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <FiClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{stats.received}</p>
                </div>
                <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled</p>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
                </div>
                <FiXCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">Rs.{stats.totalValue.toLocaleString()}</p>
                </div>
                <FiDollarSign className="w-4 h-4 text-teal-600 dark:text-teal-400" />
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
                      <td className="py-3 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                            {order.supplier.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{order.supplier}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{order.supplierCode}</div>
                          </div>
                        </div>
                      </td>
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
                placeholder="Search by PO number, supplier, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-indigo-500`}
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
                      <td className="px-4 py-3 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                            {order.supplier.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{order.supplier}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{order.supplierCode}</div>
                          </div>
                        </div>
                      </td>
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
                        <div className="flex items-center gap-2">
                          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
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

      {/* New Purchase Order Modal */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-2">
          <div className={`rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="relative">
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-900/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                    <FiShoppingCart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">Create New Purchase Order</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select supplier and add items to create order</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNewPOModalOpen(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Supplier & Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Supplier Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                      Select Supplier *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
                        className={`w-full px-4 py-3 rounded-lg border text-sm flex items-center justify-between ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      >
                        <div className="flex items-center gap-3">
                          {selectedSupplier ? (
                            <>
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {selectedSupplier.SUP_NAME.charAt(0)}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{selectedSupplier.SUP_NAME}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{selectedSupplier.SUP_CODE}</div>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500">Select a supplier...</span>
                          )}
                        </div>
                        {showSupplierDropdown ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {showSupplierDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-64 overflow-y-auto">
                          {activeSuppliers.length > 0 ? (
                            activeSuppliers.map((supplier) => (
                              <div
                                key={supplier.SUP_ID}
                                onClick={() => handleSupplierSelect(supplier)}
                                className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                    {supplier.SUP_NAME.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium dark:text-white">{supplier.SUP_NAME}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {supplier.SUP_CONPERSON} • {supplier.SUP_PHONENO}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                              No active suppliers found. Please add suppliers first.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                      Order Items *
                    </label>
                    <div className={`rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'} overflow-hidden`}>
                      <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Quantity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                          {orderItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 dark:text-gray-300">{item.product} ({item.sku})</td>
                              <td className="px-4 py-3 dark:text-gray-300">{item.quantity}</td>
                              <td className="px-4 py-3 dark:text-gray-300">Rs.{item.price.toLocaleString()}</td>
                              <td className="px-4 py-3 font-medium dark:text-white">Rs.{item.total.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-700"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {orderItems.length === 0 && (
                            <tr>
                              <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                No items added. Add items using the form below.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Item Form */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Product"
                        value={newItem.product}
                        onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Quantity"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      className={`px-3 py-2 rounded-lg border text-sm ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500`}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                      className={`px-3 py-2 rounded-lg border text-sm ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500`}
                    />
                    <button
                      type="button"
                      onClick={addItemToOrder}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Order Date
                      </label>
                      <input
                        type="date"
                        value={currentPO.orderDate}
                        onChange={(e) => setCurrentPO({ ...currentPO, orderDate: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Expected Delivery Date *
                      </label>
                      <input
                        type="date"
                        value={currentPO.expectedDate}
                        onChange={(e) => setCurrentPO({ ...currentPO, expectedDate: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Payment Terms
                      </label>
                      <select
                        value={currentPO.paymentTerms}
                        onChange={(e) => setCurrentPO({ ...currentPO, paymentTerms: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option>Net 30</option>
                        <option>Net 15</option>
                        <option>Net 45</option>
                        <option>Due on Receipt</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium dark:text-white">
                        Shipping Address
                      </label>
                      <input
                        type="text"
                        placeholder="Shipping address"
                        value={currentPO.shippingAddress}
                        onChange={(e) => setCurrentPO({ ...currentPO, shippingAddress: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                          } focus:ring-2 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium dark:text-white">
                      Notes
                    </label>
                    <textarea
                      placeholder="Additional notes or instructions"
                      value={currentPO.notes}
                      onChange={(e) => setCurrentPO({ ...currentPO, notes: e.target.value })}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-lg border text-sm ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500 resize-none`}
                    />
                  </div>
                </div>

                {/* Right Column - Summary */}
                <div className="space-y-6">
                  <div className={`p-6 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Order Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium dark:text-white">Rs.{calculateTotals().subtotal.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Discount</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPO.discount}
                            onChange={(e) => setCurrentPO({ ...currentPO, discount: parseFloat(e.target.value) || 0 })}
                            className="w-16 px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 text-right"
                          />
                          <span className="text-gray-600 dark:text-gray-400">%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentPO.tax}
                            onChange={(e) => setCurrentPO({ ...currentPO, tax: parseFloat(e.target.value) || 0 })}
                            className="w-16 px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-700 text-right"
                          />
                          <span className="text-gray-600 dark:text-gray-400">%</span>
                        </div>
                      </div>
                      
                      <div className="border-t dark:border-gray-600 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold dark:text-white">Total</span>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            Rs.{calculateTotals().total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={handleCreatePO}
                        disabled={!selectedSupplier || orderItems.length === 0}
                        className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 ${!selectedSupplier || orderItems.length === 0
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                          }`}
                      >
                        <FiSave className="w-4 h-4" />
                        Create Purchase Order
                      </button>
                      
                      <button
                        onClick={() => setIsNewPOModalOpen(false)}
                        className={`w-full py-2.5 rounded-lg font-medium text-sm ${darkMode
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                    <h4 className="font-medium mb-3 dark:text-white">Quick Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Selected Supplier:</span>
                        <span className="font-medium dark:text-white">{selectedSupplier ? selectedSupplier.SUP_NAME : 'None'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Items in Order:</span>
                        <span className="font-medium dark:text-white">{orderItems.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Quantity:</span>
                        <span className="font-medium dark:text-white">{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;