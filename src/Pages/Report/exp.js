import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import batchService from '../../services/Inventory/batchService';

const Exp = () => {
  const [expiryData, setExpiryData] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, EXPIRING_SOON, EXPIRED, GOOD
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useSelector(state => state.ui);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["ALL"]);

  const detectCategory = (desc) => {
    if (!desc) return 'OTHER';
    const text = desc.toUpperCase();
    const known = ['WHISKY','VODKA','RUM','GIN','BEER','WINE','BRANDY','ARRACK'];
    for (const k of known) if (text.includes(k)) return k;
    return 'OTHER';
  };

  useEffect(() => {
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
            supplier: it.PB_SupName || it.PB_SupCode || ''
          };
        });

        setExpiryData(mapped);
        const cats = Array.from(new Set(['ALL', ...mapped.map(m => m.category)]) );
        setCategories(cats);
      } catch (err) {
        setError(err.message || 'Failed to load batches');
      } finally {
        setLoading(false);
      }
    };

    loadBatches();
  }, []);

  const filteredData = expiryData.filter(item => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      EXPIRING_SOON: { color: 'bg-yellow-500', text: 'Expiring Soon', icon: 'fa-exclamation-triangle' },
      EXPIRED: { color: 'bg-red-500', text: 'Expired', icon: 'fa-times-circle' },
      GOOD: { color: 'bg-green-500', text: 'Good', icon: 'fa-check-circle' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        <i className={`fas ${config.icon} mr-1`}></i>
        {config.text}
      </span>
    );
  };

  const getDaysUntilExpiryText = (days) => {
    if (days < 0) return { text: `Expired ${Math.abs(days)} days ago`, color: 'text-red-600 dark:text-red-400' };
    if (days === 0) return { text: 'Expires today', color: 'text-red-600 dark:text-red-400' };
    if (days <= 7) return { text: `Expires in ${days} days`, color: 'text-red-600 dark:text-red-400' };
    if (days <= 30) return { text: `Expires in ${days} days`, color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: `Expires in ${days} days`, color: 'text-green-600 dark:text-green-400' };
  };

  const calculateTotalRiskValue = () => {
    return filteredData
      .filter(item => item.status === 'EXPIRED' || item.status === 'EXPIRING_SOON')
      .reduce((total, item) => total + (item.quantity * item.costPrice), 0);
  };

  const handleGenerateReport = () => {
    // Generate expiry report
    alert('Expiry Report Generated!');
  };

  const handleSendAlerts = () => {
    // Send alerts for expiring products
    alert('Alerts sent to concerned staff!');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full overflow-auto">
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading batches...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="p-4 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700">
          {error}
        </div>
      )}
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Near Expiry Report</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage product expiry dates</p>
        </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <button 
            onClick={handleGenerateReport}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-file-export mr-2"></i>
            Generate Report
          </button>
          <button 
            onClick={handleSendAlerts}
            className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-bell mr-2"></i>
            Send Alerts
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Expiring Soon (≤30 days)</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                {expiryData.filter(item => item.status === 'EXPIRING_SOON').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <i className="fas fa-times-circle text-red-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Expired Products</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-300">
                {expiryData.filter(item => item.status === 'EXPIRED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Good Stock</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                {expiryData.filter(item => item.status === 'GOOD').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <i className="fas fa-rupee-sign text-purple-500 text-xl mr-3"></i>
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">Risk Value</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {calculateTotalRiskValue().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Filter
            </label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
              <option value="EXPIRED">Expired</option>
              <option value="GOOD">Good Stock</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Liquor Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by product or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Expiry Details ({filteredData.length} items)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Batch Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock & Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expiry Status
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((product) => {
                const expiryInfo = getDaysUntilExpiryText(product.daysUntilExpiry);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.productName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.category} • {product.supplier}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{product.batchNo}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(product.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {product.quantity} bottles
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Cost: Rs.{product.costPrice} • Sell: Rs.{product.sellingPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(product.status)}
                        <div className={`text-sm font-medium ${expiryInfo.color}`}>
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

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <i className="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
            <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            <i className="fas fa-fire mr-2"></i>
            Quick Sale Required
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            {expiryData.filter(item => item.status === 'EXPIRING_SOON').length} products need immediate attention
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
            <i className="fas fa-ban mr-2"></i>
            Remove Expired Stock
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            {expiryData.filter(item => item.status === 'EXPIRED').length} expired products to be removed
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            <i className="fas fa-chart-line mr-2"></i>
            Stock Health
          </h3>
          <p className="text-sm text-green-600 dark:text-green-300">
            {(expiryData.filter(item => item.status === 'GOOD').length / expiryData.length * 100).toFixed(1)}% of stock is in good condition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Exp;