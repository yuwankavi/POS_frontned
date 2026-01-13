// import React, { useEffect, useState } from 'react';
// import reportService from '../../services/reportService';

// const CategoriesReport = () => {
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
//         const cat = it.CATEGORYNAME || 'Uncategorized';
//         if (!map[cat]) map[cat] = { category: cat, soldQty: 0, salesValue: 0 };
//         map[cat].soldQty += parseFloat(it.SOLDQTY || 0);
//         map[cat].salesValue += parseFloat(it.SALESVALUE || 0);
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
//         <h2 className="text-lg font-semibold">Categories Report</h2>
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
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {data.map(d => (
//             <div key={d.category} className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
//               <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{d.category}</div>
//               <div className="text-xs text-gray-500">Qty: {d.soldQty}</div>
//               <div className="text-sm font-semibold text-purple-600 dark:text-purple-300">Rs {d.salesValue.toLocaleString()}</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoriesReport;
import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

const CategoriesReport = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [reportDate, setReportDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalCategories: 0,
    totalQty: 0,
    totalSales: 0,
    totalProfit: 0,
    avgProfitMargin: 0
  });
  const [expandedCategory, setExpandedCategory] = useState(null);

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
      setSummary({
        totalCategories: categoriesArray.length,
        totalQty,
        totalSales,
        totalProfit,
        avgProfitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load categories report');
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
    setExpandedCategory(null);
  };

  const handleRefresh = () => {
    load(reportDate);
    setExpandedCategory(null);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Categories Report</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Performance analysis by product categories
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
      {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Date :
              
              <input
                type="date"
                value={reportDate}
                onChange={handleDateChange}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              /></label>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Report
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div> */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    {/* Left Section */}
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
          onClick={() => window.print()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 
          text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 
          dark:hover:bg-gray-700 transition flex items-center gap-2"
        >
          🖨 Print
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Categories</p>
              <p className="text-2xl font-bold mt-1">{summary.totalCategories}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Items Sold</p>
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
          {/* <div className="text-xs opacity-90 mt-2">
            Avg Margin: {summary.avgProfitMargin.toFixed(1)}%
          </div> */}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories report...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
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

      {/* Categories Grid */}
      {!loading && !error && data.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Categories Performance
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data.length} categor{data.length !== 1 ? 'ies' : 'y'}
            </span>
          </div>

          <div className="space-y-4">
            {data.map((cat, index) => (
              <div 
                key={cat.category} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Category Header */}
                <div 
                  className={`p-5 bg-gradient-to-r ${getCategoryColor(index)} text-white cursor-pointer`}
                  onClick={() => toggleCategory(cat.category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <span className="font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{cat.category}</h4>
                        <p className="text-sm opacity-90">
                          {cat.items.length} item{cat.items.length !== 1 ? 's' : ''} • {cat.soldQty} unit{cat.soldQty !== 1 ? 's' : ''} sold
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm opacity-90">Sales</div>
                        <div className="text-xl font-bold">Rs {cat.salesValue.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90">Profit</div>
                        <div className="text-xl font-bold">Rs {cat.totalProfit.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-90">Margin</div>
                        <div className="text-xl font-bold">{cat.profitMargin.toFixed(1)}%</div>
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
                  <div className="p-5 border-t dark:border-gray-700">
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Items in {cat.category}
                      </h5>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total contribution: {((cat.salesValue / summary.totalSales) * 100).toFixed(1)}% of total sales
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="px-4 py-2 text-left">Item Description</th>
                            <th className="px-4 py-2 text-right">SKU</th>
                            <th className="px-4 py-2 text-right">Qty</th>
                            <th className="px-4 py-2 text-right">Unit Price</th>
                            <th className="px-4 py-2 text-right">Sales</th>
                            <th className="px-4 py-2 text-right">Profit</th>
                            <th className="px-4 py-2 text-right">Cashier</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {cat.items.map((item, itemIndex) => (
                            <tr key={`${item.sku}-${itemIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="px-4 py-2">
                                <div className="font-medium text-gray-900 dark:text-white">{item.description}</div>
                              </td>
                              <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400 font-mono text-xs">
                                {item.sku}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  {item.qty}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right font-medium">
                                Rs {item.unitPrice.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-right font-semibold text-green-600 dark:text-green-400">
                                Rs {item.salesValue.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    Rs {item.profit.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.profitPerUnit.toLocaleString()} per unit
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-right">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                  {item.cashier}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
                          <tr>
                            <td className="px-4 py-2 font-semibold">Category Total</td>
                            <td className="px-4 py-2 text-right"></td>
                            <td className="px-4 py-2 text-right font-semibold">{cat.soldQty}</td>
                            <td className="px-4 py-2 text-right"></td>
                            <td className="px-4 py-2 text-right font-semibold text-green-600 dark:text-green-400">
                              Rs {cat.salesValue.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-amber-600 dark:text-amber-400">
                              Rs {cat.totalProfit.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-right"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Categories Found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            No sales data found for {new Date(reportDate).toLocaleDateString()}. Try selecting a different date.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoriesReport;