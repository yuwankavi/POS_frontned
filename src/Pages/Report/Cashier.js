

// // export default CashierReport;
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
//   FiUser
// } from "react-icons/fi";
// import Breadcrumb from "../../components/common/Breadcrumb.js";

// const CashierReport = () => {
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

//   const totalSummary = React.useMemo(() => {
//     const totalSales = data.reduce((sum, cashier) => sum + cashier.totalSales, 0);
//     const totalQty = data.reduce((sum, cashier) => sum + cashier.totalQty, 0);
//     const totalProfit = data.reduce((sum, cashier) => sum + cashier.totalProfit, 0);
//     const totalItems = data.reduce((sum, cashier) => sum + cashier.itemCount, 0);
    
//     return {
//       totalSales,
//       totalQty,
//       totalProfit,
//       totalItems,
//       cashierCount: data.length,
//       avgProfitMargin: totalSales > 0 ? (totalProfit / totalSales * 100) : 0
//     };
//   }, [data]);

//   const filteredData = React.useMemo(() => {
//     if (!searchTerm) return data;
//     return data.filter(cashier => 
//       cashier.cashier.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [data, searchTerm]);

//   const load = async (date) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await reportService.getInvoiceReports(date);
//       const items = res.ResultSet || [];
//       const map = {};
      
//       items.forEach(it => {
//         const cashier = it.CAHIERNAME || it.CASHIER || 'Unknown';
//         if (!map[cashier]) {
//           map[cashier] = { 
//             cashier, 
//             rows: [], 
//             totalSales: 0, 
//             totalQty: 0, 
//             totalProfit: 0,
//             itemCount: 0,
//             transactionCount: 0
//           };
//         }
//         map[cashier].rows.push(it);
//         const sales = parseFloat(it.SALESVALUE || 0);
//         const qty = parseFloat(it.SOLDQTY || 0);
//         const profit = parseFloat(it.TOTAL_PROFIT || 0);
        
//         map[cashier].totalSales += sales;
//         map[cashier].totalQty += qty;
//         map[cashier].totalProfit += profit;
//         map[cashier].itemCount += 1;
//         map[cashier].transactionCount = map[cashier].rows.length;
//       });

//       const cashierData = Object.values(map);
//       // Sort by total sales (highest first)
//       cashierData.sort((a, b) => b.totalSales - a.totalSales);
      
//       setData(cashierData);
//       setLastUpdated(new Date());
//       showAlertMessage("Report loaded successfully", "success");
//     } catch (err) {
//       setError(err.message || 'Failed to load report');
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
//       // Create a printable HTML string
//       const printContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Cashier Performance Report - ${new Date(reportDate).toLocaleDateString()}</title>
//           <style>
//             @media print {
//               @page {
//                 size: A4 portrait;
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
//                 background-color: #f8fafc;
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
              
//               .cashier-table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//               }
              
//               .cashier-table th {
//                 background-color: #f1f5f9 !important;
//                 color: #000 !important;
//                 border: 1px solid #ddd;
//                 padding: 10px 8px;
//                 text-align: left;
//                 font-weight: bold;
//                 -webkit-print-color-adjust: exact;
//               }
              
//               .cashier-table td {
//                 border: 1px solid #ddd;
//                 padding: 10px 8px;
//                 color: #000;
//               }
              
//               .cashier-table tr:nth-child(even) {
//                 background-color: #f9fafb !important;
//                 -webkit-print-color-adjust: exact;
//               }
              
//               .cashier-table .rank {
//                 text-align: center;
//                 font-weight: bold;
//                 background-color: #e0f2fe;
//                 border-radius: 4px;
//                 padding: 4px 8px;
//               }
              
//               .cashier-table .margin-badge {
//                 padding: 4px 8px;
//                 border-radius: 12px;
//                 font-size: 11px;
//                 font-weight: bold;
//                 display: inline-block;
//               }
              
//               .print-footer {
//                 margin-top: 30px;
//                 padding-top: 10px;
//                 border-top: 1px solid #333;
//                 font-size: 10px;
//                 color: #666;
//                 text-align: center;
//               }
              
//               .no-print {
//                 display: none !important;
//               }
              
//               .text-green { color: #059669 !important; }
//               .text-amber { color: #d97706 !important; }
//               .text-blue { color: #2563eb !important; }
//               .text-purple { color: #7c3aed !important; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-header">
//             <h1>Cashier Performance Report</h1>
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
//               <h3>Total Cashiers</h3>
//               <div class="value">${totalSummary.cashierCount}</div>
//             </div>
//             <div class="summary-card">
//               <h3>Total Sales</h3>
//               <div class="value">Rs ${totalSummary.totalSales.toLocaleString()}</div>
//             </div>
//             <div class="summary-card">
//               <h3>Total Items Sold</h3>
//               <div class="value">${totalSummary.totalQty}</div>
//             </div>
//             <div class="summary-card">
//               <h3>Total Profit</h3>
//               <div class="value">Rs ${totalSummary.totalProfit.toLocaleString()}</div>
//             </div>
//           </div>
          
//           <table class="cashier-table">
//             <thead>
//               <tr>
//                 <th style="width: 50px;">Rank</th>
//                 <th>Cashier Name</th>
//                 <th>Transactions</th>
//                 <th>Items</th>
//                 <th>Quantity Sold</th>
//                 <th>Total Sales</th>
//                 <th>Total Profit</th>
//                 <th>Profit Margin</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${data.map((cashier, index) => {
//                 const margin = cashier.totalSales > 0 ? ((cashier.totalProfit / cashier.totalSales) * 100).toFixed(1) : 0;
//                 const marginColor = margin >= 20 ? '#10b981' : margin >= 10 ? '#f59e0b' : '#ef4444';
//                 const marginBgColor = margin >= 20 ? '#d1fae5' : margin >= 10 ? '#fef3c7' : '#fee2e2';
                
//                 return `
//                   <tr>
//                     <td class="rank">#${index + 1}</td>
//                     <td><strong>${cashier.cashier}</strong></td>
//                     <td>${cashier.transactionCount}</td>
//                     <td>${cashier.itemCount}</td>
//                     <td>${cashier.totalQty}</td>
//                     <td class="text-green"><strong>Rs ${cashier.totalSales.toLocaleString()}</strong></td>
//                     <td class="text-amber"><strong>Rs ${cashier.totalProfit.toLocaleString()}</strong></td>
//                     <td>
//                       <span class="margin-badge" style="background-color: ${marginBgColor}; color: ${marginColor === '#10b981' ? '#065f46' : marginColor === '#f59e0b' ? '#92400e' : '#991b1b'};">
//                         ${margin}%
//                       </span>
//                     </td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//             <tfoot>
//               <tr style="background-color: #f1f5f9; font-weight: bold;">
//                 <td colspan="4">TOTAL</td>
//                 <td>${totalSummary.totalQty}</td>
//                 <td class="text-green">Rs ${totalSummary.totalSales.toLocaleString()}</td>
//                 <td class="text-amber">Rs ${totalSummary.totalProfit.toLocaleString()}</td>
//                 <td>
//                   ${totalSummary.totalSales > 0 ? ((totalSummary.totalProfit / totalSummary.totalSales) * 100).toFixed(1) : 0}%
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
          
//           <div class="print-footer">
//             <p>Report generated by METRO POS System • Cashier Performance Report</p>
//             <p>Page 1 of 1</p>
//           </div>
//         </body>
//         </html>
//       `;

//       // Open print window
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(printContent);
//       printWindow.document.close();
      
//       // Wait for content to load then print
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

//       <Breadcrumb current="Reports / Cashier Report" />

//       {/* Header */}
//       <div className="mt-2 mb-3 md:mb-5">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
//               <FiUser className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900">
//                 Cashier Performance Dashboard
//               </h1>
//               <p className="text-xs text-gray-600">
//                 Real-time overview of cashier sales performance
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
//               <button
//                 className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center"
//               >
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
//                 <p className="text-xs text-gray-500">Total Cashiers</p>
//                 <p className="text-sm font-bold text-blue-600">
//                   {totalSummary.cashierCount}
//                 </p>
//               </div>
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <FiUsers className="w-4 h-4 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Total Sales</p>
//                 <p className="text-sm font-bold text-green-600">
//                   {formatCurrency(totalSummary.totalSales)}
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
//                   {formatCurrency(totalSummary.totalProfit)}
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
//                   {totalSummary.totalQty.toLocaleString('en-IN')}
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
//                 <p className="text-xs text-gray-500">Total Items</p>
//                 <p className="text-sm font-bold text-indigo-600">{totalSummary.totalItems}</p>
//               </div>
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <FiPackage className="w-3 h-3 text-indigo-600" />
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500">Avg. Profit Margin</p>
//                 <p className="text-sm font-bold text-emerald-600">
//                   {totalSummary.avgProfitMargin.toFixed(1)}%
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
//               placeholder="Search by cashier name..."
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
//                   Loading Cashier Report...
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
//               {/* Cashier Cards Grid */}
//               {filteredData.length > 0 ? (
//                 <>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">
//                       Cashier Performance Ranking
//                     </h3>
//                     <span className="text-xs text-gray-500">
//                       Showing {filteredData.length} cashier{filteredData.length !== 1 ? 's' : ''}
//                     </span>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {filteredData.map((cashier, index) => {
//                       const margin = cashier.totalSales > 0 
//                         ? ((cashier.totalProfit / cashier.totalSales) * 100) 
//                         : 0;
//                       const getRankColor = (rank) => {
//                         if (rank === 1) return 'bg-gradient-to-br from-yellow-500 to-amber-600';
//                         if (rank === 2) return 'bg-gradient-to-br from-gray-400 to-gray-600';
//                         if (rank === 3) return 'bg-gradient-to-br from-amber-700 to-amber-900';
//                         return 'bg-gradient-to-br from-blue-500 to-indigo-600';
//                       };

//                       return (
//                         <div 
//                           key={cashier.cashier} 
//                           className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
//                         >
//                           <div className="p-4">
//                             <div className="flex items-start justify-between mb-3">
//                               <div className="flex items-center gap-3">
//                                 <div className={`w-12 h-12 rounded-lg ${getRankColor(index + 1)} flex items-center justify-center`}>
//                                   <span className="font-bold text-white text-lg">
//                                     #{index + 1}
//                                   </span>
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">{cashier.cashier}</h4>
//                                   <p className="text-xs text-gray-600">
//                                     {cashier.itemCount} items • {cashier.rows.length} trans
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-xs font-medium text-gray-500">Qty Sold</div>
//                                 <div className="text-sm font-bold text-blue-600">{cashier.totalQty}</div>
//                               </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                               <div className="bg-gray-50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-600 mb-1">Total Sales</div>
//                                 <div className="text-base font-bold text-green-600">
//                                   {formatCurrency(cashier.totalSales)}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-50 rounded-lg p-3">
//                                 <div className="text-xs text-gray-600 mb-1">Profit</div>
//                                 <div className="text-base font-bold text-amber-600">
//                                   {formatCurrency(cashier.totalProfit)}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <div className="text-xs text-green-800 mb-1">Performance Score</div>
//                                   <div className="text-sm font-semibold text-green-700">
//                                     {cashier.totalSales.toLocaleString()} pts
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <div className="text-xs text-green-800 mb-1">Margin</div>
//                                   <div className={`text-base font-bold ${
//                                     margin >= 20 ? 'text-green-600' :
//                                     margin >= 10 ? 'text-amber-600' :
//                                     'text-red-600'
//                                   }`}>
//                                     {margin.toFixed(1)}%
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-3 pt-3 border-t border-gray-100">
//                               <div className="flex justify-between text-xs text-gray-500">
//                                 <span>Avg. Transaction: {formatCurrency(cashier.totalSales / (cashier.rows.length || 1))}</span>
//                                 <span>Avg. Items: {(cashier.totalQty / (cashier.rows.length || 1)).toFixed(1)}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Performance Summary Table */}
//                   <div className="bg-white rounded-xl border border-gray-200 mt-4">
//                     <div className="p-4 border-b border-gray-200">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-semibold text-gray-900">
//                           Detailed Performance Summary
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
//                               Rank
//                             </th>
//                             <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                               Cashier Name
//                             </th>
//                             <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
//                               Transactions
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Items Sold
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Total Sales
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Total Profit
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Margin %
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {filteredData.map((row, index) => {
//                             const margin = row.totalSales > 0 
//                               ? ((row.totalProfit / row.totalSales) * 100) 
//                               : 0;
//                             return (
//                               <tr key={row.cashier} className="hover:bg-gray-50 transition-colors">
//                                 <td className="px-4 py-2 whitespace-nowrap text-xs font-bold text-center">
//                                   <span className={`px-2 py-1 rounded ${
//                                     index === 0 ? 'bg-yellow-100 text-yellow-800' :
//                                     index === 1 ? 'bg-gray-100 text-gray-800' :
//                                     index === 2 ? 'bg-amber-100 text-amber-800' :
//                                     'bg-blue-100 text-blue-800'
//                                   }`}>
//                                     #{index + 1}
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">
//                                   {row.cashier}
//                                 </td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-xs text-center">
//                                   {row.rows.length}
//                                 </td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
//                                   {row.totalQty}
//                                 </td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-semibold text-green-600">
//                                   {formatCurrency(row.totalSales)}
//                                 </td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-semibold text-amber-600">
//                                   {formatCurrency(row.totalProfit)}
//                                 </td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
//                                   <span className={`font-bold ${
//                                     margin >= 20 ? 'text-green-600' :
//                                     margin >= 10 ? 'text-amber-600' :
//                                     'text-red-600'
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
//                             <td colSpan="3" className="px-4 py-2 text-xs font-bold text-gray-700">
//                               TOTAL
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold">
//                               {totalSummary.totalQty}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold text-green-600">
//                               {formatCurrency(totalSummary.totalSales)}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold text-amber-600">
//                               {formatCurrency(totalSummary.totalProfit)}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold text-blue-600">
//                               {totalSummary.avgProfitMargin.toFixed(1)}%
//                             </td>
//                           </tr>
//                         </tfoot>
//                       </table>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                     <FiUser className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     {searchTerm ? 'No Cashiers Found' : 'No Data Available'}
//                   </h3>
//                   <p className="text-gray-600 max-w-md mx-auto">
//                     {searchTerm 
//                       ? `No cashiers found matching "${searchTerm}". Try a different search term.`
//                       : `No cashier report data found for ${new Date(reportDate).toLocaleDateString()}. Try selecting a different date.`
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

// export default CashierReport;
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
  FiUser
} from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb.js";

const CashierReport = () => {
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

  const totalSummary = React.useMemo(() => {
    const totalSales = data.reduce((sum, cashier) => sum + cashier.totalSales, 0);
    const totalQty = data.reduce((sum, cashier) => sum + cashier.totalQty, 0);
    const totalProfit = data.reduce((sum, cashier) => sum + cashier.totalProfit, 0);
    const totalItems = data.reduce((sum, cashier) => sum + cashier.itemCount, 0);
    
    return {
      totalSales,
      totalQty,
      totalProfit,
      totalItems,
      cashierCount: data.length,
      avgProfitMargin: totalSales > 0 ? (totalProfit / totalSales * 100) : 0
    };
  }, [data]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(cashier => 
      cashier.cashier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const load = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getInvoiceReports(date);
      const items = res.ResultSet || [];
      const map = {};
      
      items.forEach(it => {
        const cashier = it.CAHIERNAME || it.CASHIER || 'Unknown';
        if (!map[cashier]) {
          map[cashier] = { 
            cashier, 
            rows: [], 
            totalSales: 0, 
            totalQty: 0, 
            totalProfit: 0,
            itemCount: 0,
            transactionCount: 0
          };
        }
        map[cashier].rows.push(it);
        const sales = parseFloat(it.SALESVALUE || 0);
        const qty = parseFloat(it.SOLDQTY || 0);
        const profit = parseFloat(it.TOTAL_PROFIT || 0);
        
        map[cashier].totalSales += sales;
        map[cashier].totalQty += qty;
        map[cashier].totalProfit += profit;
        map[cashier].itemCount += 1;
        map[cashier].transactionCount = map[cashier].rows.length;
      });

      const cashierData = Object.values(map);
      // Sort by total sales (highest first)
      cashierData.sort((a, b) => b.totalSales - a.totalSales);
      
      setData(cashierData);
      setLastUpdated(new Date());
      showAlertMessage("Report loaded successfully", "success");
    } catch (err) {
      setError(err.message || 'Failed to load report');
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
      // Create a printable HTML string
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Cashier Performance Report - ${new Date(reportDate).toLocaleDateString()}</title>
          <style>
            @media print {
              @page {
                size: A4 portrait;
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
                background-color: #f8fafc;
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
              
              .cashier-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              
              .cashier-table th {
                background-color: #f1f5f9 !important;
                color: #000 !important;
                border: 1px solid #ddd;
                padding: 10px 8px;
                text-align: left;
                font-weight: bold;
                -webkit-print-color-adjust: exact;
              }
              
              .cashier-table td {
                border: 1px solid #ddd;
                padding: 10px 8px;
                color: #000;
              }
              
              .cashier-table tr:nth-child(even) {
                background-color: #f9fafb !important;
                -webkit-print-color-adjust: exact;
              }
              
              .cashier-table .rank {
                text-align: center;
                font-weight: bold;
                background-color: #e0f2fe;
                border-radius: 4px;
                padding: 4px 8px;
              }
              
              .cashier-table .margin-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                display: inline-block;
              }
              
              .print-footer {
                margin-top: 30px;
                padding-top: 10px;
                border-top: 1px solid #333;
                font-size: 10px;
                color: #666;
                text-align: center;
              }
              
              .no-print {
                display: none !important;
              }
              
              .text-green { color: #059669 !important; }
              .text-amber { color: #d97706 !important; }
              .text-blue { color: #2563eb !important; }
              .text-purple { color: #7c3aed !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Cashier Performance Report</h1>
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
              <h3>Total Cashiers</h3>
              <div class="value">${totalSummary.cashierCount}</div>
            </div>
            <div class="summary-card">
              <h3>Total Sales</h3>
              <div class="value">Rs ${totalSummary.totalSales.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h3>Total Items Sold</h3>
              <div class="value">${totalSummary.totalQty}</div>
            </div>
            <div class="summary-card">
              <h3>Total Profit</h3>
              <div class="value">Rs ${totalSummary.totalProfit.toLocaleString()}</div>
            </div>
          </div>
          
          <table class="cashier-table">
            <thead>
              <tr>
                <th style="width: 50px;">Rank</th>
                <th>Cashier Name</th>
                <th>Transactions</th>
                <th>Items</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
                <th>Total Profit</th>
                <th>Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((cashier, index) => {
                const margin = cashier.totalSales > 0 ? ((cashier.totalProfit / cashier.totalSales) * 100).toFixed(1) : 0;
                const marginColor = margin >= 20 ? '#10b981' : margin >= 10 ? '#f59e0b' : '#ef4444';
                const marginBgColor = margin >= 20 ? '#d1fae5' : margin >= 10 ? '#fef3c7' : '#fee2e2';
                
                return `
                  <tr>
                    <td class="rank">#${index + 1}</td>
                    <td><strong>${cashier.cashier}</strong></td>
                    <td>${cashier.transactionCount}</td>
                    <td>${cashier.itemCount}</td>
                    <td>${cashier.totalQty}</td>
                    <td class="text-green"><strong>Rs ${cashier.totalSales.toLocaleString()}</strong></td>
                    <td class="text-amber"><strong>Rs ${cashier.totalProfit.toLocaleString()}</strong></td>
                    <td>
                      <span class="margin-badge" style="background-color: ${marginBgColor}; color: ${marginColor === '#10b981' ? '#065f46' : marginColor === '#f59e0b' ? '#92400e' : '#991b1b'};">
                        ${margin}%
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f1f5f9; font-weight: bold;">
                <td colspan="4">TOTAL</td>
                <td>${totalSummary.totalQty}</td>
                <td class="text-green">Rs ${totalSummary.totalSales.toLocaleString()}</td>
                <td class="text-amber">Rs ${totalSummary.totalProfit.toLocaleString()}</td>
                <td>
                  ${totalSummary.totalSales > 0 ? ((totalSummary.totalProfit / totalSummary.totalSales) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            </tfoot>
          </table>
          
          <div class="print-footer">
            <p>Report generated by METRO POS System • Cashier Performance Report</p>
            <p>Page 1 of 1</p>
          </div>
        </body>
        </html>
      `;

      // Open print window
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
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

      <Breadcrumb current="Reports / Cashier Report" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Cashier Performance Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Real-time overview of cashier sales performance
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
              <button
                className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center"
              >
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Cashiers</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {totalSummary.cashierCount}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Sales</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalSummary.totalSales)}
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
                  {formatCurrency(totalSummary.totalProfit)}
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
                  {totalSummary.totalQty.toLocaleString('en-IN')}
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{totalSummary.totalItems}</p>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FiPackage className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Profit Margin</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {totalSummary.avgProfitMargin.toFixed(1)}%
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
              placeholder="Search by cashier name..."
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
                  Loading Cashier Report...
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
              {/* Cashier Cards Grid */}
              {filteredData.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Cashier Performance Ranking
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {filteredData.length} cashier{filteredData.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((cashier, index) => {
                      const margin = cashier.totalSales > 0 
                        ? ((cashier.totalProfit / cashier.totalSales) * 100) 
                        : 0;
                      const getRankColor = (rank) => {
                        if (rank === 1) return 'bg-gradient-to-br from-yellow-500 to-amber-600 dark:from-yellow-600 dark:to-amber-700';
                        if (rank === 2) return 'bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700';
                        if (rank === 3) return 'bg-gradient-to-br from-amber-700 to-amber-900 dark:from-amber-800 dark:to-amber-900';
                        return 'bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700';
                      };

                      return (
                        <div 
                          key={cashier.cashier} 
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg ${getRankColor(index + 1)} flex items-center justify-center`}>
                                  <span className="font-bold text-white text-lg">
                                    #{index + 1}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{cashier.cashier}</h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {cashier.itemCount} items • {cashier.rows.length} trans
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Qty Sold</div>
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{cashier.totalQty}</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Sales</div>
                                <div className="text-base font-bold text-green-600 dark:text-green-400">
                                  {formatCurrency(cashier.totalSales)}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Profit</div>
                                <div className="text-base font-bold text-amber-600 dark:text-amber-400">
                                  {formatCurrency(cashier.totalProfit)}
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs text-green-800 dark:text-green-300 mb-1">Performance Score</div>
                                  <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                                    {cashier.totalSales.toLocaleString()} pts
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-green-800 dark:text-green-300 mb-1">Margin</div>
                                  <div className={`text-base font-bold ${
                                    margin >= 20 ? 'text-green-600 dark:text-green-400' :
                                    margin >= 10 ? 'text-amber-600 dark:text-amber-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {margin.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Avg. Transaction: {formatCurrency(cashier.totalSales / (cashier.rows.length || 1))}</span>
                                <span>Avg. Items: {(cashier.totalQty / (cashier.rows.length || 1)).toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Performance Summary Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Detailed Performance Summary
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
                              Rank
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Cashier Name
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Transactions
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Items Sold
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Total Sales
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Total Profit
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Margin %
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredData.map((row, index) => {
                            const margin = row.totalSales > 0 
                              ? ((row.totalProfit / row.totalSales) * 100) 
                              : 0;
                            return (
                              <tr key={row.cashier} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-2 whitespace-nowrap text-xs font-bold text-center">
                                  <span className={`px-2 py-1 rounded ${
                                    index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                                    index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' :
                                    index === 2 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' :
                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                                  }`}>
                                    #{index + 1}
                                  </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-white">
                                  {row.cashier}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-xs text-center text-gray-600 dark:text-gray-400">
                                  {row.rows.length}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-xs text-right text-gray-900 dark:text-white">
                                  {row.totalQty}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-semibold text-green-600 dark:text-green-400">
                                  {formatCurrency(row.totalSales)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-semibold text-amber-600 dark:text-amber-400">
                                  {formatCurrency(row.totalProfit)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
                                  <span className={`font-bold ${
                                    margin >= 20 ? 'text-green-600 dark:text-green-400' :
                                    margin >= 10 ? 'text-amber-600 dark:text-amber-400' :
                                    'text-red-600 dark:text-red-400'
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
                            <td colSpan="3" className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                              TOTAL
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold text-gray-900 dark:text-white">
                              {totalSummary.totalQty}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(totalSummary.totalSales)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold text-amber-600 dark:text-amber-400">
                              {formatCurrency(totalSummary.totalProfit)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-right font-bold text-blue-600 dark:text-blue-400">
                              {totalSummary.avgProfitMargin.toFixed(1)}%
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FiUser className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchTerm ? 'No Cashiers Found' : 'No Data Available'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm 
                      ? `No cashiers found matching "${searchTerm}". Try a different search term.`
                      : `No cashier report data found for ${new Date(reportDate).toLocaleDateString()}. Try selecting a different date.`
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

export default CashierReport;