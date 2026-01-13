// import React, { useEffect, useState } from 'react';
// import reportService from '../../services/reportService';

// const CashierReport = () => {
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
//         const cashier = it.CAHIERNAME || it.CASHIER || 'Unknown';
//         if (!map[cashier]) map[cashier] = { cashier, rows: [], totalSales: 0, totalQty: 0, totalProfit: 0 };
//         map[cashier].rows.push(it);
//         map[cashier].totalSales += parseFloat(it.SALESVALUE || 0);
//         map[cashier].totalQty += parseFloat(it.SOLDQTY || 0);
//         map[cashier].totalProfit += parseFloat(it.TOTAL_PROFIT || 0);
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
//         <h2 className="text-lg font-semibold">Cashier Report</h2>
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
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {data.map(c => (
//             <div key={c.cashier} className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
//               <div className="flex items-center justify-between mb-2">
//                 <div>
//                   <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{c.cashier}</div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">{c.rows.length} items</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm font-semibold text-green-600 dark:text-green-400">Rs {c.totalSales.toLocaleString()}</div>
//                   <div className="text-xs text-gray-500">Qty: {c.totalQty}</div>
//                 </div>
//               </div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Total Profit: Rs {c.totalProfit.toLocaleString()}</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CashierReport;
// import React, { useEffect, useState } from 'react';
// import reportService from '../../services/reportService';

// const CashierReport = () => {
//   const today = new Date().toISOString().slice(0, 10);
//   const [reportDate, setReportDate] = useState(today);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const [totalSummary, setTotalSummary] = useState({
//     totalSales: 0,
//     totalQty: 0,
//     totalProfit: 0,
//     totalItems: 0,
//     cashierCount: 0
//   });

//   const load = async (date) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await reportService.getInvoiceReports(date);
//       const items = res.ResultSet || [];
//       const map = {};
//       let totalSales = 0, totalQty = 0, totalProfit = 0, totalItems = 0;
      
//       items.forEach(it => {
//         const cashier = it.CAHIERNAME || it.CASHIER || 'Unknown';
//         if (!map[cashier]) {
//           map[cashier] = { 
//             cashier, 
//             rows: [], 
//             totalSales: 0, 
//             totalQty: 0, 
//             totalProfit: 0,
//             itemCount: 0
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
        
//         totalSales += sales;
//         totalQty += qty;
//         totalProfit += profit;
//         totalItems += 1;
//       });

//       const cashierData = Object.values(map);
//       setData(cashierData);
//       setTotalSummary({
//         totalSales,
//         totalQty,
//         totalProfit,
//         totalItems,
//         cashierCount: cashierData.length
//       });
//     } catch (err) {
//       setError(err.message || 'Failed to load report');
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

//   const handleDateChange = (e) => {
//     setReportDate(e.target.value);
//   };

//   const handleRefresh = () => {
//     load(reportDate);
//   };

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-2">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Cashier Report</h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Real-time overview of cashier sales performance
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
//               Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
//                 Select Date
//               </label>
//               <input
//                 type="date"
//                 value={reportDate}
//                 onChange={handleDateChange}
//                 className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
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
//           </div>
//            */}
//            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
//   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//     <div className="flex flex-wrap items-center gap-4">

//       {/* Date */}
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//           Select Date:
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
//             <span className="font-medium">Selected:</span> {new Date(reportDate).toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Cashiers</p>
//               <p className="text-2xl font-bold mt-1">{totalSummary.cashierCount}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Sales</p>
//               <p className="text-2xl font-bold mt-1">Rs {totalSummary.totalSales.toLocaleString()}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Items Sold</p>
//               <p className="text-2xl font-bold mt-1">{totalSummary.totalQty}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Profit</p>
//               <p className="text-2xl font-bold mt-1">Rs {totalSummary.totalProfit.toLocaleString()}</p>
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
//         <div className="flex justify-center items-center p-12">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cashier report...</p>
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

//       {/* Cashier Cards Grid */}
//       {!loading && !error && data.length > 0 && (
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cashier Performance</h3>
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               Showing {data.length} cashier{data.length !== 1 ? 's' : ''}
//             </span>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {data.map((c, index) => (
//               <div 
//                 key={c.cashier} 
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
//               >
//                 <div className="p-5">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
//                         <span className="font-semibold text-blue-600 dark:text-blue-400">
//                           {c.cashier.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-gray-800 dark:text-white">{c.cashier}</h4>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {c.itemCount} item{c.itemCount !== 1 ? 's' : ''} • {c.rows.length} transaction{c.rows.length !== 1 ? 's' : ''}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Rank</div>
//                       <div className="text-lg font-bold text-blue-600 dark:text-blue-400">#{index + 1}</div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
//                       <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Sales</div>
//                       <div className="text-lg font-bold text-green-600 dark:text-green-400">
//                         Rs {c.totalSales.toLocaleString()}
//                       </div>
//                     </div>
//                     <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
//                       <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quantity</div>
//                       <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
//                         {c.totalQty}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-xs text-amber-800 dark:text-amber-300 mb-1">Total Profit</div>
//                         <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
//                           Rs {c.totalProfit.toLocaleString()}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-xs text-amber-800 dark:text-amber-300 mb-1">Margin</div>
//                         <div className="text-lg font-semibold text-amber-700 dark:text-amber-400">
//                           {c.totalSales > 0 ? ((c.totalProfit / c.totalSales) * 100).toFixed(1) : 0}%
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => {
//                       // View details functionality
//                       console.log('View details for', c.cashier);
//                     }}
//                     className="mt-4 w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && !error && data.length === 0 && (
//         <div className="text-center py-12">
//           <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
//           <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
//             No cashier report data found for {new Date(reportDate).toLocaleDateString()}. Try selecting a different date.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CashierReport;
import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

const CashierReport = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [reportDate, setReportDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [totalSummary, setTotalSummary] = useState({
    totalSales: 0,
    totalQty: 0,
    totalProfit: 0,
    totalItems: 0,
    cashierCount: 0
  });

  const load = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getInvoiceReports(date);
      const items = res.ResultSet || [];
      const map = {};
      let totalSales = 0, totalQty = 0, totalProfit = 0, totalItems = 0;
      
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
        
        totalSales += sales;
        totalQty += qty;
        totalProfit += profit;
        totalItems += 1;
      });

      const cashierData = Object.values(map);
      // Sort by total sales (highest first)
      cashierData.sort((a, b) => b.totalSales - a.totalSales);
      
      setData(cashierData);
      setTotalSummary({
        totalSales,
        totalQty,
        totalProfit,
        totalItems,
        cashierCount: cashierData.length
      });
    } catch (err) {
      setError(err.message || 'Failed to load report');
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

  const handleDateChange = (e) => {
    setReportDate(e.target.value);
  };

  const handleRefresh = () => {
    load(reportDate);
  };

  // Custom print function with better formatting
  const handlePrint = () => {
    // Create a printable HTML string
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cashier Report - ${new Date(reportDate).toLocaleDateString()}</title>
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Cashier Report</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time overview of cashier sales performance
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                Select Date:
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
            <span className="font-medium">Selected:</span> {new Date(reportDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Summary Cards - Hide in print */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 no-print">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Cashiers</p>
              <p className="text-2xl font-bold mt-1">{totalSummary.cashierCount}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Sales</p>
              <p className="text-2xl font-bold mt-1">Rs {totalSummary.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Items Sold</p>
              <p className="text-2xl font-bold mt-1">{totalSummary.totalQty}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Profit</p>
              <p className="text-2xl font-bold mt-1">Rs {totalSummary.totalProfit.toLocaleString()}</p>
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cashier report...</p>
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

      {/* Cashier Cards Grid - Screen version */}
      {!loading && !error && data.length > 0 && (
        <>
          {/* Screen version */}
          <div className="no-print">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cashier Performance</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {data.length} cashier{data.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((c, index) => (
                <div 
                  key={c.cashier} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {c.cashier.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">{c.cashier}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {c.itemCount} item{c.itemCount !== 1 ? 's' : ''} • {c.rows.length} transaction{c.rows.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Rank</div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">#{index + 1}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Sales</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          Rs {c.totalSales.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quantity</div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {c.totalQty}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-amber-800 dark:text-amber-300 mb-1">Total Profit</div>
                          <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
                            Rs {c.totalProfit.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-amber-800 dark:text-amber-300 mb-1">Margin</div>
                          <div className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                            {c.totalSales > 0 ? ((c.totalProfit / c.totalSales) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <button
                      onClick={() => {
                        // View details functionality
                        console.log('View details for', c.cashier);
                      }}
                      className="mt-4 w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      View Details
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Printable version - hidden on screen */}
          <div className="print-section hidden">
            <div className="print-header">
              <h1>Cashier Performance Report</h1>
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
                <h3>Total Cashiers</h3>
                <div className="value">{totalSummary.cashierCount}</div>
              </div>
              <div className="summary-card">
                <h3>Total Sales</h3>
                <div className="value">Rs {totalSummary.totalSales.toLocaleString()}</div>
              </div>
              <div className="summary-card">
                <h3>Total Items Sold</h3>
                <div className="value">{totalSummary.totalQty}</div>
              </div>
              <div className="summary-card">
                <h3>Total Profit</h3>
                <div className="value">Rs {totalSummary.totalProfit.toLocaleString()}</div>
              </div>
            </div>
            
            <table className="cashier-table">
              <thead>
                <tr>
                  <th>Rank</th>
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
                {data.map((cashier, index) => {
                  const margin = cashier.totalSales > 0 ? ((cashier.totalProfit / cashier.totalSales) * 100).toFixed(1) : 0;
                  return (
                    <tr key={cashier.cashier}>
                      <td className="rank">#{index + 1}</td>
                      <td><strong>{cashier.cashier}</strong></td>
                      <td>{cashier.rows.length}</td>
                      <td>{cashier.itemCount}</td>
                      <td>{cashier.totalQty}</td>
                      <td>Rs {cashier.totalSales.toLocaleString()}</td>
                      <td>Rs {cashier.totalProfit.toLocaleString()}</td>
                      <td>{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4"><strong>TOTAL</strong></td>
                  <td><strong>{totalSummary.totalQty}</strong></td>
                  <td><strong>Rs {totalSummary.totalSales.toLocaleString()}</strong></td>
                  <td><strong>Rs {totalSummary.totalProfit.toLocaleString()}</strong></td>
                  <td>
                    <strong>
                      {totalSummary.totalSales > 0 ? ((totalSummary.totalProfit / totalSummary.totalSales) * 100).toFixed(1) : 0}%
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
            
            <div className="print-footer">
              <p>Report generated by METRO POS System • Cashier Performance Report</p>
              <p>Page 1 of 1</p>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 no-print">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            No cashier report data found for {new Date(reportDate).toLocaleDateString()}. Try selecting a different date.
          </p>
        </div>
      )}
    </div>
  );
};

export default CashierReport;