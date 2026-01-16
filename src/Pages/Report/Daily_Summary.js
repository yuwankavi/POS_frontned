import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  FiX
} from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb.js";
import { fetchDailySummaryByDate } from "../../actions/dailySummaryAction.js";


import SalesTrendChart from "../../Pages/Report/daily_charts/SalesTrendChart.js";
import TopProductsChart from "../../Pages/Report/daily_charts/TopProductsChart";
import SalesProfitComparisonChart from "../../Pages/Report/daily_charts/SalesProfitComparisonChart";
import HourlySalesChart from "../../Pages/Report/daily_charts/HourlySalesChart";


import { mainCategoryService } from "../../services/Inventory/mainCategoryService";
import { subCategoryService } from "../../services/Inventory/subCategoryServices.js";
import warehouseService from "../../services/Inventory/warehouseService";
import purchaseReturnService from "../../services/Inventory/purchaseReturnService";


import FilterByMonth from "../../components/modals/filterByMonth.js";
import FilterByDate from "../../components/modals/filterByDate.js";


import { generateDailySummaryReport } from "../../utils/printUtils.js";

// Helper function to parse date strings in various formats including "M/D/YYYY h:mm:ss AM/PM"
const parseDateTime = (dateStr) => {
  if (!dateStr) return null;
  
  try {
    // Try ISO format first (contains 'T')
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;
    }
    
    // Handle "M/D/YYYY h:mm:ss AM/PM" format (e.g., "1/4/2026 1:10:25 AM")
    const amPmMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (amPmMatch) {
      const [, month, day, year, hours, minutes, seconds, ampm] = amPmMatch;
      let hour24 = parseInt(hours);
      
      // Convert 12-hour to 24-hour format
      if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes), parseInt(seconds));
      if (!isNaN(date.getTime())) return date;
    }
    
    // Handle "M/D/YYYY H:mm:ss" format (24-hour without AM/PM)
    const match24h = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/);
    if (match24h) {
      const [, month, day, year, hours, minutes, seconds] = match24h;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
      if (!isNaN(date.getTime())) return date;
    }
    
    // Fallback: try replacing space with T for standard parsing
    const date = new Date(dateStr.replace(' ', 'T'));
    if (!isNaN(date.getTime())) return date;
    
    return null;
  } catch (error) {
    return null;
  }
};

// Get hour from item using INDATE or INNOVICED_ON fields
const getHourFromItem = (item) => {
  // Try INDATE first (primary field from API)
  let date = parseDateTime(item.INDATE);
  
  // Fallback to INNOVICED_ON
  if (!date) {
    date = parseDateTime(item.INNOVICED_ON);
  }
  
  if (date) {
    return date.getHours();
  }
  
  // Return null if no valid date found
  return null;
};

export default function DailySummary() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.ui);


  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const [dateFilterData, setDateFilterData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [chooseFilter, setChooseFilter] = useState("daily");
  const [activeTab, setActiveTab] = useState("overview");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);


  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [purchaseReturns, setPurchaseReturns] = useState([]);
  const [additionalLoading, setAdditionalLoading] = useState(false);

  const refreshIntervalRef = useRef(null);
  const lastDataRef = useRef([]);

  const today = new Date().toISOString().split("T")[0];


  useEffect(() => {
    loadData();

    return () => {

      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, []);


  useEffect(() => {
    if (autoRefresh) {

      refreshIntervalRef.current = setInterval(() => {

        loadData();
      }, 30000);
    } else {
      if (refreshIntervalRef.current) {

        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [autoRefresh]);

  const loadData = async () => {

    try {
      await dispatch(fetchDailySummaryByDate(today, today));
      await loadAdditionalData();
      setLastUpdated(new Date());

    } catch (error) {

      showAlertMessage("Failed to load data", "error");
    }
  };

  const {
    data = [],
    loading,
    error,
  } = useSelector((state) => state.dailySummaryByDate);

  const dataArray = data || [];


  useEffect(() => {
    if (dataArray.length > 0 && JSON.stringify(dataArray) !== JSON.stringify(lastDataRef.current)) {

      lastDataRef.current = dataArray;
    }
  }, [dataArray]);


  const loadAdditionalData = async () => {
    setAdditionalLoading(true);
    try {
      const [mainCats, subCats, whs, prs] = await Promise.all([
        mainCategoryService.getAllActive(),
        subCategoryService.getAllActive(),
        warehouseService.getAllActive(),
        purchaseReturnService.getAll()
      ]);

      setMainCategories(mainCats);
      setSubCategories(subCats);
      setWarehouses(whs);
      setPurchaseReturns(prs);
    } catch (error) {

      showAlertMessage("Failed to load some analytics data", "error");
    } finally {
      setAdditionalLoading(false);
    }
  };


  const summaryMetrics = React.useMemo(() => {
    const totalSales = dataArray.reduce((sum, item) => sum + (parseFloat(item.SALESVALUE) || 0), 0);
    const totalQuantity = dataArray.reduce((sum, item) => sum + (parseInt(item.SOLDQTY) || 0), 0);
    const uniqueProducts = new Set(dataArray.map(item => item.PRDESC)).size;
    const averageOrderValue = dataArray.length > 0 ? totalSales / dataArray.length : 0;
    const totalProfit = dataArray.reduce((sum, item) => sum + (parseFloat(item.TOTAL_PROFIT) || 0), 0);

    return {
      totalSales,
      totalQuantity,
      uniqueProducts,
      averageOrderValue,
      totalProfit,
      totalTransactions: dataArray.length,
      totalCategories: mainCategories.length,
      totalSubCategories: subCategories.length,
    };
  }, [dataArray, mainCategories, subCategories]);


  const detailedSalesTrendData = React.useMemo(() => {
    if (!dataArray.length) return [];

    const hourlySales = {};


    for (let hour = 0; hour < 24; hour++) {
      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hourKey = `${hour12}:00 ${ampm}`;
      hourlySales[hourKey] = {
        time: hourKey,
        sales: 0,
        transactions: 0,
        quantity: 0,
        hour24: hour
      };
    }


    dataArray.forEach(item => {
      const hour = getHourFromItem(item);
      
      // Skip items with invalid dates
      if (hour === null) return;

      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hourKey = `${hour12}:00 ${ampm}`;

      if (hourlySales[hourKey]) {
        hourlySales[hourKey].sales += parseFloat(item.SALESVALUE) || 0;
        hourlySales[hourKey].transactions += 1;
        hourlySales[hourKey].quantity += parseInt(item.SOLDQTY) || 0;
      }
    });


    const result = Object.values(hourlySales)
      .sort((a, b) => a.hour24 - b.hour24)
      .map(item => ({
        time: item.time,
        sales: item.sales,
        transactions: item.transactions,
        quantity: item.quantity
      }));


    return result;
  }, [dataArray]);


  const hourlySalesData = React.useMemo(() => {
    if (!dataArray.length) return [];

    const hourlyData = {};


    for (let hour = 0; hour < 24; hour++) {
      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hourKey = `${hour12}:00 ${ampm}`;
      hourlyData[hourKey] = {
        hour: hourKey,
        sales: 0,
        transactions: 0,
        quantity: 0,
        hour24: hour
      };
    }


    dataArray.forEach(item => {
      const hour = getHourFromItem(item);
      
      // Skip items with invalid dates
      if (hour === null) return;

      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hourKey = `${hour12}:00 ${ampm}`;

      if (hourlyData[hourKey]) {
        hourlyData[hourKey].sales += parseFloat(item.SALESVALUE) || 0;
        hourlyData[hourKey].transactions += 1;
        hourlyData[hourKey].quantity += parseInt(item.SOLDQTY) || 0;
      }
    });


    const result = Object.values(hourlyData)
      .sort((a, b) => a.hour24 - b.hour24)
      .map(item => ({
        hour: item.hour,
        sales: item.sales,
        transactions: item.transactions,
        quantity: item.quantity
      }));


    return result;
  }, [dataArray]);


  const topProductsData = React.useMemo(() => {
    const productMap = {};
    dataArray.forEach(item => {
      const productName = item.PRDESC || 'Unknown Product';
      if (!productMap[productName]) {
        productMap[productName] = {
          name: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
          sales: 0,
          quantity: 0,
          profit: 0,
          unitPrice: parseFloat(item.UNITPRICE) || 0
        };
      }
      productMap[productName].sales += parseFloat(item.SALESVALUE) || 0;
      productMap[productName].quantity += parseInt(item.SOLDQTY) || 0;
      productMap[productName].profit += parseFloat(item.TOTAL_PROFIT) || 0;
    });

    const result = Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8);


    return result;
  }, [dataArray]);


  const salesProfitComparisonData = React.useMemo(() => {
    if (!dataArray.length) return [];


    const hourlyComparison = {};


    for (let hour = 0; hour < 24; hour++) {
      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hourKey = `${hour12}:00 ${ampm}`;
      hourlyComparison[hourKey] = {
        time: hourKey,
        sales: 0,
        profit: 0,
        hour24: hour
      };
    }


    dataArray.forEach(item => {
      const hour = getHourFromItem(item);
      
      // Skip items with invalid dates
      if (hour === null) return;

      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      const hourKey = `${hour12}:00 ${ampm}`;

      if (hourlyComparison[hourKey]) {
        hourlyComparison[hourKey].sales += parseFloat(item.SALESVALUE) || 0;
        hourlyComparison[hourKey].profit += parseFloat(item.TOTAL_PROFIT) || 0;
      }
    });


    const result = Object.values(hourlyComparison)
      .sort((a, b) => a.hour24 - b.hour24)
      .map(item => ({
        time: item.time,
        sales: item.sales,
        profit: item.profit
      }));


    return result;
  }, [dataArray]);


  const filteredData = dataArray.filter((d) => {
    const matchesSearch =
      (d.CUSNAME || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.PRDESC || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.CAHIERNAME || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.WHCODE || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleRefresh = () => {

    loadData();
    showAlertMessage("Data refreshed successfully", "success");
  };

  const handleAutoRefreshToggle = () => {
    const newAutoRefreshState = !autoRefresh;
    setAutoRefresh(newAutoRefreshState);
    if (newAutoRefreshState) {
      showAlertMessage("Auto-refresh enabled (30 seconds)", "info");
    } else {
      showAlertMessage("Auto-refresh disabled", "info");
    }
  };

  const handlePrintReport = async () => {
    if (isPrinting) return;

    setIsPrinting(true);
    try {
      const reportData = {
        summary: summaryMetrics,
        salesTrend: detailedSalesTrendData,
        hourlySales: hourlySalesData,
        topProducts: topProductsData,
        salesProfitComparison: salesProfitComparisonData,
        transactions: dataArray,
        dateRange: {
          start: today,
          end: today
        },
        generatedAt: new Date().toLocaleString()
      };

      await generateDailySummaryReport(reportData);
      showAlertMessage("Report printed successfully", "success");
    } catch (error) {

      showAlertMessage(`Failed to print report: ${error.message}`, "error");
    } finally {
      setIsPrinting(false);
    }
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

  return (
    <div className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full overflow-y-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}>

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

      <Breadcrumb current="Reports / Daily Summary" />

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiBarChart2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Sales Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Real-time overview of your daily sales performance
                {lastUpdated && (
                  <span className="ml-2 text-green-600">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                {autoRefresh && (
                  <span className="ml-2 text-blue-600">
                    • Auto-refresh: ON
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

              <button
                onClick={handleAutoRefreshToggle}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm min-w-[80px] justify-center ${autoRefresh
                    ? 'bg-blue-600 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
              >
                <FiActivity className="w-4 h-4" />
                {autoRefresh ? 'On' : 'Off'}
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrintReport}
              disabled={isPrinting || dataArray.length === 0}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm min-w-[120px] justify-center disabled:opacity-50"
            >
              <FiPrinter className="w-4 h-4" />
              {isPrinting ? "Printing..." : "Print Report"}
            </button>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setChooseFilter("month");
                  setIsFilterModalOpen(true);
                }}
                className={`flex items-center gap-1 ${chooseFilter === "month"
                    ? `bg-blue-900`
                    : `bg-gradient-to-r from-blue-600 to-indigo-600`
                  } hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[140px] justify-center`}
              >
                <FiCalendar className="w-4 h-4" />
                Filter By Month
              </button>

              <button
                onClick={() => setIsDateModalOpen(true)}
                className={`flex items-center gap-1 ${chooseFilter === "month"
                    ? `bg-blue-900`
                    : `bg-gradient-to-r from-blue-600 to-indigo-600`
                  } hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center`}
              >
                <FiCalendar className="w-4 h-4" />
                Filter By Date
              </button>
            </div>
          </div>
        </div>

        {/* Primary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Sales</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(summaryMetrics.totalSales)}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiDollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Profit</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(summaryMetrics.totalProfit)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiTrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Items Sold</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {summaryMetrics.totalQuantity.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Order Value</p>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(summaryMetrics.averageOrderValue)}
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FiUsers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{summaryMetrics.totalTransactions}</p>
              </div>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <FiCreditCard className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{summaryMetrics.uniqueProducts}</p>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <FiPackage className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{summaryMetrics.totalCategories}</p>
              </div>
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                <FiPieChart className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-3">
          <div className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: FiBarChart2 },
                { id: "products", name: "Products", icon: FiPackage },
                { id: "transactions", name: "Transactions", icon: FiShoppingCart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? darkMode
                        ? "border-blue-500 text-blue-500"
                        : "border-blue-600 text-blue-600"
                      : darkMode
                        ? "border-transparent text-gray-400 hover:text-gray-300"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search By Customer Name, Warehouse Code, Product Description & Cashier Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
          }`}>
          {loading || additionalLoading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-green-800" : "border-green-200"
                      }`}
                  ></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p
                  className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Loading Data...
                </p>
              </div>
            </div>
          ) : error ? (
            <div
              className={`rounded-xl p-4 text-center h-full flex items-center justify-center border ${darkMode
                  ? "bg-red-900/20 border-red-800"
                  : "bg-red-50 border-red-200"
                }`}
            >
              <div>
                <div
                  className={`font-medium text-sm ${darkMode ? "text-red-400" : "text-red-600"
                    }`}
                >
                  ⚠️ Error
                </div>
                <p
                  className={`mt-1 text-xs ${darkMode ? "text-red-400" : "text-red-600"
                    }`}
                >
                  {error}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overview Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Main Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Sales Trend Chart */}
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
                      }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Sales Trend - Hourly Intervals
                        </h3>
                        <div className="flex items-center gap-2">
                          {autoRefresh && (
                            <div className="flex items-center gap-1 text-green-500 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Live
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            Current Time: {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <SalesTrendChart
                        data={detailedSalesTrendData}
                        darkMode={darkMode}
                        currency="Rs."
                      />
                    </div>

                    {/* Sales vs Profit Comparison Chart */}
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
                      }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Sales vs Profit Comparison
                        </h3>
                        <div className="flex items-center gap-2">
                          {autoRefresh && (
                            <div className="flex items-center gap-1 text-green-500 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Live
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            Current Time: {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <SalesProfitComparisonChart
                        data={salesProfitComparisonData}
                        darkMode={darkMode}
                        currency="Rs."
                      />
                    </div>
                  </div>

                  {/* Secondary Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Top Products Chart */}
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
                      }`}>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Top Products by Revenue
                      </h3>
                      <TopProductsChart
                        data={topProductsData}
                        darkMode={darkMode}
                        currency="Rs."
                      />
                    </div>

                    {/* Hourly Sales Performance */}
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
                      }`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Hourly Sales Performance
                        </h3>
                        <div className="flex items-center gap-2">
                          {autoRefresh && (
                            <div className="flex items-center gap-1 text-green-500 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Live
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            Current Time: {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <HourlySalesChart
                        data={hourlySalesData}
                        darkMode={darkMode}
                        currency="Rs."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab Content */}
              {activeTab === "products" && (
                <div className={`rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
                  }`}>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Product Performance
                      </h3>
                      <span className="text-xs text-gray-500">
                        Updated: {lastUpdated.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
                        }`}>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                            Product Description
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                            Batch ID
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                            Sold Qty
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
                            Sales Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
                        }`}>
                        {filteredData.map((row, index) => (
                          <tr key={index} className={`transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                            }`}>
                            <td className="px-4 py-2 whitespace-nowrap text-xs">
                              {row.PRDESC}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-center">
                              {row.BATCHID}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
                              {formatCurrency(row.UNITPRICE)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
                              {row.SOLDQTY}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
                              {formatCurrency(row.SALESVALUE)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredData.length === 0 && (
                      <div className="text-center py-8">
                        <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>No products found</p>
                        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"
                          }`}>Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transactions Tab Content */}
              {activeTab === "transactions" && (
                <div className={`rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
                  }`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Recent Transactions
                      </h3>
                      <span className="text-xs text-gray-500">
                        Updated: {lastUpdated.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {filteredData.slice(0, 10).map((transaction, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-900" : "bg-blue-100"
                                }`}>
                                <FiShoppingCart className={`w-3 h-3 ${darkMode ? "text-blue-400" : "text-blue-600"
                                  }`} />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-900 dark:text-white">
                                  {transaction.PRDESC}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.CUSNAME} • {transaction.WHCODE} • {transaction.CAHIERNAME}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(transaction.SALESVALUE)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Qty: {transaction.SOLDQTY} • Price: {formatCurrency(transaction.UNITPRICE)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Modals */}
      <FilterByMonth
        isOpen={isFilterModalOpen}
        darkMode={darkMode}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(value) => {
          setFilterData(value);
          if (value.mode === "single" && value.value) {
            dispatch(
              fetchDailySummaryByDate(value.value.start, value.value.end)
            );
          } else if (
            value.mode === "range" &&
            value.value.start &&
            value.value.end
          ) {
            dispatch(
              fetchDailySummaryByDate(value.value.start, value.value.end)
            );
          }
        }}
      />

      <FilterByDate
        isOpen={isDateModalOpen}
        darkMode={darkMode}
        onClose={() => setIsDateModalOpen(false)}
        onApply={(value) => {
          setDateFilterData(value);
          if (value.mode === "single") {
            dispatch(fetchDailySummaryByDate(value.value, value.value));
          } else if (value.mode === "range") {
            dispatch(
              fetchDailySummaryByDate(value.value.start, value.value.end)
            );
          }
        }}
      />
    </div>
  );
}








// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
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
//   FiGrid
// } from "react-icons/fi";
// import Breadcrumb from "../../components/common/Breadcrumb.js";
// import { fetchDailySummaryByDate } from "../../actions/dailySummaryAction.js";

// import SalesTrendChart from "../../Pages/Report/daily_charts/SalesTrendChart.js";
// import TopProductsChart from "../../Pages/Report/daily_charts/TopProductsChart";
// import SalesProfitComparisonChart from "../../Pages/Report/daily_charts/SalesProfitComparisonChart";
// import HourlySalesChart from "../../Pages/Report/daily_charts/HourlySalesChart";
// import TradingViewWidget from "../../Pages/Report/daily_charts/TradingViewWidget.js";

// import { mainCategoryService } from "../../services/Inventory/mainCategoryService";
// import { subCategoryService } from "../../services/Inventory/subCategoryServices.js";
// import warehouseService from "../../services/Inventory/warehouseService";
// import purchaseReturnService from "../../services/Inventory/purchaseReturnService";

// import FilterByMonth from "../../components/modals/filterByMonth.js";
// import FilterByDate from "../../components/modals/filterByDate.js";

// import { generateDailySummaryReport } from "../../utils/printUtils.js";

// export default function DailySummary() {
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state) => state.ui);

//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [isDateModalOpen, setIsDateModalOpen] = useState(false);
//   const [filterData, setFilterData] = useState(null);
//   const [dateFilterData, setDateFilterData] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [chooseFilter, setChooseFilter] = useState("daily");
//   const [activeTab, setActiveTab] = useState("overview");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [alertType, setAlertType] = useState("success");
//   const [showAlert, setShowAlert] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
//   const [autoRefresh, setAutoRefresh] = useState(false);
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [showStockChart, setShowStockChart] = useState(false);

//   const [mainCategories, setMainCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);
//   const [purchaseReturns, setPurchaseReturns] = useState([]);
//   const [additionalLoading, setAdditionalLoading] = useState(false);

//   const refreshIntervalRef = useRef(null);
//   const lastDataRef = useRef([]);

//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     loadData();

//     return () => {
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//         refreshIntervalRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (autoRefresh) {
//       refreshIntervalRef.current = setInterval(() => {
//         loadData();
//       }, 30000);
//     } else {
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//         refreshIntervalRef.current = null;
//       }
//     }

//     return () => {
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//         refreshIntervalRef.current = null;
//       }
//     };
//   }, [autoRefresh]);

//   const loadData = async () => {
//     try {
//       await dispatch(fetchDailySummaryByDate(today, today));
//       await loadAdditionalData();
//       setLastUpdated(new Date());
//     } catch (error) {
//       showAlertMessage("Failed to load data", "error");
//     }
//   };

//   const {
//     data = [],
//     loading,
//     error,
//   } = useSelector((state) => state.dailySummaryByDate);

//   const dataArray = data || [];

//   useEffect(() => {
//     if (dataArray.length > 0 && JSON.stringify(dataArray) !== JSON.stringify(lastDataRef.current)) {
//       lastDataRef.current = dataArray;
//     }
//   }, [dataArray]);

//   const loadAdditionalData = async () => {
//     setAdditionalLoading(true);
//     try {
//       const [mainCats, subCats, whs, prs] = await Promise.all([
//         mainCategoryService.getAllActive(),
//         subCategoryService.getAllActive(),
//         warehouseService.getAllActive(),
//         purchaseReturnService.getAll()
//       ]);

//       setMainCategories(mainCats);
//       setSubCategories(subCats);
//       setWarehouses(whs);
//       setPurchaseReturns(prs);
//     } catch (error) {
//       showAlertMessage("Failed to load some analytics data", "error");
//     } finally {
//       setAdditionalLoading(false);
//     }
//   };

//   const summaryMetrics = React.useMemo(() => {
//     const totalSales = dataArray.reduce((sum, item) => sum + (parseFloat(item.SALESVALUE) || 0), 0);
//     const totalQuantity = dataArray.reduce((sum, item) => sum + (parseInt(item.SOLDQTY) || 0), 0);
//     const uniqueProducts = new Set(dataArray.map(item => item.PRDESC)).size;
//     const averageOrderValue = dataArray.length > 0 ? totalSales / dataArray.length : 0;
//     const totalProfit = dataArray.reduce((sum, item) => sum + (parseFloat(item.TOTAL_PROFIT) || 0), 0);

//     return {
//       totalSales,
//       totalQuantity,
//       uniqueProducts,
//       averageOrderValue,
//       totalProfit,
//       totalTransactions: dataArray.length,
//       totalCategories: mainCategories.length,
//       totalSubCategories: subCategories.length,
//     };
//   }, [dataArray, mainCategories, subCategories]);

//   const detailedSalesTrendData = React.useMemo(() => {
//     if (!dataArray.length) return [];

//     const hourlySales = {};

//     for (let hour = 0; hour < 24; hour++) {
//       const hour12 = hour % 12 || 12;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const hourKey = `${hour12}:00 ${ampm}`;
//       hourlySales[hourKey] = {
//         time: hourKey,
//         sales: 0,
//         transactions: 0,
//         quantity: 0,
//         hour24: hour
//       };
//     }

//     dataArray.forEach(item => {
//       let hour;

//       if (item.INNOVICED_ON) {
//         try {
//           const dateStr = item.INNOVICED_ON;
//           let date;

//           if (dateStr.includes('T')) {
//             date = new Date(dateStr);
//           } else {
//             date = new Date(dateStr.replace(' ', 'T'));
//           }

//           if (!isNaN(date.getTime())) {
//             hour = date.getHours();
//           } else {
//             hour = new Date().getHours();
//           }
//         } catch (error) {
//           hour = new Date().getHours();
//         }
//       } else {
//         hour = new Date().getHours();
//       }

//       const hour12 = hour % 12 || 12;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const hourKey = `${hour12}:00 ${ampm}`;

//       if (hourlySales[hourKey]) {
//         hourlySales[hourKey].sales += parseFloat(item.SALESVALUE) || 0;
//         hourlySales[hourKey].transactions += 1;
//         hourlySales[hourKey].quantity += parseInt(item.SOLDQTY) || 0;
//       }
//     });

//     const result = Object.values(hourlySales)
//       .sort((a, b) => a.hour24 - b.hour24)
//       .map(item => ({
//         time: item.time,
//         sales: item.sales,
//         transactions: item.transactions,
//         quantity: item.quantity
//       }));

//     return result;
//   }, [dataArray]);

//   const hourlySalesData = React.useMemo(() => {
//     if (!dataArray.length) return [];

//     const hourlyData = {};

//     for (let hour = 0; hour < 24; hour++) {
//       const hour12 = hour % 12 || 12;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const hourKey = `${hour12}:00 ${ampm}`;
//       hourlyData[hourKey] = {
//         hour: hourKey,
//         sales: 0,
//         transactions: 0,
//         quantity: 0,
//         hour24: hour
//       };
//     }

//     dataArray.forEach(item => {
//       let hour;

//       if (item.INNOVICED_ON) {
//         try {
//           const dateStr = item.INNOVICED_ON;
//           let date;

//           if (dateStr.includes('T')) {
//             date = new Date(dateStr);
//           } else {
//             date = new Date(dateStr.replace(' ', 'T'));
//           }

//           if (!isNaN(date.getTime())) {
//             hour = date.getHours();
//           } else {
//             hour = new Date().getHours();
//           }
//         } catch (error) {
//           hour = new Date().getHours();
//         }
//       } else {
//         hour = new Date().getHours();
//       }

//       const hour12 = hour % 12 || 12;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const hourKey = `${hour12}:00 ${ampm}`;

//       if (hourlyData[hourKey]) {
//         hourlyData[hourKey].sales += parseFloat(item.SALESVALUE) || 0;
//         hourlyData[hourKey].transactions += 1;
//         hourlyData[hourKey].quantity += parseInt(item.SOLDQTY) || 0;
//       }
//     });

//     const result = Object.values(hourlyData)
//       .sort((a, b) => a.hour24 - b.hour24)
//       .map(item => ({
//         hour: item.hour,
//         sales: item.sales,
//         transactions: item.transactions,
//         quantity: item.quantity
//       }));

//     return result;
//   }, [dataArray]);

//   const topProductsData = React.useMemo(() => {
//     const productMap = {};
//     dataArray.forEach(item => {
//       const productName = item.PRDESC || 'Unknown Product';
//       if (!productMap[productName]) {
//         productMap[productName] = {
//           name: productName.length > 20 ? productName.substring(0, 20) + '...' : productName,
//           sales: 0,
//           quantity: 0,
//           profit: 0,
//           unitPrice: parseFloat(item.UNITPRICE) || 0
//         };
//       }
//       productMap[productName].sales += parseFloat(item.SALESVALUE) || 0;
//       productMap[productName].quantity += parseInt(item.SOLDQTY) || 0;
//       productMap[productName].profit += parseFloat(item.TOTAL_PROFIT) || 0;
//     });

//     const result = Object.values(productMap)
//       .sort((a, b) => b.sales - a.sales)
//       .slice(0, 8);

//     return result;
//   }, [dataArray]);

//   const salesProfitComparisonData = React.useMemo(() => {
//     if (!dataArray.length) return [];

//     const hourlyComparison = {};

//     for (let hour = 0; hour < 24; hour++) {
//       const hour12 = hour % 12 || 12;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const hourKey = `${hour12}:00 ${ampm}`;
//       hourlyComparison[hourKey] = {
//         time: hourKey,
//         sales: 0,
//         profit: 0,
//         hour24: hour
//       };
//     }

//     dataArray.forEach(item => {
//       let hour;

//       if (item.INNOVICED_ON) {
//         try {
//           const dateStr = item.INNOVICED_ON;
//           let date;

//           if (dateStr.includes('T')) {
//             date = new Date(dateStr);
//           } else {
//             date = new Date(dateStr.replace(' ', 'T'));
//           }

//           if (!isNaN(date.getTime())) {
//             hour = date.getHours();
//           } else {
//             hour = new Date().getHours();
//           }
//         } catch (error) {
//           hour = new Date().getHours();
//         }
//       } else {
//         hour = new Date().getHours();
//       }

//       const hour12 = hour % 12 || 12;
//       const ampm = hour < 12 ? 'AM' : 'PM';
//       const hourKey = `${hour12}:00 ${ampm}`;

//       if (hourlyComparison[hourKey]) {
//         hourlyComparison[hourKey].sales += parseFloat(item.SALESVALUE) || 0;
//         hourlyComparison[hourKey].profit += parseFloat(item.TOTAL_PROFIT) || 0;
//       }
//     });

//     const result = Object.values(hourlyComparison)
//       .sort((a, b) => a.hour24 - b.hour24)
//       .map(item => ({
//         time: item.time,
//         sales: item.sales,
//         profit: item.profit
//       }));

//     return result;
//   }, [dataArray]);

//   const filteredData = dataArray.filter((d) => {
//     const matchesSearch =
//       (d.CUSNAME || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (d.PRDESC || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (d.CAHIERNAME || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (d.WHCODE || '').toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesSearch;
//   });

//   const showAlertMessage = (message, type = 'success') => {
//     setAlertMessage(message);
//     setAlertType(type);
//     setShowAlert(true);

//     setTimeout(() => {
//       setShowAlert(false);
//     }, 5000);
//   };

//   const handleRefresh = () => {
//     loadData();
//     showAlertMessage("Data refreshed successfully", "success");
//   };

//   const handleAutoRefreshToggle = () => {
//     const newAutoRefreshState = !autoRefresh;
//     setAutoRefresh(newAutoRefreshState);
//     if (newAutoRefreshState) {
//       showAlertMessage("Auto-refresh enabled (30 seconds)", "info");
//     } else {
//       showAlertMessage("Auto-refresh disabled", "info");
//     }
//   };

//   const handlePrintReport = async () => {
//     if (isPrinting) return;

//     setIsPrinting(true);
//     try {
//       const reportData = {
//         summary: summaryMetrics,
//         salesTrend: detailedSalesTrendData,
//         hourlySales: hourlySalesData,
//         topProducts: topProductsData,
//         salesProfitComparison: salesProfitComparisonData,
//         transactions: dataArray,
//         dateRange: {
//           start: today,
//           end: today
//         },
//         generatedAt: new Date().toLocaleString()
//       };

//       await generateDailySummaryReport(reportData);
//       showAlertMessage("Report printed successfully", "success");
//     } catch (error) {
//       showAlertMessage(`Failed to print report: ${error.message}`, "error");
//     } finally {
//       setIsPrinting(false);
//     }
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

//   return (
//     <div className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//       } border`}>

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

//       <Breadcrumb current="Reports / Daily Summary" />

//       {/* Header */}
//       <div className="mt-2 mb-3 md:mb-5">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2 gap-3">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
//               <FiBarChart2 className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900 dark:text-white">
//                 Sales Dashboard
//               </h1>
//               <p className="text-xs text-gray-600 dark:text-gray-400">
//                 Real-time overview of your daily sales performance
//                 {lastUpdated && (
//                   <span className="ml-2 text-green-600">
//                     • Last updated: {lastUpdated.toLocaleTimeString()}
//                   </span>
//                 )}
//                 {autoRefresh && (
//                   <span className="ml-2 text-blue-600">
//                     • Auto-refresh: ON
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* Responsive Button Group */}
//           <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
//             {/* Stock Chart Toggle Button */}
//             <button
//               onClick={() => setShowStockChart(!showStockChart)}
//               className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center ${showStockChart
//                   ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
//                   : darkMode
//                     ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//             >
//               <FiGrid className="w-4 h-4" />
//               {showStockChart ? 'Hide Stocks' : 'Show Stocks'}
//             </button>

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

//               <button
//                 onClick={handleAutoRefreshToggle}
//                 className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm min-w-[80px] justify-center ${autoRefresh
//                     ? 'bg-blue-600 text-white'
//                     : darkMode
//                       ? 'bg-gray-700 text-gray-300'
//                       : 'bg-gray-200 text-gray-700'
//                   }`}
//               >
//                 <FiActivity className="w-4 h-4" />
//                 {autoRefresh ? 'On' : 'Off'}
//               </button>
//             </div>

//             {/* Print Button */}
//             <button
//               onClick={handlePrintReport}
//               disabled={isPrinting || dataArray.length === 0}
//               className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm min-w-[120px] justify-center disabled:opacity-50"
//             >
//               <FiPrinter className="w-4 h-4" />
//               {isPrinting ? "Printing..." : "Print Report"}
//             </button>

//             {/* Filter Buttons */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   setChooseFilter("month");
//                   setIsFilterModalOpen(true);
//                 }}
//                 className={`flex items-center gap-1 ${chooseFilter === "month"
//                     ? `bg-blue-900`
//                     : `bg-gradient-to-r from-blue-600 to-indigo-600`
//                   } hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[140px] justify-center`}
//               >
//                 <FiCalendar className="w-4 h-4" />
//                 Filter By Month
//               </button>

//               <button
//                 onClick={() => setIsDateModalOpen(true)}
//                 className={`flex items-center gap-1 ${chooseFilter === "month"
//                     ? `bg-blue-900`
//                     : `bg-gradient-to-r from-blue-600 to-indigo-600`
//                   } hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm min-w-[130px] justify-center`}
//               >
//                 <FiCalendar className="w-4 h-4" />
//                 Filter By Date
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Primary Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
//             }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Total Sales</p>
//                 <p className="text-sm font-bold text-green-600 dark:text-green-400">
//                   {formatCurrency(summaryMetrics.totalSales)}
//                 </p>
//               </div>
//               <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
//                 <FiDollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </div>

//           <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
//             }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Total Profit</p>
//                 <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
//                   {formatCurrency(summaryMetrics.totalProfit)}
//                 </p>
//               </div>
//               <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
//                 <FiTrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//               </div>
//             </div>
//           </div>

//           <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
//             }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Items Sold</p>
//                 <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
//                   {summaryMetrics.totalQuantity.toLocaleString('en-IN')}
//                 </p>
//               </div>
//               <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
//                 <FiShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </div>

//           <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'
//             }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Order Value</p>
//                 <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
//                   {formatCurrency(summaryMetrics.averageOrderValue)}
//                 </p>
//               </div>
//               <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
//                 <FiUsers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2 mb-3">
//           <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'
//             }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Transactions</p>
//                 <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{summaryMetrics.totalTransactions}</p>
//               </div>
//               <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
//                 <FiCreditCard className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
//               </div>
//             </div>
//           </div>
//           <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'
//             }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
//                 <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{summaryMetrics.uniqueProducts}</p>
//               </div>
//               <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
//                 <FiPackage className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
//               </div>
//             </div>
//           </div>
//           <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'
//             }`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
//                 <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{summaryMetrics.totalCategories}</p>
//               </div>
//               <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
//                 <FiPieChart className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="mb-3">
//           <div className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
//             <nav className="-mb-px flex space-x-8">
//               {[
//                 { id: "overview", name: "Overview", icon: FiBarChart2 },
//                 { id: "products", name: "Products", icon: FiPackage },
//                 { id: "transactions", name: "Transactions", icon: FiShoppingCart },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
//                       ? darkMode
//                         ? "border-blue-500 text-blue-500"
//                         : "border-blue-600 text-blue-600"
//                       : darkMode
//                         ? "border-transparent text-gray-400 hover:text-gray-300"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                     }`}
//                 >
//                   <tab.icon className="w-4 h-4" />
//                   {tab.name}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-1 md:mb-2">
//           <div className="relative flex-1">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search By Customer Name, Warehouse Code, Product Description & Cashier Name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode
//                   ? "bg-gray-700 border-gray-600 text-white"
//                   : "bg-gray-50 border-gray-200 text-gray-900"
//                 }`}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Content Area */}
//       <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
//         <div className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? "bg-gray-700/30" : "bg-gray-100"
//           }`}>
//           {loading || additionalLoading ? (
//             <div className="flex items-center justify-center py-8 rounded-xl h-full">
//               <div className="flex flex-col items-center gap-2">
//                 <div className="relative">
//                   <div
//                     className={`w-8 h-8 border-4 rounded-full animate-spin ${darkMode ? "border-green-800" : "border-green-200"
//                       }`}
//                   ></div>
//                   <div className="absolute inset-0 w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//                 <p
//                   className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"
//                     }`}
//                 >
//                   Loading Data...
//                 </p>
//               </div>
//             </div>
//           ) : error ? (
//             <div
//               className={`rounded-xl p-4 text-center h-full flex items-center justify-center border ${darkMode
//                   ? "bg-red-900/20 border-red-800"
//                   : "bg-red-50 border-red-200"
//                 }`}
//             >
//               <div>
//                 <div
//                   className={`font-medium text-sm ${darkMode ? "text-red-400" : "text-red-600"
//                     }`}
//                 >
//                   ⚠️ Error
//                 </div>
//                 <p
//                   className={`mt-1 text-xs ${darkMode ? "text-red-400" : "text-red-600"
//                     }`}
//                 >
//                   {error}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Stock Chart Section - Conditionally Rendered */}
//               {showStockChart && (
//                 <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
//                   }`}>
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                       Market Watch - Real-time Stock Chart
//                     </h3>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-gray-500">
//                         Powered by TradingView
//                       </span>
//                     </div>
//                   </div>
//                   <div className="h-[400px] rounded-lg overflow-hidden">
//                     <TradingViewWidget />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Interactive stock chart showing market trends. You can change symbols, intervals, and other settings.
//                   </p>
//                 </div>
//               )}

//               {/* Overview Tab Content */}
//               {activeTab === "overview" && (
//                 <div className="space-y-4">
//                   {/* Main Charts Row */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                     {/* Sales Trend Chart */}
//                     <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
//                       }`}>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                           Sales Trend - Hourly Intervals
//                         </h3>
//                         <div className="flex items-center gap-2">
//                           {autoRefresh && (
//                             <div className="flex items-center gap-1 text-green-500 text-xs">
//                               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                               Live
//                             </div>
//                           )}
//                           <span className="text-xs text-gray-500">
//                             Current Time: {new Date().toLocaleTimeString()}
//                           </span>
//                         </div>
//                       </div>
//                       <SalesTrendChart
//                         data={detailedSalesTrendData}
//                         darkMode={darkMode}
//                         currency="Rs."
//                       />
//                     </div>

//                     {/* Sales vs Profit Comparison Chart */}
//                     <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
//                       }`}>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                           Sales vs Profit Comparison
//                         </h3>
//                         <div className="flex items-center gap-2">
//                           {autoRefresh && (
//                             <div className="flex items-center gap-1 text-green-500 text-xs">
//                               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                               Live
//                             </div>
//                           )}
//                           <span className="text-xs text-gray-500">
//                             Current Time: {new Date().toLocaleTimeString()}
//                           </span>
//                         </div>
//                       </div>
//                       <SalesProfitComparisonChart
//                         data={salesProfitComparisonData}
//                         darkMode={darkMode}
//                         currency="Rs."
//                       />
//                     </div>
//                   </div>

//                   {/* Secondary Charts Row */}
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                     {/* Top Products Chart */}
//                     <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
//                       }`}>
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
//                         Top Products by Revenue
//                       </h3>
//                       <TopProductsChart
//                         data={topProductsData}
//                         darkMode={darkMode}
//                         currency="Rs."
//                       />
//                     </div>

//                     {/* Hourly Sales Performance */}
//                     <div className={`p-4 rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
//                       }`}>
//                       <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                           Hourly Sales Performance
//                         </h3>
//                         <div className="flex items-center gap-2">
//                           {autoRefresh && (
//                             <div className="flex items-center gap-1 text-green-500 text-xs">
//                               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                               Live
//                             </div>
//                           )}
//                           <span className="text-xs text-gray-500">
//                             Current Time: {new Date().toLocaleTimeString()}
//                           </span>
//                         </div>
//                       </div>
//                       <HourlySalesChart
//                         data={hourlySalesData}
//                         darkMode={darkMode}
//                         currency="Rs."
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Products Tab Content */}
//               {activeTab === "products" && (
//                 <div className={`rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
//                   }`}>
//                   <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                         Product Performance
//                       </h3>
//                       <span className="text-xs text-gray-500">
//                         Updated: {lastUpdated.toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className={`border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
//                         }`}>
//                         <tr>
//                           <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
//                             Product Description
//                           </th>
//                           <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
//                             Batch ID
//                           </th>
//                           <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                             Unit Price
//                           </th>
//                           <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                             Sold Qty
//                           </th>
//                           <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">
//                             Sales Value
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"
//                         }`}>
//                         {filteredData.map((row, index) => (
//                           <tr key={index} className={`transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
//                             }`}>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs">
//                               {row.PRDESC}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-center">
//                               {row.BATCHID}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
//                               {formatCurrency(row.UNITPRICE)}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
//                               {row.SOLDQTY}
//                             </td>
//                             <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
//                               {formatCurrency(row.SALESVALUE)}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                     {filteredData.length === 0 && (
//                       <div className="text-center py-8">
//                         <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                         <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"
//                           }`}>No products found</p>
//                         <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"
//                           }`}>Try adjusting your search or filters</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Transactions Tab Content */}
//               {activeTab === "transactions" && (
//                 <div className={`rounded-xl border ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"
//                   }`}>
//                   <div className="p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                         Recent Transactions
//                       </h3>
//                       <span className="text-xs text-gray-500">
//                         Updated: {lastUpdated.toLocaleTimeString()}
//                       </span>
//                     </div>
//                     <div className="space-y-2">
//                       {filteredData.slice(0, 10).map((transaction, index) => (
//                         <div key={index} className={`p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
//                           }`}>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                               <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-900" : "bg-blue-100"
//                                 }`}>
//                                 <FiShoppingCart className={`w-3 h-3 ${darkMode ? "text-blue-400" : "text-blue-600"
//                                   }`} />
//                               </div>
//                               <div>
//                                 <p className="text-xs font-medium text-gray-900 dark:text-white">
//                                   {transaction.PRDESC}
//                                 </p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                                   {transaction.CUSNAME} • {transaction.WHCODE} • {transaction.CAHIERNAME}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xs font-semibold text-gray-900 dark:text-white">
//                                 {formatCurrency(transaction.SALESVALUE)}
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 Qty: {transaction.SOLDQTY} • Price: {formatCurrency(transaction.UNITPRICE)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Filter Modals */}
//       <FilterByMonth
//         isOpen={isFilterModalOpen}
//         darkMode={darkMode}
//         onClose={() => setIsFilterModalOpen(false)}
//         onApply={(value) => {
//           setFilterData(value);
//           if (value.mode === "single" && value.value) {
//             dispatch(
//               fetchDailySummaryByDate(value.value.start, value.value.end)
//             );
//           } else if (
//             value.mode === "range" &&
//             value.value.start &&
//             value.value.end
//           ) {
//             dispatch(
//               fetchDailySummaryByDate(value.value.start, value.value.end)
//             );
//           }
//         }}
//       />

//       <FilterByDate
//         isOpen={isDateModalOpen}
//         darkMode={darkMode}
//         onClose={() => setIsDateModalOpen(false)}
//         onApply={(value) => {
//           setDateFilterData(value);
//           if (value.mode === "single") {
//             dispatch(fetchDailySummaryByDate(value.value, value.value));
//           } else if (value.mode === "range") {
//             dispatch(
//               fetchDailySummaryByDate(value.value.start, value.value.end)
//             );
//           }
//         }}
//       />
//     </div>
//   );
// }





































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































