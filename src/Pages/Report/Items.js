
// // export default ItemsReport;
// import React, { useEffect, useState } from 'react';
// import reportService from '../../services/reportService';

// const ItemsReport = () => {
//   const today = new Date().toISOString().slice(0, 10);
//   const [reportDate, setReportDate] = useState(today);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState({
//     totalItems: 0,
//     totalQty: 0,
//     totalSales: 0,
//     totalProfit: 0,
//     avgProfitMargin: 0
//   });
//   const [sortConfig, setSortConfig] = useState({ key: 'salesValue', direction: 'desc' });

//   const load = async (date) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await reportService.getInvoiceReports(date);
//       const items = res.ResultSet || [];
//       const map = {};
//       let totalQty = 0, totalSales = 0, totalProfit = 0;
      
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
        
//         totalQty += qty;
//         totalSales += sales;
//         totalProfit += profit;
//       });

//       // Calculate profit margins
//       Object.values(map).forEach(item => {
//         item.profitMargin = item.salesValue > 0 ? (item.totalProfit / item.salesValue) * 100 : 0;
//       });

//       const itemsArray = Object.values(map);
//       setData(itemsArray);
//       setSummary({
//         totalItems: itemsArray.length,
//         totalQty,
//         totalSales,
//         totalProfit,
//         avgProfitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
//       });
//     } catch (err) {
//       setError(err.message || 'Failed to load items report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-load when date changes
//   useEffect(() => {
//     load(reportDate);
//   }, [reportDate]);

//   // Initial load
//   useEffect(() => {
//     load(today);
//   }, []);

//   const handleSort = (key) => {
//     let direction = 'desc';
//     if (sortConfig.key === key && sortConfig.direction === 'desc') {
//       direction = 'asc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedData = React.useMemo(() => {
//     const sortableData = [...data];
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
//   }, [data, sortConfig]);

//   const handleDateChange = (e) => {
//     setReportDate(e.target.value);
//   };

//   const handleRefresh = () => {
//     load(reportDate);
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

//   // Custom print function with better formatting
//   const handlePrint = () => {
//     // Create a printable HTML string
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Items Report - ${new Date(reportDate).toLocaleDateString()}</title>
//         <style>
//           @media print {
//             @page {
//               size: A4 landscape;
//               margin: 0.5cm;
//             }
            
//             body {
//               font-family: Arial, sans-serif;
//               font-size: 12px;
//               line-height: 1.4;
//               color: #000;
//               background: white !important;
//             }
            
//             .print-header {
//               text-align: center;
//               margin-bottom: 20px;
//               padding-bottom: 10px;
//               border-bottom: 2px solid #333;
//             }
            
//             .print-header h1 {
//               font-size: 20px;
//               margin: 0 0 5px 0;
//               color: #000;
//             }
            
//             .print-header p {
//               margin: 0;
//               color: #666;
//             }
            
//             .print-summary {
//               display: grid;
//               grid-template-columns: repeat(4, 1fr);
//               gap: 10px;
//               margin-bottom: 20px;
//             }
            
//             .summary-card {
//               padding: 10px;
//               border: 1px solid #ddd;
//               border-radius: 4px;
//               text-align: center;
//             }
            
//             .summary-card h3 {
//               font-size: 11px;
//               margin: 0 0 5px 0;
//               color: #666;
//               text-transform: uppercase;
//             }
            
//             .summary-card .value {
//               font-size: 16px;
//               font-weight: bold;
//               color: #000;
//             }
            
//             .print-table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 20px;
//             }
            
//             .print-table th {
//               background-color: #f5f5f5 !important;
//               color: #000 !important;
//               border: 1px solid #ddd;
//               padding: 8px;
//               text-align: left;
//               font-weight: bold;
//               -webkit-print-color-adjust: exact;
//             }
            
//             .print-table td {
//               border: 1px solid #ddd;
//               padding: 8px;
//               color: #000;
//             }
            
//             .print-table tr:nth-child(even) {
//               background-color: #f9f9f9 !important;
//               -webkit-print-color-adjust: exact;
//             }
            
//             .print-footer {
//               margin-top: 30px;
//               padding-top: 10px;
//               border-top: 1px solid #333;
//               font-size: 10px;
//               color: #666;
//             }
            
//             .no-print {
//               display: none !important;
//             }
            
//             .badge {
//               padding: 2px 6px;
//               border-radius: 10px;
//               font-size: 11px;
//               font-weight: bold;
//             }
            
//             .text-green { color: #059669 !important; }
//             .text-amber { color: #d97706 !important; }
//             .text-blue { color: #2563eb !important; }
//             .text-gray { color: #6b7280 !important; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="print-header">
//           <h1>Items Report</h1>
//           <p>Date: ${new Date(reportDate).toLocaleDateString('en-US', { 
//             weekday: 'long', 
//             year: 'numeric', 
//             month: 'long', 
//             day: 'numeric' 
//           })}</p>
//           <p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
//         </div>
        
//         <div class="print-summary">
//           <div class="summary-card">
//             <h3>Total Items</h3>
//             <div class="value">${summary.totalItems}</div>
//           </div>
//           <div class="summary-card">
//             <h3>Total Quantity</h3>
//             <div class="value">${summary.totalQty}</div>
//           </div>
//           <div class="summary-card">
//             <h3>Total Sales</h3>
//             <div class="value">Rs ${summary.totalSales.toLocaleString()}</div>
//           </div>
//           <div class="summary-card">
//             <h3>Total Profit</h3>
//             <div class="value">Rs ${summary.totalProfit.toLocaleString()}</div>
//           </div>
//         </div>
        
//         <table class="print-table">
//           <thead>
//             <tr>
//               <th>Item Description</th>
//               <th>SKU</th>
//               <th>Quantity</th>
//               <th>Sales Value</th>
//               <th>Profit</th>
//               <th>Margin</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${sortedData.map(item => `
//               <tr>
//                 <td>${item.desc}</td>
//                 <td class="text-gray">${item.sku}</td>
//                 <td><span class="badge" style="background-color: #dbeafe; color: #1e40af;">${item.soldQty}</span></td>
//                 <td class="text-green"><strong>Rs ${item.salesValue.toLocaleString()}</strong></td>
//                 <td class="text-amber"><strong>Rs ${item.totalProfit.toLocaleString()}</strong></td>
//                 <td>
//                   <span class="badge" style="
//                     background-color: ${item.profitMargin >= 20 ? '#d1fae5' : item.profitMargin >= 10 ? '#fef3c7' : '#fee2e2'};
//                     color: ${item.profitMargin >= 20 ? '#065f46' : item.profitMargin >= 10 ? '#92400e' : '#991b1b'};
//                   ">
//                     ${item.profitMargin.toFixed(1)}%
//                   </span>
//                 </td>
//               </tr>
//             `).join('')}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colspan="2"><strong>Total</strong></td>
//               <td><strong>${summary.totalQty}</strong></td>
//               <td class="text-green"><strong>Rs ${summary.totalSales.toLocaleString()}</strong></td>
//               <td class="text-amber"><strong>Rs ${summary.totalProfit.toLocaleString()}</strong></td>
//               <td><strong>${summary.avgProfitMargin.toFixed(1)}%</strong></td>
//             </tr>
//           </tfoot>
//         </table>
        
//         <div class="print-footer">
//           <p>Report generated by METRO POS System</p>
//         </div>
//       </body>
//       </html>
//     `;

//     // Open print window
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(printContent);
//     printWindow.document.close();
    
//     // Wait for content to load then print
//     printWindow.onload = function() {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.onafterprint = function() {
//         printWindow.close();
//       };
//     };
//   };

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       {/* Print styles */}
//       <style jsx>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
          
//           .print-section,
//           .print-section * {
//             visibility: visible;
//           }
          
//           .print-section {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             background: white !important;
//             color: black !important;
//           }
          
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>

//       {/* Header */}
//       <div className="mb-6 no-print">
//         <div className="flex items-center justify-between mb-2">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Items Report</h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Detailed analysis of item sales performance
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
//               Report Date: {new Date(reportDate).toLocaleDateString('en-US', { 
//                 weekday: 'short', 
//                 month: 'short', 
//                 day: 'numeric' 
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Date Controls */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 no-print">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex flex-wrap items-center gap-4">
//             {/* Date */}
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Select Date :
//               </span>
//               <input
//                 type="date"
//                 value={reportDate}
//                 onChange={handleDateChange}
//                 className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
//                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm 
//                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleRefresh}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
//                 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 
//                 transition-all duration-200 flex items-center gap-2 shadow-sm"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh Report
//               </button>

//               <button
//                 onClick={handlePrint}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 
//                 text-gray-700 dark:text-gray-300 rounded-lg 
//                 hover:bg-gray-50 dark:hover:bg-gray-700 
//                 transition flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                 </svg>
//                 Print Report
//               </button>
//             </div>
//           </div>
          
//           <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
//             <span className="font-medium">Showing:</span> {summary.totalItems} unique item{summary.totalItems !== 1 ? 's' : ''}
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards - Hide in print */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 no-print">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Items</p>
//               <p className="text-2xl font-bold mt-1">{summary.totalItems}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Quantity</p>
//               <p className="text-2xl font-bold mt-1">{summary.totalQty}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Sales</p>
//               <p className="text-2xl font-bold mt-1">Rs {summary.totalSales.toLocaleString()}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Profit</p>
//               <p className="text-2xl font-bold mt-1">Rs {summary.totalProfit.toLocaleString()}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center p-12 no-print">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600 dark:text-gray-400">Loading items report...</p>
//           </div>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 no-print">
//           <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span>{error}</span>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
//           >
//             Try Again
//           </button>
//         </div>
//       )}

//       {/* Items Table - Printable version */}
//       {!loading && !error && sortedData.length > 0 && (
//         <>
//           {/* Screen version */}
//           <div className="no-print">
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
//               <div className="px-6 py-4 border-b dark:border-gray-700">
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//                   Item Details ({sortedData.length} items)
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   Click on column headers to sort
//                 </p>
//               </div>
              
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 dark:bg-gray-700/50">
//                     <tr>
//                       <th className="px-6 py-3 text-left">
//                         <button
//                           onClick={() => handleSort('desc')}
//                           className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                         >
//                           Item Description
//                           <SortIcon direction={sortConfig.key === 'desc' ? sortConfig.direction : null} />
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-right">
//                         <button
//                           onClick={() => handleSort('soldQty')}
//                           className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                         >
//                           Quantity
//                           <SortIcon direction={sortConfig.key === 'soldQty' ? sortConfig.direction : null} />
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-right">
//                         <button
//                           onClick={() => handleSort('salesValue')}
//                           className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                         >
//                           Sales Value
//                           <SortIcon direction={sortConfig.key === 'salesValue' ? sortConfig.direction : null} />
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-right">
//                         <button
//                           onClick={() => handleSort('totalProfit')}
//                           className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                         >
//                           Profit
//                           <SortIcon direction={sortConfig.key === 'totalProfit' ? sortConfig.direction : null} />
//                         </button>
//                       </th>
//                       <th className="px-6 py-3 text-right">
//                         <button
//                           onClick={() => handleSort('profitMargin')}
//                           className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                         >
//                           Margin
//                           <SortIcon direction={sortConfig.key === 'profitMargin' ? sortConfig.direction : null} />
//                         </button>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {sortedData.map((item, index) => (
//                       <tr 
//                         key={item.key} 
//                         className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
//                           index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
//                         }`}
//                       >
//                         <td className="px-6 py-4">
//                           <div>
//                             <div className="font-medium text-gray-900 dark:text-white">{item.desc}</div>
//                             <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SKU: {item.sku}</div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                             {item.soldQty}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="font-semibold text-green-600 dark:text-green-400">
//                             Rs {item.salesValue.toLocaleString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="font-semibold text-amber-600 dark:text-amber-400">
//                             Rs {item.totalProfit.toLocaleString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                             item.profitMargin >= 20 
//                               ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
//                               : item.profitMargin >= 10
//                               ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
//                               : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
//                           }`}>
//                             {item.profitMargin.toFixed(1)}%
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot className="bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
//                     <tr>
//                       <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Total</td>
//                       <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
//                         {summary.totalQty}
//                       </td>
//                       <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">
//                         Rs {summary.totalSales.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 text-right font-semibold text-amber-600 dark:text-amber-400">
//                         Rs {summary.totalProfit.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
//                         {summary.avgProfitMargin.toFixed(1)}%
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Simple printable version - hidden on screen */}
//           <div className="print-section hidden">
//             <div className="print-header">
//               <h1>Items Report</h1>
//               <p>Date: {new Date(reportDate).toLocaleDateString('en-US', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })}</p>
//               <p>Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
//             </div>
            
//             <div className="print-summary">
//               <div className="summary-card">
//                 <h3>Total Items</h3>
//                 <div className="value">{summary.totalItems}</div>
//               </div>
//               <div className="summary-card">
//                 <h3>Total Quantity</h3>
//                 <div className="value">{summary.totalQty}</div>
//               </div>
//               <div className="summary-card">
//                 <h3>Total Sales</h3>
//                 <div className="value">Rs {summary.totalSales.toLocaleString()}</div>
//               </div>
//               <div className="summary-card">
//                 <h3>Total Profit</h3>
//                 <div className="value">Rs {summary.totalProfit.toLocaleString()}</div>
//               </div>
//             </div>
            
//             <table className="print-table">
//               <thead>
//                 <tr>
//                   <th>Item Description</th>
//                   <th>SKU</th>
//                   <th>Quantity</th>
//                   <th>Sales Value</th>
//                   <th>Profit</th>
//                   <th>Margin</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sortedData.map(item => (
//                   <tr key={item.key}>
//                     <td>{item.desc}</td>
//                     <td>{item.sku}</td>
//                     <td>{item.soldQty}</td>
//                     <td>Rs {item.salesValue.toLocaleString()}</td>
//                     <td>Rs {item.totalProfit.toLocaleString()}</td>
//                     <td>{item.profitMargin.toFixed(1)}%</td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan="2"><strong>Total</strong></td>
//                   <td><strong>{summary.totalQty}</strong></td>
//                   <td><strong>Rs {summary.totalSales.toLocaleString()}</strong></td>
//                   <td><strong>Rs {summary.totalProfit.toLocaleString()}</strong></td>
//                   <td><strong>{summary.avgProfitMargin.toFixed(1)}%</strong></td>
//                 </tr>
//               </tfoot>
//             </table>
            
//             <div className="print-footer">
//               <p>Report generated by METRO POS System</p>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Empty State */}
//       {!loading && !error && sortedData.length === 0 && (
//         <div className="text-center py-12 no-print">
//           <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Items Found</h3>
//           <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
//             No sales data found for {new Date(reportDate).toLocaleDateString()}. Try selecting a different date.
//           </p>
//         </div>
//       )}
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
    <div className="flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full bg-white border-gray-200 border">
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
              <h1 className="text-lg font-bold text-gray-900">
                Items Sales Dashboard
              </h1>
              <p className="text-xs text-gray-600">
                Detailed analysis of item sales performance
                {lastUpdated && (
                  <span className="ml-2 text-green-600">
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
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm min-w-[100px] justify-center disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrintReport}
              disabled={isPrinting || data.length === 0}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm min-w-[120px] justify-center disabled:opacity-50"
            >
              <FiPrinter className="w-4 h-4" />
              {isPrinting ? "Printing..." : "Print Report"}
            </button>

            {/* Date Filter */}
            <div className="flex gap-2">
              <button className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center">
                <FiCalendar className="w-4 h-4" />
                Select Date
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Report Date:
            </span>
            <input
              type="date"
              value={reportDate}
              onChange={handleDateChange}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Primary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Items</p>
                <p className="text-sm font-bold text-blue-600">
                  {summary.totalItems}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiPackage className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Sales</p>
                <p className="text-sm font-bold text-green-600">
                  {formatCurrency(summary.totalSales)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Profit</p>
                <p className="text-sm font-bold text-purple-600">
                  {formatCurrency(summary.totalProfit)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTrendingUp className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Items Sold</p>
                <p className="text-sm font-bold text-orange-600">
                  {summary.totalQty.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiShoppingCart className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
          <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg. Profit Margin</p>
                <p className="text-sm font-bold text-indigo-600">
                  {summary.avgProfitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FiPieChart className="w-3 h-3 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg. Sales per Item</p>
                <p className="text-sm font-bold text-emerald-600">
                  {formatCurrency(summary.avgSalesPerItem)}
                </p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FiBarChart2 className="w-3 h-3 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg p-2 shadow border bg-gray-50 border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Report Date</p>
                <p className="text-sm font-bold text-cyan-600">
                  {new Date(reportDate).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="p-2 bg-cyan-100 rounded-lg">
                <FiCalendar className="w-3 h-3 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by item description or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border bg-gray-50 border-gray-200 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className="rounded-lg p-1 md:p-2 h-full overflow-y-auto bg-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin border-green-200"></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Loading Items Report...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl p-4 text-center h-full flex items-center justify-center border bg-red-50 border-red-200">
              <div>
                <div className="font-medium text-sm text-red-600">
                  ⚠️ Error
                </div>
                <p className="mt-1 text-xs text-red-600">
                  {error}
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
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
                    <h3 className="text-sm font-semibold text-gray-900">
                      Item Performance Details
                    </h3>
                    <span className="text-xs text-gray-500">
                      Showing {sortedData.length} item{sortedData.length !== 1 ? 's' : ''} • Click headers to sort
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Sales Performance Summary
                        </h3>
                        <span className="text-xs text-gray-500">
                          Updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                              <button
                                onClick={() => handleSort('desc')}
                                className="flex items-center hover:text-gray-900"
                              >
                                Item Description
                                <SortIcon direction={sortConfig.key === 'desc' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                              SKU
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                              <button
                                onClick={() => handleSort('soldQty')}
                                className="flex items-center justify-end hover:text-gray-900"
                              >
                                Quantity
                                <SortIcon direction={sortConfig.key === 'soldQty' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                              <button
                                onClick={() => handleSort('salesValue')}
                                className="flex items-center justify-end hover:text-gray-900"
                              >
                                Total Sales
                                <SortIcon direction={sortConfig.key === 'salesValue' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                              <button
                                onClick={() => handleSort('totalProfit')}
                                className="flex items-center justify-end hover:text-gray-900"
                              >
                                Total Profit
                                <SortIcon direction={sortConfig.key === 'totalProfit' ? sortConfig.direction : null} />
                              </button>
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                              <button
                                onClick={() => handleSort('profitMargin')}
                                className="flex items-center justify-end hover:text-gray-900"
                              >
                                Margin %
                                <SortIcon direction={sortConfig.key === 'profitMargin' ? sortConfig.direction : null} />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sortedData.map((item, index) => {
                            const margin = item.profitMargin || 0;
                            return (
                              <tr key={item.key} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${
                                      index === 0 ? 'bg-gradient-to-br from-yellow-100 to-amber-100' :
                                      index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
                                      index === 2 ? 'bg-gradient-to-br from-amber-50 to-amber-100' :
                                      'bg-gradient-to-br from-blue-50 to-indigo-50'
                                    } flex items-center justify-center`}>
                                      <span className="text-xs font-bold ${
                                        index === 0 ? 'text-yellow-700' :
                                        index === 1 ? 'text-gray-700' :
                                        index === 2 ? 'text-amber-700' :
                                        'text-blue-700'
                                      }">
                                        #{index + 1}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-gray-900">
                                        {item.desc}
                                      </div>
                                      {item.desc !== item.sku && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          SKU: {item.sku}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600">
                                  {item.sku}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.soldQty}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-semibold text-green-600">
                                  {formatCurrency(item.salesValue)}
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-semibold text-amber-600">
                                  {formatCurrency(item.totalProfit)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    margin >= 20 
                                      ? 'bg-green-100 text-green-800'
                                      : margin >= 10
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {margin.toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="2" className="px-4 py-3 text-xs font-bold text-gray-700">
                              TOTAL ({sortedData.length} items)
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold">
                              {summary.totalQty}
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-green-600">
                              {formatCurrency(summary.totalSales)}
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-amber-600">
                              {formatCurrency(summary.totalProfit)}
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-blue-600">
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
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h4 className="text-xs font-semibold text-gray-900 mb-3">🏆 Top Sales</h4>
                      {sortedData.slice(0, 3).map((item, index) => (
                        <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-gray-100 text-gray-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="text-xs text-gray-700 truncate max-w-[120px]">
                              {item.desc}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-green-600">
                            {formatCurrency(item.salesValue)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Top Quantity */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h4 className="text-xs font-semibold text-gray-900 mb-3">📦 Top Quantity</h4>
                      {[...sortedData]
                        .sort((a, b) => b.soldQty - a.soldQty)
                        .slice(0, 3)
                        .map((item, index) => (
                          <div key={item.key} className="flex items-center justify-between mb-2 last:mb-0">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-blue-100 text-blue-700' :
                                index === 1 ? 'bg-purple-100 text-purple-700' :
                                'bg-indigo-100 text-indigo-700'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="text-xs text-gray-700 truncate max-w-[120px]">
                                {item.desc}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-blue-600">
                              {item.soldQty}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Top Margin */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <h4 className="text-xs font-semibold text-gray-900 mb-3">💰 Top Margin</h4>
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
                                  index === 0 ? 'bg-green-100 text-green-700' :
                                  index === 1 ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-teal-100 text-teal-700'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="text-xs text-gray-700 truncate max-w-[120px]">
                                  {item.desc}
                                </span>
                              </div>
                              <span className={`text-xs font-semibold ${
                                margin >= 20 ? 'text-green-600' :
                                margin >= 10 ? 'text-yellow-600' :
                                'text-red-600'
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
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiPackage className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No Items Found' : 'No Data Available'}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
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