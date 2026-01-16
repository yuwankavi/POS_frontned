

// // export default Exp;
// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import batchService from '../../services/Inventory/batchService';
// import {
//   FiSearch,
//   FiPackage,
//   FiBarChart2,
//   FiCalendar,
//   FiDollarSign,
//   FiShoppingCart,
//   FiTrendingUp,
//   FiUsers,
//   FiPieChart,
//   FiActivity,
//   FiCreditCard,
//   FiPrinter,
//   FiRefreshCw,
//   FiCheckCircle,
//   FiX,
//   FiGrid,
//   FiFilter,
//   FiAlertTriangle,
//   FiClock,
//   FiCheck,
//   FiAlertCircle,
//   FiTag
// } from "react-icons/fi";
// import Breadcrumb from "../../components/common/Breadcrumb.js";

// const Exp = () => {
//   const [expiryData, setExpiryData] = useState([]);
//   const [filter, setFilter] = useState('ALL'); // ALL, EXPIRING_SOON, EXPIRED, GOOD
//   const [selectedCategory, setSelectedCategory] = useState('ALL');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState(["ALL"]);
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(new Date());

//   const detectCategory = (desc) => {
//     if (!desc) return 'OTHER';
//     const text = desc.toUpperCase();
//     const known = ['WHISKY','VODKA','RUM','GIN','BEER','WINE','BRANDY','ARRACK'];
//     for (const k of known) if (text.includes(k)) return k;
//     return 'OTHER';
//   };

//   const loadBatches = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await batchService.getAll();
//       const items = (res && res.ResultSet) ? res.ResultSet : [];
//       const mapped = items.map((it, idx) => {
//         const expiryRaw = it.PB_EXDate || it.PB_EXDate || '';
//         const expiryDate = expiryRaw ? new Date(expiryRaw) : null;
//         const today = new Date();
//         const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000*60*60*24)) : 0;
//         let status = 'GOOD';
//         if (daysUntilExpiry < 0) status = 'EXPIRED';
//         else if (daysUntilExpiry <= 30) status = 'EXPIRING_SOON';

//         const costPrice = parseFloat(it.PB_PPrice || 0);
//         const quantity = parseFloat(it.PB_BLQty || 0);

//         return {
//           id: `${it.PB_BId || idx}_${it.PB_ProCode || idx}`,
//           productName: it.PB_ProDes || it.PB_ProCode || 'Unknown',
//           category: detectCategory(it.PB_ProDes),
//           batchNo: it.PB_BId || '',
//           quantity: quantity,
//           costPrice: costPrice,
//           sellingPrice: parseFloat(it.PB_SPrice || (costPrice * 1.3)),
//           expiryDate: expiryDate ? expiryDate.toISOString().slice(0,10) : '',
//           daysUntilExpiry,
//           status,
//           supplier: it.PB_SupName || it.PB_SupCode || '',
//           totalCost: quantity * costPrice
//         };
//       });

//       setExpiryData(mapped);
//       const cats = Array.from(new Set(['ALL', ...mapped.map(m => m.category)]) );
//       setCategories(cats);
//       setLastUpdated(new Date());
//       showAlertMessage("Expiry data loaded successfully", "success");
//     } catch (err) {
//       setError(err.message || 'Failed to load batches');
//       showAlertMessage("Failed to load expiry data", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBatches();
//   }, []);

//   const filteredData = expiryData.filter(item => {
//     const matchesFilter = filter === 'ALL' || item.status === filter;
//     const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
//     const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
//     return matchesFilter && matchesCategory && matchesSearch;
//   });

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       EXPIRING_SOON: { 
//         color: 'bg-yellow-500', 
//         text: 'Expiring Soon', 
//         icon: FiAlertTriangle,
//         textColor: 'text-yellow-800',
//         bgColor: 'bg-yellow-100'
//       },
//       EXPIRED: { 
//         color: 'bg-red-500', 
//         text: 'Expired', 
//         icon: FiX,
//         textColor: 'text-red-800',
//         bgColor: 'bg-red-100'
//       },
//       GOOD: { 
//         color: 'bg-green-500', 
//         text: 'Good', 
//         icon: FiCheck,
//         textColor: 'text-green-800',
//         bgColor: 'bg-green-100'
//       }
//     };
    
//     const config = statusConfig[status];
//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
//         <config.icon className="w-3 h-3" />
//         {config.text}
//       </span>
//     );
//   };

//   const getDaysUntilExpiryText = (days) => {
//     if (days < 0) return { text: `Expired ${Math.abs(days)} days ago`, color: 'text-red-600', bgColor: 'bg-red-100' };
//     if (days === 0) return { text: 'Expires today', color: 'text-red-600', bgColor: 'bg-red-100' };
//     if (days <= 7) return { text: `Expires in ${days} days`, color: 'text-red-600', bgColor: 'bg-red-100' };
//     if (days <= 30) return { text: `Expires in ${days} days`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
//     return { text: `Expires in ${days} days`, color: 'text-green-600', bgColor: 'bg-green-100' };
//   };

//   const calculateTotalRiskValue = () => {
//     return expiryData
//       .filter(item => item.status === 'EXPIRED' || item.status === 'EXPIRING_SOON')
//       .reduce((total, item) => total + (item.quantity * item.costPrice), 0);
//   };

//   const showAlertMessage = (message, type = 'success') => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);

//     setTimeout(() => {
//       setShowAlert(false);
//     }, 5000);
//   };

//   const getAlertBgColor = () => {
//     switch (alertType) {
//       case 'success': return 'bg-green-100 border-green-300';
//       case 'error': return 'bg-red-100 border-red-300';
//       case 'warning': return 'bg-yellow-100 border-yellow-300';
//       case 'info': return 'bg-blue-100 border-blue-300';
//       default: return 'bg-gray-100 border-gray-300';
//     }
//   };

//   const getAlertTextColor = () => {
//     switch (alertType) {
//       case 'success': return 'text-green-800';
//       case 'error': return 'text-red-800';
//       case 'warning': return 'text-yellow-800';
//       case 'info': return 'text-blue-800';
//       default: return 'text-gray-800';
//     }
//   };

//   const getAlertIcon = () => {
//     switch (alertType) {
//       case 'success': return <FiCheckCircle className="w-5 h-5 text-green-600" />;
//       case 'error': return <FiX className="w-5 h-5 text-red-600" />;
//       case 'warning': return <FiAlertTriangle className="w-5 h-5 text-yellow-600" />;
//       case 'info': return <FiBarChart2 className="w-5 h-5 text-blue-600" />;
//       default: return <FiBarChart2 className="w-5 h-5 text-gray-600" />;
//     }
//   };

//   const formatCurrency = (value) => {
//     const amount = parseFloat(value) || 0;
//     return `Rs. ${Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
//   };

//   const handleGenerateReport = () => {
//     showAlertMessage("Expiry report generated successfully", "success");
//   };

//   const handleSendAlerts = () => {
//     showAlertMessage("Alerts sent to concerned staff", "info");
//   };

//   const summaryMetrics = React.useMemo(() => {
//     const expiringSoon = expiryData.filter(item => item.status === 'EXPIRING_SOON').length;
//     const expired = expiryData.filter(item => item.status === 'EXPIRED').length;
//     const good = expiryData.filter(item => item.status === 'GOOD').length;
//     const totalItems = expiryData.length;
//     const healthPercentage = totalItems > 0 ? (good / totalItems * 100) : 0;
//     const riskValue = calculateTotalRiskValue();

//     return {
//       expiringSoon,
//       expired,
//       good,
//       totalItems,
//       healthPercentage,
//       riskValue,
//       totalCategories: categories.length - 1
//     };
//   }, [expiryData, categories]);

//   return (
//     <div className="flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full bg-white border-gray-200 border">
//       {/* Alert Message */}
//       {showAlert && (
//         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-md px-2 sm:px-0">
//           <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl shadow-lg border ${getAlertBgColor()} ${getAlertTextColor()} mx-2`}>
//             <div className="flex items-center gap-2 sm:gap-3">
//               {getAlertIcon()}
//               <p className="font-medium text-sm sm:text-base">{alertMessage}</p>
//             </div>
//             <button
//               onClick={() => setShowAlert(false)}
//               className="hover:opacity-70 transition-opacity"
//             >
//               <FiX className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       <Breadcrumb current="Inventory / Expiry Report" />

//       {/* Header */}
//       <div className="mt-2 mb-3 md:mb-5">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
//               <FiClock className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900">
//                 Expiry Monitoring Dashboard
//               </h1>
//               <p className="text-xs text-gray-600">
//                 Monitor and manage product expiry dates in real-time
//                 {lastUpdated && (
//                   <span className="ml-2 text-green-600">
//                     • Last updated: {lastUpdated.toLocaleTimeString()}
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* Responsive Button Group */}
//           <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
//             {/* Refresh Controls */}
//             <div className="flex gap-2">
//               <button
//                 onClick={loadBatches}
//                 disabled={loading}
//                 className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm min-w-[100px] justify-center disabled:opacity-50"
//               >
//                 <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                 {loading ? "Loading..." : "Refresh"}
//               </button>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2">
//               <button
//                 onClick={handleGenerateReport}
//                 className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm min-w-[140px] justify-center"
//               >
//                 <FiPrinter className="w-4 h-4" />
//                 Generate Report
//               </button>

//               <button
//                 onClick={handleSendAlerts}
//                 className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center"
//               >
//                 <FiAlertCircle className="w-4 h-4" />
//                 Send Alerts
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Primary Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="rounded-lg p-2 shadow border bg-yellow-50 border-yellow-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-yellow-700">Expiring Soon (≤30 days)</p>
//                 <p className="text-sm font-bold text-yellow-600">
//                   {summaryMetrics.expiringSoon}
//                 </p>
//               </div>
//               <div className="p-2 bg-yellow-100 rounded-lg">
//                 <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg p-2 shadow border bg-red-50 border-red-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-red-700">Expired Products</p>
//                 <p className="text-sm font-bold text-red-600">
//                   {summaryMetrics.expired}
//                 </p>
//               </div>
//               <div className="p-2 bg-red-100 rounded-lg">
//                 <FiX className="w-4 h-4 text-red-600" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg p-2 shadow border bg-green-50 border-green-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-green-700">Good Stock</p>
//                 <p className="text-sm font-bold text-green-600">
//                   {summaryMetrics.good}
//                 </p>
//               </div>
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <FiCheck className="w-4 h-4 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg p-2 shadow border bg-purple-50 border-purple-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-purple-700">Risk Value</p>
//                 <p className="text-sm font-bold text-purple-600">
//                   {formatCurrency(summaryMetrics.riskValue)}
//                 </p>
//               </div>
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <FiDollarSign className="w-4 h-4 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Total Products</p>
//                 <p className="text-sm font-bold text-indigo-600">{summaryMetrics.totalItems}</p>
//               </div>
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <FiPackage className="w-3 h-3 text-indigo-600" />
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Stock Health</p>
//                 <p className="text-sm font-bold text-emerald-600">
//                   {summaryMetrics.healthPercentage.toFixed(1)}%
//                 </p>
//               </div>
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <FiPieChart className="w-3 h-3 text-emerald-600" />
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Categories</p>
//                 <p className="text-sm font-bold text-cyan-600">{summaryMetrics.totalCategories}</p>
//               </div>
//               <div className="p-2 bg-cyan-100 rounded-lg">
//                 <FiTag className="w-3 h-3 text-cyan-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
//             {/* Status Filter */}
//             <div className="relative">
//               <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <select 
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-gray-50 border-gray-200 text-gray-900"
//               >
//                 <option value="ALL">All Status</option>
//                 <option value="EXPIRING_SOON">Expiring Soon</option>
//                 <option value="EXPIRED">Expired</option>
//                 <option value="GOOD">Good Stock</option>
//               </select>
//             </div>

//             {/* Category Filter */}
//             <div className="relative">
//               <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <select 
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-gray-50 border-gray-200 text-gray-900"
//               >
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Search */}
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search products, batches, or suppliers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-gray-50 border-gray-200 text-gray-900"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
//         <div className="rounded-lg p-1 md:p-2 h-full overflow-y-auto bg-gray-100">
//           {loading ? (
//             <div className="flex items-center justify-center py-8 rounded-xl h-full">
//               <div className="flex flex-col items-center gap-2">
//                 <div className="relative">
//                   <div className="w-8 h-8 border-4 rounded-full animate-spin border-green-200"></div>
//                   <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">
//                   Loading expiry data...
//                 </p>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="rounded-xl p-4 text-center h-full flex items-center justify-center border bg-red-50 border-red-200">
//               <div>
//                 <div className="font-medium text-sm text-red-600">
//                   ⚠️ Error
//                 </div>
//                 <p className="mt-1 text-xs text-red-600">
//                   {error}
//                 </p>
//                 <button
//                   onClick={loadBatches}
//                   className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Products Table */}
//               {filteredData.length > 0 ? (
//                 <>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">
//                       Product Expiry Details
//                     </h3>
//                     <span className="text-xs text-gray-500">
//                       Showing {filteredData.length} item{filteredData.length !== 1 ? 's' : ''}
//                     </span>
//                   </div>
                  
//                   <div className="bg-white rounded-xl border border-gray-200">
//                     <div className="p-4 border-b border-gray-200">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-semibold text-gray-900">
//                           Expiry Monitoring Table
//                         </h3>
//                         <span className="text-xs text-gray-500">
//                           Updated: {lastUpdated.toLocaleTimeString()}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="border-b border-gray-200 bg-gray-50">
//                           <tr>
//                             <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                               Product Details
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                               Batch Info
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                               Stock & Pricing
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                               Expiry Status
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {filteredData.map((product) => {
//                             const expiryInfo = getDaysUntilExpiryText(product.daysUntilExpiry);
//                             return (
//                               <tr key={product.id} className="hover:bg-gray-50 transition-colors">
//                                 <td className="px-4 py-3">
//                                   <div className="flex items-center gap-3">
//                                     <div className={`w-8 h-8 rounded-lg ${
//                                       product.status === 'EXPIRED' ? 'bg-red-100' :
//                                       product.status === 'EXPIRING_SOON' ? 'bg-yellow-100' :
//                                       'bg-green-100'
//                                     } flex items-center justify-center`}>
//                                       {product.status === 'EXPIRED' ? (
//                                         <FiX className="w-4 h-4 text-red-600" />
//                                       ) : product.status === 'EXPIRING_SOON' ? (
//                                         <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
//                                       ) : (
//                                         <FiCheck className="w-4 h-4 text-green-600" />
//                                       )}
//                                     </div>
//                                     <div>
//                                       <div className="text-xs font-medium text-gray-900">
//                                         {product.productName}
//                                       </div>
//                                       <div className="text-xs text-gray-500 mt-1">
//                                         {product.category} • {product.supplier}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-3">
//                                   <div>
//                                     <div className="text-xs font-medium text-gray-900">{product.batchNo}</div>
//                                     <div className="text-xs text-gray-500 mt-1">
//                                       {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'No expiry'}
//                                     </div>
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-3">
//                                   <div>
//                                     <div className="text-xs font-medium text-gray-900">
//                                       {product.quantity} bottles
//                                     </div>
//                                     <div className="text-xs text-gray-500 mt-1">
//                                       Cost: {formatCurrency(product.costPrice)} • Sell: {formatCurrency(product.sellingPrice)}
//                                     </div>
//                                     <div className="text-xs font-semibold text-blue-600 mt-1">
//                                       Total: {formatCurrency(product.totalCost)}
//                                     </div>
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-3">
//                                   <div className="space-y-2">
//                                     {getStatusBadge(product.status)}
//                                     <div className={`text-xs font-medium ${expiryInfo.color} px-2 py-1 rounded ${expiryInfo.bgColor}`}>
//                                       {expiryInfo.text}
//                                     </div>
//                                   </div>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//                     <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
//                           <FiActivity className="w-5 h-5 text-white" />
//                         </div>
//                         <div>
//                           <h4 className="text-sm font-semibold text-blue-800">Quick Sale Required</h4>
//                           <p className="text-xs text-blue-600">
//                             {summaryMetrics.expiringSoon} products need immediate attention
//                           </p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
//                           <FiX className="w-5 h-5 text-white" />
//                         </div>
//                         <div>
//                           <h4 className="text-sm font-semibold text-red-800">Remove Expired Stock</h4>
//                           <p className="text-xs text-red-600">
//                             {summaryMetrics.expired} expired products to be removed
//                           </p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
//                           <FiTrendingUp className="w-5 h-5 text-white" />
//                         </div>
//                         <div>
//                           <h4 className="text-sm font-semibold text-green-800">Stock Health</h4>
//                           <p className="text-xs text-green-600">
//                             {summaryMetrics.healthPercentage.toFixed(1)}% of stock is in good condition
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Status Breakdown */}
//                   <div className="bg-white rounded-xl border border-gray-200 mt-4">
//                     <div className="p-4 border-b border-gray-200">
//                       <h3 className="text-sm font-semibold text-gray-900">
//                         Expiry Status Breakdown
//                       </h3>
//                     </div>
//                     <div className="p-4">
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                             <span className="text-xs text-gray-700">Expired Products</span>
//                           </div>
//                           <div className="text-xs font-semibold text-red-600">
//                             {summaryMetrics.expired} ({summaryMetrics.totalItems > 0 ? (summaryMetrics.expired/summaryMetrics.totalItems*100).toFixed(1) : 0}%)
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                             <span className="text-xs text-gray-700">Expiring Soon (≤30 days)</span>
//                           </div>
//                           <div className="text-xs font-semibold text-yellow-600">
//                             {summaryMetrics.expiringSoon} ({summaryMetrics.totalItems > 0 ? (summaryMetrics.expiringSoon/summaryMetrics.totalItems*100).toFixed(1) : 0}%)
//                           </div>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                             <span className="text-xs text-gray-700">Good Stock</span>
//                           </div>
//                           <div className="text-xs font-semibold text-green-600">
//                             {summaryMetrics.good} ({summaryMetrics.totalItems > 0 ? (summaryMetrics.good/summaryMetrics.totalItems*100).toFixed(1) : 0}%)
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                     <FiPackage className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     {searchTerm || filter !== 'ALL' || selectedCategory !== 'ALL' ? 'No Products Found' : 'No Expiry Data'}
//                   </h3>
//                   <p className="text-gray-600 max-w-md mx-auto">
//                     {searchTerm 
//                       ? `No products found matching "${searchTerm}". Try a different search term.`
//                       : filter !== 'ALL' || selectedCategory !== 'ALL'
//                       ? 'No products match the selected filters. Try adjusting your filters.'
//                       : 'No expiry data available. Load data or check back later.'
//                     }
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Exp;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import batchService from '../../services/Inventory/batchService';
import {
  FiSearch,
  FiPackage,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
  FiPieChart,
  FiActivity,
  FiCreditCard,
  FiPrinter,
  FiRefreshCw,
  FiCheckCircle,
  FiX,
  FiGrid,
  FiFilter,
  FiAlertTriangle,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiTag
} from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb.js";

const Exp = () => {
  const { darkMode } = useSelector(state => state.ui || {});
  const [expiryData, setExpiryData] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, EXPIRING_SOON, EXPIRED, GOOD
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["ALL"]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const detectCategory = (desc) => {
    if (!desc) return 'OTHER';
    const text = desc.toUpperCase();
    const known = ['WHISKY','VODKA','RUM','GIN','BEER','WINE','BRANDY','ARRACK'];
    for (const k of known) if (text.includes(k)) return k;
    return 'OTHER';
  };

  const loadBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await batchService.getAll();
      const items = (res && res.ResultSet) ? res.ResultSet : [];
      const mapped = items.map((it, idx) => {
        const expiryRaw = it.PB_EXDate || it.PB_EXDate || '';
        const expiryDate = expiryRaw ? new Date(expiryRaw) : null;
        const today = new Date();
        const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000*60*60*24)) : 0;
        let status = 'GOOD';
        if (daysUntilExpiry < 0) status = 'EXPIRED';
        else if (daysUntilExpiry <= 30) status = 'EXPIRING_SOON';

        const costPrice = parseFloat(it.PB_PPrice || 0);
        const quantity = parseFloat(it.PB_BLQty || 0);

        return {
          id: `${it.PB_BId || idx}_${it.PB_ProCode || idx}`,
          productName: it.PB_ProDes || it.PB_ProCode || 'Unknown',
          category: detectCategory(it.PB_ProDes),
          batchNo: it.PB_BId || '',
          quantity: quantity,
          costPrice: costPrice,
          sellingPrice: parseFloat(it.PB_SPrice || (costPrice * 1.3)),
          expiryDate: expiryDate ? expiryDate.toISOString().slice(0,10) : '',
          daysUntilExpiry,
          status,
          supplier: it.PB_SupName || it.PB_SupCode || '',
          totalCost: quantity * costPrice
        };
      });

      setExpiryData(mapped);
      const cats = Array.from(new Set(['ALL', ...mapped.map(m => m.category)]) );
      setCategories(cats);
      setLastUpdated(new Date());
      showAlertMessage("Expiry data loaded successfully", "success");
    } catch (err) {
      setError(err.message || 'Failed to load batches');
      showAlertMessage("Failed to load expiry data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const filteredData = expiryData.filter(item => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      EXPIRING_SOON: { 
        color: 'bg-yellow-500', 
        text: 'Expiring Soon', 
        icon: FiAlertTriangle,
        textColor: 'text-yellow-800 dark:text-yellow-300',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
      },
      EXPIRED: { 
        color: 'bg-red-500', 
        text: 'Expired', 
        icon: FiX,
        textColor: 'text-red-800 dark:text-red-300',
        bgColor: 'bg-red-100 dark:bg-red-900/30'
      },
      GOOD: { 
        color: 'bg-green-500', 
        text: 'Good', 
        icon: FiCheck,
        textColor: 'text-green-800 dark:text-green-300',
        bgColor: 'bg-green-100 dark:bg-green-900/30'
      }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <config.icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const getDaysUntilExpiryText = (days) => {
    if (days < 0) return { 
      text: `Expired ${Math.abs(days)} days ago`, 
      color: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-100 dark:bg-red-900/30' 
    };
    if (days === 0) return { 
      text: 'Expires today', 
      color: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-100 dark:bg-red-900/30' 
    };
    if (days <= 7) return { 
      text: `Expires in ${days} days`, 
      color: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-100 dark:bg-red-900/30' 
    };
    if (days <= 30) return { 
      text: `Expires in ${days} days`, 
      color: 'text-yellow-600 dark:text-yellow-400', 
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' 
    };
    return { 
      text: `Expires in ${days} days`, 
      color: 'text-green-600 dark:text-green-400', 
      bgColor: 'bg-green-100 dark:bg-green-900/30' 
    };
  };

  const calculateTotalRiskValue = () => {
    return expiryData
      .filter(item => item.status === 'EXPIRED' || item.status === 'EXPIRING_SOON')
      .reduce((total, item) => total + (item.quantity * item.costPrice), 0);
  };

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
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
      case 'warning': return <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <FiBarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <FiBarChart2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatCurrency = (value) => {
    const amount = parseFloat(value) || 0;
    return `Rs. ${Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const handleGenerateReport = () => {
    try {
      const reportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const reportTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Get categorized data
      const expiredProducts = expiryData.filter(item => item.status === 'EXPIRED');
      const expiringSoonProducts = expiryData.filter(item => item.status === 'EXPIRING_SOON');
      const goodProducts = expiryData.filter(item => item.status === 'GOOD');

      // Group by category
      const categoryBreakdown = {};
      expiryData.forEach(item => {
        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = { expired: 0, expiringSoon: 0, good: 0, totalValue: 0 };
        }
        if (item.status === 'EXPIRED') categoryBreakdown[item.category].expired++;
        else if (item.status === 'EXPIRING_SOON') categoryBreakdown[item.category].expiringSoon++;
        else categoryBreakdown[item.category].good++;
        categoryBreakdown[item.category].totalValue += item.totalCost || 0;
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Expiry Monitoring Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: #f8fafc;
              color: #1e293b;
              line-height: 1.6;
            }
            .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
            
            /* Header */
            .header { 
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              padding: 30px;
              border-radius: 16px;
              margin-bottom: 24px;
              text-align: center;
              box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
            }
            .header h1 { font-size: 32px; margin-bottom: 8px; font-weight: 700; }
            .header .subtitle { opacity: 0.9; font-size: 14px; }
            .header .report-meta { 
              margin-top: 20px; 
              display: flex; 
              justify-content: center; 
              gap: 20px;
              flex-wrap: wrap;
              font-size: 13px;
            }
            .header .report-meta span { 
              background: rgba(255,255,255,0.2); 
              padding: 8px 16px; 
              border-radius: 25px;
              backdrop-filter: blur(10px);
            }
            
            /* Summary Cards */
            .summary-grid { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 16px; 
              margin-bottom: 24px; 
            }
            .summary-card { 
              background: white; 
              padding: 20px; 
              border-radius: 12px; 
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
              text-align: center;
              border-top: 4px solid;
            }
            .summary-card.yellow { border-top-color: #f59e0b; background: linear-gradient(to bottom, #fffbeb, white); }
            .summary-card.red { border-top-color: #ef4444; background: linear-gradient(to bottom, #fef2f2, white); }
            .summary-card.green { border-top-color: #22c55e; background: linear-gradient(to bottom, #f0fdf4, white); }
            .summary-card.purple { border-top-color: #a855f7; background: linear-gradient(to bottom, #faf5ff, white); }
            .summary-card .icon { font-size: 28px; margin-bottom: 8px; }
            .summary-card .value { font-size: 36px; font-weight: 800; }
            .summary-card.yellow .value { color: #d97706; }
            .summary-card.red .value { color: #dc2626; }
            .summary-card.green .value { color: #16a34a; }
            .summary-card.purple .value { color: #9333ea; }
            .summary-card .label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
            
            /* Section */
            .section { 
              background: white; 
              border-radius: 12px; 
              padding: 24px; 
              margin-bottom: 20px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .section-title { 
              font-size: 18px; 
              font-weight: 700; 
              color: #1e293b;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 2px solid #e2e8f0;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .section-title .icon { font-size: 20px; }
            
            /* Alert Section */
            .alert-section { 
              border-left: 4px solid;
              padding-left: 16px;
              margin-bottom: 20px;
            }
            .alert-section.danger { border-left-color: #ef4444; background: #fef2f2; padding: 16px; border-radius: 0 8px 8px 0; }
            .alert-section.warning { border-left-color: #f59e0b; background: #fffbeb; padding: 16px; border-radius: 0 8px 8px 0; }
            .alert-section h4 { font-weight: 600; margin-bottom: 8px; }
            .alert-section.danger h4 { color: #dc2626; }
            .alert-section.warning h4 { color: #d97706; }
            
            /* Table */
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { 
              background: linear-gradient(to right, #f8fafc, #f1f5f9); 
              padding: 14px 12px; 
              text-align: left; 
              font-weight: 600;
              color: #475569;
              border-bottom: 2px solid #e2e8f0;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 0.5px;
            }
            td { 
              padding: 12px; 
              border-bottom: 1px solid #f1f5f9;
              color: #334155;
            }
            tr:hover { background: #f8fafc; }
            
            /* Status Badges */
            .badge { 
              display: inline-block; 
              padding: 6px 12px; 
              border-radius: 20px; 
              font-size: 11px; 
              font-weight: 600;
              text-transform: uppercase;
            }
            .badge-expired { background: #fecaca; color: #dc2626; }
            .badge-warning { background: #fef3c7; color: #d97706; }
            .badge-good { background: #dcfce7; color: #16a34a; }
            
            /* Progress Bar */
            .health-bar { 
              width: 100%; 
              height: 24px; 
              background: #e2e8f0; 
              border-radius: 12px; 
              overflow: hidden;
              display: flex;
            }
            .health-bar .segment { height: 100%; transition: width 0.3s; }
            .health-bar .good { background: linear-gradient(to right, #22c55e, #16a34a); }
            .health-bar .warning { background: linear-gradient(to right, #f59e0b, #d97706); }
            .health-bar .danger { background: linear-gradient(to right, #ef4444, #dc2626); }
            
            /* Footer */
            .footer { 
              text-align: center; 
              padding: 24px; 
              color: #94a3b8;
              font-size: 12px;
              border-top: 1px solid #e2e8f0;
              margin-top: 24px;
            }
            .footer .company { font-weight: 600; color: #64748b; font-size: 14px; }
            
            /* Print Styles */
            @media print {
              body { background: white; }
              .container { padding: 0; }
              .section, .summary-card { box-shadow: none; border: 1px solid #e2e8f0; }
              .header { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>📦 Expiry Monitoring Report</h1>
              <p class="subtitle">Comprehensive Product Expiry Analysis & Stock Health Assessment</p>
              <div class="report-meta">
                <span>📅 ${reportDate}</span>
                <span>🕐 ${reportTime}</span>
                <span>📊 ${expiryData.length} Products Analyzed</span>
                <span>💰 Risk Value: ${formatCurrency(summaryMetrics.riskValue)}</span>
              </div>
            </div>
            
            <!-- Summary Cards -->
            <div class="summary-grid">
              <div class="summary-card yellow">
                <div class="icon">⚠️</div>
                <div class="value">${summaryMetrics.expiringSoon}</div>
                <div class="label">Expiring Soon</div>
              </div>
              <div class="summary-card red">
                <div class="icon">❌</div>
                <div class="value">${summaryMetrics.expired}</div>
                <div class="label">Expired</div>
              </div>
              <div class="summary-card green">
                <div class="icon">✅</div>
                <div class="value">${summaryMetrics.good}</div>
                <div class="label">Good Stock</div>
              </div>
              <div class="summary-card purple">
                <div class="icon">📈</div>
                <div class="value">${summaryMetrics.healthPercentage.toFixed(1)}%</div>
                <div class="label">Stock Health</div>
              </div>
            </div>
            
            <!-- Stock Health Overview -->
            <div class="section">
              <h3 class="section-title"><span class="icon">📊</span> Stock Health Overview</h3>
              <div class="health-bar">
                <div class="segment good" style="width: ${(summaryMetrics.good / summaryMetrics.totalItems * 100) || 0}%"></div>
                <div class="segment warning" style="width: ${(summaryMetrics.expiringSoon / summaryMetrics.totalItems * 100) || 0}%"></div>
                <div class="segment danger" style="width: ${(summaryMetrics.expired / summaryMetrics.totalItems * 100) || 0}%"></div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; color: #64748b;">
                <span>🟢 Good: ${summaryMetrics.good} items (${((summaryMetrics.good / summaryMetrics.totalItems * 100) || 0).toFixed(1)}%)</span>
                <span>🟡 Expiring: ${summaryMetrics.expiringSoon} items (${((summaryMetrics.expiringSoon / summaryMetrics.totalItems * 100) || 0).toFixed(1)}%)</span>
                <span>🔴 Expired: ${summaryMetrics.expired} items (${((summaryMetrics.expired / summaryMetrics.totalItems * 100) || 0).toFixed(1)}%)</span>
              </div>
            </div>

            ${expiredProducts.length > 0 ? `
            <!-- Expired Products - Critical Alert -->
            <div class="section">
              <div class="alert-section danger">
                <h4>🚨 CRITICAL: ${expiredProducts.length} Expired Products Require Immediate Action</h4>
                <p style="font-size: 13px; color: #7f1d1d;">These products have passed their expiry date and should be removed from inventory immediately.</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Batch No</th>
                    <th>Qty</th>
                    <th>Expiry Date</th>
                    <th>Days Expired</th>
                    <th>Risk Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${expiredProducts.slice(0, 15).map(item => `
                    <tr>
                      <td><strong>${item.productName}</strong><br><small style="color:#94a3b8;">${item.supplier || 'N/A'}</small></td>
                      <td><span class="badge badge-expired">${item.category}</span></td>
                      <td>${item.batchNo || 'N/A'}</td>
                      <td><strong>${parseInt(item.quantity)}</strong></td>
                      <td style="color:#dc2626; font-weight:600;">${item.expiryDate || 'N/A'}</td>
                      <td style="color:#dc2626; font-weight:700;">${Math.abs(item.daysUntilExpiry)} days ago</td>
                      <td style="color:#dc2626; font-weight:600;">${formatCurrency(item.totalCost)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${expiredProducts.length > 15 ? `<p style="text-align:center; margin-top:12px; color:#64748b; font-size:12px;">... and ${expiredProducts.length - 15} more expired products</p>` : ''}
            </div>
            ` : ''}

            ${expiringSoonProducts.length > 0 ? `
            <!-- Expiring Soon Products - Warning -->
            <div class="section">
              <div class="alert-section warning">
                <h4>⚠️ WARNING: ${expiringSoonProducts.length} Products Expiring Within 30 Days</h4>
                <p style="font-size: 13px; color: #92400e;">These products need attention. Consider promotions or stock rotation.</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Batch No</th>
                    <th>Qty</th>
                    <th>Expiry Date</th>
                    <th>Days Left</th>
                    <th>Value at Risk</th>
                  </tr>
                </thead>
                <tbody>
                  ${expiringSoonProducts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry).slice(0, 15).map(item => `
                    <tr>
                      <td><strong>${item.productName}</strong><br><small style="color:#94a3b8;">${item.supplier || 'N/A'}</small></td>
                      <td><span class="badge badge-warning">${item.category}</span></td>
                      <td>${item.batchNo || 'N/A'}</td>
                      <td><strong>${parseInt(item.quantity)}</strong></td>
                      <td style="color:#d97706; font-weight:600;">${item.expiryDate || 'N/A'}</td>
                      <td style="color:#d97706; font-weight:700;">${item.daysUntilExpiry} days</td>
                      <td style="color:#d97706; font-weight:600;">${formatCurrency(item.totalCost)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${expiringSoonProducts.length > 15 ? `<p style="text-align:center; margin-top:12px; color:#64748b; font-size:12px;">... and ${expiringSoonProducts.length - 15} more products expiring soon</p>` : ''}
            </div>
            ` : ''}
            
            <!-- Category Breakdown -->
            <div class="section">
              <h3 class="section-title"><span class="icon">📁</span> Category-wise Analysis</h3>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Expired</th>
                    <th>Expiring Soon</th>
                    <th>Good</th>
                    <th>Total Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.entries(categoryBreakdown).map(([category, data]) => `
                    <tr>
                      <td><strong>${category}</strong></td>
                      <td style="color:#dc2626; font-weight:600;">${data.expired}</td>
                      <td style="color:#d97706; font-weight:600;">${data.expiringSoon}</td>
                      <td style="color:#16a34a; font-weight:600;">${data.good}</td>
                      <td>${formatCurrency(data.totalValue)}</td>
                      <td>
                        ${data.expired > 0 ? '<span class="badge badge-expired">Needs Action</span>' : 
                          data.expiringSoon > 0 ? '<span class="badge badge-warning">Monitor</span>' : 
                          '<span class="badge badge-good">Healthy</span>'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Good Stock Summary -->
            <div class="section">
              <h3 class="section-title"><span class="icon">✅</span> Healthy Stock Summary (${goodProducts.length} Products)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Batch No</th>
                    <th>Qty</th>
                    <th>Expiry Date</th>
                    <th>Days Remaining</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${goodProducts.slice(0, 10).map(item => `
                    <tr>
                      <td><strong>${item.productName}</strong></td>
                      <td>${item.category}</td>
                      <td>${item.batchNo || 'N/A'}</td>
                      <td>${parseInt(item.quantity)}</td>
                      <td>${item.expiryDate || 'N/A'}</td>
                      <td style="color:#16a34a; font-weight:600;">${item.daysUntilExpiry} days</td>
                      <td><span class="badge badge-good">Good</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${goodProducts.length > 10 ? `<p style="text-align:center; margin-top:12px; color:#64748b; font-size:12px;">... and ${goodProducts.length - 10} more products in good condition</p>` : ''}
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p class="company">METRO POS - Inventory Management System</p>
              <p>Generated on ${reportDate} at ${reportTime}</p>
              <p style="margin-top:8px;">📧 For queries, contact inventory@metropos.com | 📞 Support: +94 11 234 5678</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create blob and trigger download, and also open in new tab for viewing
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new tab for immediate viewing
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
      
      // Also trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `Expiry_Monitoring_Report_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after a delay to allow both operations to complete
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      showAlertMessage("Expiry report generated and downloaded successfully!", "success");
    } catch (error) {
      console.error('Report generation error:', error);
      showAlertMessage("Failed to generate report: " + error.message, "error");
    }
  };

  const handleSendAlerts = () => {
    setShowAlertsModal(true);
  };

  const summaryMetrics = React.useMemo(() => {
    const expiringSoon = expiryData.filter(item => item.status === 'EXPIRING_SOON').length;
    const expired = expiryData.filter(item => item.status === 'EXPIRED').length;
    const good = expiryData.filter(item => item.status === 'GOOD').length;
    const totalItems = expiryData.length;
    const healthPercentage = totalItems > 0 ? (good / totalItems * 100) : 0;
    const riskValue = calculateTotalRiskValue();

    return {
      expiringSoon,
      expired,
      good,
      totalItems,
      healthPercentage,
      riskValue,
      totalCategories: categories.length - 1
    };
  }, [expiryData, categories]);

  return (
    <div className="flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border">
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

      {/* Expiry Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999] p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className={`rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FiAlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">⚠️ Expiry Alerts Dashboard</h2>
                    <p className="text-white/80 text-sm">Products requiring immediate attention</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAlertsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              {/* Quick Stats in Header */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-3xl font-bold">{expiryData.filter(item => item.status === 'EXPIRED').length}</div>
                  <div className="text-white/80 text-xs">Expired Products</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-3xl font-bold">{expiryData.filter(item => item.status === 'EXPIRING_SOON').length}</div>
                  <div className="text-white/80 text-xs">Expiring Soon</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-3xl font-bold">{formatCurrency(summaryMetrics.riskValue)}</div>
                  <div className="text-white/80 text-xs">Total Risk Value</div>
                </div>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Expired Products Section */}
              {expiryData.filter(item => item.status === 'EXPIRED').length > 0 && (
                <div className="mb-6">
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                    <div className="p-2 bg-red-500 rounded-lg">
                      <FiX className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-600 dark:text-red-400">🚨 CRITICAL - Expired Products ({expiryData.filter(item => item.status === 'EXPIRED').length})</h3>
                      <p className="text-xs text-red-600/70 dark:text-red-400/70">These products must be removed from inventory immediately</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {expiryData.filter(item => item.status === 'EXPIRED').map((item, index) => (
                      <div 
                        key={item.id || index}
                        className={`flex items-center justify-between p-4 rounded-xl border-l-4 border-red-500 ${darkMode ? 'bg-gray-700/50' : 'bg-red-50/50'} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <FiPackage className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{item.productName}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">{item.category}</span>
                              <span>•</span>
                              <span>Batch: {item.batchNo || 'N/A'}</span>
                              <span>•</span>
                              <span>{item.supplier || 'Unknown Supplier'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Quantity</div>
                              <div className="font-bold text-gray-900 dark:text-white">{parseInt(item.quantity)} units</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Expired On</div>
                              <div className="font-bold text-red-600 dark:text-red-400">{item.expiryDate}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Days Ago</div>
                              <div className="font-bold text-red-600 dark:text-red-400">{Math.abs(item.daysUntilExpiry)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Loss Value</div>
                              <div className="font-bold text-red-600 dark:text-red-400">{formatCurrency(item.totalCost)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Expiring Soon Products Section */}
              {expiryData.filter(item => item.status === 'EXPIRING_SOON').length > 0 && (
                <div>
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl ${darkMode ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="p-2 bg-yellow-500 rounded-lg">
                      <FiAlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-yellow-600 dark:text-yellow-400">⚠️ WARNING - Expiring Soon ({expiryData.filter(item => item.status === 'EXPIRING_SOON').length})</h3>
                      <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70">Products expiring within the next 30 days - Consider promotions or stock rotation</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {expiryData.filter(item => item.status === 'EXPIRING_SOON').sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry).map((item, index) => (
                      <div 
                        key={item.id || index}
                        className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                          item.daysUntilExpiry <= 7 ? 'border-orange-500' : 'border-yellow-500'
                        } ${darkMode ? 'bg-gray-700/50' : 'bg-yellow-50/50'} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${item.daysUntilExpiry <= 7 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                            <FiClock className={`w-5 h-5 ${item.daysUntilExpiry <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{item.productName}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">{item.category}</span>
                              <span>•</span>
                              <span>Batch: {item.batchNo || 'N/A'}</span>
                              <span>•</span>
                              <span>{item.supplier || 'Unknown Supplier'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Quantity</div>
                              <div className="font-bold text-gray-900 dark:text-white">{parseInt(item.quantity)} units</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</div>
                              <div className={`font-bold ${item.daysUntilExpiry <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                {item.expiryDate}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Days Left</div>
                              <div className={`font-bold text-lg ${
                                item.daysUntilExpiry <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-yellow-600 dark:text-yellow-400'
                              }`}>
                                {item.daysUntilExpiry}
                                <span className="text-xs ml-1">days</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">At Risk</div>
                              <div className={`font-bold ${item.daysUntilExpiry <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                {formatCurrency(item.totalCost)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* No Alerts */}
              {expiryData.filter(item => item.status === 'EXPIRED' || item.status === 'EXPIRING_SOON').length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All Clear! 🎉</h3>
                  <p className="text-gray-600 dark:text-gray-400">No expired or expiring soon products found. Your inventory is in great shape!</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {lastUpdated.toLocaleString()}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleGenerateReport();
                      setShowAlertsModal(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <FiPrinter className="w-4 h-4" />
                    Download Report
                  </button>
                  <button
                    onClick={() => setShowAlertsModal(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Breadcrumb current="Inventory / Expiry Report" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiClock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Expiry Monitoring Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Monitor and manage product expiry dates in real-time
                {lastUpdated && (
                  <span className="ml-2 text-green-600 dark:text-green-400">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Responsive Button Group */}
          <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
            {/* Refresh Controls */}
            <div className="flex gap-2">
              <button
                onClick={loadBatches}
                disabled={loading}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-3 py-2 rounded-lg text-sm min-w-[100px] justify-center disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-sm min-w-[140px] justify-center"
              >
                <FiPrinter className="w-4 h-4" />
                Generate Report
              </button>

              <button
                onClick={handleSendAlerts}
                className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center"
              >
                <FiAlertCircle className="w-4 h-4" />
                Send Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Primary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="rounded-lg p-2 shadow border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Expiring Soon (≤30 days)</p>
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  {summaryMetrics.expiringSoon}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiAlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700 dark:text-red-300">Expired Products</p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {summaryMetrics.expired}
                </p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 dark:text-green-300">Good Stock</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {summaryMetrics.good}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-700 dark:text-purple-300">Risk Value</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(summaryMetrics.riskValue)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FiDollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Products</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{summaryMetrics.totalItems}</p>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FiPackage className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Stock Health</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {summaryMetrics.healthPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <FiPieChart className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{summaryMetrics.totalCategories}</p>
              </div>
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FiTag className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="ALL">All Status</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="EXPIRED">Expired</option>
                <option value="GOOD">Good Stock</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products, batches, or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className="rounded-lg p-1 md:p-2 h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin border-green-200 dark:border-green-800"></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 dark:border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Loading expiry data...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl p-4 text-center h-full flex items-center justify-center border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
              <div>
                <div className="font-medium text-sm text-red-600 dark:text-red-400">
                  ⚠️ Error
                </div>
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
                <button
                  onClick={loadBatches}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Products Table */}
              {filteredData.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Product Expiry Details
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {filteredData.length} item{filteredData.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Expiry Monitoring Table
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Product Details
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Batch Info
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Stock & Pricing
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Expiry Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredData.map((product) => {
                            const expiryInfo = getDaysUntilExpiryText(product.daysUntilExpiry);
                            return (
                              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${
                                      product.status === 'EXPIRED' ? 'bg-red-100 dark:bg-red-900/30' :
                                      product.status === 'EXPIRING_SOON' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                      'bg-green-100 dark:bg-green-900/30'
                                    } flex items-center justify-center`}>
                                      {product.status === 'EXPIRED' ? (
                                        <FiX className="w-4 h-4 text-red-600 dark:text-red-400" />
                                      ) : product.status === 'EXPIRING_SOON' ? (
                                        <FiAlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                      ) : (
                                        <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                                        {product.productName}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {product.category} • {product.supplier}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div>
                                    <div className="text-xs font-medium text-gray-900 dark:text-white">{product.batchNo}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'No expiry'}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div>
                                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                                      {product.quantity} bottles
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      Cost: {formatCurrency(product.costPrice)} • Sell: {formatCurrency(product.sellingPrice)}
                                    </div>
                                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                                      Total: {formatCurrency(product.totalCost)}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="space-y-2">
                                    {getStatusBadge(product.status)}
                                    <div className={`text-xs font-medium ${expiryInfo.color} px-2 py-1 rounded ${expiryInfo.bgColor}`}>
                                      {expiryInfo.text}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                          <FiActivity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Quick Sale Required</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {summaryMetrics.expiringSoon} products need immediate attention
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                          <FiX className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Remove Expired Stock</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {summaryMetrics.expired} expired products to be removed
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                          <FiTrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Stock Health</h4>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {summaryMetrics.healthPercentage.toFixed(1)}% of stock is in good condition
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Expiry Status Breakdown
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs text-gray-700 dark:text-gray-300">Expired Products</span>
                          </div>
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                            {summaryMetrics.expired} ({summaryMetrics.totalItems > 0 ? (summaryMetrics.expired/summaryMetrics.totalItems*100).toFixed(1) : 0}%)
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-xs text-gray-700 dark:text-gray-300">Expiring Soon (≤30 days)</span>
                          </div>
                          <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                            {summaryMetrics.expiringSoon} ({summaryMetrics.totalItems > 0 ? (summaryMetrics.expiringSoon/summaryMetrics.totalItems*100).toFixed(1) : 0}%)
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-gray-700 dark:text-gray-300">Good Stock</span>
                          </div>
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                            {summaryMetrics.good} ({summaryMetrics.totalItems > 0 ? (summaryMetrics.good/summaryMetrics.totalItems*100).toFixed(1) : 0}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FiPackage className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchTerm || filter !== 'ALL' || selectedCategory !== 'ALL' ? 'No Products Found' : 'No Expiry Data'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm 
                      ? `No products found matching "${searchTerm}". Try a different search term.`
                      : filter !== 'ALL' || selectedCategory !== 'ALL'
                      ? 'No products match the selected filters. Try adjusting your filters.'
                      : 'No expiry data available. Load data or check back later.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exp;