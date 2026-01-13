// import React, { useEffect, useState } from 'react';
// import reportService from '../../services/reportService';

// const ItemsReport = () => {
//   const today = new Date().toISOString().slice(0, 10);
//   const [reportDate, setReportDate] = useState(today);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);

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
//         if (!map[key]) map[key] = { key, desc, soldQty: 0, salesValue: 0, totalProfit: 0 };
//         map[key].soldQty += parseFloat(it.SOLDQTY || 0);
//         map[key].salesValue += parseFloat(it.SALESVALUE || 0);
//         map[key].totalProfit += parseFloat(it.TOTAL_PROFIT || 0);
//       });
//       setData(Object.values(map));
//     } catch (err) {
//       setError(err.message || 'Failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load(reportDate);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Items Report</h2>
//         <div className="flex items-center gap-2">
//           <input
//             type="date"
//             value={reportDate}
//             onChange={(e) => setReportDate(e.target.value)}
//             className="p-2 rounded-lg border bg-white dark:bg-gray-700 text-sm"
//           />
//           <button
//             onClick={() => load(reportDate)}
//             className="px-3 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Get Report
//           </button>
//         </div>
//       </div>

//       {loading && <div className="p-4">Loading...</div>}
//       {error && <div className="p-4 text-red-600">{error}</div>}

//       {!loading && !error && (
//         <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-4 py-2 text-left">Item</th>
//                 <th className="px-4 py-2 text-right">Qty</th>
//                 <th className="px-4 py-2 text-right">Sales</th>
//                 <th className="px-4 py-2 text-right">Profit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map(d => (
//                 <tr key={d.key} className="border-b dark:border-gray-700">
//                   <td className="px-4 py-2">{d.desc}</td>
//                   <td className="px-4 py-2 text-right">{d.soldQty}</td>
//                   <td className="px-4 py-2 text-right">Rs {d.salesValue.toLocaleString()}</td>
//                   <td className="px-4 py-2 text-right">Rs {d.totalProfit.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItemsReport;
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

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
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
//       {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Select Date  :
              
//               <input
//                 type="date"
//                 value={reportDate}
//                 onChange={handleDateChange}
//                 className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               /></label>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleRefresh}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh Report
//               </button>
//               <button
//                 onClick={() => window.print()}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                 </svg>
//                 Print
//               </button>
//             </div>
//           </div> */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
//   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//     <div className="flex flex-wrap items-center gap-4">

//       {/* Date */}
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//           Select Date :
//         </span>

//         <input
//           type="date"
//           value={reportDate}
//           onChange={handleDateChange}
//           className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
//           bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm 
//           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={handleRefresh}
//           className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
//           text-white rounded-lg hover:from-blue-700 hover:to-blue-800 
//           transition-all duration-200 flex items-center gap-2 shadow-sm"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//           </svg>
//           Refresh Report
//         </button>

//         <button
//           onClick={() => window.print()}
//           className="px-4 py-2 border border-gray-300 dark:border-gray-600 
//           text-gray-700 dark:text-gray-300 rounded-lg 
//           hover:bg-gray-50 dark:hover:bg-gray-700 
//           transition flex items-center gap-2"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//           </svg>
//           Print
//         </button>
//       </div>

//     </div>

 


          
//           <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
//             <span className="font-medium">Showing:</span> {summary.totalItems} unique item{summary.totalItems !== 1 ? 's' : ''}
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
//           {/* <div className="text-xs opacity-90 mt-2">
//             Avg Margin: {summary.avgProfitMargin.toFixed(1)}%
//           </div> */}
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex justify-center items-center p-12">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600 dark:text-gray-400">Loading items report...</p>
//           </div>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
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

//       {/* Items Table */}
//       {!loading && !error && sortedData.length > 0 && (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b dark:border-gray-700">
//             <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//               Item Details ({sortedData.length} items)
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//               Click on column headers to sort
//             </p>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 dark:bg-gray-700/50">
//                 <tr>
//                   <th className="px-6 py-3 text-left">
//                     <button
//                       onClick={() => handleSort('desc')}
//                       className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                     >
//                       Item Description
//                       <SortIcon direction={sortConfig.key === 'desc' ? sortConfig.direction : null} />
//                     </button>
//                   </th>
//                   <th className="px-6 py-3 text-right">
//                     <button
//                       onClick={() => handleSort('soldQty')}
//                       className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                     >
//                       Quantity
//                       <SortIcon direction={sortConfig.key === 'soldQty' ? sortConfig.direction : null} />
//                     </button>
//                   </th>
//                   <th className="px-6 py-3 text-right">
//                     <button
//                       onClick={() => handleSort('salesValue')}
//                       className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                     >
//                       Sales Value
//                       <SortIcon direction={sortConfig.key === 'salesValue' ? sortConfig.direction : null} />
//                     </button>
//                   </th>
//                   <th className="px-6 py-3 text-right">
//                     <button
//                       onClick={() => handleSort('totalProfit')}
//                       className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                     >
//                       Profit
//                       <SortIcon direction={sortConfig.key === 'totalProfit' ? sortConfig.direction : null} />
//                     </button>
//                   </th>
//                   <th className="px-6 py-3 text-right">
//                     <button
//                       onClick={() => handleSort('profitMargin')}
//                       className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
//                     >
//                       Margin
//                       <SortIcon direction={sortConfig.key === 'profitMargin' ? sortConfig.direction : null} />
//                     </button>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {sortedData.map((item, index) => (
//                   <tr 
//                     key={item.key} 
//                     className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
//                       index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
//                     }`}
//                   >
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="font-medium text-gray-900 dark:text-white">{item.desc}</div>
//                         <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SKU: {item.sku}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                         {item.soldQty}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="font-semibold text-green-600 dark:text-green-400">
//                         Rs {item.salesValue.toLocaleString()}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="font-semibold text-amber-600 dark:text-amber-400">
//                         Rs {item.totalProfit.toLocaleString()}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                         item.profitMargin >= 20 
//                           ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
//                           : item.profitMargin >= 10
//                           ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
//                           : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
//                       }`}>
//                         {item.profitMargin.toFixed(1)}%
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot className="bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
//                 <tr>
//                   <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Total</td>
//                   <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
//                     {summary.totalQty}
//                   </td>
//                   <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">
//                     Rs {summary.totalSales.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 text-right font-semibold text-amber-600 dark:text-amber-400">
//                     Rs {summary.totalProfit.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
//                     {summary.avgProfitMargin.toFixed(1)}%
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && !error && sortedData.length === 0 && (
//         <div className="text-center py-12">
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
// export default ItemsReport;
import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

const ItemsReport = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [reportDate, setReportDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalQty: 0,
    totalSales: 0,
    totalProfit: 0,
    avgProfitMargin: 0
  });
  const [sortConfig, setSortConfig] = useState({ key: 'salesValue', direction: 'desc' });

  const load = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getInvoiceReports(date);
      const items = res.ResultSet || [];
      const map = {};
      let totalQty = 0, totalSales = 0, totalProfit = 0;
      
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
        
        totalQty += qty;
        totalSales += sales;
        totalProfit += profit;
      });

      // Calculate profit margins
      Object.values(map).forEach(item => {
        item.profitMargin = item.salesValue > 0 ? (item.totalProfit / item.salesValue) * 100 : 0;
      });

      const itemsArray = Object.values(map);
      setData(itemsArray);
      setSummary({
        totalItems: itemsArray.length,
        totalQty,
        totalSales,
        totalProfit,
        avgProfitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load items report');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load when date changes
  useEffect(() => {
    load(reportDate);
  }, [reportDate]);

  // Initial load
  useEffect(() => {
    load(today);
  }, []);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
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
  }, [data, sortConfig]);

  const handleDateChange = (e) => {
    setReportDate(e.target.value);
  };

  const handleRefresh = () => {
    load(reportDate);
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

  // Custom print function with better formatting
  const handlePrint = () => {
    // Create a printable HTML string
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
          <h1>Items Report</h1>
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
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Print styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .print-section,
          .print-section * {
            visibility: visible;
          }
          
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 no-print">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Items Report</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed analysis of item sales performance
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Report Date: {new Date(reportDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Date Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Date :
              </span>
              <input
                type="date"
                value={reportDate}
                onChange={handleDateChange}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                text-white rounded-lg hover:from-blue-700 hover:to-blue-800 
                transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Report
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-300 rounded-lg 
                hover:bg-gray-50 dark:hover:bg-gray-700 
                transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Report
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
            <span className="font-medium">Showing:</span> {summary.totalItems} unique item{summary.totalItems !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Summary Cards - Hide in print */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 no-print">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Items</p>
              <p className="text-2xl font-bold mt-1">{summary.totalItems}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Quantity</p>
              <p className="text-2xl font-bold mt-1">{summary.totalQty}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Sales</p>
              <p className="text-2xl font-bold mt-1">Rs {summary.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Profit</p>
              <p className="text-2xl font-bold mt-1">Rs {summary.totalProfit.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-12 no-print">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading items report...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 no-print">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Items Table - Printable version */}
      {!loading && !error && sortedData.length > 0 && (
        <>
          {/* Screen version */}
          <div className="no-print">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Item Details ({sortedData.length} items)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Click on column headers to sort
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('desc')}
                          className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          Item Description
                          <SortIcon direction={sortConfig.key === 'desc' ? sortConfig.direction : null} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleSort('soldQty')}
                          className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          Quantity
                          <SortIcon direction={sortConfig.key === 'soldQty' ? sortConfig.direction : null} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleSort('salesValue')}
                          className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          Sales Value
                          <SortIcon direction={sortConfig.key === 'salesValue' ? sortConfig.direction : null} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleSort('totalProfit')}
                          className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          Profit
                          <SortIcon direction={sortConfig.key === 'totalProfit' ? sortConfig.direction : null} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleSort('profitMargin')}
                          className="flex items-center justify-end text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          Margin
                          <SortIcon direction={sortConfig.key === 'profitMargin' ? sortConfig.direction : null} />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedData.map((item, index) => (
                      <tr 
                        key={item.key} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.desc}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SKU: {item.sku}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {item.soldQty}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            Rs {item.salesValue.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-semibold text-amber-600 dark:text-amber-400">
                            Rs {item.totalProfit.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.profitMargin >= 20 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : item.profitMargin >= 10
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {item.profitMargin.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
                    <tr>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Total</td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                        {summary.totalQty}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">
                        Rs {summary.totalSales.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-amber-600 dark:text-amber-400">
                        Rs {summary.totalProfit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                        {summary.avgProfitMargin.toFixed(1)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Simple printable version - hidden on screen */}
          <div className="print-section hidden">
            <div className="print-header">
              <h1>Items Report</h1>
              <p>Date: {new Date(reportDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p>Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            </div>
            
            <div className="print-summary">
              <div className="summary-card">
                <h3>Total Items</h3>
                <div className="value">{summary.totalItems}</div>
              </div>
              <div className="summary-card">
                <h3>Total Quantity</h3>
                <div className="value">{summary.totalQty}</div>
              </div>
              <div className="summary-card">
                <h3>Total Sales</h3>
                <div className="value">Rs {summary.totalSales.toLocaleString()}</div>
              </div>
              <div className="summary-card">
                <h3>Total Profit</h3>
                <div className="value">Rs {summary.totalProfit.toLocaleString()}</div>
              </div>
            </div>
            
            <table className="print-table">
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
                {sortedData.map(item => (
                  <tr key={item.key}>
                    <td>{item.desc}</td>
                    <td>{item.sku}</td>
                    <td>{item.soldQty}</td>
                    <td>Rs {item.salesValue.toLocaleString()}</td>
                    <td>Rs {item.totalProfit.toLocaleString()}</td>
                    <td>{item.profitMargin.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>Total</strong></td>
                  <td><strong>{summary.totalQty}</strong></td>
                  <td><strong>Rs {summary.totalSales.toLocaleString()}</strong></td>
                  <td><strong>Rs {summary.totalProfit.toLocaleString()}</strong></td>
                  <td><strong>{summary.avgProfitMargin.toFixed(1)}%</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <div className="print-footer">
              <p>Report generated by METRO POS System</p>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && sortedData.length === 0 && (
        <div className="text-center py-12 no-print">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Items Found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            No sales data found for {new Date(reportDate).toLocaleDateString()}. Try selecting a different date.
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsReport;