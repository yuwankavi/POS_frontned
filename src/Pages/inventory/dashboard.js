import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiAlertTriangle,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiBarChart2,
  FiRefreshCw,
  FiTag,
  FiHome,
  FiChevronRight
} from 'react-icons/fi';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Breadcrumb from '../../components/common/Breadcrumb';
import customerService from '../../services/customerService';
import dailySummaryService from '../../services/dailySummaryService';
import supplierService from '../../services/supplierService';
import warehouseService from '../../services/warehouseService';
import { productService } from '../../services/POS/ProductService';
import { promotionService } from '../../services/POS/promotionService';
import { getUsersList } from '../../services/userService';
import { returnService } from '../../services/returnService';

const DashboardPage = () => {
  const { darkMode } = useSelector(state => state.ui);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalWarehouses: 0,
    totalUsers: 0,
    totalPromotions: 0,
    todaySales: 0,
    monthlyRevenue: 0,
    totalReturns: 0,
    lowStockItems: 0
  });

  const [chartData, setChartData] = useState({
    salesData: [],
    stockData: [],
    customerData: [],
    categoryData: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {

      const [
        products,
        customers,
        suppliers,
        warehouses,
        users,
        promotions,
        dailySummary,
        categories
      ] = await Promise.all([
        productService.getAllProducts(),
        customerService.getAll(),
        supplierService.getAll(),
        warehouseService.getAllActive(),
        getUsersList(),
        promotionService.getPromotions(),
        dailySummaryService.getDailySummaryByDate(
          new Date().toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ),
        productService.getAllCategories()
      ]);


      const todaySales = dailySummary?.ResultSet?.reduce((total, item) => total + (item.NETAMOUNT || 0), 0) || 0;


      const monthlyRevenue = todaySales * 30;


      const lowStockItems = products.filter(product => (product.QUANTITY || 0) < 10).length;


      setStats({
        totalProducts: products.length,
        totalCustomers: customers?.ResultSet?.length || 0,
        totalSuppliers: suppliers.length,
        totalWarehouses: warehouses?.ResultSet?.length || 0,
        totalUsers: users?.ResultSet?.length || 0,
        totalPromotions: promotions?.ResultSet?.length || 0,
        todaySales,
        monthlyRevenue,
        totalReturns: 0,
        lowStockItems
      });


      prepareChartData(products, categories, dailySummary?.ResultSet || []);

    } catch (error) {

      setStats({
        totalProducts: 1247,
        totalCustomers: 856,
        totalSuppliers: 45,
        totalWarehouses: 8,
        totalUsers: 23,
        totalPromotions: 12,
        todaySales: 15420,
        monthlyRevenue: 452800,
        totalReturns: 8,
        lowStockItems: 23
      });
      prepareMockChartData();
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (products, categories, dailySales) => {

    const salesData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: Math.floor(Math.random() * 20000) + 5000
      };
    });


    const stockData = categories.slice(0, 5).map(category => ({
      name: category.CATNAME?.substring(0, 12) || 'Category',
      products: products.filter(p => p.CATID === category.CATID).length,
      value: products.filter(p => p.CATID === category.CATID).length
    }));


    const customerData = [
      { name: 'Regular', value: 65 },
      { name: 'Silver', value: 20 },
      { name: 'Gold', value: 10 },
      { name: 'Platinum', value: 5 }
    ];

    const categoryData = categories.slice(0, 6).map(category => ({
      name: category.CATNAME?.substring(0, 10) || 'Cat',
      count: products.filter(p => p.CATID === category.CATID).length
    }));

    setChartData({
      salesData,
      stockData,
      customerData,
      categoryData
    });
  };

  const prepareMockChartData = () => {
    const salesData = [
      { name: 'Mon', sales: 12000 },
      { name: 'Tue', sales: 19000 },
      { name: 'Wed', sales: 15000 },
      { name: 'Thu', sales: 22000 },
      { name: 'Fri', sales: 18000 },
      { name: 'Sat', sales: 25000 },
      { name: 'Sun', sales: 14000 }
    ];

    const stockData = [
      { name: 'Electronics', products: 45, value: 45 },
      { name: 'Clothing', products: 32, value: 32 },
      { name: 'Home & Garden', products: 28, value: 28 },
      { name: 'Sports', products: 18, value: 18 },
      { name: 'Books', products: 22, value: 22 }
    ];

    const customerData = [
      { name: 'Regular', value: 65 },
      { name: 'Silver', value: 20 },
      { name: 'Gold', value: 10 },
      { name: 'Platinum', value: 5 }
    ];

    const categoryData = [
      { name: 'Electronics', count: 45 },
      { name: 'Clothing', count: 32 },
      { name: 'Home', count: 28 },
      { name: 'Sports', count: 18 },
      { name: 'Books', count: 22 },
      { name: 'Toys', count: 15 }
    ];

    setChartData({
      salesData,
      stockData,
      customerData,
      categoryData
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const StatCard = ({ icon: Icon, title, value, change, changeType, loading }) => (
    <div className={`rounded-lg p-3 shadow-sm border transition-all duration-300 hover:shadow-md ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
      }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          {loading ? (
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mt-1"></div>
          ) : (
            <p className={`text-lg font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {value}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${title === 'Total Products' ? 'from-blue-500 to-cyan-500' :
            title === 'Total Customers' ? 'from-green-500 to-emerald-500' :
              title === 'Today Sales' ? 'from-purple-500 to-violet-500' :
                title === 'Monthly Revenue' ? 'from-orange-500 to-red-500' :
                  title === 'Total Suppliers' ? 'from-indigo-500 to-purple-500' :
                    'from-pink-500 to-rose-500'
          }`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-2">
          <span className={`inline-flex items-center text-xs font-medium ${changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
            {changeType === 'positive' ? <FiArrowUp className="w-3 h-3 mr-1" /> : <FiArrowDown className="w-3 h-3 mr-1" />}
            {change}
          </span>
          <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            from last month
          </span>
        </div>
      )}
    </div>
  );

  const ChartCard = ({ title, children, className = '' }) => (
    <div className={`rounded-lg border p-4 ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'} ${className}`}>
      <h3 className={`font-semibold text-sm mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      {children}
    </div>
  );

  const QuickActionCard = ({ icon: Icon, label, description, color, onClick }) => (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg p-3 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${darkMode ? 'bg-gray-700/50' : 'bg-white'
        } border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-3 h-3 text-white" />
        </div>
        <FiArrowUp className="w-3 h-3 transform rotate-45 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <h3 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </h3>
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </button>
  );

  const recentActivities = [
    { id: 1, type: 'sale', message: 'New sale completed - Order #INV-00124', time: '2 min ago', amount: 1250 },
    { id: 2, type: 'stock', message: 'Low stock alert - Product "Wireless Mouse"', time: '15 min ago', amount: null },
    { id: 3, type: 'purchase', message: 'New stock added - 50 units of "Keyboard"', time: '1 hour ago', amount: 2500 },
    { id: 4, type: 'sale', message: 'New sale completed - Order #INV-00123', time: '2 hours ago', amount: 890 },
    { id: 5, type: 'adjustment', message: 'Inventory adjustment - Product "Monitor"', time: '3 hours ago', amount: null }
  ];

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'sale': return <FiDollarSign className="w-3 h-3 text-green-500" />;
        case 'stock': return <FiPackage className="w-3 h-3 text-orange-500" />;
        case 'purchase': return <FiShoppingCart className="w-3 h-3 text-blue-500" />;
        default: return <FiBarChart2 className="w-3 h-3 text-gray-500" />;
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'sale': return 'bg-green-100 dark:bg-green-900/20';
        case 'stock': return 'bg-orange-100 dark:bg-orange-900/20';
        case 'purchase': return 'bg-blue-100 dark:bg-blue-900/20';
        default: return 'bg-gray-100 dark:bg-gray-900/20';
      }
    };

    return (
      <div className={`flex items-center justify-between p-2 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-lg ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {activity.message}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {activity.time}
            </p>
          </div>
        </div>
        {activity.amount && (
          <span className={`text-xs font-semibold whitespace-nowrap ml-2 ${activity.type === 'sale' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
            Rs.{activity.amount.toLocaleString()}
          </span>
        )}
      </div>
    );
  };

  const quickActions = [
    { icon: FiPackage, label: 'Add Product', description: 'Add new product to inventory', color: 'from-blue-500 to-cyan-500', path: '/inventory/products/add' },
    { icon: FiShoppingCart, label: 'New Sale', description: 'Create new sales transaction', color: 'from-green-500 to-emerald-500', path: '/sales/new' },
    { icon: FiTrendingUp, label: 'View Reports', description: 'Sales and inventory reports', color: 'from-purple-500 to-violet-500', path: '/reports' },
    { icon: FiUsers, label: 'Manage Customers', description: 'View and manage customers', color: 'from-orange-500 to-red-500', path: '/customers' }
  ];

  return (
    <div className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>

      {/* <Breadcrumb current="Dashboard" /> */}

      {/* Header */}
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiBarChart2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                POS Dashboard
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg border text-xs ${darkMode
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}>
              <FiCalendar className="w-3 h-3" />
              <span>Today</span>
            </button>
            <button
              onClick={fetchDashboardData}
              className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg border text-xs ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
            >
              <FiRefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-2 mb-1 md:mb-2">
          <StatCard
            icon={FiPackage}
            title="Total Products"
            value={stats.totalProducts.toLocaleString()}
            change="+12%"
            changeType="positive"
            loading={loading}
          />
          <StatCard
            icon={FiUsers}
            title="Total Customers"
            value={stats.totalCustomers.toLocaleString()}
            change="+8%"
            changeType="positive"
            loading={loading}
          />
          <StatCard
            icon={FiDollarSign}
            title="Today Sales"
            value={`Rs.${stats.todaySales.toLocaleString()}`}
            change="+8.2%"
            changeType="positive"
            loading={loading}
          />
          <StatCard
            icon={FiTrendingUp}
            title="Monthly Revenue"
            value={`Rs.${stats.monthlyRevenue.toLocaleString()}`}
            change="+15.3%"
            changeType="positive"
            loading={loading}
          />
          <StatCard
            icon={FiShoppingCart}
            title="Total Suppliers"
            value={stats.totalSuppliers}
            change="+2"
            changeType="positive"
            loading={loading}
          />
          <StatCard
            icon={FiAlertTriangle}
            title="Low Stock"
            value={stats.lowStockItems}
            change="+3"
            changeType="negative"
            loading={loading}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
          }`}>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 md:gap-2 mb-1 md:mb-2">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className={`rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                <div className={`p-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                  <h2 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Quick Actions
                  </h2>
                </div>
                <div className="p-2 grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <QuickActionCard
                      key={index}
                      icon={action.icon}
                      label={action.label}
                      description={action.description}
                      color={action.color}
                      onClick={() => console.log(`Navigate to: ${action.path}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className={`rounded-lg border ${darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                <div className={`p-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                  <h2 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h2>
                </div>
                <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
                  {recentActivities.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mb-1 md:mb-2">
            <h2 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Analytics Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-2 mb-1 md:mb-2">
              {/* Sales Trend Chart */}
              <ChartCard title="Sales Trend - Last 7 Days">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: darkMode ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Product Categories Chart */}
              <ChartCard title="Product Distribution by Category">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: darkMode ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-2">
              {/* Customer Tier Distribution */}
              <ChartCard title="Customer Tier Distribution">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.customerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: darkMode ? '#F9FAFB' : '#111827'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Stock Levels by Category */}
              <ChartCard title="Stock Levels by Category">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.stockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: darkMode ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Bar dataKey="products" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className={`w-8 h-8 border-3 rounded-full animate-spin ${darkMode ? 'border-blue-800' : 'border-blue-200'
                    }`}></div>
                  <div className="absolute inset-0 w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Loading dashboard data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;