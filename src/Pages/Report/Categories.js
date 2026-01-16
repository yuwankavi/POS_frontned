

// // export default CategoriesReport;
// import React, { useEffect, useState } from 'react';
// import reportService from '../../services/reportService';

// const CategoriesReport = () => {
//   const today = new Date().toISOString().slice(0, 10);
//   const [reportDate, setReportDate] = useState(today);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState({
//     totalCategories: 0,
//     totalQty: 0,
//     totalSales: 0,
//     totalProfit: 0,
//     avgProfitMargin: 0
//   });
//   const [expandedCategory, setExpandedCategory] = useState(null);

//   const load = async (date) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await reportService.getInvoiceReports(date);
//       const items = res.ResultSet || [];
//       const categoryMap = {};
//       let totalQty = 0, totalSales = 0, totalProfit = 0;
      
//       items.forEach(it => {
//         const cat = it.CATEGORYNAME || 'Uncategorized';
//         const categoryKey = cat.trim();
        
//         if (!categoryMap[categoryKey]) {
//           categoryMap[categoryKey] = { 
//             category: cat, 
//             soldQty: 0, 
//             salesValue: 0,
//             totalProfit: 0,
//             items: [],
//             profitMargin: 0
//           };
//         }
        
//         const qty = parseFloat(it.SOLDQTY || 0);
//         const sales = parseFloat(it.SALESVALUE || 0);
//         const profit = parseFloat(it.TOTAL_PROFIT || 0);
        
//         categoryMap[categoryKey].soldQty += qty;
//         categoryMap[categoryKey].salesValue += sales;
//         categoryMap[categoryKey].totalProfit += profit;
//         categoryMap[categoryKey].items.push({
//           sku: it.SKU,
//           description: it.PRDESC,
//           qty: qty,
//           unitPrice: parseFloat(it.UNITPRICE || 0),
//           salesValue: sales,
//           profit: profit,
//           profitPerUnit: parseFloat(it.PROFIT_PER_UNIT || 0),
//           cashier: it.CAHIERNAME || 'Unknown'
//         });
        
//         totalQty += qty;
//         totalSales += sales;
//         totalProfit += profit;
//       });

//       // Calculate profit margins and sort items within categories
//       const categoriesArray = Object.values(categoryMap);
//       categoriesArray.forEach(cat => {
//         cat.profitMargin = cat.salesValue > 0 ? (cat.totalProfit / cat.salesValue) * 100 : 0;
//         // Sort items by sales value (highest first)
//         cat.items.sort((a, b) => b.salesValue - a.salesValue);
//       });

//       // Sort categories by sales value (highest first)
//       categoriesArray.sort((a, b) => b.salesValue - a.salesValue);

//       setData(categoriesArray);
//       setSummary({
//         totalCategories: categoriesArray.length,
//         totalQty,
//         totalSales,
//         totalProfit,
//         avgProfitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
//       });
//     } catch (err) {
//       setError(err.message || 'Failed to load categories report');
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
//     setExpandedCategory(null);
//   };

//   const handleRefresh = () => {
//     load(reportDate);
//     setExpandedCategory(null);
//   };

//   const toggleCategory = (category) => {
//     setExpandedCategory(expandedCategory === category ? null : category);
//   };

//   const getCategoryColor = (index) => {
//     const colors = [
//       'from-blue-500 to-blue-600',
//       'from-purple-500 to-purple-600',
//       'from-green-500 to-green-600',
//       'from-amber-500 to-amber-600',
//       'from-pink-500 to-pink-600',
//       'from-indigo-500 to-indigo-600',
//       'from-teal-500 to-teal-600',
//       'from-orange-500 to-orange-600',
//       'from-cyan-500 to-cyan-600',
//       'from-rose-500 to-rose-600'
//     ];
//     return colors[index % colors.length];
//   };

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-2">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Categories Report</h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Performance analysis by product categories
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
//                 Select Date :
              
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
//   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//     {/* Left Section */}
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
//           text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 
//           dark:hover:bg-gray-700 transition flex items-center gap-2"
//         >
//           🖨 Print
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
//               <p className="text-sm opacity-90">Total Categories</p>
//               <p className="text-2xl font-bold mt-1">{summary.totalCategories}</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm opacity-90">Total Items Sold</p>
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
//             <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories report...</p>
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

//       {/* Categories Grid */}
//       {!loading && !error && data.length > 0 && (
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//               Categories Performance
//             </h3>
//             <span className="text-sm text-gray-600 dark:text-gray-400">
//               {data.length} categor{data.length !== 1 ? 'ies' : 'y'}
//             </span>
//           </div>

//           <div className="space-y-4">
//             {data.map((cat, index) => (
//               <div 
//                 key={cat.category} 
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
//               >
//                 {/* Category Header */}
//                 <div 
//                   className={`p-5 bg-gradient-to-r ${getCategoryColor(index)} text-white cursor-pointer`}
//                   onClick={() => toggleCategory(cat.category)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
//                         <span className="font-bold text-lg">
//                           {index + 1}
//                         </span>
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-lg">{cat.category}</h4>
//                         <p className="text-sm opacity-90">
//                           {cat.items.length} item{cat.items.length !== 1 ? 's' : ''} • {cat.soldQty} unit{cat.soldQty !== 1 ? 's' : ''} sold
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-6">
//                       <div className="text-right">
//                         <div className="text-sm opacity-90">Sales</div>
//                         <div className="text-xl font-bold">Rs {cat.salesValue.toLocaleString()}</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm opacity-90">Profit</div>
//                         <div className="text-xl font-bold">Rs {cat.totalProfit.toLocaleString()}</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm opacity-90">Margin</div>
//                         <div className="text-xl font-bold">{cat.profitMargin.toFixed(1)}%</div>
//                       </div>
//                       <div>
//                         <svg 
//                           className={`w-5 h-5 transform transition-transform ${expandedCategory === cat.category ? 'rotate-180' : ''}`}
//                           fill="none" 
//                           stroke="currentColor" 
//                           viewBox="0 0 24 24"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Category Items (Collapsible) */}
//                 {expandedCategory === cat.category && (
//                   <div className="p-5 border-t dark:border-gray-700">
//                     <div className="mb-4">
//                       <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                         Items in {cat.category}
//                       </h5>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">
//                         Total contribution: {((cat.salesValue / summary.totalSales) * 100).toFixed(1)}% of total sales
//                       </div>
//                     </div>
                    
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-sm">
//                         <thead className="bg-gray-50 dark:bg-gray-700/50">
//                           <tr>
//                             <th className="px-4 py-2 text-left">Item Description</th>
//                             <th className="px-4 py-2 text-right">SKU</th>
//                             <th className="px-4 py-2 text-right">Qty</th>
//                             <th className="px-4 py-2 text-right">Unit Price</th>
//                             <th className="px-4 py-2 text-right">Sales</th>
//                             <th className="px-4 py-2 text-right">Profit</th>
//                             <th className="px-4 py-2 text-right">Cashier</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                           {cat.items.map((item, itemIndex) => (
//                             <tr key={`${item.sku}-${itemIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
//                               <td className="px-4 py-2">
//                                 <div className="font-medium text-gray-900 dark:text-white">{item.description}</div>
//                               </td>
//                               <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400 font-mono text-xs">
//                                 {item.sku}
//                               </td>
//                               <td className="px-4 py-2 text-right">
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                                   {item.qty}
//                                 </span>
//                               </td>
//                               <td className="px-4 py-2 text-right font-medium">
//                                 Rs {item.unitPrice.toLocaleString()}
//                               </td>
//                               <td className="px-4 py-2 text-right font-semibold text-green-600 dark:text-green-400">
//                                 Rs {item.salesValue.toLocaleString()}
//                               </td>
//                               <td className="px-4 py-2 text-right">
//                                 <div className="flex flex-col items-end">
//                                   <span className="font-semibold text-amber-600 dark:text-amber-400">
//                                     Rs {item.profit.toLocaleString()}
//                                   </span>
//                                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                                     {item.profitPerUnit.toLocaleString()} per unit
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="px-4 py-2 text-right">
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
//                                   {item.cashier}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                         <tfoot className="bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
//                           <tr>
//                             <td className="px-4 py-2 font-semibold">Category Total</td>
//                             <td className="px-4 py-2 text-right"></td>
//                             <td className="px-4 py-2 text-right font-semibold">{cat.soldQty}</td>
//                             <td className="px-4 py-2 text-right"></td>
//                             <td className="px-4 py-2 text-right font-semibold text-green-600 dark:text-green-400">
//                               Rs {cat.salesValue.toLocaleString()}
//                             </td>
//                             <td className="px-4 py-2 text-right font-semibold text-amber-600 dark:text-amber-400">
//                               Rs {cat.totalProfit.toLocaleString()}
//                             </td>
//                             <td className="px-4 py-2 text-right"></td>
//                           </tr>
//                         </tfoot>
//                       </table>
//                     </div>
//                   </div>
//                 )}
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
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Categories Found</h3>
//           <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
//             No sales data found for {new Date(reportDate).toLocaleDateString()}. Try selecting a different date.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default CategoriesReport;
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
//   FiFilter,
//   FiFolder
// } from "react-icons/fi";
// import Breadcrumb from "../../components/common/Breadcrumb.js";

// const CategoriesReport = () => {
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
//   const [expandedCategory, setExpandedCategory] = useState(null);

//   const summary = React.useMemo(() => {
//     const totalQty = data.reduce((sum, cat) => sum + (cat.soldQty || 0), 0);
//     const totalSales = data.reduce((sum, cat) => sum + (cat.salesValue || 0), 0);
//     const totalProfit = data.reduce((sum, cat) => sum + (cat.totalProfit || 0), 0);
//     const totalItems = data.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
//     const avgProfitMargin = totalSales > 0 ? (totalProfit / totalSales * 100) : 0;
    
//     return {
//       totalCategories: data.length,
//       totalQty,
//       totalSales,
//       totalProfit,
//       totalItems,
//       avgProfitMargin,
//       avgSalesPerCategory: data.length > 0 ? totalSales / data.length : 0
//     };
//   }, [data]);

//   const filteredData = React.useMemo(() => {
//     if (!searchTerm) return data;
//     return data.filter(cat => 
//       (cat.category || '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [data, searchTerm]);

//   const load = async (date) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await reportService.getInvoiceReports(date);
//       const items = res.ResultSet || [];
//       const categoryMap = {};
//       let totalQty = 0, totalSales = 0, totalProfit = 0;
      
//       items.forEach(it => {
//         const cat = it.CATEGORYNAME || 'Uncategorized';
//         const categoryKey = cat.trim();
        
//         if (!categoryMap[categoryKey]) {
//           categoryMap[categoryKey] = { 
//             category: cat, 
//             soldQty: 0, 
//             salesValue: 0,
//             totalProfit: 0,
//             items: [],
//             profitMargin: 0
//           };
//         }
        
//         const qty = parseFloat(it.SOLDQTY || 0);
//         const sales = parseFloat(it.SALESVALUE || 0);
//         const profit = parseFloat(it.TOTAL_PROFIT || 0);
        
//         categoryMap[categoryKey].soldQty += qty;
//         categoryMap[categoryKey].salesValue += sales;
//         categoryMap[categoryKey].totalProfit += profit;
//         categoryMap[categoryKey].items.push({
//           sku: it.SKU,
//           description: it.PRDESC,
//           qty: qty,
//           unitPrice: parseFloat(it.UNITPRICE || 0),
//           salesValue: sales,
//           profit: profit,
//           profitPerUnit: parseFloat(it.PROFIT_PER_UNIT || 0),
//           cashier: it.CAHIERNAME || 'Unknown'
//         });
        
//         totalQty += qty;
//         totalSales += sales;
//         totalProfit += profit;
//       });

//       // Calculate profit margins and sort items within categories
//       const categoriesArray = Object.values(categoryMap);
//       categoriesArray.forEach(cat => {
//         cat.profitMargin = cat.salesValue > 0 ? (cat.totalProfit / cat.salesValue) * 100 : 0;
//         // Sort items by sales value (highest first)
//         cat.items.sort((a, b) => b.salesValue - a.salesValue);
//       });

//       // Sort categories by sales value (highest first)
//       categoriesArray.sort((a, b) => b.salesValue - a.salesValue);

//       setData(categoriesArray);
//       setLastUpdated(new Date());
//       showAlertMessage("Report loaded successfully", "success");
//     } catch (err) {
//       setError(err.message || 'Failed to load categories report');
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
//     setExpandedCategory(null);
//   };

//   const handleRefresh = () => {
//     load(reportDate);
//     setExpandedCategory(null);
//   };

//   const toggleCategory = (category) => {
//     setExpandedCategory(expandedCategory === category ? null : category);
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

//   const getCategoryColor = (index) => {
//     const colors = [
//       'from-blue-500 to-blue-600',
//       'from-purple-500 to-purple-600',
//       'from-green-500 to-green-600',
//       'from-amber-500 to-amber-600',
//       'from-pink-500 to-pink-600',
//       'from-indigo-500 to-indigo-600',
//       'from-teal-500 to-teal-600',
//       'from-orange-500 to-orange-600',
//       'from-cyan-500 to-cyan-600',
//       'from-rose-500 to-rose-600'
//     ];
//     return colors[index % colors.length];
//   };

//   // Custom print function
//   const handlePrintReport = async () => {
//     if (isPrinting || data.length === 0) return;

//     setIsPrinting(true);
//     try {
//       const printContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Categories Report - ${new Date(reportDate).toLocaleDateString()}</title>
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
              
//               .category-table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//               }
              
//               .category-table th {
//                 background-color: #f5f5f5 !important;
//                 color: #000 !important;
//                 border: 1px solid #ddd;
//                 padding: 8px;
//                 text-align: left;
//                 font-weight: bold;
//                 -webkit-print-color-adjust: exact;
//               }
              
//               .category-table td {
//                 border: 1px solid #ddd;
//                 padding: 8px;
//                 color: #000;
//               }
              
//               .category-table tr:nth-child(even) {
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
//               .text-purple { color: #7c3aed !important; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-header">
//             <h1>Categories Sales Report</h1>
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
//               <h3>Total Categories</h3>
//               <div class="value">${summary.totalCategories}</div>
//             </div>
//             <div class="summary-card">
//               <h3>Total Items Sold</h3>
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
          
//           <table class="category-table">
//             <thead>
//               <tr>
//                 <th>Category</th>
//                 <th>Items Count</th>
//                 <th>Quantity Sold</th>
//                 <th>Sales Value</th>
//                 <th>Profit</th>
//                 <th>Margin %</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${filteredData.map((cat, index) => `
//                 <tr>
//                   <td><strong>#${index + 1} ${cat.category}</strong></td>
//                   <td>${cat.items.length}</td>
//                   <td>${cat.soldQty}</td>
//                   <td class="text-green"><strong>Rs ${cat.salesValue.toLocaleString()}</strong></td>
//                   <td class="text-amber"><strong>Rs ${cat.totalProfit.toLocaleString()}</strong></td>
//                   <td>
//                     <span class="badge" style="
//                       background-color: ${cat.profitMargin >= 20 ? '#d1fae5' : cat.profitMargin >= 10 ? '#fef3c7' : '#fee2e2'};
//                       color: ${cat.profitMargin >= 20 ? '#065f46' : cat.profitMargin >= 10 ? '#92400e' : '#991b1b'};
//                     ">
//                       ${cat.profitMargin.toFixed(1)}%
//                     </span>
//                   </td>
//                 </tr>
//               `).join('')}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td><strong>TOTAL</strong></td>
//                 <td><strong>${summary.totalItems}</strong></td>
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

//       <Breadcrumb current="Reports / Categories Report" />

//       {/* Header */}
//       <div className="mt-2 mb-3 md:mb-5">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
//               <FiFolder className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900">
//                 Categories Performance Dashboard
//               </h1>
//               <p className="text-xs text-gray-600">
//                 Sales analysis by product categories
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
//                 <p className="text-xs text-gray-500">Total Categories</p>
//                 <p className="text-sm font-bold text-blue-600">
//                   {summary.totalCategories}
//                 </p>
//               </div>
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <FiFolder className="w-4 h-4 text-blue-600" />
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
//                 <p className="text-xs text-gray-500">Total Items</p>
//                 <p className="text-sm font-bold text-indigo-600">{summary.totalItems}</p>
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
//                   {summary.avgProfitMargin.toFixed(1)}%
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
//                 <p className="text-xs text-gray-500">Avg. Sales per Category</p>
//                 <p className="text-sm font-bold text-cyan-600">
//                   {formatCurrency(summary.avgSalesPerCategory)}
//                 </p>
//               </div>
//               <div className="p-2 bg-cyan-100 rounded-lg">
//                 <FiBarChart2 className="w-3 h-3 text-cyan-600" />
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
//               placeholder="Search by category name..."
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
//                   Loading Categories Report...
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
//               {/* Categories List */}
//               {filteredData.length > 0 ? (
//                 <>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">
//                       Category Performance Ranking
//                     </h3>
//                     <span className="text-xs text-gray-500">
//                       Showing {filteredData.length} categor{filteredData.length !== 1 ? 'ies' : 'y'}
//                     </span>
//                   </div>
                  
//                   <div className="space-y-4">
//                     {filteredData.map((cat, index) => (
//                       <div 
//                         key={cat.category} 
//                         className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
//                       >
//                         {/* Category Header */}
//                         <div 
//                           className={`p-4 bg-gradient-to-r ${getCategoryColor(index)} text-white cursor-pointer`}
//                           onClick={() => toggleCategory(cat.category)}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
//                                 <span className="font-bold text-lg">
//                                   #{index + 1}
//                                 </span>
//                               </div>
//                               <div>
//                                 <h4 className="font-bold">{cat.category}</h4>
//                                 <p className="text-sm opacity-90">
//                                   {cat.items.length} items • {cat.soldQty} units sold
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-6">
//                               <div className="text-right">
//                                 <div className="text-xs opacity-90">Sales</div>
//                                 <div className="text-lg font-bold">{formatCurrency(cat.salesValue)}</div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-xs opacity-90">Profit</div>
//                                 <div className="text-lg font-bold">{formatCurrency(cat.totalProfit)}</div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-xs opacity-90">Margin</div>
//                                 <div className={`text-lg font-bold ${
//                                   cat.profitMargin >= 20 ? 'text-green-300' :
//                                   cat.profitMargin >= 10 ? 'text-yellow-300' :
//                                   'text-red-300'
//                                 }`}>
//                                   {cat.profitMargin.toFixed(1)}%
//                                 </div>
//                               </div>
//                               <div>
//                                 <svg 
//                                   className={`w-5 h-5 transform transition-transform ${expandedCategory === cat.category ? 'rotate-180' : ''}`}
//                                   fill="none" 
//                                   stroke="currentColor" 
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                 </svg>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Category Items (Collapsible) */}
//                         {expandedCategory === cat.category && (
//                           <div className="p-4 border-t border-gray-200 bg-gray-50">
//                             <div className="mb-3">
//                               <div className="flex items-center justify-between mb-2">
//                                 <h5 className="font-semibold text-gray-700">
//                                   Items in {cat.category}
//                                 </h5>
//                                 <span className="text-xs text-gray-500">
//                                   Contributes {((cat.salesValue / summary.totalSales) * 100).toFixed(1)}% of total sales
//                                 </span>
//                               </div>
//                             </div>
                            
//                             <div className="overflow-x-auto">
//                               <table className="w-full text-xs">
//                                 <thead className="bg-gray-100">
//                                   <tr>
//                                     <th className="px-3 py-2 text-left">Item Description</th>
//                                     <th className="px-3 py-2 text-center">SKU</th>
//                                     <th className="px-3 py-2 text-center">Qty</th>
//                                     <th className="px-3 py-2 text-right">Unit Price</th>
//                                     <th className="px-3 py-2 text-right">Sales</th>
//                                     <th className="px-3 py-2 text-right">Profit</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {cat.items.map((item, itemIndex) => (
//                                     <tr key={`${item.sku}-${itemIndex}`} className="hover:bg-white">
//                                       <td className="px-3 py-2">
//                                         <div className="font-medium text-gray-900">{item.description}</div>
//                                       </td>
//                                       <td className="px-3 py-2 text-center text-gray-600 font-mono">
//                                         {item.sku}
//                                       </td>
//                                       <td className="px-3 py-2 text-center">
//                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                           {item.qty}
//                                         </span>
//                                       </td>
//                                       <td className="px-3 py-2 text-right font-medium">
//                                         {formatCurrency(item.unitPrice)}
//                                       </td>
//                                       <td className="px-3 py-2 text-right font-semibold text-green-600">
//                                         {formatCurrency(item.salesValue)}
//                                       </td>
//                                       <td className="px-3 py-2 text-right">
//                                         <div className="flex flex-col items-end">
//                                           <span className="font-semibold text-amber-600">
//                                             {formatCurrency(item.profit)}
//                                           </span>
//                                           <span className="text-xs text-gray-500">
//                                             {formatCurrency(item.profitPerUnit)} per unit
//                                           </span>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                                 <tfoot className="bg-gray-100 border-t border-gray-300">
//                                   <tr>
//                                     <td className="px-3 py-2 font-semibold">Category Total</td>
//                                     <td className="px-3 py-2 text-center"></td>
//                                     <td className="px-3 py-2 text-center font-semibold">{cat.soldQty}</td>
//                                     <td className="px-3 py-2 text-right"></td>
//                                     <td className="px-3 py-2 text-right font-semibold text-green-600">
//                                       {formatCurrency(cat.salesValue)}
//                                     </td>
//                                     <td className="px-3 py-2 text-right font-semibold text-amber-600">
//                                       {formatCurrency(cat.totalProfit)}
//                                     </td>
//                                   </tr>
//                                 </tfoot>
//                               </table>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Summary Table */}
//                   <div className="bg-white rounded-xl border border-gray-200 mt-4">
//                     <div className="p-4 border-b border-gray-200">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-semibold text-gray-900">
//                           Category Performance Summary
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
//                               Category
//                             </th>
//                             <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
//                               Items
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Quantity
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Sales Value
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Profit
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Margin %
//                             </th>
//                             <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                               Share
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {filteredData.map((cat, index) => {
//                             const share = (cat.salesValue / summary.totalSales) * 100;
//                             return (
//                               <tr key={cat.category} className="hover:bg-gray-50 transition-colors">
//                                 <td className="px-4 py-3">
//                                   <div className="flex items-center gap-2">
//                                     <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
//                                       index === 0 ? 'bg-yellow-100 text-yellow-800' :
//                                       index === 1 ? 'bg-gray-100 text-gray-800' :
//                                       index === 2 ? 'bg-amber-100 text-amber-800' :
//                                       'bg-blue-100 text-blue-800'
//                                     }`}>
//                                       #{index + 1}
//                                     </span>
//                                     <span className="text-xs font-medium text-gray-900">
//                                       {cat.category}
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-3 text-center text-xs">
//                                   {cat.items.length}
//                                 </td>
//                                 <td className="px-4 py-3 text-right text-xs">
//                                   <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
//                                     {cat.soldQty}
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-3 text-right text-xs font-semibold text-green-600">
//                                   {formatCurrency(cat.salesValue)}
//                                 </td>
//                                 <td className="px-4 py-3 text-right text-xs font-semibold text-amber-600">
//                                   {formatCurrency(cat.totalProfit)}
//                                 </td>
//                                 <td className="px-4 py-3 text-right text-xs">
//                                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                                     cat.profitMargin >= 20 
//                                       ? 'bg-green-100 text-green-800'
//                                       : cat.profitMargin >= 10
//                                       ? 'bg-yellow-100 text-yellow-800'
//                                       : 'bg-red-100 text-red-800'
//                                   }`}>
//                                     {cat.profitMargin.toFixed(1)}%
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-3 text-right text-xs font-bold text-blue-600">
//                                   {share.toFixed(1)}%
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                         <tfoot className="bg-gray-50">
//                           <tr>
//                             <td colSpan="2" className="px-4 py-3 text-xs font-bold text-gray-700">
//                               TOTAL ({filteredData.length} categories)
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
//                             <td className="px-4 py-3 text-right text-xs font-bold">
//                               100%
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
//                     <FiFolder className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     {searchTerm ? 'No Categories Found' : 'No Data Available'}
//                   </h3>
//                   <p className="text-gray-600 max-w-md mx-auto">
//                     {searchTerm 
//                       ? `No categories found matching "${searchTerm}". Try a different search term.`
//                       : `No category data found for ${new Date(reportDate).toLocaleDateString()}. Try selecting a different date.`
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

// export default CategoriesReport;
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
  FiFilter,
  FiFolder
} from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb.js";

const CategoriesReport = () => {
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
  const [expandedCategory, setExpandedCategory] = useState(null);

  const summary = React.useMemo(() => {
    const totalQty = data.reduce((sum, cat) => sum + (cat.soldQty || 0), 0);
    const totalSales = data.reduce((sum, cat) => sum + (cat.salesValue || 0), 0);
    const totalProfit = data.reduce((sum, cat) => sum + (cat.totalProfit || 0), 0);
    const totalItems = data.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
    const avgProfitMargin = totalSales > 0 ? (totalProfit / totalSales * 100) : 0;
    
    return {
      totalCategories: data.length,
      totalQty,
      totalSales,
      totalProfit,
      totalItems,
      avgProfitMargin,
      avgSalesPerCategory: data.length > 0 ? totalSales / data.length : 0
    };
  }, [data]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(cat => 
      (cat.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const load = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getInvoiceReports(date);
      const items = res.ResultSet || [];
      const categoryMap = {};
      let totalQty = 0, totalSales = 0, totalProfit = 0;
      
      items.forEach(it => {
        const cat = it.CATEGORYNAME || 'Uncategorized';
        const categoryKey = cat.trim();
        
        if (!categoryMap[categoryKey]) {
          categoryMap[categoryKey] = { 
            category: cat, 
            soldQty: 0, 
            salesValue: 0,
            totalProfit: 0,
            items: [],
            profitMargin: 0
          };
        }
        
        const qty = parseFloat(it.SOLDQTY || 0);
        const sales = parseFloat(it.SALESVALUE || 0);
        const profit = parseFloat(it.TOTAL_PROFIT || 0);
        
        categoryMap[categoryKey].soldQty += qty;
        categoryMap[categoryKey].salesValue += sales;
        categoryMap[categoryKey].totalProfit += profit;
        categoryMap[categoryKey].items.push({
          sku: it.SKU,
          description: it.PRDESC,
          qty: qty,
          unitPrice: parseFloat(it.UNITPRICE || 0),
          salesValue: sales,
          profit: profit,
          profitPerUnit: parseFloat(it.PROFIT_PER_UNIT || 0),
          cashier: it.CAHIERNAME || 'Unknown'
        });
        
        totalQty += qty;
        totalSales += sales;
        totalProfit += profit;
      });

      // Calculate profit margins and sort items within categories
      const categoriesArray = Object.values(categoryMap);
      categoriesArray.forEach(cat => {
        cat.profitMargin = cat.salesValue > 0 ? (cat.totalProfit / cat.salesValue) * 100 : 0;
        // Sort items by sales value (highest first)
        cat.items.sort((a, b) => b.salesValue - a.salesValue);
      });

      // Sort categories by sales value (highest first)
      categoriesArray.sort((a, b) => b.salesValue - a.salesValue);

      setData(categoriesArray);
      setLastUpdated(new Date());
      showAlertMessage("Report loaded successfully", "success");
    } catch (err) {
      setError(err.message || 'Failed to load categories report');
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
    setExpandedCategory(null);
  };

  const handleRefresh = () => {
    load(reportDate);
    setExpandedCategory(null);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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

  const getCategoryColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-amber-500 to-amber-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600',
      'from-rose-500 to-rose-600'
    ];
    return colors[index % colors.length];
  };

  // Custom print function
  const handlePrintReport = async () => {
    if (isPrinting || data.length === 0) return;

    setIsPrinting(true);
    try {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Categories Report - ${new Date(reportDate).toLocaleDateString()}</title>
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
              
              .category-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              
              .category-table th {
                background-color: #f5f5f5 !important;
                color: #000 !important;
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-weight: bold;
                -webkit-print-color-adjust: exact;
              }
              
              .category-table td {
                border: 1px solid #ddd;
                padding: 8px;
                color: #000;
              }
              
              .category-table tr:nth-child(even) {
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
              .text-purple { color: #7c3aed !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Categories Sales Report</h1>
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
              <h3>Total Categories</h3>
              <div class="value">${summary.totalCategories}</div>
            </div>
            <div class="summary-card">
              <h3>Total Items Sold</h3>
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
          
          <table class="category-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Items Count</th>
                <th>Quantity Sold</th>
                <th>Sales Value</th>
                <th>Profit</th>
                <th>Margin %</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((cat, index) => `
                <tr>
                  <td><strong>#${index + 1} ${cat.category}</strong></td>
                  <td>${cat.items.length}</td>
                  <td>${cat.soldQty}</td>
                  <td class="text-green"><strong>Rs ${cat.salesValue.toLocaleString()}</strong></td>
                  <td class="text-amber"><strong>Rs ${cat.totalProfit.toLocaleString()}</strong></td>
                  <td>
                    <span class="badge" style="
                      background-color: ${cat.profitMargin >= 20 ? '#d1fae5' : cat.profitMargin >= 10 ? '#fef3c7' : '#fee2e2'};
                      color: ${cat.profitMargin >= 20 ? '#065f46' : cat.profitMargin >= 10 ? '#92400e' : '#991b1b'};
                    ">
                      ${cat.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>TOTAL</strong></td>
                <td><strong>${summary.totalItems}</strong></td>
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

      <Breadcrumb current="Reports / Categories Report" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiFolder className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Categories Performance Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Sales analysis by product categories
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
              {/* <button className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center">
                <FiCalendar className="w-4 h-4" />
                Select Date
              </button> */}
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Categories</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {summary.totalCategories}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiFolder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{summary.totalItems}</p>
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
                  {summary.avgProfitMargin.toFixed(1)}%
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Sales per Category</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  {formatCurrency(summary.avgSalesPerCategory)}
                </p>
              </div>
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <FiBarChart2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
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
              placeholder="Search by category name..."
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
                  Loading Categories Report...
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
              {/* Categories List */}
              {filteredData.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Category Performance Ranking
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {filteredData.length} categor{filteredData.length !== 1 ? 'ies' : 'y'}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredData.map((cat, index) => (
                      <div 
                        key={cat.category} 
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                      >
                        {/* Category Header */}
                        <div 
                          className={`p-4 bg-gradient-to-r ${getCategoryColor(index)} text-white cursor-pointer`}
                          onClick={() => toggleCategory(cat.category)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <span className="font-bold text-lg">
                                  #{index + 1}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold">{cat.category}</h4>
                                <p className="text-sm opacity-90">
                                  {cat.items.length} items • {cat.soldQty} units sold
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-xs opacity-90">Sales</div>
                                <div className="text-lg font-bold">{formatCurrency(cat.salesValue)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs opacity-90">Profit</div>
                                <div className="text-lg font-bold">{formatCurrency(cat.totalProfit)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs opacity-90">Margin</div>
                                <div className={`text-lg font-bold ${
                                  cat.profitMargin >= 20 ? 'text-green-300' :
                                  cat.profitMargin >= 10 ? 'text-yellow-300' :
                                  'text-red-300'
                                }`}>
                                  {cat.profitMargin.toFixed(1)}%
                                </div>
                              </div>
                              <div>
                                <svg 
                                  className={`w-5 h-5 transform transition-transform ${expandedCategory === cat.category ? 'rotate-180' : ''}`}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Category Items (Collapsible) */}
                        {expandedCategory === cat.category && (
                          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gray-700 dark:text-gray-300">
                                  Items in {cat.category}
                                </h5>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Contributes {((cat.salesValue / summary.totalSales) * 100).toFixed(1)}% of total sales
                                </span>
                              </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Item Description</th>
                                    <th className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">SKU</th>
                                    <th className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">Qty</th>
                                    <th className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">Unit Price</th>
                                    <th className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">Sales</th>
                                    <th className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">Profit</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {cat.items.map((item, itemIndex) => (
                                    <tr key={`${item.sku}-${itemIndex}`} className="hover:bg-white dark:hover:bg-gray-800">
                                      <td className="px-3 py-2">
                                        <div className="font-medium text-gray-900 dark:text-white">{item.description}</div>
                                      </td>
                                      <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400 font-mono">
                                        {item.sku}
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                          {item.qty}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.unitPrice)}
                                      </td>
                                      <td className="px-3 py-2 text-right font-semibold text-green-600 dark:text-green-400">
                                        {formatCurrency(item.salesValue)}
                                      </td>
                                      <td className="px-3 py-2 text-right">
                                        <div className="flex flex-col items-end">
                                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                                            {formatCurrency(item.profit)}
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatCurrency(item.profitPerUnit)} per unit
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-gray-100 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600">
                                  <tr>
                                    <td className="px-3 py-2 font-semibold text-gray-900 dark:text-white">Category Total</td>
                                    <td className="px-3 py-2 text-center"></td>
                                    <td className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">{cat.soldQty}</td>
                                    <td className="px-3 py-2 text-right"></td>
                                    <td className="px-3 py-2 text-right font-semibold text-green-600 dark:text-green-400">
                                      {formatCurrency(cat.salesValue)}
                                    </td>
                                    <td className="px-3 py-2 text-right font-semibold text-amber-600 dark:text-amber-400">
                                      {formatCurrency(cat.totalProfit)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Category Performance Summary
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
                              Category
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Items
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Sales Value
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Profit
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Margin %
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              Share
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredData.map((cat, index) => {
                            const share = (cat.salesValue / summary.totalSales) * 100;
                            return (
                              <tr key={cat.category} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                      index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                                      index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' :
                                      index === 2 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' :
                                      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                                    }`}>
                                      #{index + 1}
                                    </span>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                      {cat.category}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-xs text-gray-600 dark:text-gray-400">
                                  {cat.items.length}
                                </td>
                                <td className="px-4 py-3 text-right text-xs">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                                    {cat.soldQty}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-semibold text-green-600 dark:text-green-400">
                                  {formatCurrency(cat.salesValue)}
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-semibold text-amber-600 dark:text-amber-400">
                                  {formatCurrency(cat.totalProfit)}
                                </td>
                                <td className="px-4 py-3 text-right text-xs">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    cat.profitMargin >= 20 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                      : cat.profitMargin >= 10
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                  }`}>
                                    {cat.profitMargin.toFixed(1)}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {share.toFixed(1)}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <td colSpan="2" className="px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300">
                              TOTAL ({filteredData.length} categories)
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
                            <td className="px-4 py-3 text-right text-xs font-bold text-gray-900 dark:text-white">
                              100%
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
                    <FiFolder className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchTerm ? 'No Categories Found' : 'No Data Available'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {searchTerm 
                      ? `No categories found matching "${searchTerm}". Try a different search term.`
                      : `No category data found for ${new Date(reportDate).toLocaleDateString()}. Try selecting a different date.`
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

export default CategoriesReport;