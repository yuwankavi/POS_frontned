
// // export default ItemsReport;
// import React, { useEffect, useState } from 'react';
// import reportService from '../../services/reportService';
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
//   FiFilter
// } from "react-icons/fi";
// import Breadcrumb from "../../components/common/Breadcrumb.js";

// const ItemsReport = () => {
//   const today = new Date().toISOString().slice(0, 10);
//   const [reportDate, setReportDate] = useState(today);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: 'salesValue', direction: 'desc' });

//   const summary = React.useMemo(() => {
//     const totalQty = data.reduce((sum, item) => sum + (item.soldQty || 0), 0);
//     const totalSales = data.reduce((sum, item) => sum + (item.salesValue || 0), 0);
//     const totalProfit = data.reduce((sum, item) => sum + (item.totalProfit || 0), 0);
//     const avgProfitMargin = totalSales > 0 ? (totalProfit / totalSales * 100) : 0;
    
//     return {
//       totalItems: data.length,
//       totalQty,
//       totalSales,
//       totalProfit,
//       avgProfitMargin,
//       avgSalesPerItem: data.length > 0 ? totalSales / data.length : 0
//     };
//   }, [data]);

//   const filteredData = React.useMemo(() => {
//     if (!searchTerm) return data;
//     return data.filter(item => 
//       (item.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [data, searchTerm]);

//   const sortedData = React.useMemo(() => {
//     const sortableData = [...filteredData];
//     if (sortConfig.key) {
//       sortableData.sort((a, b) => {
//         const aVal = a[sortConfig.key] || 0;
//         const bVal = b[sortConfig.key] || 0;
        
//         if (aVal < bVal) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aVal > bVal) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableData;
//   }, [filteredData, sortConfig]);

//   const load = async (date) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await reportService.getInvoiceReports(date);
//       const items = res.ResultSet || [];
//       const map = {};
      
//       items.forEach(it => {
//         const key = it.PRCODE || it.SKU || it.PRDESC || 'Unknown';
//         const desc = it.PRDESC || it.SKU || key;
//         if (!map[key]) {
//           map[key] = { 
//             key, 
//             desc, 
//             sku: it.SKU || 'N/A',
//             soldQty: 0, 
//             salesValue: 0, 
//             totalProfit: 0,
//             profitMargin: 0
//           };
//         }
//         const qty = parseFloat(it.SOLDQTY || 0);
//         const sales = parseFloat(it.SALESVALUE || 0);
//         const profit = parseFloat(it.TOTAL_PROFIT || 0);
        
//         map[key].soldQty += qty;
//         map[key].salesValue += sales;
//         map[key].totalProfit += profit;
//       });

//       // Calculate profit margins
//       Object.values(map).forEach(item => {
//         item.profitMargin = item.salesValue > 0 ? (item.totalProfit / item.salesValue) * 100 : 0;
//       });

//       const itemsArray = Object.values(map);
//       setData(itemsArray);
//       setLastUpdated(new Date());
//       showAlertMessage("Report loaded successfully", "success");
//     } catch (err) {
//       setError(err.message || 'Failed to load items report');
//       showAlertMessage("Failed to load report data", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-load when date changes
//   useEffect(() => {
//     load(reportDate);
//   }, [reportDate]);

//   const handleDateChange = (e) => {
//     setReportDate(e.target.value);
//   };

//   const handleRefresh = () => {
//     load(reportDate);
//   };

//   const handleSort = (key) => {
//     let direction = 'desc';
//     if (sortConfig.key === key && sortConfig.direction === 'desc') {
//       direction = 'asc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const SortIcon = ({ direction }) => (
//     <svg 
//       className={`w-3 h-3 ml-1 ${direction === 'asc' ? 'transform rotate-180' : ''}`} 
//       fill="none" 
//       stroke="currentColor" 
//       viewBox="0 0 24 24"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//     </svg>
//   );

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
//       case 'success': return 'bg-green-100 border-green-300 dark:bg-green-900/70 dark:border-green-700';
//       case 'error': return 'bg-red-100 border-red-300 dark:bg-red-900/70 dark:border-red-700';
//       case 'warning': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/70 dark:border-yellow-700';
//       case 'info': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/70 dark:border-blue-700';
//       default: return 'bg-gray-100 border-gray-300 dark:bg-gray-900/70 dark:border-gray-700';
//     }
//   };

//   const getAlertTextColor = () => {
//     switch (alertType) {
//       case 'success': return 'text-green-800 dark:text-green-200';
//       case 'error': return 'text-red-800 dark:text-red-200';
//       case 'warning': return 'text-yellow-800 dark:text-yellow-200';
//       case 'info': return 'text-blue-800 dark:text-blue-200';
//       default: return 'text-gray-800 dark:text-gray-200';
//     }
//   };

//   const getAlertIcon = () => {
//     switch (alertType) {
//       case 'success': return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
//       case 'error': return <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />;
//       case 'warning': return <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
//       case 'info': return <FiBarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
//       default: return <FiBarChart2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
//     }
//   };

//   const formatCurrency = (value) => {
//     const amount = parseFloat(value) || 0;
//     return `Rs. ${Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
//   };

//   // Custom print function with better formatting
//   const handlePrintReport = async () => {
//     if (isPrinting || data.length === 0) return;

//     setIsPrinting(true);
//     try {
//       const printContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Items Report - ${new Date(reportDate).toLocaleDateString()}</title>
//           <style>
//             @media print {
//               @page {
//                 size: A4 landscape;
//                 margin: 0.5cm;
//               }
              
//               body {
//                 font-family: Arial, sans-serif;
//                 font-size: 12px;
//                 line-height: 1.4;
//                 color: #000;
//                 background: white !important;
//               }
              
//               .print-header {
//                 text-align: center;
//                 margin-bottom: 20px;
//                 padding-bottom: 10px;
//                 border-bottom: 2px solid #333;
//               }
              
//               .print-header h1 {
//                 font-size: 20px;
//                 margin: 0 0 5px 0;
//                 color: #000;
//               }
              
//               .print-header p {
//                 margin: 0;
//                 color: #666;
//               }
              
//               .print-summary {
//                 display: grid;
//                 grid-template-columns: repeat(4, 1fr);
//                 gap: 10px;
//                 margin-bottom: 20px;
//               }
              
//               .summary-card {
//                 padding: 10px;
//                 border: 1px solid #ddd;
//                 border-radius: 4px;
//                 text-align: center;
//               }
              
//               .summary-card h3 {
//                 font-size: 11px;
//                 margin: 0 0 5px 0;
//                 color: #666;
//                 text-transform: uppercase;
//               }
              
//               .summary-card .value {
//                 font-size: 16px;
//                 font-weight: bold;
//                 color: #000;
//               }
              
//               .print-table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//               }
              
//               .print-table th {
//                 background-color: #f5f5f5 !important;
//                 color: #000 !important;
//                 border: 1px solid #ddd;
//                 padding: 8px;
//                 text-align: left;
//                 font-weight: bold;
//                 -webkit-print-color-adjust: exact;
//               }
              
//               .print-table td {
//                 border: 1px solid #ddd;
//                 padding: 8px;
//                 color: #000;
//               }
              
//               .print-table tr:nth-child(even) {
//                 background-color: #f9f9f9 !important;
//                 -webkit-print-color-adjust: exact;
//               }
              
//               .print-footer {
//                 margin-top: 30px;
//                 padding-top: 10px;
//                 border-top: 1px solid #333;
//                 font-size: 10px;
//                 color: #666;
//               }
              
//               .no-print {
//                 display: none !important;
//               }
              
//               .badge {
//                 padding: 2px 6px;
//                 border-radius: 10px;
//                 font-size: 11px;
//                 font-weight: bold;
//               }
              
//               .text-green { color: #059669 !important; }
//               .text-amber { color: #d97706 !important; }
//               .text-blue { color: #2563eb !important; }
//               .text-gray { color: #6b7280 !important; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-header">
//             <h1>Items Sales Report</h1>
//             <p>Date: ${new Date(reportDate).toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}</p>
//             <p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
//           </div>
          
//           <div class="print-summary">
//             <div class="summary-card">
//               <h3>Total Items</h3>
//               <div class="value">${summary.totalItems}</div>
//             </div>
//             <div class="summary-card">
//               <h3>Total Quantity</h3>
//               <div class="value">${summary.totalQty}</div>
//             </div>
//             <div class="summary-card">
//               <h3>Total Sales</h3>
//               <div class="value">Rs ${summary.totalSales.toLocaleString()}</div>
//             </div>
//             <div class="summary-card">
//               <h3>Total Profit</h3>
//               <div class="value">Rs ${summary.totalProfit.toLocaleString()}</div>
//             </div>
//           </div>
          
//           <table class="print-table">
//             <thead>
//               <tr>
//                 <th>Item Description</th>
//                 <th>SKU</th>
//                 <th>Quantity</th>
//                 <th>Sales Value</th>
//                 <th>Profit</th>
//                 <th>Margin</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sortedData.map(item => `
//                 <tr>
//                   <td>${item.desc}</td>
//                   <td class="text-gray">${item.sku}</td>
//                   <td><span class="badge" style="background-color: #dbeafe; color: #1e40af;">${item.soldQty}</span></td>
//                   <td class="text-green"><strong>Rs ${item.salesValue.toLocaleString()}</strong></td>
//                   <td class="text-amber"><strong>Rs ${item.totalProfit.toLocaleString()}</strong></td>
//                   <td>
//                     <span class="badge" style="
//                       background-color: ${item.profitMargin >= 20 ? '#d1fae5' : item.profitMargin >= 10 ? '#fef3c7' : '#fee2e2'};
//                       color: ${item.profitMargin >= 20 ? '#065f46' : item.profitMargin >= 10 ? '#92400e' : '#991b1b'};
//                     ">
//                       ${item.profitMargin.toFixed(1)}%
//                     </span>
//                   </td>
//                 </tr>
//               `).join('')}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colspan="2"><strong>Total</strong></td>
//                 <td><strong>${summary.totalQty}</strong></td>
//                 <td class="text-green"><strong>Rs ${summary.totalSales.toLocaleString()}</strong></td>
//                 <td class="text-amber"><strong>Rs ${summary.totalProfit.toLocaleString()}</strong></td>
//                 <td><strong>${summary.avgProfitMargin.toFixed(1)}%</strong></td>
//               </tr>
//             </tfoot>
//           </table>
          
//           <div class="print-footer">
//             <p>Report generated by METRO POS System</p>
//           </div>
//         </body>
//         </html>
//       `;

//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(printContent);
//       printWindow.document.close();
      
//       printWindow.onload = function() {
//         printWindow.focus();
//         printWindow.print();
//         printWindow.onafterprint = function() {
//           printWindow.close();
//         };
//       };
      
//       showAlertMessage("Report printed successfully", "success");
//     } catch (error) {
//       showAlertMessage(`Failed to print report: ${error.message}`, "error");
//     } finally {
//       setIsPrinting(false);
//     }
//   };

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

//       <Breadcrumb current="Reports / Items Report" />

//       {/* Header */}
//       <div className="mt-2 mb-3 md:mb-5">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
//               <FiPackage className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900">
//                 Items Sales Dashboard
//               </h1>
//               <p className="text-xs text-gray-600">
//                 Detailed analysis of item sales performance
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
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm min-w-[100px] justify-center disabled:opacity-50"
//               >
//                 <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                 {loading ? "Loading..." : "Refresh"}
//               </button>
//             </div>

//             {/* Print Button */}
//             <button
//               onClick={handlePrintReport}
//               disabled={isPrinting || data.length === 0}
//               className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm min-w-[120px] justify-center disabled:opacity-50"
//             >
//               <FiPrinter className="w-4 h-4" />
//               {isPrinting ? "Printing..." : "Print Report"}
//             </button>

//             {/* Date Filter */}
//             <div className="flex gap-2">
//               <button className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center">
//                 <FiCalendar className="w-4 h-4" />
//                 Select Date
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Date Selection */}
//         <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-700">
//               Report Date:
//             </span>
//             <input
//               type="date"
//               value={reportDate}
//               onChange={handleDateChange}
//               className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Primary Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Total Items</p>
//                 <p className="text-sm font-bold text-blue-600">
//                   {summary.totalItems}
//                 </p>
//               </div>
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <FiPackage className="w-4 h-4 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Total Sales</p>
//                 <p className="text-sm font-bold text-green-600">
//                   {formatCurrency(summary.totalSales)}
//                 </p>
//               </div>
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <FiDollarSign className="w-4 h-4 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Total Profit</p>
//                 <p className="text-sm font-bold text-purple-600">
//                   {formatCurrency(summary.totalProfit)}
//                 </p>
//               </div>
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <FiTrendingUp className="w-4 h-4 text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Items Sold</p>
//                 <p className="text-sm font-bold text-orange-600">
//                   {summary.totalQty.toLocaleString('en-IN')}
//                 </p>
//               </div>
//               <div className="p-2 bg-orange-100 rounded-lg">
//                 <FiShoppingCart className="w-4 h-4 text-orange-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Avg. Profit Margin</p>
//                 <p className="text-sm font-bold text-indigo-600">
//                   {summary.avgProfitMargin.toFixed(1)}%
//                 </p>
//               </div>
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <FiPieChart className="w-3 h-3 text-indigo-600" />
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Avg. Sales per Item</p>
//                 <p className="text-sm font-bold text-emerald-600">
//                   {formatCurrency(summary.avgSalesPerItem)}
//                 </p>
//               </div>
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <FiBarChart2 className="w-3 h-3 text-emerald-600" />
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Report Date</p>
//                 <p className="text-sm font-bold text-cyan-600">
//                   {new Date(reportDate).toLocaleDateString('en-GB')}
//                 </p>
//               </div>
//               <div className="p-2 bg-cyan-100 rounded-lg">
//                 <FiCalendar className="w-3 h-3 text-cyan-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="relative flex-1">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search by item description or SKU..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-gray-50 border-gray-200 text-gray-900"
//             />
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
//                   Loading Items Report...
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
//                   onClick={handleRefresh}
//                   className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Items Table */}
//               {sortedData.length > 0 ? (
//                 <>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">
//                       Item Performance Details
//                     </h3>
//                     <span className="text-xs text-gray-500">
//                       Showing {sortedData.length} item{sortedData.length !== 1 ? 's' : ''} • Click headers to sort
//                     </span>
//                   </div>
                  
//                   <div className="bg-white rounded-xl border border-gray-200">
//                     <div className="p-4 border-b border-gray-200">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-semibold text-gray-900">
//                           Sales Performance Summary
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
//                             <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                               <button
//                                 onClick={() => handleSort('desc')}
//                                 className="flex items-center hover:text-gray-900"
//                               >
//                                 Item Description
//                                 <SortIcon direction={sortConfig.key === 'desc' ? sortConfig.direction : null} />
//                               </button>
//                             </th>
//                             <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                               SKU
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               <button
//                                 onClick={() => handleSort('soldQty')}
//                                 className="flex items-center justify-end hover:text-gray-900"
//                               >
//                                 Quantity
//                                 <SortIcon direction={sortConfig.key === 'soldQty' ? sortConfig.direction : null} />
//                               </button>
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               <button
//                                 onClick={() => handleSort('salesValue')}
//                                 className="flex items-center justify-end hover:text-gray-900"
//                               >
//                                 Total Sales
//                                 <SortIcon direction={sortConfig.key === 'salesValue' ? sortConfig.direction : null} />
//                               </button>
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               <button
//                                 onClick={() => handleSort('totalProfit')}
//                                 className="flex items-center justify-end hover:text-gray-900"
//                               >
//                                 Total Profit
//                                 <SortIcon direction={sortConfig.key === 'totalProfit' ? sortConfig.direction : null} />
//                               </button>
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               <button
//                                 onClick={() => handleSort('profitMargin')}
//                                 className="flex items-center justify-end hover:text-gray-900"
//                               >
//                                 Margin %
//                                 <SortIcon direction={sortConfig.key === 'profitMargin' ? sortConfig.direction : null} />
//                               </button>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {sortedData.map((item, index) => {
//                             const margin = item.profitMargin || 0;
//                             return (
//                               <tr key={item.key} className="hover:bg-gray-50 transition-colors">
//                                 <td className="px-4 py-3">
//                                   <div className="flex items-center gap-3">
//                                     <div className={`w-8 h-8 rounded-lg ${
//                                       index === 0 ? 'bg-gradient-to-br from-yellow-100 to-amber-100' :
//                                       index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
//                                       index === 2 ? 'bg-gradient-to-br from-amber-50 to-amber-100' :
//                                       'bg-gradient-to-br from-blue-50 to-indigo-50'
//                                     } flex items-center justify-center`}>
//                                       <span className="text-xs font-bold ${
//                                         index === 0 ? 'text-yellow-700' :
//                                         index === 1 ? 'text-gray-700' :
//                                         index === 2 ? 'text-amber-700' :
//                                         'text-blue-700'
//                                       }">
//                                         #{index + 1}
//                                       </span>
//                                     </div>
//                                     <div>
//                                       <div className="text-xs font-medium text-gray-900">
//                                         {item.desc}
//                                       </div>
//                                       {item.desc !== item.sku && (
//                                         <div className="text-xs text-gray-500 mt-1">
//                                           SKU: {item.sku}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-3 text-xs text-gray-600">
//                                   {item.sku}
//                                 </td>
//                                 <td className="px-4 py-3 text-right">
//                                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                                     {item.soldQty}
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-3 text-right text-xs font-semibold text-green-600">
//                                   {formatCurrency(item.salesValue)}
//                                 </td>
//                                 <td className="px-4 py-3 text-right text-xs font-semibold text-amber-600">
//                                   {formatCurrency(item.totalProfit)}
//                                 </td>
//                                 <td className="px-4 py-3 text-right">
//                                   <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                                     margin >= 20 
//                                       ? 'bg-green-100 text-green-800'
//                                       : margin >= 10
//                                       ? 'bg-yellow-100 text-yellow-800'
//                                       : 'bg-red-100 text-red-800'
//                                   }`}>
//                                     {margin.toFixed(1)}%
//                                   </span>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                         <tfoot className="bg-gray-50">
//                           <tr>
//                             <td colSpan="2" className="px-4 py-3 text-xs font-bold text-gray-700">
//                               TOTAL ({sortedData.length} items)
//                             </td>
//                             <td className="px-4 py-3 text-right text-xs font-bold">
//                               {summary.totalQty}
//                             </td>
//                             <td className="px-4 py-3 text-right text-xs font-bold text-green-600">
//                               {formatCurrency(summary.totalSales)}
//                             </td>
//                             <td className="px-4 py-3 text-right text-xs font-bold text-amber-600">
//                               {formatCurrency(summary.totalProfit)}
//                             </td>
//                             <td className="px-4 py-3 text-right text-xs font-bold text-blue-600">
//                               {summary.avgProfitMargin.toFixed(1)}%
//                             </td>
//                           </tr>
//                         </tfoot>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Top Performers Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//                     {/* Top Sales */}
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <h4 className="text-xs font-semibold text-gray-900 mb-3">🏆 Top Sales</h4>
//                       {sortedData.slice(0, 3).map((item, index) => (
//                         <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
//                           <div className="flex items-center gap-2">
//                             <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
//                               index === 0 ? 'bg-yellow-100 text-yellow-700' :
//                               index === 1 ? 'bg-gray-100 text-gray-700' :
//                               'bg-amber-100 text-amber-700'
//                             }`}>
//                               {index + 1}
//                             </div>
//                             <span className="text-xs text-gray-700 truncate max-w-[120px]">
//                               {item.desc}
//                             </span>
//                           </div>
//                           <span className="text-xs font-semibold text-green-600">
//                             {formatCurrency(item.salesValue)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Top Quantity */}
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <h4 className="text-xs font-semibold text-gray-900 mb-3">📦 Top Quantity</h4>
//                       {[...sortedData]
//                         .sort((a, b) => b.soldQty - a.soldQty)
//                         .slice(0, 3)
//                         .map((item, index) => (
//                           <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
//                             <div className="flex items-center gap-2">
//                               <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
//                                 index === 0 ? 'bg-blue-100 text-blue-700' :
//                                 index === 1 ? 'bg-purple-100 text-purple-700' :
//                                 'bg-indigo-100 text-indigo-700'
//                               }`}>
//                                 {index + 1}
//                               </div>
//                               <span className="text-xs text-gray-700 truncate max-w-[120px]">
//                                 {item.desc}
//                               </span>
//                             </div>
//                             <span className="text-xs font-semibold text-blue-600">
//                               {item.soldQty}
//                             </span>
//                           </div>
//                         ))}
//                     </div>

//                     {/* Top Margin */}
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <h4 className="text-xs font-semibold text-gray-900 mb-3">💰 Top Margin</h4>
//                       {[...sortedData]
//                         .filter(item => item.salesValue > 0)
//                         .sort((a, b) => b.profitMargin - a.profitMargin)
//                         .slice(0, 3)
//                         .map((item, index) => {
//                           const margin = item.profitMargin || 0;
//                           return (
//                             <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
//                               <div className="flex items-center gap-2">
//                                 <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
//                                   index === 0 ? 'bg-green-100 text-green-700' :
//                                   index === 1 ? 'bg-emerald-100 text-emerald-700' :
//                                   'bg-teal-100 text-teal-700'
//                                 }`}>
//                                   {index + 1}
//                                 </div>
//                                 <span className="text-xs text-gray-700 truncate max-w-[120px]">
//                                   {item.desc}
//                                 </span>
//                               </div>
//                               <span className={`text-xs font-semibold ${
//                                 margin >= 20 ? 'text-green-600' :
//                                 margin >= 10 ? 'text-yellow-600' :
//                                 'text-red-600'
//                               }`}>
//                                 {margin.toFixed(1)}%
//                               </span>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                     <FiPackage className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     {searchTerm ? 'No Items Found' : 'No Data Available'}
//                   </h3>
//                   <p className="text-gray-600 max-w-md mx-auto">
//                     {searchTerm 
//                       ? `No items found matching "${searchTerm}". Try a different search term.`
//                       : `No item sales data found for ${new Date(reportDate).toLocaleDateString()}. Try selecting a different date.`
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

// export default ItemsReport;
import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';
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
  FiFilter
} from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb.js";

const ItemsReport = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [reportDate, setReportDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isPrinting, setIsPrinting] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'salesValue', direction: 'desc' });

  const summary = React.useMemo(() => {
    const totalQty = data.reduce((sum, item) => sum + (item.soldQty || 0), 0);
    const totalSales = data.reduce((sum, item) => sum + (item.salesValue || 0), 0);
    const totalProfit = data.reduce((sum, item) => sum + (item.totalProfit || 0), 0);
    const avgProfitMargin = totalSales > 0 ? (totalProfit / totalSales * 100) : 0;
    
    return {
      totalItems: data.length,
      totalQty,
      totalSales,
      totalProfit,
      avgProfitMargin,
      avgSalesPerItem: data.length > 0 ? totalSales / data.length : 0
    };
  }, [data]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      (item.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = React.useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key] || 0;
        const bVal = b[sortConfig.key] || 0;
        
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const load = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getInvoiceReports(date);
      const items = res.ResultSet || [];
      const map = {};
      
      items.forEach(it => {
        const key = it.PRCODE || it.SKU || it.PRDESC || 'Unknown';
        const desc = it.PRDESC || it.SKU || key;
        if (!map[key]) {
          map[key] = { 
            key, 
            desc, 
            sku: it.SKU || 'N/A',
            soldQty: 0, 
            salesValue: 0, 
            totalProfit: 0,
            profitMargin: 0
          };
        }
        const qty = parseFloat(it.SOLDQTY || 0);
        const sales = parseFloat(it.SALESVALUE || 0);
        const profit = parseFloat(it.TOTAL_PROFIT || 0);
        
        map[key].soldQty += qty;
        map[key].salesValue += sales;
        map[key].totalProfit += profit;
      });

      // Calculate profit margins
      Object.values(map).forEach(item => {
        item.profitMargin = item.salesValue > 0 ? (item.totalProfit / item.salesValue) * 100 : 0;
      });

      const itemsArray = Object.values(map);
      setData(itemsArray);
      setLastUpdated(new Date());
      showAlertMessage("Report loaded successfully", "success");
    } catch (err) {
      setError(err.message || 'Failed to load items report');
      showAlertMessage("Failed to load report data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Auto-load when date changes
  useEffect(() => {
    load(reportDate);
  }, [reportDate]);

  const handleDateChange = (e) => {
    setReportDate(e.target.value);
  };

  const handleRefresh = () => {
    load(reportDate);
  };

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ direction }) => (
    <svg 
      className={`w-3 h-3 ml-1 ${direction === 'asc' ? 'transform rotate-180' : ''}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

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
      case 'warning': return <FiPackage className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info': return <FiBarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <FiBarChart2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatCurrency = (value) => {
    const amount = parseFloat(value) || 0;
    return `Rs. ${Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Custom print function with better formatting
  const handlePrintReport = async () => {
    if (isPrinting || data.length === 0) return;

    setIsPrinting(true);
    try {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Items Report - ${new Date(reportDate).toLocaleDateString()}</title>
          <style>
            @media print {
              @page {
                size: A4 landscape;
                margin: 0.5cm;
              }
              
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #000;
                background: white !important;
              }
              
              .print-header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #333;
              }
              
              .print-header h1 {
                font-size: 20px;
                margin: 0 0 5px 0;
                color: #000;
              }
              
              .print-header p {
                margin: 0;
                color: #666;
              }
              
              .print-summary {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-bottom: 20px;
              }
              
              .summary-card {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                text-align: center;
              }
              
              .summary-card h3 {
                font-size: 11px;
                margin: 0 0 5px 0;
                color: #666;
                text-transform: uppercase;
              }
              
              .summary-card .value {
                font-size: 16px;
                font-weight: bold;
                color: #000;
              }
              
              .print-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              
              .print-table th {
                background-color: #f5f5f5 !important;
                color: #000 !important;
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-weight: bold;
                -webkit-print-color-adjust: exact;
              }
              
              .print-table td {
                border: 1px solid #ddd;
                padding: 8px;
                color: #000;
              }
              
              .print-table tr:nth-child(even) {
                background-color: #f9f9f9 !important;
                -webkit-print-color-adjust: exact;
              }
              
              .print-footer {
                margin-top: 30px;
                padding-top: 10px;
                border-top: 1px solid #333;
                font-size: 10px;
                color: #666;
              }
              
              .no-print {
                display: none !important;
              }
              
              .badge {
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: bold;
              }
              
              .text-green { color: #059669 !important; }
              .text-amber { color: #d97706 !important; }
              .text-blue { color: #2563eb !important; }
              .text-gray { color: #6b7280 !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Items Sales Report</h1>
            <p>Date: ${new Date(reportDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="print-summary">
            <div class="summary-card">
              <h3>Total Items</h3>
              <div class="value">${summary.totalItems}</div>
            </div>
            <div class="summary-card">
              <h3>Total Quantity</h3>
              <div class="value">${summary.totalQty}</div>
            </div>
            <div class="summary-card">
              <h3>Total Sales</h3>
              <div class="value">Rs ${summary.totalSales.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h3>Total Profit</h3>
              <div class="value">Rs ${summary.totalProfit.toLocaleString()}</div>
            </div>
          </div>
          
          <table class="print-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Sales Value</th>
                <th>Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              ${sortedData.map(item => `
                <tr>
                  <td>${item.desc}</td>
                  <td class="text-gray">${item.sku}</td>
                  <td><span class="badge" style="background-color: #dbeafe; color: #1e40af;">${item.soldQty}</span></td>
                  <td class="text-green"><strong>Rs ${item.salesValue.toLocaleString()}</strong></td>
                  <td class="text-amber"><strong>Rs ${item.totalProfit.toLocaleString()}</strong></td>
                  <td>
                    <span class="badge" style="
                      background-color: ${item.profitMargin >= 20 ? '#d1fae5' : item.profitMargin >= 10 ? '#fef3c7' : '#fee2e2'};
                      color: ${item.profitMargin >= 20 ? '#065f46' : item.profitMargin >= 10 ? '#92400e' : '#991b1b'};
                    ">
                      ${item.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"><strong>Total</strong></td>
                <td><strong>${summary.totalQty}</strong></td>
                <td class="text-green"><strong>Rs ${summary.totalSales.toLocaleString()}</strong></td>
                <td class="text-amber"><strong>Rs ${summary.totalProfit.toLocaleString()}</strong></td>
                <td><strong>${summary.avgProfitMargin.toFixed(1)}%</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="print-footer">
            <p>Report generated by METRO POS System</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
      
      showAlertMessage("Report printed successfully", "success");
    } catch (error) {
      showAlertMessage(`Failed to print report: ${error.message}`, "error");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border">
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

      <Breadcrumb current="Reports / Items Report" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiPackage className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Items Sales Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Detailed analysis of item sales performance
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
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-3 py-2 rounded-lg text-sm min-w-[100px] justify-center disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrintReport}
              disabled={isPrinting || data.length === 0}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-3 py-2 rounded-lg text-sm min-w-[120px] justify-center disabled:opacity-50"
            >
              <FiPrinter className="w-4 h-4" />
              {isPrinting ? "Printing..." : "Print Report"}
            </button>

            {/* Date Filter */}
            <div className="flex gap-2">
              <button className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center">
                <FiCalendar className="w-4 h-4" />
                Select Date
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Date:
            </span>
            <input
              type="date"
              value={reportDate}
              onChange={handleDateChange}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Primary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {summary.totalItems}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiPackage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Sales</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(summary.totalSales)}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiDollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Profit</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(summary.totalProfit)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FiTrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Items Sold</p>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {summary.totalQty.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <FiShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Profit Margin</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {summary.avgProfitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FiPieChart className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Sales per Item</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(summary.avgSalesPerItem)}
                </p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <FiBarChart2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Report Date</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {new Date(reportDate).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FiCalendar className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by item description or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
            />
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
                  Loading Items Report...
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
                  onClick={handleRefresh}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Items Table */}
              {sortedData.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Item Performance Details
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {sortedData.length} item{sortedData.length !== 1 ? 's' : ''} • Click headers to sort
                    </span>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Sales Performance Summary
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
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              <button
                                onClick={() => handleSort('desc')}
                                className="flex items-center hover:text-gray-900 dark:hover:text-white"
                              >
                                Item Description
                                <SortIcon direction={sortConfig.key === 'desc' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              SKU
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              <button
                                onClick={() => handleSort('soldQty')}
                                className="flex items-center justify-end hover:text-gray-900 dark:hover:text-white"
                              >
                                Quantity
                                <SortIcon direction={sortConfig.key === 'soldQty' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              <button
                                onClick={() => handleSort('salesValue')}
                                className="flex items-center justify-end hover:text-gray-900 dark:hover:text-white"
                              >
                                Total Sales
                                <SortIcon direction={sortConfig.key === 'salesValue' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              <button
                                onClick={() => handleSort('totalProfit')}
                                className="flex items-center justify-end hover:text-gray-900 dark:hover:text-white"
                              >
                                Total Profit
                                <SortIcon direction={sortConfig.key === 'totalProfit' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              <button
                                onClick={() => handleSort('profitMargin')}
                                className="flex items-center justify-end hover:text-gray-900 dark:hover:text-white"
                              >
                                Margin %
                                <SortIcon direction={sortConfig.key === 'profitMargin' ? sortConfig.direction : null} />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {sortedData.map((item, index) => {
                            const margin = item.profitMargin || 0;
                            return (
                              <tr key={item.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${
                                      index === 0 ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30' :
                                      index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800' :
                                      index === 2 ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30' :
                                      'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                                    } flex items-center justify-center`}>
                                      <span className={`text-xs font-bold ${
                                        index === 0 ? 'text-yellow-700 dark:text-yellow-400' :
                                        index === 1 ? 'text-gray-700 dark:text-gray-300' :
                                        index === 2 ? 'text-amber-700 dark:text-amber-400' :
                                        'text-blue-700 dark:text-blue-400'
                                      }`}>
                                        #{index + 1}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                                        {item.desc}
                                      </div>
                                      {item.desc !== item.sku && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          SKU: {item.sku}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                                  {item.sku}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                    {item.soldQty}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-semibold text-green-600 dark:text-green-400">
                                  {formatCurrency(item.salesValue)}
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-semibold text-amber-600 dark:text-amber-400">
                                  {formatCurrency(item.totalProfit)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    margin >= 20 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                      : margin >= 10
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                  }`}>
                                    {margin.toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <td colSpan="2" className="px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                              TOTAL ({sortedData.length} items)
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-gray-900 dark:text-white">
                              {summary.totalQty}
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(summary.totalSales)}
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-amber-600 dark:text-amber-400">
                              {formatCurrency(summary.totalProfit)}
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-blue-600 dark:text-blue-400">
                              {summary.avgProfitMargin.toFixed(1)}%
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Top Performers Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Top Sales */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">🏆 Top Sales</h4>
                      {sortedData.slice(0, 3).map((item, index) => (
                        <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                              index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                              'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                              {item.desc}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(item.salesValue)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Top Quantity */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">📦 Top Quantity</h4>
                      {[...sortedData]
                        .sort((a, b) => b.soldQty - a.soldQty)
                        .slice(0, 3)
                        .map((item, index) => (
                          <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                index === 1 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                {item.desc}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {item.soldQty}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Top Margin */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">💰 Top Margin</h4>
                      {[...sortedData]
                        .filter(item => item.salesValue > 0)
                        .sort((a, b) => b.profitMargin - a.profitMargin)
                        .slice(0, 3)
                        .map((item, index) => {
                          const margin = item.profitMargin || 0;
                          return (
                            <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                  index === 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                  index === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                  'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                  {item.desc}
                                </span>
                              </div>
                              <span className={`text-xs font-semibold ${
                                margin >= 20 ? 'text-green-600 dark:text-green-400' :
                                margin >= 10 ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {margin.toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FiPackage className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchTerm ? 'No Items Found' : 'No Data Available'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm 
                      ? `No items found matching "${searchTerm}". Try a different search term.`
                      : `No item sales data found for ${new Date(reportDate).toLocaleDateString()}. Try selecting a different date.`
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

export default ItemsReport;